import Head from 'next/head';
import { Heading, Paragraph } from '@digdir/designsystemet-react';
import { ProductCard } from '@/components/homepage/ProductCard';
import productsData from '@/data/products.json';
import { Product } from '@/types/product';
import styles from '@/styles/produkter.module.css';

export default function ProdukterPage() {
  const products = productsData.products as Product[];

  return (
    <>
      <Head>
        <title>Produkter - Digdir Dokumentasjon</title>
        <meta
          name="description"
          content="Oversikt over alle Altinn-produkter og tjenester"
        />
      </Head>
      <main id="main-content" className={styles.container}>
        <a href="#main-content" className="skip-to-main">
          Hopp til hovedinnhold
        </a>

        <header className={styles.hero}>
          <Heading data-size="xl" level={1}>
            Produkter og tjenester
          </Heading>
          <Paragraph data-size="lg" className={styles.description}>
            Utforsk dokumentasjonen for Altinn-produktene. Velg et produkt for å
            se detaljert dokumentasjon, guider og API-referanser.
          </Paragraph>
        </header>

        <section className={styles.products} aria-label="Produkter">
          <div className={styles.productGrid}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
