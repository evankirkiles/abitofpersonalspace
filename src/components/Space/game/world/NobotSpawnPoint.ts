/*
 * NobotSpawnPoint.ts
 * author: evan kirkiles
 * created on Sat Jun 25 2022
 * 2022 the nobot space,
 */
import * as THREE from 'three';
import * as Utils from '../core/FunctionLibrary';
import { LoadingManager } from '../core/LoadingManager';
import { ISpawnPoint } from '../interfaces/ISpawnPoint';
import { Nobot } from '../nobots/Nobot';
import { World } from './World';

// const PLAYER_MODEL = '/assets/characters/nobot-anim.glb';
const PLAYER_MODEL = '/assets/characters/personspace.glb';
// const PLAYER_MODEL = '/models/nobot.glb';
// const PLAYER_MODEL = '/models/boxman.glb';

export class NobotSpawnPoint implements ISpawnPoint {
  private object: THREE.Object3D;

  /**
   * Instantiate the spawn point from a GLTF scene / scenario
   * @param object The object whose userData has nobot.spawn
   */
  constructor(object: THREE.Object3D) {
    this.object = object;
  }

  /**
   * Spawns the nobot player at this point in the scene
   * @param loadingManager The loading manager for checking download state
   * @param world The world in which the spawn point exists
   */
  public async spawn(world: World) {
    const playerGLTF = await world.loadingManager.loadGLTF(PLAYER_MODEL);
    const nobot = new Nobot(playerGLTF);
    const worldPos = new THREE.Vector3();
    this.object.getWorldPosition(worldPos);
    nobot.setPosition(worldPos.x, worldPos.y, worldPos.z);
    const forward = Utils.getForward(this.object);
    nobot.setOrientation(forward, true);
    world.add(nobot);
    nobot.takeControl();
  }
}
