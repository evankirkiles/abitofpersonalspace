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
import { useEffect, useRef, useState } from 'react';
import { getFileUrl, getSignedFileUrl } from '../../util/s3client';
import Space from '../../components/Space/Space';
import { BiBook, BiQuestionMark } from 'react-icons/bi';
import Modal from '../../modals/Modal';

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

  // about modals
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

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
      // getSignedFileUrl(space.file_space.key).then((worldUrl) => {
      //   setWorld(worldUrl);
      // });
      setWorld(getFileUrl(space.file_space.key));
    }
  }, [space]);

  // on large non-touch displays, auto-show the about
  useEffect(() => {
    // get if touch screen
    const isTouchScreen =
      typeof window != 'undefined' &&
      ('ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0);
    if (!isTouchScreen) {
      setShowAboutModal(true);
      if (window.innerWidth > 650) {
        setShowSettingsModal(true);
      }
    }
    // eslint-disable-next-line
  }, []);

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
          <div className={s.credits}>
            <u>SPACE OF</u>
            <br />
            {space ? space.author ?? 'anonymous' : 'loading...'}
            <br />
            {space?.created_at ? (
              <>
                {getSeasonString(new Date(space.created_at)).toLowerCase()}
                <br />
              </>
            ) : null}
            {space?.location ? (
              <>
                {space.location}
                <br />
              </>
            ) : null}
            <div className={s.button_row}>
              <div
                className={s.more_info}
                onClick={() => setShowAboutModal(!showAboutModal)}
              >
                <BiBook />
              </div>
              <div
                className={s.instructions}
                onClick={() => setShowSettingsModal(!showSettingsModal)}
              >
                <BiQuestionMark />
              </div>
            </div>
          </div>
          <Modal on={showAboutModal} setOn={setShowAboutModal} title={'about'}>
            <div className={s.space_author}>{space?.author ?? 'anonymous'}</div>
            <h2 className={s.space_title}>{space?.title}</h2>
            <p className={s.space_desc}>
              {space?.description ?? 'no description provided.'}
            </p>
            {space?.href ? (
              <p className={s.space_href}>
                {'>> '}
                <a href={space.href} target="_blank" rel="noopener noreferrer">
                  {new URL(space.href).hostname}
                </a>
              </p>
            ) : null}
            <div className={s.date_loc_row}>
              {space?.created_at ? (
                <div>
                  {getSeasonString(new Date(space.created_at)).toLowerCase()}
                </div>
              ) : null}
              {space?.location ? <div>{space.location}</div> : null}
            </div>
          </Modal>
          <Modal
            on={showSettingsModal}
            setOn={setShowSettingsModal}
            title={'settings'}
            style={{
              maxWidth: '300px',
              left: 'unset',
              right: '20px',
              bottom: '20px',
            }}
          >
            <table className={s.keybinding}>
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    W&nbsp;<i>-</i>&nbsp;
                  </td>
                  <td>Move forward</td>
                </tr>
                <tr>
                  <td>
                    A&nbsp;<i>-</i>&nbsp;
                  </td>
                  <td>Move left</td>
                </tr>
                <tr>
                  <td>
                    S&nbsp;<i>-</i>&nbsp;
                  </td>
                  <td>Move backward</td>
                </tr>
                <tr>
                  <td>
                    D&nbsp;<i>-</i>&nbsp;
                  </td>
                  <td>Move right</td>
                </tr>
                <tr>
                  <td>
                    Space&nbsp;<i>-</i>&nbsp;
                  </td>
                  <td>Move up (jump)</td>
                </tr>
                <tr>
                  <td>
                    Shift&nbsp;<i>-</i>&nbsp;
                  </td>
                  <td>Move down</td>
                </tr>
                <tr>
                  <td>
                    C&nbsp;<i>-</i>&nbsp;
                  </td>
                  <td>
                    Switch from camera view to person view, and vice versa.
                  </td>
                </tr>
              </tbody>
            </table>
            <div className={s.mouse_control}>
              Click and drag around the screen with your mouse to look around.
              The scroll wheel dollies in and out.
            </div>
          </Modal>
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
