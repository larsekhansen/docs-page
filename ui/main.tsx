import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { SearchTrigger } from './islands/SearchTrigger';

type IslandComponent = (props: any) => React.ReactElement;

type IslandRegistry = Record<string, IslandComponent>;

const registry: IslandRegistry = {
  SearchTrigger,
};

const mounted = new WeakMap<Element, Root>();

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
  if (!root) {
    root = createRoot(el);
    mounted.set(el, root);
  }

  root.render(
    <React.StrictMode>
      <Comp {...props} />
    </React.StrictMode>
  );
}

function mountAll() {
  const nodes = document.querySelectorAll<HTMLElement>('[data-react-island]');
  nodes.forEach(mountIsland);
}

// Mount once
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountAll);
} else {
  mountAll();
}

// Mount again if Hugo swaps content in the future (or if any other script injects islands)
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
