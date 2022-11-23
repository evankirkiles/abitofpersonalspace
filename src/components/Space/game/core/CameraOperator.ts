/*
 * CameraOperator.ts
 * author: evan kirkiles
 * created on Sat Jun 25 2022
 * 2022 the nobot space,
 */
import CameraControls from 'camera-controls';
import _ from 'lodash';
import { EventData, JoystickOutputData } from 'nipplejs';
import * as THREE from 'three';
import { acceleratedRaycast } from 'three-mesh-bvh';
import { IInputReceiver } from '../interfaces/IInputReceiver';
import { IUpdatable } from '../interfaces/IUpdatable';
import { Nobot } from '../nobots/Nobot';
import { World } from '../world/World';
import * as Utils from './FunctionLibrary';
import { KeyBinding } from './KeyBinding';

THREE.Mesh.prototype.raycast = acceleratedRaycast;
// initialize camera controller
CameraControls.install({ THREE });

export class CameraOperator
  extends CameraControls
  implements IInputReceiver, IUpdatable
{
  public updateOrder: number = 4;

  // scene / world properties
  public world: World;
  public nobotCaller?: Nobot;

  // statefuls
  public target?: THREE.Object3D;
  public freeTarget: THREE.Object3D;
  public followMode: boolean = true;
  public transitioning: boolean = false;

  // constraints
  public movementSpeed: number;

  // free- state
  public upVelocity: number = 0;
  public forwardVelocity: number = 0;
  public rightVelocity: number = 0;

  // actions & character
  public actions: { [action: string]: KeyBinding };

  /**
   * Constructs a CameraOperator which can be added as an updatable to the world.
   * The CameraOperator follows the nobot from its position, allowing for a minor
   * level of offset from mouse movement based on the mouse position in the canvas.
   * @param world
   * @param camera
   */
  constructor(
    world: World,
    camera: THREE.PerspectiveCamera,
    domElement: HTMLCanvasElement
  ) {
    super(camera, domElement);
    // set properties
    this.world = world;
    this.camera = camera;

    // offset state
    this.freeTarget = new THREE.Object3D();
    this.movementSpeed = 0.06;
    this.restThreshold = 0.01;

    // create actions
    this.actions = {
      forward: new KeyBinding('KeyW'),
      back: new KeyBinding('KeyS'),
      left: new KeyBinding('KeyA'),
      right: new KeyBinding('KeyD'),
      up: new KeyBinding('KeyE'),
      down: new KeyBinding('KeyQ'),
      fast: new KeyBinding('ShiftLeft'),
    };
  }

  /* -------------------------------------------------------------------------- */
  /*                                 UPDATE LOOP                                */
  /* -------------------------------------------------------------------------- */

  /**
   * Runs one step of updating the camera. TODO: add offset
   */
  public update2(delta: number): void {
    // during transitions, skip update
    if (!this.transitioning) {
      // wwhen following, keep position offset from target
      if (this.followMode === true && this.target) {
        const x = this.target.position.x;
        const y = this.target.position.y;
        const z = this.target.position.z;
        this.moveTo(x, y, z, false);
        // when free, just calculate the position based on targetPos + velocity
      } else {
        const x = this.freeTarget.position.x;
        const y = this.freeTarget.position.y;
        const z = this.freeTarget.position.z;
        this.moveTo(x, y, z, false);
        // const speed =
        //   this.movementSpeed *
        //   (this.actions.fast.isPressed ? delta * 600 : delta * 60);
        // const up = Utils.getUp(this.camera);
        // const right = Utils.getRight(this.camera);
        // const forward = Utils.getBack(this.camera);
        // const newPosition = new THREE.Vector3();
        // this.getPosition(newPosition);
        // console.log(up.multiplyScalar(speed * this.upVelocity));
        // newPosition.add(up.multiplyScalar(speed * this.upVelocity));
        // newPosition.add(forward.multiplyScalar(speed * this.forwardVelocity));
        // newPosition.add(right.multiplyScalar(speed * this.rightVelocity));
        // // this.setPosition(newPosition.x, newPosition.y, newPosition.z, false);
        // // this.camera.position.set(newPosition.x, newPosition.y, newPosition.z);
        // const newLookAt = newPosition.clone();
        // newLookAt.add(Utils.getBack(this.camera).multiplyScalar(1e-5));
        // this.moveTo(newPosition.x, newPosition.y, newPosition.z, false);
        // const newLookAt = newPosition.clone();
        // newLookAt.add(forward.multiplyScalar(1e-2));
        // // this.setLookAt(
        // //   newPosition.x,
        // //   newPosition.y,
        // //   newPosition.z,
        // //   newLookAt.x,
        // //   newLookAt.y,
        // //   newLookAt.z,
        // //   false
        // // );
        // this.moveTo(newPosition.x, newPosition.y, newPosition.z);
        // decay the velocity until below a threshold
        // this.rightVelocity = THREE.MathUtils.lerp(this.rightVelocity, 0, 0.3);
        // this.upVelocity = THREE.MathUtils.lerp(this.upVelocity, 0, 0.3);
        // this.forwardVelocity = THREE.MathUtils.lerp(
        //   this.forwardVelocity,
        //   0,
        //   0.3
        // );
      }
    }
    // call the initial camera controls update func
    this.update(delta);
  }

  /* -------------------------------------------------------------------------- */
  /*                                  LISTENERS                                 */
  /* -------------------------------------------------------------------------- */

  /**
   * Not sure what the mouse handler will be used for. Definitely for clicking
   * on objects in the scene with raycasting, at least.
   * @param event
   * @param code
   * @param pressed
   */
  public handleMouseButton(
    event: MouseEvent,
    code: string,
    pressed: boolean
  ): void {
    // TODO: Some mouse click event with the camera
    Object.keys(this.actions).forEach((action) => {
      if (Object.prototype.hasOwnProperty.call(this.actions, action)) {
        const binding = this.actions[action];
        if (_.includes(binding.eventCodes, code)) {
          binding.isPressed = pressed;
        }
      }
    });
  }

  /**
   * Handle keyboard input to the camera.
   * @param e
   * @param code
   * @param pressed
   */
  public handleKeyboardEvent(
    e: KeyboardEvent,
    code: string,
    pressed: boolean
  ): void {
    if (code === 'KeyC' && pressed) {
      if (this.nobotCaller !== undefined) {
        // reset our things back to defaults
        this.minDistance = 1;
        this.maxDistance = 20;
        this.azimuthRotateSpeed = 1.0;
        this.polarRotateSpeed = 1.0;
        this.transitioning = true;
        this.moveTo(
          this.nobotCaller.position.x,
          this.nobotCaller.position.y,
          this.nobotCaller.position.z,
          true
        ).then(() => {
          this.world.inputManager.setInputReceiver(this.nobotCaller!);
          this.nobotCaller = undefined;
          this.followMode = true;
          this.transitioning = false;
        });
      }
    } else {
      for (const action in this.actions) {
        if (this.actions.hasOwnProperty(action)) {
          const binding = this.actions[action];
          if (_.includes(binding.eventCodes, code)) {
            binding.isPressed = pressed;
          }
        }
      }
    }
  }

  /**
   * Handle nipple input to the camera.
   * @param state the nipple state
   */
  public handleNippleEvent(active: boolean, angle: number): void {
    const a = this;
  }

  /* -------------------------------------------------------------------------- */
  /*                               INPUT RECEIVER                               */
  /* -------------------------------------------------------------------------- */

  /**
   * Initialize the input receiver, by simply placing the camera in the scene.
   */
  public inputReceiverInit(): void {
    this.freeTarget.position.copy(this.camera.position);
    this.target = this.freeTarget;
    this.distance = 1e-5;
    // move a bit off
    this.moveTo(
      this.target.position.x,
      this.target.position.y,
      this.target.position.z,
      true
    );
    // set epsilon to center
    // this.setTarget(
    //   this.camera.position.x,
    //   this.camera.position.y,
    //   this.camera.position.z,
    //   true
    // );
    this.minDistance = this.maxDistance = 1e-5;
    this.azimuthRotateSpeed = -0.3;
    this.polarRotateSpeed = -0.3;
    this.followMode = false;
  }

  /**
   * When the camera is the input receiver, allow it to fly around
   * @param timeStep
   */
  public inputReceiverUpdate(timeStep: number): void {
    this.upVelocity = THREE.MathUtils.lerp(
      this.upVelocity,
      +this.actions.up.isPressed - +this.actions.down.isPressed,
      0.3
    );
    this.forwardVelocity = THREE.MathUtils.lerp(
      this.forwardVelocity,
      +this.actions.forward.isPressed - +this.actions.back.isPressed,
      0.3
    );
    this.rightVelocity = THREE.MathUtils.lerp(
      this.rightVelocity,
      +this.actions.right.isPressed - +this.actions.left.isPressed,
      0.3
    );
  }
}
