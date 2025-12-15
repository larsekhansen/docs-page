import { ReactNode } from 'react';
import { Product } from '@/types/product';
import { ProductSidebar } from './ProductSidebar';
import { ArticleToc } from './ArticleToc';
import type { TocItem } from '@/types/toc';
import styles from './ProductLayout.module.css';

interface ProductLayoutProps {
  product: Product;
  children: ReactNode;
  tocItems?: TocItem[];
}

/**
 * Layout wrapper for product pages with left sidebar navigation
 * Only used on individual product pages, NOT on homepage or overview pages
 */
export function ProductLayout({ product, children, tocItems }: ProductLayoutProps) {
  const hasToc = (tocItems?.length ?? 0) > 0;

  return (
    <div className={`${styles.productLayout} ${!hasToc ? styles.noToc : ''}`.trim()}>
      {/* Left sidebar navigation */}
      <ProductSidebar product={product} />

      {/* Main content area */}
      <div className={styles.content}>{children}</div>

      {/* Right sidebar table of contents */}
      {hasToc ? <ArticleToc items={tocItems ?? []} /> : null}
    </div>
  );
}
