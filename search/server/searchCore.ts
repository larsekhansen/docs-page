import fs from 'node:fs/promises';
import path from 'node:path';

export type SearchConfig = {
  highlight?: {
    minTokenLength?: number;
  };
  ranking?: {
    lexWeightMin?: number;
    lexWeightMax?: number;
    signals?: {
      hasDigit?: number;
      hasSpecialChar?: number;
      hasCamelCase?: number;
      hasLongToken?: number;
      manyTokens?: number;
    };
    thresholds?: {
      longTokenLength?: number;
      manyTokensCount?: number;
    };
  };
};

export type SearchResult = {
  id: string;
  url: string;
  filePath: string;
  title: string;
  score: number;
  vecScore: number;
  lexScore: number;
  snippet: string;
};

export type SearchResponse = {
  q: string;
  k: number;
  ranking: {
    specificity: number;
    wLex: number;
    wVec: number;
  };
  results: SearchResult[];
};

type IndexRecord = {
  id: string;
  url: string;
  filePath: string;
  title: string;
  text: string;
  embeddingB64: string;
  embeddingDim: number;
  embeddingNorm: number;
};

type LoadedRecord = IndexRecord & {
  embedding: Float32Array;
};

let cachedIndex: LoadedRecord[] | null = null;
let cachedIndexMtimeMs: number | null = null;
let cachedConfig: SearchConfig | null = null;
let cachedConfigMtimeMs: number | null = null;

function decodeBase64Float32(b64: string): Float32Array {
  const buf = Buffer.from(b64, 'base64');
  const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  return new Float32Array(ab);
}

async function loadIndex(projectRoot: string): Promise<LoadedRecord[]> {
  const indexPath = path.join(projectRoot, 'search', 'index', 'index.jsonl');
  const st = await fs.stat(indexPath);
  if (cachedIndex && cachedIndexMtimeMs === st.mtimeMs) return cachedIndex;

  const raw = await fs.readFile(indexPath, 'utf8');
  const lines = raw.split(/\r?\n/).filter(Boolean);
  const records: LoadedRecord[] = [];

  for (const line of lines) {
    const rec = JSON.parse(line) as IndexRecord;
    const embedding = decodeBase64Float32(rec.embeddingB64);
    records.push({ ...rec, embedding });
  }

  cachedIndex = records;
  cachedIndexMtimeMs = st.mtimeMs;
  return records;
}

async function loadSearchConfig(projectRoot: string): Promise<SearchConfig> {
  const configPath = path.join(projectRoot, 'search', 'search.config.json');
  const st = await fs.stat(configPath);
  if (cachedConfig && cachedConfigMtimeMs === st.mtimeMs) return cachedConfig;

  const raw = await fs.readFile(configPath, 'utf8');
  const cfg = JSON.parse(raw) as SearchConfig;
  cachedConfig = cfg;
  cachedConfigMtimeMs = st.mtimeMs;
  return cfg;
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function tokenize(q: string): string[] {
  return q
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((t) => t.length >= 2);
}

function computeSpecificity(q: string, tokens: string[], cfg: SearchConfig): number {
  const signals = cfg.ranking?.signals ?? {};
  const thresholds = cfg.ranking?.thresholds ?? {};

  const hasDigit = /\d/.test(q);
  const hasSpecialChar = /[-_\/.\:]/.test(q);
  const hasCamelCase = /[a-z][A-Z]/.test(q);
  const longTokenLength = thresholds.longTokenLength ?? 12;
  const manyTokensCount = thresholds.manyTokensCount ?? 3;
  const maxTokenLen = tokens.reduce((m, t) => Math.max(m, t.length), 0);
  const hasLongToken = maxTokenLen >= longTokenLength;
  const manyTokens = tokens.length >= manyTokensCount;

  let score = 0;
  if (hasDigit) score += signals.hasDigit ?? 0;
  if (hasSpecialChar) score += signals.hasSpecialChar ?? 0;
  if (hasCamelCase) score += signals.hasCamelCase ?? 0;
  if (hasLongToken) score += signals.hasLongToken ?? 0;
  if (manyTokens) score += signals.manyTokens ?? 0;
  return clamp01(score);
}

function lexicalScore(tokens: string[], text: string, title: string): number {
  if (!tokens.length) return 0;
  const hay = text.toLowerCase();
  const ttl = title.toLowerCase();

  let score = 0;
  for (const t of tokens) {
    const re = new RegExp(`\\b${t.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}\\b`, 'g');
    const inText = (hay.match(re) || []).length;
    const inTitle = (ttl.match(re) || []).length;
    score += inText + inTitle * 5;
  }

  return Math.log1p(score);
}

function cosineSimilarity(query: Float32Array, queryNorm: number, vec: Float32Array, vecNorm: number): number {
  const len = Math.min(query.length, vec.length);
  let dot = 0;
  for (let i = 0; i < len; i++) dot += query[i] * vec[i];
  const denom = queryNorm * vecNorm;
  if (!denom) return 0;
  return dot / denom;
}

async function embedQuery(q: string): Promise<Float32Array> {
  const apiKey = process.env.api_key;
  const apiBase = process.env.api_base;
  const apiVersion = process.env.api_version;
  const deployment = process.env.embedding_deployment_name || process.env.deployment_name;

  if (!apiKey || !apiBase || !apiVersion || !deployment) {
    throw new Error('Missing required env: api_key, api_base, api_version, embedding_deployment_name (or deployment_name)');
  }

  const url = `${apiBase.replace(/\/+$/, '')}/openai/deployments/${deployment}/embeddings?api-version=${encodeURIComponent(apiVersion)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({ input: q }),
  });

  const json = (await res.json().catch(() => ({}))) as any;
  if (!res.ok) {
    const msg = json?.error?.message ?? JSON.stringify(json);
    throw new Error(`Embeddings request failed: ${res.status} ${msg}`);
  }

  const emb = json?.data?.[0]?.embedding;
  if (!Array.isArray(emb)) throw new Error('Unexpected embeddings response shape');

  return new Float32Array(emb);
}

function snippetFor(tokens: string[], text: string, maxLen: number): string {
  if (!tokens.length) return text.slice(0, maxLen);
  const lower = text.toLowerCase();
  let idx = -1;
  for (const t of tokens) {
    idx = lower.indexOf(t.toLowerCase());
    if (idx !== -1) break;
  }
  if (idx === -1) return text.slice(0, maxLen);
  const start = Math.max(0, idx - Math.floor(maxLen / 3));
  const end = Math.min(text.length, start + maxLen);
  return text.slice(start, end);
}

export async function search(projectRoot: string, q: string, k: number): Promise<SearchResponse> {
  const [index, cfg, queryVec] = await Promise.all([loadIndex(projectRoot), loadSearchConfig(projectRoot), embedQuery(q)]);

  let queryNorm = 0;
  for (const v of queryVec) queryNorm += v * v;
  queryNorm = Math.sqrt(queryNorm);

  const tokens = tokenize(q);

  const specificity = computeSpecificity(q, tokens, cfg);
  const lexWeightMin = cfg.ranking?.lexWeightMin ?? 0.2;
  const lexWeightMax = cfg.ranking?.lexWeightMax ?? 0.7;
  const wLex = lexWeightMin + (lexWeightMax - lexWeightMin) * specificity;
  const wVec = 1 - wLex;

  const scored = index.map((rec) => {
    const vecScore = cosineSimilarity(queryVec, queryNorm, rec.embedding, rec.embeddingNorm);
    const lexScore = lexicalScore(tokens, rec.text, rec.title);
    const score = vecScore * wVec + lexScore * wLex;
    return { rec, vecScore, lexScore, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const results: SearchResult[] = scored.slice(0, k).map((s) => ({
    id: s.rec.id,
    url: s.rec.url,
    filePath: s.rec.filePath,
    title: s.rec.title,
    score: s.score,
    vecScore: s.vecScore,
    lexScore: s.lexScore,
    snippet: snippetFor(tokens, s.rec.text, 240),
  }));

  return {
    q,
    k,
    ranking: { specificity, wLex, wVec },
    results,
  };
}
