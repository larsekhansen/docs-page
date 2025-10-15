import { Heading, Paragraph } from '@digdir/designsystemet-react';
import { Product } from '@/types/product';
import { NavigationCard } from './NavigationCard';
import styles from './ProductLandingPage.module.css';

interface ProductLandingPageProps {
  product: Product;
}

export function ProductLandingPage({ product }: ProductLandingPageProps) {
  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <Heading size="xlarge" level={1} className={styles.title}>
          {product.title}
        </Heading>
        <Paragraph size="large" className={styles.description}>
          {product.description}
        </Paragraph>
      </header>

      {product.sections && product.sections.length > 0 && (
        <section className={styles.navigation} aria-label="Produktnavigasjon">
          <div className={styles.cardGrid}>
            {product.sections.map((section) => (
              <NavigationCard key={section.url} section={section} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
