/*
 * spaces.ts
 * author: evan kirkiles
 * created on Mon Oct 10 2022
 * 2022 the nobot space,
 */

import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import {
  applyNextPageParam,
  InfiniteQueryFilter,
} from '../../util/getNextPageParam';
import * as APIt from '../types';

/* -------------------------------------------------------------------------- */
/*                                   QUERIES                                  */
/* -------------------------------------------------------------------------- */

/**
 * Gets a space by its id
 * @returns A list of builds
 */
export const getSpace = async (id: string) => {
  const { data: spaces, error } = await supabaseClient
    .from<APIt.Space>('spaces')
    .select(`*`)
    .eq('id', id);
  if (error) throw error;
  return spaces[0];
};

export type ListSpacesQueryVariables = {
  search?: string;
  tags?: string[];
} & InfiniteQueryFilter<APIt.Space>;

/**
 * Lists the spaces from the supabase database.
 * @returns A list of builds
 */
export const listSpaces = async (
  { search, filter }: ListSpacesQueryVariables,
  pageParam: string | number | null = null
) => {
  let req = (
    search
      ? supabaseClient.rpc<APIt.Space>('search_spaces', {
          build_term: search,
        })
      : supabaseClient.from<APIt.Space>('spaces')
  ).select(`*`);
  // now apply the filters using the next page param
  const { data: builds, error } = await applyNextPageParam(
    req,
    filter,
    pageParam
  );
  if (error) throw error;
  return builds;
};

/* -------------------------------------------------------------------------- */
/*                                  MUTATIONS                                 */
/* -------------------------------------------------------------------------- */

/**
 * Inserts a space into the database
 * @param input
 * @returns
 */
export const insertSpace = async (
  input: APIt.SpaceInput | APIt.SpaceInput[]
) => {
  const { data: spaces, error } = await supabaseClient
    .from<APIt.Space>('spaces')
    .insert(input);
  if (error) throw error;
  return spaces;
};

/* -------------------------------------------------------------------------- */
/*                                 KEY FACTORY                                */
/* -------------------------------------------------------------------------- */

export const spaceKeys = {
  all: ['spaces'] as const,
  lists: () => [...spaceKeys.all, 'list'] as const,
  list: (params: ListSpacesQueryVariables) =>
    [...spaceKeys.lists(), params] as const,
  gets: () => [...spaceKeys.all, 'get'] as const,
  get: (id: string) => [...spaceKeys.gets(), id] as const,
};
