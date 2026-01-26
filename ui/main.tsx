import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { SearchTrigger } from './islands/SearchTrigger';
import { DsPlayground } from './islands/DsPlayground';
import { SearchDialog } from './islands/SearchDialog';

type IslandComponent = (props: any) => React.ReactElement;

type IslandRegistry = Record<string, IslandComponent>;

const registry: IslandRegistry = {
  SearchTrigger,
  DsPlayground,
  SearchDialog,
};

const mounted = new WeakMap<Element, Root>();

const debugEnabled = (() => {
  try {
    return new URLSearchParams(window.location.search).has('debugIslands');
  } catch {
    return false;
  }
})();

type IslandsDebug = {
  loaded: boolean;
  readyState: DocumentReadyState;
  mountPoints: number;
  mounted: number;
  lastError?: string;
};

function ensureDebugEl(): HTMLElement {
  const existing = document.getElementById('islands-debug');
  if (existing) return existing;

  if (!document.body) {
    throw new Error('document.body not ready');
  }

  const el = document.createElement('div');
  el.id = 'islands-debug';
  el.style.position = 'fixed';
  el.style.left = '8px';
  el.style.bottom = '8px';
  el.style.zIndex = '99999';
  el.style.maxWidth = '420px';
  el.style.padding = '8px 10px';
  el.style.fontFamily = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';
  el.style.fontSize = '12px';
  el.style.lineHeight = '1.25';
  el.style.border = '1px solid rgba(0,0,0,0.2)';
  el.style.borderRadius = '8px';
  el.style.background = 'rgba(255,255,255,0.95)';
  el.style.color = '#111';
  el.style.boxShadow = '0 2px 10px rgba(0,0,0,0.15)';
  document.body.appendChild(el);
  return el;
}

function setDebug(patch: Partial<IslandsDebug>) {
  const w = window as unknown as { ISLANDS_DEBUG?: IslandsDebug };
  const current: IslandsDebug = w.ISLANDS_DEBUG ?? {
    loaded: true,
    readyState: document.readyState,
    mountPoints: document.querySelectorAll('[data-react-island]').length,
    mounted: 0,
  };

  const next = { ...current, ...patch };
  w.ISLANDS_DEBUG = next;

  if (debugEnabled) {
    try {
      const el = ensureDebugEl();
      el.textContent = `islands loaded=${next.loaded} readyState=${next.readyState} mountPoints=${next.mountPoints} mounted=${next.mounted}${next.lastError ? `\nerror: ${next.lastError}` : ''}`;
    } catch {
    }
  }
}

function parseProps(el: HTMLElement): any {
  const raw = el.dataset.props;
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function mountIsland(el: HTMLElement) {
  const name = el.dataset.reactIsland;
  if (!name) return;

  const Comp = registry[name];
  if (!Comp) return;

  const props = parseProps(el);
  
  let root = mounted.get(el);
  try {
    if (!root) {
      root = createRoot(el);
      mounted.set(el, root);
    }

    root.render(
      <React.StrictMode>
        <Comp {...props} />
      </React.StrictMode>
    );

    setDebug({ mounted: (window as any).ISLANDS_DEBUG?.mounted ? (window as any).ISLANDS_DEBUG.mounted + 1 : 1 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    setDebug({ lastError: msg });
  }
}

function mountAll() {
  const nodes = document.querySelectorAll<HTMLElement>('[data-react-island]');
  setDebug({ readyState: document.readyState, mountPoints: nodes.length });
  nodes.forEach(mountIsland);
}

setDebug({ loaded: true });

window.addEventListener('error', (e) => {
  const err = (e as ErrorEvent).error;
  const msg = err instanceof Error ? err.message : (e as ErrorEvent).message;
  setDebug({ lastError: msg });
});

window.addEventListener('unhandledrejection', (e) => {
  const reason = (e as PromiseRejectionEvent).reason;
  const msg = reason instanceof Error ? reason.message : String(reason);
  setDebug({ lastError: msg });
});

// Mount once
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountAll);
} else {
  mountAll();
}

// Mount again if Hugo swaps content (or if any other script injects islands)
const observer = new MutationObserver((mutations) => {
  for (const m of mutations) {
    for (const n of Array.from(m.addedNodes)) {
      if (!(n instanceof HTMLElement)) continue;
      if (n.hasAttribute('data-react-island')) mountIsland(n);
      n.querySelectorAll<HTMLElement>('[data-react-island]').forEach(mountIsland);
    }
  }
});

observer.observe(document.documentElement, { subtree: true, childList: true });
