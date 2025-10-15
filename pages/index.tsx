import Head from 'next/head';
import { Homepage } from '@/components/homepage/Homepage';
import productsData from '@/data/products.json';
import { Product } from '@/types/product';

export default function Home() {
  const products = productsData.products as Product[];

  return (
    <>
      <Head>
        <title>Digdir Dokumentasjon</title>
        <meta
          name="description"
          content="Dokumentasjon og guider for Digitaliseringsdirektoratets produkter"
        />
      </Head>
      <main id="main-content">
        <a href="#main-content" className="skip-to-main">
          Hopp til hovedinnhold
        </a>
        <Homepage products={products} />
      </main>
    </>
  );
}
