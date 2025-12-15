import Head from 'next/head';
import { ProductLandingPage } from '@/components/product-landing/ProductLandingPage';
import { ProductLayout } from '@/components/layout/ProductLayout';
import productsData from '@/data/products.json';
import { Product } from '@/types/product';

export default function MeldingPage() {
  const product = productsData.products.find(
    (p) => p.id === 'melding'
  ) as Product;

  if (!product) {
    return <div>Produkt ikke funnet</div>;
  }

  return (
    <>
      <Head>
        <title>{`${product.title} - Digdir Dokumentasjon`}</title>
        <meta name="description" content={product.description} />
      </Head>
      <a href="#main-content" className="skip-to-main">
        Hopp til hovedinnhold
      </a>
      <ProductLayout product={product}>
        <div id="main-content">
          <ProductLandingPage product={product} />
        </div>
      </ProductLayout>
    </>
  );
}
