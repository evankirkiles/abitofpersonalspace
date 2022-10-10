/*
 * _app.tsx
 * author: evan kirkiles
 * created on Sun Oct 09 2022
 * 2022 the nobot space,
 */
import { DefaultSeo } from 'next-seo';
import { AppProps } from 'next/app';
import '../styles/globals.scss';
import '../styles/fonts.scss';
import SEO from '../../next-seo.config';
import { QueryClientProvider, QueryClient, Hydrate } from 'react-query';
import { useState } from 'react';

function MyApp({
  Component,
  pageProps,
}: AppProps<{ dehydratedState: unknown }>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <>
      <DefaultSeo {...SEO} />
      <QueryClientProvider client={queryClient} contextSharing={true}>
        <Hydrate state={pageProps.dehydratedState}>
          <Component {...pageProps} />
        </Hydrate>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
