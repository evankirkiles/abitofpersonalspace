/*
 * [spaceid].tsx
 * author: evan kirkiles
 * created on Mon Oct 10 2022
 * 2022 the nobot space,
 */

import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import { getSpace, spaceKeys } from '../../supabase/api/spaces';
import s from '../../styles/Space.module.scss';
import Logo from '../../components/Logo/Logo';
import Link from 'next/link';

/* -------------------------------------------------------------------------- */
/*                                   TYPING                                   */
/* -------------------------------------------------------------------------- */

interface SpacePageProps {
  spaceid: string;
}
interface QParams extends ParsedUrlQuery {
  spaceid?: string;
}

/* -------------------------------------------------------------------------- */
/*                                  COMPONENT                                 */
/* -------------------------------------------------------------------------- */

const SpacePage: NextPage<SpacePageProps> = function SpacePage({ spaceid }) {
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
      <div className={s.container}>
        <div className={s.overlay}>
          <Link href="/">
            <div className={s.title}>
              A BIT OF
              <br />
              PERSONAL
              <br />
              SPACE
              <div className={s.return_button}>← return</div>
            </div>
          </Link>
          <div className={s.logo}>
            <Logo />
          </div>
          <div className={s.credits}>
            SPACE OF
            <br />
            peter kirkiles
            <br />
            winter 2022
            <br />
            kent, ct
          </div>
          <div className={s.loading_container}>
            <div>Loading...</div>
            <div className={s.loading_bar}></div>
          </div>
          <div className={s.more_info}>{space.data?.description}</div>
          <div className={s.instructions}>HI2</div>
        </div>
      </div>
    </>
  );
};

/* -------------------------------------------------------------------------- */
/*                                     SSG                                    */
/* -------------------------------------------------------------------------- */

/**
 * Generate papercraft pages for all papercrafts,
 * @returns
 */
export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: true };
};

/**
 * Run the intiial papercraft query on the server. This only queries for public
 * papercrafts, not worrying about RLS.
 * @param context
 * @returns
 */
export const getStaticProps: GetStaticProps<SpacePageProps, QParams> = async ({
  params,
}) => {
  const queryClient = new QueryClient();
  const spaceid = params!.spaceid!;
  await queryClient.prefetchQuery(spaceKeys.get(spaceid), () =>
    getSpace(spaceid)
  );
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      spaceid,
    },
    revalidate: false,
  };
};

export default SpacePage;
