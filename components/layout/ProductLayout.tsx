import { ReactNode } from 'react';
import { Product } from '@/types/product';
import { ProductSidebar } from './ProductSidebar';
import styles from './ProductLayout.module.css';

interface ProductLayoutProps {
  product: Product;
  children: ReactNode;
}

/**
 * Layout wrapper for product pages with left sidebar navigation
 * Only used on individual product pages, NOT on homepage or overview pages
 */
export function ProductLayout({ product, children }: ProductLayoutProps) {
  return (
    <div className={styles.productLayout}>
      {/* Left sidebar navigation */}
      <ProductSidebar product={product} />
      
      {/* Main content area */}
      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}
