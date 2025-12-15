import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Product } from '@/types/product';
import styles from './ProductSidebar.module.css';

interface ProductSidebarProps {
  product: Product;
}

export function ProductSidebar({ product }: ProductSidebarProps) {
  const router = useRouter();
  const [expandedSections, setExpandedSections] = useState<string[]>(() => {
    const path = router.asPath.split('#')[0].split('?')[0].replace(/\/$/, '') || '/';
    const normalize = (url: string) => url.split('#')[0].split('?')[0].replace(/\/$/, '') || '/';

    const active = product.sections?.find((s) => {
      const target = normalize(s.url);
      return path === target || path.startsWith(`${target}/`);
    });

    return active ? [active.title] : [];
  });

  const currentPath = router.asPath.split('#')[0].split('?')[0].replace(/\/$/, '') || '/';

  const normalize = (url: string) => url.split('#')[0].split('?')[0].replace(/\/$/, '') || '/';

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections((prev: string[]) =>
      prev.includes(sectionTitle)
        ? prev.filter((t: string) => t !== sectionTitle)
        : [...prev, sectionTitle]
    );
  };

  const isActive = (url: string) => currentPath === normalize(url);

  const isActiveOrChild = (url: string) => {
    const target = normalize(url);
    return currentPath === target || currentPath.startsWith(`${target}/`);
  };

  const getIconForType = (type: string) => {
    const icons: Record<string, string> = {
      explanation: '📖',
      tutorial: '🚀',
      'how-to': '📚',
      reference: '📑',
    };
    return icons[type] || '📄';
  };

  return (
    <aside className={styles.sidebar}>
      {/* Product Header */}
      <div className={styles.header}>
        <Link href={product.url} className={styles.productTitle}>
          <h2>{product.title}</h2>
        </Link>
        <p className={styles.productDescription}>{product.shortDescription}</p>
      </div>

      {/* Navigation */}
      <nav className={styles.nav} aria-label={`${product.title} navigation`}>
        <ul className={styles.navList}>
          {/* Overview link */}
          <li>
            <Link
              href={product.url}
              className={`${styles.navLink} ${
                isActive(product.url) ? styles.active : ''
              }`}
            >
              <span className={styles.icon}>🏠</span>
              <span>Oversikt</span>
            </Link>
          </li>

          {/* Sections */}
          {product.sections?.map((section) => (
            <li key={section.url}>
              <Link
                href={section.url}
                className={`${styles.navLink} ${
                  isActiveOrChild(section.url) ? styles.active : ''
                } ${section.highlighted ? styles.highlighted : ''}`}
              >
                <span className={styles.icon}>
                  {getIconForType(section.type)}
                </span>
                <span>{section.title}</span>
              </Link>

              {/* Sub-sections (if any) */}
              {section.subsections && section.subsections.length > 0 && (
                <>
                  <button
                    onClick={() => toggleSection(section.title)}
                    className={styles.expandButton}
                    aria-expanded={expandedSections.includes(section.title)}
                  >
                    {expandedSections.includes(section.title) ? '▼' : '▶'}
                  </button>
                  {expandedSections.includes(section.title) && (
                    <ul className={styles.subList}>
                      {section.subsections.map((sub) => (
                        <li key={sub.url}>
                          <Link
                            href={sub.url}
                            className={`${styles.subLink} ${
                              isActive(sub.url) ? styles.active : ''
                            }`}
                          >
                            {sub.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer Links (optional) */}
      <div className={styles.footer}>
        <a href="#feedback" className={styles.footerLink}>
          💬 Gi tilbakemelding
        </a>
        <a
          href="https://github.com/your-repo/issues"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.footerLink}
        >
          🐛 Rapporter feil
        </a>
      </div>
    </aside>
  );
}
