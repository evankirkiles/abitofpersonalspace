/*
 * [spaceid].tsx
 * author: evan kirkiles
 * created on Mon Oct 10 2022
 * 2022 the nobot space,
 */

import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { useQuery } from 'react-query';
import { getSpace, spaceKeys } from '../../supabase/api/spaces';

/* -------------------------------------------------------------------------- */
/*                                   TYPING                                   */
/* -------------------------------------------------------------------------- */

interface SpagePageProps {
  spaceid: string;
}
interface QParams extends ParsedUrlQuery {
  pid?: string;
}

/* -------------------------------------------------------------------------- */
/*                                  COMPONENT                                 */
/* -------------------------------------------------------------------------- */

const SpacePage: NextPage<SpagePageProps> = function SpacePage({ spaceid }) {
  // use a fallback loading indicator
  const router = useRouter();
  // get the cached space query. we will also re-get the papercraft likes
  const space = useQuery(spaceKeys.get(spaceid), () => getSpace(spaceid), {
    enabled: !!spaceid,
  });

  return (
    <>
      <Head>
        <title>{`${space.data?.title} - a bit of personal space`}</title>
        <meta property="og:url" content={router.asPath} />
        <NextSeo
          canonical={`https://abitofpersonal.space/spaces/${spaceid}`}
          description={space.data?.description}
          title={space.data ? `${space.data.title}` : undefined}
          openGraph={{
            url: router.basePath,
            title: space.data ? `${space.data.title} on paperarium` : undefined,
            description: space.data
              ? `view @${space.data.author}'s ${space.data.title} on paperarium!`
              : undefined,
          }}
        />
      </Head>
    </>
  );
};

export default SpacePage;
