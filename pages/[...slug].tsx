import Head from 'next/head';
import { MDXRemote } from 'next-mdx-remote';
import type { GetStaticPaths, GetStaticProps } from 'next';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import productsData from '@/data/products.json';
import type { Product } from '@/types/product';
import type { TocItem } from '@/types/toc';
import { ProductLayout } from '@/components/layout/ProductLayout';
import styles from '@/styles/docs-article.module.css';
import { getMdxPageBySlug, listAllMdxSlugs } from '@/lib/content';

interface DocPageProps {
  product: Product;
  title: string;
  description?: string;
  mdxSource: MDXRemoteSerializeResult;
  tocItems: TocItem[];
}

export default function DocPage({ product, title, description, mdxSource, tocItems }: DocPageProps) {
  return (
    <>
      <Head>
        <title>{`${title} - ${product.title}`}</title>
        {description ? <meta name="description" content={description} /> : null}
      </Head>
      <ProductLayout product={product} tocItems={tocItems}>
        <article className={styles.article}>
          <MDXRemote {...mdxSource} />
        </article>
      </ProductLayout>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await listAllMdxSlugs();
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<DocPageProps> = async ({ params }) => {
  const slugParts = (params?.slug as string[] | undefined) ?? [];
  const mdxPage = await getMdxPageBySlug(slugParts);

  if (!mdxPage) {
    return { notFound: true };
  }

  const productId = slugParts[0];
  const product = (productsData as any).products.find((p: any) => p.id === productId) as Product | undefined;

  if (!product || product.external) {
    return { notFound: true };
  }

  const title = mdxPage.frontMatter.title ?? product.title;
  const description = mdxPage.frontMatter.description ?? undefined;

  return {
    props: {
      product,
      title,
      description,
      mdxSource: mdxPage.mdxSource,
      tocItems: mdxPage.toc,
    },
  };
};
