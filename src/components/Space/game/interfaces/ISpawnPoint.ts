/*
 * ISpawnPoint.ts
 * author: evan kirkiles
 * created on Sat Jun 25 2022
 * 2022 the nobot space,
 */
import { LoadingManager } from '../core/LoadingManager';
import { World } from '../world/World';

export interface ISpawnPoint {
  spawn(world: World): Promise<void>;
}
