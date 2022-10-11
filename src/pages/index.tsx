/*
 * index.tsx
 * author: evan kirkiles
 * created on Sun Oct 09 2022
 * 2022 the nobot space,
 */
import Head from 'next/head';
import Image from 'next/image';
import Header from '../components/Header/Header';
import Logo from '../components/Logo/Logo';
import s from '../styles/Home.module.scss';
import { QueryClient, dehydrate } from 'react-query';
import {
  listSpaces,
  ListSpacesQueryVariables,
  spaceKeys,
} from '../supabase/api/spaces';
import getNextPageParam from '../util/getNextPageParam';
import {
  listTags,
  ListTagsQueryVariables,
  tagsKeys,
} from '../supabase/api/tags';
import { useInfiniteQuery } from 'react-query';
import Link from 'next/link';
import * as APIt from '../supabase/types';
import SpaceCard from '../components/SpaceCard/SpaceCard';

const HomePage: React.FC = function Home() {
  // get the tags query to show in the filter bar
  const tagParams = {
    search: '',
    filter: undefined,
  };
  const tags = useInfiniteQuery(
    tagsKeys.list(tagParams),
    ({ pageParam = null }) => listTags(tagParams, pageParam),
    { getNextPageParam: getNextPageParam(tagParams) }
  );

  // list the spaces
  const spaceParams = {
    search: '',
    filter: undefined,
  };
  const { data: spaces } = useInfiniteQuery<APIt.Space[]>(
    spaceKeys.list(spaceParams),
    ({ pageParam = null }) => listSpaces(spaceParams, pageParam),
    {
      getNextPageParam: getNextPageParam(spaceParams),
      keepPreviousData: true,
    }
  );

  return (
    <div className={s.container}>
      <Header />
      <div className={s.header_container}>
        <div className={s.main_container}>
          <h1 className={s.title}>A&nbsp;BIT&nbsp;OF PERSONAL&nbsp;SPACE</h1>
          <div className={s.subtext} style={{ opacity: 0.8 }}>
            is an exploration into the places we call home. the spaces embodied
            here are <i>us</i>––they define our selves and our interactions with
            the world. yet what happens when we share these entirely personal
            places? is their magic lost, or does it regain power through the
            eyes of another beholder? who would even want to share their own
            personal space? enter and see for yourself. and please,{' '}
            <Link href="/shoes">
              <a className={s.shoes}>take off your shoes.</a>
            </Link>
          </div>
        </div>
        <div className={`${s.logo_column} ${s.subtext}`}>
          <div className={s.logo}>
            <Logo />
          </div>
          <span>
            by{' '}
            <a
              href="https://evankirkiles.com"
              target="_blank"
              rel="noopener noreferrer"
              className={s.link}
            >
              evan kirkiles
            </a>
            .
          </span>
          <span className={s.date}>
            <i>winter 2022</i>
          </span>
        </div>
      </div>
      <div className={s.filter_bar}>
        {tags.data?.pages
          ? tags.data.pages.flatMap((page) =>
              page.map(({ title, code }) => (
                <span key={code}>{`➾ ${title}`}</span>
              ))
            )
          : null}
      </div>
      <div className={s.door_grid}>
        {spaces?.pages
          ? spaces.pages.flatMap((page) =>
              page.map((space) => <SpaceCard key={space.id} space={space} />)
            )
          : null}
        {spaces?.pages
          ? spaces.pages.flatMap((page) =>
              page.map((space) => <SpaceCard key={space.id} space={space} />)
            )
          : null}
        {spaces?.pages
          ? spaces.pages.flatMap((page) =>
              page.map((space) => <SpaceCard key={space.id} space={space} />)
            )
          : null}
        {spaces?.pages
          ? spaces.pages.flatMap((page) =>
              page.map((space) => <SpaceCard key={space.id} space={space} />)
            )
          : null}
        {spaces?.pages
          ? spaces.pages.flatMap((page) =>
              page.map((space) => <SpaceCard key={space.id} space={space} />)
            )
          : null}
        {/* <div className={s.door}>peter kirkiles</div>
        <div className={s.door}>HI</div>
        <div className={s.door}>HI</div>
        <div className={s.door}>HI</div>
        <div className={s.door}>HI</div>
        <div className={s.door}>HI</div>
        <div className={s.door}>HI</div>
        <div className={s.door}>HI</div>
        <div className={s.door}>HI</div>
        <div className={s.door}>HI</div> */}
      </div>
    </div>
  );
};

/**
 * Run the initial spaces and tags query on the server.
 * @param context
 * @returns
 */
export async function getStaticProps() {
  const queryClient = new QueryClient();
  const params: ListSpacesQueryVariables = {
    search: '',
    filter: undefined,
  };
  const tagParams: ListTagsQueryVariables = {
    search: '',
    filter: undefined,
  };
  await Promise.all([
    queryClient.prefetchInfiniteQuery(
      spaceKeys.list(params),
      ({ pageParam = null }) => listSpaces(params, pageParam),
      { getNextPageParam: getNextPageParam(params) }
    ),
    queryClient.prefetchInfiniteQuery(
      tagsKeys.list(tagParams),
      ({ pageParam = null }) => listTags(tagParams, pageParam),
      { getNextPageParam: getNextPageParam(tagParams) }
    ),
  ]);
  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
    revalidate: 10,
  };
}

export default HomePage;
