import { Card } from '@digdir/designsystemet-react';
import Link from 'next/link';
import { Product } from '@/types/product';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const CardWrapper = product.external ? 'a' : Link;
  const linkProps = product.external
    ? { href: product.url, target: '_blank', rel: 'noopener noreferrer' }
    : { href: product.url };

  return (
    <Card asChild className={styles.productCard}>
      <CardWrapper {...linkProps}>
        <Card.Block className={styles.cardContent}>
          <h3 className={styles.title}>{product.title}</h3>
          <p className={styles.description}>{product.shortDescription}</p>
          {product.external && (
            <span className={styles.externalBadge} aria-label="Ekstern lenke">
              ↗
            </span>
          )}
        </Card.Block>
      </CardWrapper>
    </Card>
  );
}
