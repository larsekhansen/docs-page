import '@digdir/designsystemet-css/index.css';
import '@digdir/designsystemet-theme';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Button } from '@digdir/designsystemet-react';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
      <Button> hello world</Button>
    </>
  );
}
