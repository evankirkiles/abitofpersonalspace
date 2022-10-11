/*
 * ICollider.ts
 * author: evan kirkiles
 * created on Sat Jun 25 2022
 * 2022 the nobot space,
 */
import * as CANNON from 'cannon-es';

export interface ICollider {
  body: CANNON.Body;
}
