/*
 * spaces_private.ts
 * author: evan kirkiles
 * created on Mon Oct 10 2022
 * 2022 the nobot space,
 */
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import * as APIt from '../types';

/* -------------------------------------------------------------------------- */
/*                                  MUTATIONS                                 */
/* -------------------------------------------------------------------------- */

/**
 * Inserts a space into the database
 * @param input
 * @returns
 */
export const insertSpacePrivate = async (
  input: APIt.SpacePrivateInput | APIt.SpacePrivateInput[]
) => {
  const { data: spaces, error } = await supabaseClient
    .from<APIt.SpacePrivate>('spaces_private')
    .insert(input, { returning: 'minimal' });
  if (error) throw error;
  return spaces;
};
