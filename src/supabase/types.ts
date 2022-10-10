/*
 * types.ts
 * author: evan kirkiles
 * created on Mon Oct 10 2022
 * 2022 the nobot space,
 */

import * as APIt from './API';

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

type Modify<T, R> = Omit<T, keyof R> & R;
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
// expands object types one level deep
type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

/* -------------------------------------------------------------------------- */
/*                                MAIN GENERICS                               */
/* -------------------------------------------------------------------------- */

// fields generated db-side
type GeneratedFields = 'id' | 'created_at' | 'updated_at';

// helper generic:
//  T: the base entity type
//  S: a view for the entity
//  R: the incorrectly typed fields of the base definitiion
//  V: additional information not retrieved from the DB
type SupabaseEntityFactory<T, S = {}, R = {}, V = {}> = {
  entity: Expand<
    Modify<
      Omit<T, GeneratedFields> &
        Required<Pick<T, Extract<keyof T, GeneratedFields>>> & // make generated fields required
        Required<Omit<S, keyof T>> & // add in view fields
        V, // add in any additional fields we want
      R
    >
  >;
  input: Expand<Modify<Omit<T, GeneratedFields | keyof Omit<S, keyof T>>, R>>;
};

// helper generic for join tables
//  T: the base join table entity type
//  S: additional fields representing the entities being joined
type SupabaseJoinEntityFactory<T, S = {}> = {
  entity: Expand<
    Omit<T, GeneratedFields> &
      Required<Pick<T, Extract<keyof T, GeneratedFields>>> & // make required fields required
      S
  >; // add in the augmenting fields, allowing created_at to be changed by admins
  input: Expand<Omit<T, GeneratedFields>>;
};

/* -------------------------------------------------------------------------- */
/*                                   SPACES                                   */
/* -------------------------------------------------------------------------- */

// these are incorrectly typed fields we need to overwrite
type _SpaceOverwriteFields = {
  file_door?: Picture;
  file_space: S3Object;
};

// use factory to generate space + input types
type SpaceFactory = SupabaseEntityFactory<
  APIt.definitions['spaces'],
  {},
  _SpaceOverwriteFields,
  {}
>;
export type Space = SpaceFactory['entity'];
export type SpaceInput = SpaceFactory['input'];

/* ----------------------------- spaces_private ----------------------------- */

type SpacePrivateFactory = SupabaseEntityFactory<
  APIt.definitions['spaces_private']
>;
export type SpacePrivate = SpacePrivateFactory['entity'];
export type SpacePrivateInput = SpacePrivateFactory['input'];

/* -------------------------------------------------------------------------- */
/*                                    TAGS                                    */
/* -------------------------------------------------------------------------- */

// use factory to generate space + input types
type TagFactory = SupabaseEntityFactory<APIt.definitions['tags'], {}, {}, {}>;
export type Tag = TagFactory['entity'];
export type TagInput = TagFactory['input'];

/* -------------------------------------------------------------------------- */
/*                                 PRIMITIVES                                 */
/* -------------------------------------------------------------------------- */

export type Picture = {
  object: S3Object;
  width: number;
  height: number;
};

export type S3Object = {
  region: string;
  bucket: string;
  version: string;
  key: string;
};
