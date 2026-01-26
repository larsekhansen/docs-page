import React from 'react';
import { Dialog } from '@digdir/designsystemet-react';

type Props = {
  searchApiBase?: string;
};

type SearchResult = {
  url: string;
  title?: string;
  snippet?: string;
};

type ResultsResponse = {
  results?: SearchResult[];
};

function tokenizeForHighlight(q: string, minLen: number) {
  return String(q || '')
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean)
    .filter((t) => t.length >= minLen);
}

function groupLabelFromUrl(url: string) {
  const clean = String(url || '').replace(/^\/+/, '');
  const parts = clean.split('/').filter(Boolean);
  const start = parts[0] === 'nb' || parts[0] === 'en' ? 1 : 0;
  const group = parts[start] || 'Dokumentasjon';
  return group.charAt(0).toUpperCase() + group.slice(1);
}

function highlightParts(text: string, tokens: string[]) {
  const s = String(text || '');
  if (!s) return [{ t: '', h: false }];
  if (!tokens?.length) return [{ t: s, h: false }];

  const uniq = Array.from(new Set(tokens)).sort((a, b) => b.length - a.length);
  const re = new RegExp('(' + uniq.map((x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'gi');

  const out: Array<{ t: string; h: boolean }> = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s)) !== null) {
    const start = m.index;
    const end = start + m[0].length;
    if (start > last) out.push({ t: s.slice(last, start), h: false });
    out.push({ t: s.slice(start, end), h: true });
    last = end;
    if (re.lastIndex === m.index) re.lastIndex += 1;
  }
  if (last < s.length) out.push({ t: s.slice(last), h: false });
  return out.length ? out : [{ t: s, h: false }];
}

export function SearchDialog({ searchApiBase = '' }: Props) {
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const lastFocusRef = React.useRef<HTMLElement | null>(null);
  const controllerRef = React.useRef<AbortController | null>(null);

  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [status, setStatus] = React.useState<'idle' | 'empty' | 'loading' | 'error' | 'results'>('empty');
  const [results, setResults] = React.useState<SearchResult[]>([]);

  const highlightTokens = React.useMemo(() => tokenizeForHighlight(query, 3), [query]);

  const openDialog = React.useCallback(() => {
    lastFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setOpen(true);
  }, []);

  const closeDialog = React.useCallback(() => {
    setOpen(false);
    try {
      controllerRef.current?.abort();
    } catch {
    }
  }, []);

  React.useEffect(() => {
    const onOpen = () => openDialog();
    window.addEventListener('docs:search:open', onOpen as EventListener);
    return () => window.removeEventListener('docs:search:open', onOpen as EventListener);
  }, [openDialog]);

  React.useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      const key = String(e.key || '').toLowerCase();
      const isOpenShortcut = key === 'k' && (e.ctrlKey || e.metaKey);

      if (isOpenShortcut) {
        e.preventDefault();
        openDialog();
        return;
      }

      if (!open) return;

      if (key === 'escape') {
        e.preventDefault();
        closeDialog();
        return;
      }

      if (key === 'arrowdown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(Math.max(0, i + 1), Math.max(0, results.length - 1)));
        return;
      }

      if (key === 'arrowup') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(0, i - 1));
        return;
      }

      if (key === 'enter') {
        const idx = activeIndex >= 0 ? activeIndex : 0;
        const r = results[idx];
        if (r?.url) {
          e.preventDefault();
          closeDialog();
          window.location.assign(r.url);
        }
      }
    };

    document.addEventListener('keydown', onKeydown);
    return () => document.removeEventListener('keydown', onKeydown);
  }, [activeIndex, closeDialog, open, openDialog, results]);

  React.useEffect(() => {
    if (!open) {
      setQuery('');
      setResults([]);
      setActiveIndex(-1);
      setStatus('empty');
      if (lastFocusRef.current) {
        try {
          lastFocusRef.current.focus();
        } catch {
        }
      }
      return;
    }

    window.setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  }, [open]);

  React.useEffect(() => {
    if (!open) return;

    const q = query.trim();
    if (!q) {
      setResults([]);
      setActiveIndex(-1);
      setStatus('empty');
      return;
    }

    if (!searchApiBase) {
      setResults([]);
      setActiveIndex(-1);
      setStatus('error');
      return;
    }

    try {
      controllerRef.current?.abort();
    } catch {
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    setStatus('loading');
    setResults([]);
    setActiveIndex(-1);

    const url = searchApiBase.replace(/\/+$/, '') + '/api/search?q=' + encodeURIComponent(q) + '&k=20';

    fetch(url, { signal: controller.signal })
      .then((res) => res.json() as Promise<ResultsResponse>)
      .then((data) => {
        const list = Array.isArray(data?.results) ? data.results : [];
        setResults(list);
        setStatus(list.length ? 'results' : 'idle');
        setActiveIndex(list.length ? 0 : -1);
      })
      .catch((err) => {
        if (err && err.name === 'AbortError') return;
        setStatus('error');
      });
  }, [open, query, searchApiBase]);

  const grouped = React.useMemo(() => {
    const byGroup = new Map<string, SearchResult[]>();
    for (const r of results) {
      const key = groupLabelFromUrl(r.url);
      const cur = byGroup.get(key) ?? [];
      cur.push(r);
      byGroup.set(key, cur);
    }
    return Array.from(byGroup.entries());
  }, [results]);

  return (
    <Dialog
      ref={dialogRef}
      aria-label="Søk"
      className="site-search__dialog"
      open={open}
      onClose={() => closeDialog()}
      closedby="any"
      data-testid="search-dialog"
    >
      <Dialog.Block>
        <div className="site-search__bar">
          <input
            ref={inputRef}
            className="site-search__input"
            type="search"
            placeholder="Søk gjennom dokumentasjonen…"
            aria-label="Søk gjennom dokumentasjonen…"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery((e.target as HTMLInputElement).value)}
            data-search-input
          />
        </div>
      </Dialog.Block>

      <Dialog.Block>
        <div className="site-search__results" data-search-results>
          {status === 'empty' && <div className="site-search__empty">Skriv for å søke…</div>}
          {status === 'loading' && <div className="site-search__empty">Søker…</div>}
          {status === 'idle' && <div className="site-search__empty">Ingen treff.</div>}
          {status === 'error' && <div className="site-search__empty">Noe gikk galt ved søk.</div>}

          {status === 'results' && (
            <div role="listbox">
              {grouped.map(([group, items]) => (
                <div key={group}>
                  <div className="site-search__section">{group} ({items.length})</div>
                  {items.map((item, idx) => {
                    const globalIdx = results.indexOf(item);
                    const isActive = globalIdx === activeIndex;
                    const title = item.title || item.url;
                    const snippet = item.snippet || '';

                    return (
                      <a
                        key={item.url + idx}
                        className={`site-search__item${isActive ? ' is-active' : ''}`}
                        href={item.url}
                        data-search-item
                        role="option"
                        aria-selected={isActive ? 'true' : 'false'}
                        onMouseEnter={() => setActiveIndex(globalIdx)}
                        onClick={(e) => {
                          e.preventDefault();
                          closeDialog();
                          window.location.assign(item.url);
                        }}
                      >
                        <div className="site-search__item-title">
                          {highlightParts(title, highlightTokens).map((p, i) =>
                            p.h ? (
                              <mark key={i} className="site-search__hl">
                                {p.t}
                              </mark>
                            ) : (
                              <React.Fragment key={i}>{p.t}</React.Fragment>
                            )
                          )}
                        </div>
                        {snippet ? (
                          <p className="site-search__item-snippet">
                            {highlightParts(snippet, highlightTokens).map((p, i) =>
                              p.h ? (
                                <mark key={i} className="site-search__hl">
                                  {p.t}
                                </mark>
                              ) : (
                                <React.Fragment key={i}>{p.t}</React.Fragment>
                              )
                            )}
                          </p>
                        ) : null}
                      </a>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </Dialog.Block>

      <Dialog.Block>
        <div className="site-search__footer">
          <span className="site-search__hint">
            <span className="site-search-trigger__kbd">Esc</span> for å lukke
          </span>
          <span className="site-search__hint">
            <span className="site-search-trigger__kbd">↑</span>
            <span className="site-search-trigger__kbd">↓</span> for å navigere
          </span>
          <span className="site-search__hint">
            <span className="site-search-trigger__kbd">Enter</span> for å åpne
          </span>
        </div>
      </Dialog.Block>
    </Dialog>
  );
}
