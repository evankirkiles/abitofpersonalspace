/*
 * Scenario.ts
 * author: evan kirkiles
 * created on Sat Jun 25 2022
 * 2022 the nobot space,
 */
import * as THREE from 'three';
import { LoadingManager } from '../core/LoadingManager';
import { ISpawnPoint } from '../interfaces/ISpawnPoint';
import { NobotSpawnPoint } from './NobotSpawnPoint';
import { World } from './World';

export class Scenario {
  // metadata
  public id: string;
  public spawnAlways: boolean = false;
  public default: boolean = false;
  public name?: string;
  public descriptionTitle?: string;
  public descriptionContent?: string;

  // world reference
  public world: World;

  // private scenario information
  private rootNode: THREE.Object3D;
  private spawnPoints: ISpawnPoint[] = [];
  private invisible: boolean = false;
  private initialCameraAngle?: number;

  // build a scenario into the world
  constructor(root: THREE.Object3D, world: World) {
    this.rootNode = root;
    this.world = world;
    this.id = root.name;

    // parse the scenario metadata
    if (Object.prototype.hasOwnProperty.call(root.userData, 'name'))
      this.name = root.userData.name;
    if (Object.prototype.hasOwnProperty.call(root.userData, 'default'))
      this.default = root.userData.default;
    if (Object.prototype.hasOwnProperty.call(root.userData, 'spawn_always'))
      this.spawnAlways = root.userData.spawn_always;
    if (Object.prototype.hasOwnProperty.call(root.userData, 'invisible'))
      this.invisible = root.userData.invisible;
    if (Object.prototype.hasOwnProperty.call(root.userData, 'desc_title'))
      this.descriptionTitle = root.userData.desc_title;
    if (Object.prototype.hasOwnProperty.call(root.userData, 'desc_content'))
      this.descriptionContent = root.userData.desc_content;
    if (Object.prototype.hasOwnProperty.call(root.userData, 'camera_angle'))
      this.initialCameraAngle = root.userData.camera_angle;

    // find scenario spawns and entities
    root.traverse((child) => {
      if (
        Object.prototype.hasOwnProperty.call(child, 'userData') &&
        Object.prototype.hasOwnProperty.call(child.userData, 'data')
      ) {
        if (child.userData.data === 'spawn') {
          if (child.userData.type === 'player') {
            const sp = new NobotSpawnPoint(child);
            this.spawnPoints.push(sp);
          }
        }
      }
    });
  }

  /**
   * Launches the scenario.
   */
  public async launch(world: World) {
    await Promise.all(this.spawnPoints.map((sp) => sp.spawn(world)));
    if (!this.spawnAlways) {
      world.cameraOperator.theta = this.initialCameraAngle || 0;
      world.cameraOperator.phi = 15;
    }
  }
}
