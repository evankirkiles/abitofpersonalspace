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
import getSeasonString from '../../util/getSeasonString';
import { useEffect, useState } from 'react';
import { getSignedFileUrl } from '../../util/s3client';
import Space from '../../components/Space/Space';
import ScrollLock from 'react-scrolllock';

/* -------------------------------------------------------------------------- */
/*                                   TYPING                                   */
/* -------------------------------------------------------------------------- */

interface SpacePageProps {
  spaceid: string;
}
interface QParams extends ParsedUrlQuery {
  spaceid: string;
}

/* -------------------------------------------------------------------------- */
/*                                  COMPONENT                                 */
/* -------------------------------------------------------------------------- */

const SpacePage: NextPage<SpacePageProps> = function SpacePage({ spaceid }) {
  // use a fallback loading indicator
  const router = useRouter();

  // get the cached space query. we will also re-get the papercraft likes
  const { data: space } = useQuery(
    spaceKeys.get(spaceid),
    () => getSpace(spaceid),
    {
      enabled: !!spaceid,
    }
  );

  // keep track of the world's object url
  const [world, setWorld] = useState<string | null>(null);
  useEffect(() => {
    if (space) {
      getSignedFileUrl(space.file_space.key).then((worldUrl) => {
        setWorld(worldUrl);
      });
    }
    // setWorld('/test/worlds/room.glb');
  }, [space]);

  return (
    <>
      <Head>
        <title>{`${space?.title} - a bit of personal space`}</title>
        <meta property="og:url" content={router.asPath} />
        <NextSeo
          canonical={`https://abitofpersonal.space/spaces/${spaceid}`}
          description={space?.description}
          title={space ? `${space.title}` : undefined}
          openGraph={{
            url: router.basePath,
            title: space ? `${space.title} on paperarium` : undefined,
            description: space
              ? `view @${space.author}'s ${space.title} on paperarium!`
              : undefined,
          }}
        />
      </Head>
      <ScrollLock />
      <div className={s.container}>
        {world ? <Space world={world} /> : null}
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
          {space ? (
            <div className={s.credits}>
              {space.author ? (
                <>
                  SPACE OF
                  <br />
                  {space.author}
                  <br />
                </>
              ) : null}
              {getSeasonString(new Date(space.created_at)).toLowerCase()}
              <br />
              {space.location ? (
                <>
                  {space.location}
                  <br />
                </>
              ) : null}
            </div>
          ) : null}
          {/* <div className={s.more_info}>+</div>
          <div className={s.instructions}>?</div> */}
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
