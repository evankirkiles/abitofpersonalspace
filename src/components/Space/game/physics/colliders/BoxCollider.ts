/*
 * BoxCollider.ts
 * author: evan kirkiles
 * created on Sat Jun 25 2022
 * 2022 the nobot space,
 */
import * as CANNON from 'cannon-es';
import { ICollider } from '../../interfaces/ICollider';

// Cannon options for mesh + body
interface BoxColliderOptions {
  mass: number;
  position: CANNON.Vec3;
  size: CANNON.Vec3;
  friction: number;
}

export class BoxCollider implements ICollider {
  public options: BoxColliderOptions;
  public body: CANNON.Body;

  /**
   * Construct a box collider with the given options
   * @param options
   */
  constructor(opts: Partial<BoxColliderOptions>) {
    // combine defaults and options
    this.options = {
      mass: 0,
      position: new CANNON.Vec3(),
      size: new CANNON.Vec3(0.3, 0.3, 0.3),
      friction: 0.3,
      ...opts,
    };

    // create cannon options
    this.options.position = new CANNON.Vec3(
      this.options.position.x,
      this.options.position.y,
      this.options.position.z
    );
    this.options.size = new CANNON.Vec3(
      this.options.size.x,
      this.options.size.y,
      this.options.size.z
    );

    // apply friction to material
    const mat = new CANNON.Material('boxMat');
    mat.friction = this.options.friction;

    // build shape and body
    const shape = new CANNON.Box(this.options.size);
    const physBox = new CANNON.Body({
      mass: this.options.mass,
      position: this.options.position,
      shape,
    });
    physBox.material = mat;

    // now save the physics body
    this.body = physBox;
  }
}
