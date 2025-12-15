import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import GithubSlugger from 'github-slugger';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import type { TocItem } from '@/types/toc';

export const CONTENT_DIR = path.join(process.cwd(), 'content');

export interface MdxFrontMatter {
  title?: string;
  description?: string;
}

export interface MdxPage {
  frontMatter: MdxFrontMatter;
  mdxSource: MDXRemoteSerializeResult;
  toc: TocItem[];
}

async function pathExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function resolveContentFile(slugParts: string[]): Promise<string | null> {
  const rawPath = path.join(CONTENT_DIR, ...slugParts);

  const candidates = [
    `${rawPath}.mdx`,
    `${rawPath}.md`,
    path.join(rawPath, 'index.mdx'),
    path.join(rawPath, 'index.md'),
  ];

  for (const candidate of candidates) {
    if (await pathExists(candidate)) return candidate;
  }

  return null;
}

function stripInlineMarkdown(text: string) {
  return text
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .trim();
}

export function extractTocFromMdx(source: string): TocItem[] {
  const slugger = new GithubSlugger();
  const toc: TocItem[] = [];

  const lines = source.split(/\r?\n/);
  let inFence = false;

  for (const line of lines) {
    const fence = line.match(/^\s*```/);
    if (fence) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = line.match(/^(##|###)\s+(.+?)\s*#*\s*$/);
    if (!match) continue;

    const level = match[1] === '##' ? 2 : 3;
    const text = stripInlineMarkdown(match[2]);
    if (!text) continue;

    const id = slugger.slug(text);
    toc.push({ id, text, level });
  }

  return toc;
}

export async function getMdxPageBySlug(slugParts: string[]): Promise<MdxPage | null> {
  const filePath = await resolveContentFile(slugParts);
  if (!filePath) return null;

  const raw = await fs.readFile(filePath, 'utf8');
  const { content, data } = matter(raw);

  const toc = extractTocFromMdx(content);

  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
    },
    parseFrontmatter: false,
  });

  return {
    frontMatter: (data ?? {}) as MdxFrontMatter,
    mdxSource,
    toc,
  };
}

export async function listAllMdxSlugs(): Promise<string[][]> {
  const results: string[][] = [];

  async function walk(dir: string, parts: string[]) {
    let entries: Array<{ name: string; isDirectory: () => boolean; isFile: () => boolean }> = [];
    try {
      entries = (await fs.readdir(dir, { withFileTypes: true })) as any;
    } catch {
      return;
    }

    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue;

      const full = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await walk(full, [...parts, entry.name]);
        continue;
      }

      if (!entry.isFile()) continue;
      if (!entry.name.endsWith('.mdx') && !entry.name.endsWith('.md')) continue;

      const base = entry.name.replace(/\.(mdx|md)$/i, '');
      if (base === 'index') {
        results.push(parts);
      } else {
        results.push([...parts, base]);
      }
    }
  }

  await walk(CONTENT_DIR, []);
  return results;
}
