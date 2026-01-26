(function () {
  function qs(root, sel) {
    return root.querySelector(sel);
  }

  function qsa(root, sel) {
    return Array.from(root.querySelectorAll(sel));
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function escapeRegExp(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function tokenizeForHighlight(q, minLen) {
    return String(q || '')
      .toLowerCase()
      .split(/[^\p{L}\p{N}]+/u)
      .filter(Boolean)
      .filter((t) => t.length >= minLen);
  }

  function highlightHtml(text, tokens) {
    const s = String(text || '');
    if (!s) return '';
    if (!tokens || !tokens.length) return escapeHtml(s);

    const uniq = Array.from(new Set(tokens)).sort((a, b) => b.length - a.length);
    const re = new RegExp('(' + uniq.map(escapeRegExp).join('|') + ')', 'gi');

    let out = '';
    let last = 0;
    let m;
    while ((m = re.exec(s)) !== null) {
      const start = m.index;
      const end = start + m[0].length;
      if (start > last) out += escapeHtml(s.slice(last, start));
      out += '<mark class="site-search__hl">' + escapeHtml(s.slice(start, end)) + '</mark>';
      last = end;
      if (re.lastIndex === m.index) re.lastIndex += 1;
    }
    if (last < s.length) out += escapeHtml(s.slice(last));
    return out;
  }

  function groupLabelFromUrl(url) {
    const clean = String(url || '').replace(/^\/+/, '');
    const parts = clean.split('/').filter(Boolean);
    // /nb/... or /en/...
    const start = parts[0] === 'nb' || parts[0] === 'en' ? 1 : 0;
    const group = parts[start] || 'Dokumentasjon';
    return group.charAt(0).toUpperCase() + group.slice(1);
  }

  function createEmptyState() {
    return '<div class="site-search__empty">Skriv for å søke…</div>';
  }

  function createNoResultsState() {
    return '<div class="site-search__empty">Ingen treff.</div>';
  }

  function renderResults(results, highlightTokens) {
    const byGroup = new Map();
    for (const r of results) {
      const key = groupLabelFromUrl(r.url);
      if (!byGroup.has(key)) byGroup.set(key, []);
      byGroup.get(key).push(r);
    }

    let html = '';
    for (const [group, items] of byGroup.entries()) {
      html += `<div class="site-search__section">${escapeHtml(group)} (${items.length})</div>`;
      for (const item of items) {
        const title = item.title || item.url;
        const snippet = item.snippet || '';
        html += `<a class="site-search__item" href="${escapeHtml(item.url)}" data-search-item>`;
        html += `<div class="site-search__item-title">${highlightHtml(title, highlightTokens)}</div>`;
        if (snippet) html += `<p class="site-search__item-snippet">${highlightHtml(snippet, highlightTokens)}</p>`;
        html += `</a>`;
      }
    }

    return html;
  }

  function getShortcutKey() {
    const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform);
    return isMac ? '⌘ K' : 'Ctrl K';
  }

  function init() {
    const modal = document.querySelector('[data-search-modal]');
    if (!modal) return;

    const apiBase = modal.getAttribute('data-search-api-base') || '';
    const dialog = qs(modal, '.site-search__dialog');
    const input = qs(modal, '[data-search-input]');
    const resultsEl = qs(modal, '[data-search-results]');
    const closeButtons = qsa(modal, '[data-search-close]');

    if (!dialog || !input || !resultsEl) return;

    // Update trigger keys if present
    function updateTriggerKbdLabels() {
      const triggerKbdEls = qsa(document, '.site-search-trigger__kbd');
      if (triggerKbdEls.length === 2) {
        const s = getShortcutKey();
        const parts = s.split(' ');
        triggerKbdEls[0].textContent = parts[0];
        triggerKbdEls[1].textContent = parts[1];
      }
    }

    updateTriggerKbdLabels();

    let isOpen = false;
    let activeIndex = -1;
    let lastController = null;

    function setOpen(next) {
      isOpen = next;
      modal.classList.toggle('is-open', next);
      modal.setAttribute('aria-hidden', next ? 'false' : 'true');

      if (next) {
        updateTriggerKbdLabels();
        resultsEl.innerHTML = createEmptyState();
        activeIndex = -1;
        window.setTimeout(() => {
          input.focus();
          input.select();
        }, 0);
      } else {
        if (lastController) {
          try {
            lastController.abort();
          } catch {}
        }
      }
    }

    function updateActiveItem() {
      const items = qsa(resultsEl, '[data-search-item]');
      items.forEach((el, idx) => {
        el.classList.toggle('is-active', idx === activeIndex);
        if (idx === activeIndex) {
          el.scrollIntoView({ block: 'nearest' });
        }
      });
    }

    function navigate(delta) {
      const items = qsa(resultsEl, '[data-search-item]');
      if (!items.length) return;
      activeIndex = Math.max(0, Math.min(items.length - 1, activeIndex + delta));
      updateActiveItem();
    }

    function openActive() {
      const items = qsa(resultsEl, '[data-search-item]');
      if (!items.length) return;
      const idx = activeIndex >= 0 ? activeIndex : 0;
      const el = items[idx];
      const href = el.getAttribute('href');
      if (href) window.location.assign(href);
    }

    async function search(query) {
      const q = String(query || '').trim();
      if (!q) {
        resultsEl.innerHTML = createEmptyState();
        activeIndex = -1;
        return;
      }

      const highlightTokens = tokenizeForHighlight(q, 3);

      if (!apiBase) {
        resultsEl.innerHTML = '<div class="site-search__empty">Search API base is not configured.</div>';
        return;
      }

      if (lastController) {
        try {
          lastController.abort();
        } catch {}
      }
      const controller = new AbortController();
      lastController = controller;

      resultsEl.innerHTML = '<div class="site-search__empty">Søker…</div>';
      activeIndex = -1;

      try {
        const url = apiBase.replace(/\/+$/, '') + '/api/search?q=' + encodeURIComponent(q) + '&k=20';
        const res = await fetch(url, { signal: controller.signal });
        const data = await res.json();
        const results = Array.isArray(data?.results) ? data.results : [];

        if (!results.length) {
          resultsEl.innerHTML = createNoResultsState();
          return;
        }

        resultsEl.innerHTML = renderResults(results, highlightTokens);
        activeIndex = 0;
        updateActiveItem();
      } catch (err) {
        if (err && err.name === 'AbortError') return;
        resultsEl.innerHTML = '<div class="site-search__empty">Noe gikk galt ved søk.</div>';
      }
    }

    function onGlobalKeydown(e) {
      const key = String(e.key || '').toLowerCase();
      const isK = key === 'k';
      const isOpenShortcut = isK && (e.ctrlKey || e.metaKey);

      if (isOpenShortcut) {
        e.preventDefault();
        setOpen(true);
        return;
      }

      if (!isOpen) return;

      if (key === 'escape') {
        e.preventDefault();
        setOpen(false);
        return;
      }

      if (key === 'arrowdown') {
        e.preventDefault();
        navigate(1);
        return;
      }

      if (key === 'arrowup') {
        e.preventDefault();
        navigate(-1);
        return;
      }

      if (key === 'enter') {
        // If focus is inside the input/dialog and we have an active item, open it.
        const activeEl = document.activeElement;
        if (activeEl === input || dialog.contains(activeEl)) {
          e.preventDefault();
          openActive();
        }
      }
    }

    function onInput() {
      search(input.value);
    }

    function closeFromButton() {
      setOpen(false);
    }

    document.addEventListener('click', (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      if (target.closest('[data-search-open]')) {
        e.preventDefault();
        setOpen(true);
      }
    });
    closeButtons.forEach((b) => b.addEventListener('click', closeFromButton));
    input.addEventListener('input', onInput);

    // Click outside dialog closes
    modal.addEventListener('click', (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      if (target.hasAttribute('data-search-close')) {
        setOpen(false);
      }
    });

    // Prevent clicks inside dialog from closing
    dialog.addEventListener('click', (e) => e.stopPropagation());

    document.addEventListener('keydown', onGlobalKeydown);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
