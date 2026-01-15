import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'node:fs/promises';
import path from 'node:path';

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

function decodeBase64Float32(b64: string): Float32Array {
  const buf = Buffer.from(b64, 'base64');
  const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  return new Float32Array(ab);
}

async function loadIndex(): Promise<LoadedRecord[]> {
  const indexPath = path.join(process.cwd(), 'search', 'index', 'index.jsonl');
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

function tokenize(q: string): string[] {
  return q
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((t) => t.length >= 2);
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
  const kRaw = typeof req.query.k === 'string' ? Number(req.query.k) : 10;
  const k = Number.isFinite(kRaw) ? Math.max(1, Math.min(50, kRaw)) : 10;

  if (!q) {
    res.status(400).json({ error: 'Missing q' });
    return;
  }

  try {
    const [index, queryVec] = await Promise.all([loadIndex(), embedQuery(q)]);

    let queryNorm = 0;
    for (const v of queryVec) queryNorm += v * v;
    queryNorm = Math.sqrt(queryNorm);

    const tokens = tokenize(q);

    const scored = index.map((rec) => {
      const vecScore = cosineSimilarity(queryVec, queryNorm, rec.embedding, rec.embeddingNorm);
      const lexScore = lexicalScore(tokens, rec.text, rec.title);
      const score = vecScore * 0.75 + lexScore * 0.25;
      return { rec, vecScore, lexScore, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const top = scored.slice(0, k).map((s) => ({
      id: s.rec.id,
      url: s.rec.url,
      filePath: s.rec.filePath,
      title: s.rec.title,
      score: s.score,
      vecScore: s.vecScore,
      lexScore: s.lexScore,
      snippet: snippetFor(tokens, s.rec.text, 240),
    }));

    res.status(200).json({ q, k, results: top });
  } catch (err: any) {
    res.status(500).json({ error: String(err?.message ?? err) });
  }
}
