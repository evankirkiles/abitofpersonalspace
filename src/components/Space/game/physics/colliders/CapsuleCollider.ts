/*
 * CapsuleCollider.ts
 * author: evan kirkiles
 * created on Sat Jun 25 2022
 * 2022 the nobot space,
 */
import * as CANNON from 'cannon-es';
import { ICollider } from '../../interfaces/ICollider';

interface CapsuleColliderOptions {
  mass: number;
  position: CANNON.Vec3;
  height: number;
  radius: number;
  segments: number;
  friction: number;
}

export class CapsuleCollider implements ICollider {
  public options: CapsuleColliderOptions;
  public body: CANNON.Body;

  /**
   * Construct a capsule colliider (used for player collision) from optioons
   * @param opts Options for the capsule collider
   */
  constructor(options: Partial<CapsuleColliderOptions>) {
    // build options with defaults and partials
    this.options = {
      mass: 0,
      position: new CANNON.Vec3(),
      height: 0.5,
      radius: 0.3,
      segments: 8,
      friction: 0.3,
      ...options,
    };

    // build physics material
    const mat = new CANNON.Material('capsuleMat');
    mat.friction = this.options.friction;

    // build physics body
    const capsuleBody = new CANNON.Body({
      mass: this.options.mass,
      position: this.options.position,
    });
    capsuleBody.material = mat;

    // compound shape
    const sphereShape = new CANNON.Sphere(this.options.radius);
    capsuleBody.addShape(sphereShape, new CANNON.Vec3(0, 0, 0));
    capsuleBody.addShape(
      sphereShape,
      new CANNON.Vec3(0, this.options.height / 2, 0)
    );
    capsuleBody.addShape(
      sphereShape,
      new CANNON.Vec3(0, -this.options.height / 2, 0)
    );

    // set body
    this.body = capsuleBody;
  }
}
