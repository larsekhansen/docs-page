import express from 'express';
import path from 'node:path';
import fs from 'node:fs/promises';
import { search } from './searchCore';

function parseDotEnv(content: string): Record<string, string> {
  const out: Record<string, string> = {};
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

async function loadEnv(projectRoot: string): Promise<void> {
  const envPath = path.join(projectRoot, '.env');
  try {
    const raw = await fs.readFile(envPath, 'utf8');
    const parsed = parseDotEnv(raw);
    for (const [k, v] of Object.entries(parsed)) {
      if (process.env[k] == null) process.env[k] = v;
    }
  } catch {
    // ignore if missing
  }
}

function setCors(req: express.Request, res: express.Response): void {
  const origin = typeof req.headers.origin === 'string' ? req.headers.origin : '';
  const allowedOrigins = new Set<string>([
    'http://localhost:1313',
    'http://127.0.0.1:1313',
  ]);

  if (origin && allowedOrigins.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
}

async function main() {
  const projectRoot = process.cwd();
  await loadEnv(projectRoot);

  const app = express();

  app.get('/healthz', (_req: express.Request, res: express.Response) => {
    res.status(200).json({ ok: true });
  });

  app.options('/api/search', (req: express.Request, res: express.Response) => {
    setCors(req, res);
    res.status(204).end();
  });

  app.get('/api/search', async (req: express.Request, res: express.Response) => {
    setCors(req, res);

    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    const kRaw = typeof req.query.k === 'string' ? Number(req.query.k) : 10;
    const k = Number.isFinite(kRaw) ? Math.max(1, Math.min(50, kRaw)) : 10;

    if (!q) {
      res.status(400).json({ error: 'Missing q' });
      return;
    }

    try {
      const result = await search(projectRoot, q, k);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(500).json({ error: String(err?.message ?? err) });
    }
  });

  const port = 8000;
  app.listen(port, () => {
    process.stdout.write(`Search API listening on http://localhost:${port}\n`);
  });
}

main().catch((err) => {
  process.stderr.write(String(err?.stack || err) + '\n');
  process.exit(1);
});
