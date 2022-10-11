/*
 * TriMeshCollider.ts
 * author: evan kirkiles
 * created on Sun Jun 26 2022
 * 2022 the nobot space,
 */
import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import { ShapeType, threeToCannon } from 'three-to-cannon';
import { cannonQuat, cannonVector } from '../../core/FunctionLibrary';
import { ICollider } from '../../interfaces/ICollider';

interface TrimeshColliderOptions {
  mass: number;
  position: CANNON.Vec3;
  rotation: CANNON.Quaternion;
  friction: number;
}

export class TrimeshCollider implements ICollider {
  public mesh: THREE.Object3D;
  public options: TrimeshColliderOptions;
  public body: CANNON.Body;

  constructor(mesh: THREE.Object3D, options: Partial<TrimeshColliderOptions>) {
    this.mesh = mesh.clone();
    this.options = {
      mass: 0,
      position: cannonVector(mesh.position),
      rotation: cannonQuat(mesh.quaternion),
      friction: 0.3,
      ...options,
    };
    const mat = new CANNON.Material('triMat');
    mat.friction = this.options.friction;
    const shape = threeToCannon(this.mesh, { type: ShapeType.MESH });
    const physBox = new CANNON.Body({
      mass: options.mass,
      position: options.position,
      quaternion: options.rotation,
      shape: shape?.shape,
    });
    physBox.material = mat;
    this.body = physBox;
  }
}
