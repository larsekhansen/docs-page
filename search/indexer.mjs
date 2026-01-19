import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseDotEnv(content) {
  const out = {};
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    if (line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

async function loadEnv(repoRoot) {
  const envPath = path.join(repoRoot, '.env');
  const env = {};
  try {
    const raw = await fs.readFile(envPath, 'utf8');
    Object.assign(env, parseDotEnv(raw));
  } catch {
  }
  for (const [k, v] of Object.entries(process.env)) {
    if (typeof v === 'string') env[k] = v;
  }
  return env;
}

function getArg(args, name) {
  const idx = args.indexOf(name);
  if (idx === -1) return null;
  return args[idx + 1] ?? null;
}

function hasFlag(args, name) {
  return args.includes(name);
}

async function walkFiles(rootDir, exts, { ignoreDirs = new Set() } = {}) {
  const results = [];
  const stack = [rootDir];

  while (stack.length) {
    const cur = stack.pop();
    const entries = await fs.readdir(cur, { withFileTypes: true });
    for (const ent of entries) {
      const full = path.join(cur, ent.name);
      if (ent.isDirectory()) {
        if (ent.name === '.git') continue;
        if (ent.name === 'node_modules') continue;
        if (ent.name === 'dist') continue;
        if (ent.name === 'build') continue;
        if (ignoreDirs.has(ent.name)) continue;
        if (ent.name.startsWith('_')) continue;
        stack.push(full);
      } else if (ent.isFile()) {
        if (ent.name.startsWith('_')) continue;
        const ext = path.extname(ent.name).toLowerCase();
        if (exts.has(ext)) results.push(full);
      }
    }
  }

  return results;
}

function stripMdx(text) {
  const lines = text.split(/\r?\n/);
  const kept = [];
  for (const line of lines) {
    if (/^\s*import\s+/.test(line)) continue;
    if (/^\s*export\s+/.test(line)) continue;
    kept.push(line);
  }
  return kept.join('\n');
}

function stripHugoShortcodes(text) {
  // Removes inline shortcodes like {{< children >}} / {{% panel %}} ... {{% /panel %}}
  // Not perfect, but good enough for a POC index.
  return text
    .replace(/\{\{[<%][\s\S]*?[>%]\}\}/g, '')
    .replace(/\n{3,}/g, '\n\n');
}

function chunkMarkdown(text, { minWords, maxWords }) {
  const lines = text.split(/\r?\n/);
  const chunks = [];
  let curHeading = '';
  let cur = [];
  let curWords = 0;

  function pushChunk(force = false) {
    if (!cur.length) return;
    if (!force && curWords < minWords) return;
    const body = cur.join('\n').trim();
    if (!body) {
      cur = [];
      curWords = 0;
      return;
    }
    const prefix = curHeading ? `${curHeading}\n` : '';
    chunks.push((prefix + body).trim());
    cur = [];
    curWords = 0;
  }

  for (const line of lines) {
    const headingMatch = /^(#{1,6})\s+(.+)\s*$/.exec(line);
    if (headingMatch) {
      pushChunk(true);
      curHeading = line.trim();
      continue;
    }

    cur.push(line);
    const words = line.trim() ? line.trim().split(/\s+/).length : 0;
    curWords += words;
    if (curWords >= maxWords) pushChunk(true);
  }

  pushChunk(true);
  return chunks;
}

function toBase64Float32(values) {
  const arr = new Float32Array(values);
  return Buffer.from(arr.buffer).toString('base64');
}

function normalizeAltinnDocsUrl(filePathRel) {
  // altinn-studio-docs is a Hugo site. We only index files under content/.
  // Hugo multilingual files often look like:
  //   content/foo/_index.en.md  -> /en/foo/
  //   content/foo/bar/index.nb.md -> /nb/foo/bar/
  //   content/foo/bar.en.md -> /en/foo/bar/
  let rel = filePathRel.replace(/\\/g, '/');
  if (rel.startsWith('content/')) rel = rel.slice('content/'.length);

  const m = rel.match(/^(.*?)(?:\.(en|nb))?\.(md|mdx)$/i);
  if (!m) return '/' + rel;

  let base = m[1];
  const lang = m[2] ? m[2].toLowerCase() : null;

  // Section/list pages
  base = base.replace(/\/_index$/i, '');
  // Leaf pages using index.md
  base = base.replace(/\/index$/i, '');

  const clean = base.replace(/^\/+/, '').replace(/\/+/g, '/');
  if (lang) return `/${lang}/${clean}`.replace(/\/$/, '') || `/${lang}`;
  return `/${clean}`.replace(/\/$/, '') || '/';
}

function normalizePortalUrl(filePathRelUnderContent) {
  // This repo's portal is a Hugo site under hugo/content.
  // We normalize to Hugo-like pretty URLs (trailing slash).
  let rel = filePathRelUnderContent.replace(/\\/g, '/');

  const m = rel.match(/^(.*?)(?:\.(en|nb))?\.(md|mdx)$/i);
  if (!m) return '/' + rel.replace(/^\/+/, '');

  let base = m[1];
  // Section/list pages
  base = base.replace(/\/_index$/i, '');
  // Leaf pages using index.md
  base = base.replace(/\/index$/i, '');

  const clean = base.replace(/^\/+/, '').replace(/\/+/g, '/');
  if (!clean) return '/';
  return `/${clean}/`;
}

async function embedBatch({ apiBase, apiKey, apiVersion, deploymentName, inputs }) {
  const url = `${apiBase.replace(/\/+$/, '')}/openai/deployments/${deploymentName}/embeddings?api-version=${encodeURIComponent(apiVersion)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({ input: inputs }),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = json?.error?.message ?? JSON.stringify(json);
    const err = new Error(`Embeddings request failed: ${res.status} ${msg}`);
    err.status = res.status;
    throw err;
  }

  const data = json?.data;
  if (!Array.isArray(data) || data.length !== inputs.length) {
    throw new Error('Unexpected embeddings response shape');
  }

  return data.map((d) => d.embedding);
}

async function withRetry(fn, { retries, baseDelayMs }) {
  let attempt = 0;
  for (;;) {
    try {
      return await fn();
    } catch (err) {
      attempt += 1;
      const status = err?.status;
      const retryable = status === 429 || (status >= 500 && status <= 599);
      if (!retryable || attempt > retries) throw err;
      const delay = baseDelayMs * Math.pow(2, attempt - 1);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

function gitTry(repoDir, args) {
  const r = spawnSync('git', args, { cwd: repoDir, encoding: 'utf8' });
  if (r.status !== 0) return null;
  return (r.stdout || '').trim();
}

async function main() {
  const repoRoot = path.resolve(__dirname, '..');
  const args = process.argv.slice(2);

  const docsRepo = getArg(args, '--repo') ?? path.join(__dirname, '.cache', 'altinn-studio-docs');
  const shouldClone = hasFlag(args, '--clone');
  const contentRootArg = getArg(args, '--contentRoot');
  const outDir = getArg(args, '--outDir') ?? path.join(__dirname, 'index');
  const maxFiles = Number(getArg(args, '--maxFiles') ?? '0') || 0;

  const env = await loadEnv(repoRoot);
  const apiKey = env.api_key;
  const apiBase = env.api_base;
  const apiVersion = env.api_version;
  const deploymentName = env.embedding_deployment_name || env.deployment_name;

  if (!apiKey || !apiBase || !apiVersion || !deploymentName) {
    throw new Error('Missing required env: api_key, api_base, api_version, embedding_deployment_name (or deployment_name)');
  }

  // Decide indexing mode
  const isAltinnMode = Boolean(shouldClone || getArg(args, '--repo')) && !contentRootArg;
  const contentRoot = contentRootArg
    ? path.resolve(repoRoot, contentRootArg)
    : isAltinnMode
      ? path.join(docsRepo, 'content')
      : path.join(repoRoot, 'hugo', 'content');

  if (shouldClone && isAltinnMode) {
    await fs.mkdir(path.dirname(docsRepo), { recursive: true });
    try {
      await fs.stat(docsRepo);
    } catch {
      const r = spawnSync('git', ['clone', 'https://github.com/Altinn/altinn-studio-docs', docsRepo], { stdio: 'inherit' });
      if (r.status !== 0) process.exit(r.status ?? 1);
    }
    const pull = spawnSync('git', ['pull', '--ff-only'], { cwd: docsRepo, stdio: 'inherit' });
    if (pull.status !== 0) process.exit(pull.status ?? 1);
  }

  const exts = new Set(['.md', '.mdx']);
  const ignoreDirs = new Set([
    'themes',
    'exampleSite',
    'archetypes',
    '.github',
    '.devcontainer',
    'static',
    'resources',
    'public',
  ]);

  const files = await walkFiles(contentRoot, exts, { ignoreDirs });
  const selected = maxFiles > 0 ? files.slice(0, maxFiles) : files;

  await fs.mkdir(outDir, { recursive: true });
  const outIndexPath = path.join(outDir, 'index.jsonl');
  const outMetaPath = path.join(outDir, 'meta.json');

  const commit = isAltinnMode ? gitTry(docsRepo, ['rev-parse', 'HEAD']) : gitTry(repoRoot, ['rev-parse', 'HEAD']);

  const meta = {
    createdAt: new Date().toISOString(),
    source: isAltinnMode ? 'Altinn/altinn-studio-docs' : 'portal',
    contentRootPath: contentRoot,
    docsRepoPath: isAltinnMode ? docsRepo : null,
    docsRepoCommit: isAltinnMode ? commit : null,
    portalCommit: isAltinnMode ? null : commit,
    embeddingDeployment: deploymentName,
    apiBase: apiBase,
    apiVersion: apiVersion,
  };

  await fs.writeFile(outMetaPath, JSON.stringify(meta, null, 2) + '\n', 'utf8');
  await fs.writeFile(outIndexPath, '', 'utf8');

  const batchSize = 16;
  const minWords = 120;
  const maxWords = 450;

  let totalChunks = 0;
  let pending = [];
  let pendingMeta = [];

  async function flushBatch() {
    if (!pending.length) return;
    const inputs = pending;
    const metaItems = pendingMeta;
    pending = [];
    pendingMeta = [];

    const vectors = await withRetry(
      () => embedBatch({ apiBase, apiKey, apiVersion, deploymentName, inputs }),
      { retries: 5, baseDelayMs: 750 }
    );

    let out = '';
    for (let i = 0; i < vectors.length; i++) {
      const embedding = vectors[i];
      let norm = 0;
      for (const v of embedding) norm += v * v;
      norm = Math.sqrt(norm);

      const record = {
        id: metaItems[i].id,
        url: metaItems[i].url,
        filePath: metaItems[i].filePath,
        title: metaItems[i].title,
        text: metaItems[i].text,
        embeddingB64: toBase64Float32(embedding),
        embeddingDim: embedding.length,
        embeddingNorm: norm,
      };
      out += JSON.stringify(record) + '\n';
    }

    await fs.appendFile(outIndexPath, out, 'utf8');
  }

  for (const filePathAbs of selected) {
    const relToRoot = path.relative(repoRoot, filePathAbs);
    const relToContent = path.relative(contentRoot, filePathAbs);
    const raw = await fs.readFile(filePathAbs, 'utf8');
    const normalized = stripHugoShortcodes(stripMdx(raw));

    let fm;
    try {
      fm = matter(normalized);
    } catch {
      fm = { data: {}, content: normalized };
    }

    const title = typeof fm.data?.title === 'string' ? fm.data.title : '';
    const body = fm.content;
    const chunks = chunkMarkdown(body, { minWords, maxWords });

    for (let i = 0; i < chunks.length; i++) {
      const text = chunks[i].trim();
      if (!text) continue;
      const id = `${relToRoot}#${i}`;
      const url = isAltinnMode ? normalizeAltinnDocsUrl(path.posix.join('content', relToContent.replace(/\\/g, '/'))) : normalizePortalUrl(relToContent);

      pending.push(text);
      pendingMeta.push({ id, url, filePath: relToRoot, title, text });
      totalChunks += 1;

      if (pending.length >= batchSize) await flushBatch();
    }
  }

  await flushBatch();

  process.stdout.write(`Indexed ${selected.length} files into ${totalChunks} chunks\n`);
  process.stdout.write(`Output: ${outIndexPath}\n`);
}

main().catch((err) => {
  process.stderr.write(String(err?.stack || err) + '\n');
  process.exit(1);
});
