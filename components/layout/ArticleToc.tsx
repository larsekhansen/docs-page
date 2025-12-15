import { useEffect, useMemo, useState } from 'react';
import type { TocItem } from '@/types/toc';
import styles from './ArticleToc.module.css';

interface ArticleTocProps {
  items: TocItem[];
}

export function ArticleToc({ items }: ArticleTocProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const ids = useMemo(() => items.map((i) => i.id), [items]);

  useEffect(() => {
    if (ids.length === 0) return;

    const elements = ids
      .map((id: string) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.boundingClientRect.top > b.boundingClientRect.top ? 1 : -1));

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: '-96px 0px -70% 0px',
        threshold: [0, 1],
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [ids]);

  if (!items || items.length === 0) return null;

  return (
    <aside className={styles.toc} aria-label="Innhold på siden">
      <p className={styles.title}>Innhold på siden</p>
      <ol className={styles.list}>
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li key={item.id} className={styles.item}>
              <a
                href={`#${item.id}`}
                className={`${styles.link} ${
                  item.level === 3 ? styles.level3 : ''
                } ${isActive ? styles.linkActive : ''}`}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
