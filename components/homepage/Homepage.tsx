import { Heading, Paragraph } from '@digdir/designsystemet-react';
import { Product } from '@/types/product';
import { FeatureCard } from './FeatureCard';
import { ProductCard } from './ProductCard';
import styles from './Homepage.module.css';

interface HomepageProps {
  products: Product[];
}

export function Homepage({ products }: HomepageProps) {
  return (
    <>
      {/* Full-width hero section */}
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <Heading data-size="xl" level={1} className={styles.title}>
            Dokumentasjon for Altinn
          </Heading>
          <Paragraph data-size="lg" className={styles.description}>
            Dokumentasjon for produkter og tjenester fra Digitaliseringsdirektoratet
          </Paragraph>
        </div>
      </header>

      {/* Container for remaining content */}
      <div className={styles.container}>
        {/* Main navigation cards */}
        <section className={styles.features} aria-label="Hovednavigasjon">
        <div className={styles.featureGrid}>
          <FeatureCard
            title="Produkter"
            description="Utforsk dokumentasjon for alle Altinn-produkter. Finn guider, API-referanser og kom i gang-veiledninger."
            href="/produkter"
            icon="📦"
          />
          <FeatureCard
            title="Kom i gang"
            description="Ny til Altinn? Start her for å lære grunnleggende konsepter og vanlige bruksscenarier."
            href="/kom-i-gang"
            icon="🚀"
          />
          <FeatureCard
            title="Om dokumentasjonen"
            description="Lær om hvordan dokumentasjonen er strukturert med Diataxis og Jobs to be Done."
            href="/om"
            icon="📚"
          />
        </div>
      </section>

      {/* Featured products */}
      <section className={styles.products} aria-label="Utvalgte produkter">
        <Heading data-size="md" level={2} className={styles.sectionTitle}>
          Utvalgte produkter
        </Heading>
        <div className={styles.productGrid}>
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {products.length > 4 && (
          <div className={styles.viewAll}>
            <a href="/produkter" className={styles.viewAllLink}>
              Se alle produkter →
            </a>
          </div>
        )}
      </section>
      </div>
    </>
  );
}
