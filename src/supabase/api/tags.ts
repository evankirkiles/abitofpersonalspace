/*
 * tags.ts
 * author: evan kirkiles
 * created on Mon Oct 10 2022
 * 2022 the nobot space,
 */

import {
  supabaseClient,
  supabaseServerClient,
} from '@supabase/auth-helpers-nextjs';
import {
  applyNextPageParam,
  InfiniteQueryFilter,
} from '../../util/getNextPageParam';
import * as APIt from '../types';

/* -------------------------------------------------------------------------- */
/*                                   QUERIES                                  */
/* -------------------------------------------------------------------------- */

export type ListTagsQueryVariables = {
  search?: string;
} & InfiniteQueryFilter<APIt.Tag>;

/**
 * Lists the tags from the supabase database.
 * @returns A list of builds
 */
export const listTags = async (
  { search, filter }: ListTagsQueryVariables,
  pageParam: string | number | null = null
) => {
  let req = (
    search
      ? supabaseClient.rpc<APIt.Tag>('search_tags', {
          build_term: search,
        })
      : supabaseClient.from<APIt.Tag>('tags')
  ).select(`*`);
  // now apply the filters using the next page param
  const { data: tags, error } = await applyNextPageParam(
    req,
    filter,
    pageParam
  );
  if (error) throw error;
  return tags;
};

/* -------------------------------------------------------------------------- */
/*                                 KEY FACTORY                                */
/* -------------------------------------------------------------------------- */

export const tagsKeys = {
  all: ['tags'] as const,
  lists: () => [...tagsKeys.all, 'list'] as const,
  list: (params: ListTagsQueryVariables) =>
    [...tagsKeys.lists(), params] as const,
  gets: () => [...tagsKeys.all, 'get'] as const,
  get: (id: string) => [...tagsKeys.gets(), id] as const,
};
