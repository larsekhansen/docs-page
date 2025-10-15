import Head from 'next/head';
import { ProductLandingPage } from '@/components/product-landing/ProductLandingPage';
import productsData from '@/data/products.json';
import { Product } from '@/types/product';

export default function AuthorizationPage() {
  const product = productsData.products.find(
    (p) => p.id === 'authorization'
  ) as Product;

  if (!product) {
    return <div>Produkt ikke funnet</div>;
  }

  return (
    <>
      <Head>
        <title>{product.title} - Digdir Dokumentasjon</title>
        <meta name="description" content={product.description} />
      </Head>
      <main id="main-content">
        <a href="#main-content" className="skip-to-main">
          Hopp til hovedinnhold
        </a>
        <ProductLandingPage product={product} />
      </main>
    </>
  );
}
