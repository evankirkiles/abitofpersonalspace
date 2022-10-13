/*
 * CameraOperator.ts
 * author: evan kirkiles
 * created on Sat Jun 25 2022
 * 2022 the nobot space,
 */
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

export class CameraOperator implements IInputReceiver, IUpdatable {
  public updateOrder: number = 4;

  // scene / world properties
  public world: World;
  public camera: THREE.Camera;
  public nobotCaller?: Nobot;
  public raycaster: THREE.Raycaster;

  // statefuls
  public target: THREE.Vector3;
  public sensitivity: THREE.Vector2;
  public followMode: boolean = true;

  // constraints
  public movementSpeed: number;
  public radius: number;
  public targetRadius: number = 1;
  public theta: number;
  public phi: number;

  // free- state
  public upVelocity: number = 0;
  public forwardVelocity: number = 0;
  public rightVelocity: number = 0;

  // mouse interaction
  public onMouseDownPosition: THREE.Vector2;
  public onMouseDownTheta: any;
  public onMouseDownPhi: any;

  // actions & character
  public actions: { [action: string]: KeyBinding };

  /**
   * Constructs a CameraOperator which can be added as an updatable to the world.
   * The CameraOperator follows the nobot from its position, allowing for a minor
   * level of offset from mouse movement based on the mouse position in the canvas.
   * @param world
   * @param camera
   * @param sensitivityX
   * @param sensitivityY
   */
  constructor(
    world: World,
    camera: THREE.Camera,
    sensitivityX: number = 0.2,
    sensitivityY: number = sensitivityX * 0.8
  ) {
    // set properties
    this.world = world;
    this.camera = camera;
    this.raycaster = new THREE.Raycaster();
    this.raycaster.firstHitOnly = true;

    // target holds the target position
    this.target = new THREE.Vector3();

    // offset state
    this.movementSpeed = 0.06;
    this.radius = 3;
    this.theta = 0;
    this.phi = 0;

    // mouse interaction
    this.sensitivity = new THREE.Vector2(sensitivityX, sensitivityY);
    this.onMouseDownPosition = new THREE.Vector2();
    this.onMouseDownTheta = this.theta;
    this.onMouseDownPhi = this.phi;

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

    // add the camera as an updatable
    // world.registerUpdatable(this);
  }

  /* -------------------------------------------------------------------------- */
  /*                                  STATEFULS                                 */
  /* -------------------------------------------------------------------------- */

  /**
   * Sets the radius, i.e. the distance the camera is from the character
   * @param value
   * @param instantly
   */
  public setRadius(value: number, instantly: boolean = false): void {
    this.targetRadius = Math.max(0.001, value);
    if (instantly === true) {
      this.radius = value;
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                 UPDATE LOOP                                */
  /* -------------------------------------------------------------------------- */

  /**
   * Offsets the camera's target from its target.
   * @param deltaX
   * @param deltaY
   */
  public move(deltaX: number, deltaY: number): void {
    this.theta -= deltaX * (this.sensitivity.x / 2);
    this.theta %= 360;
    this.phi += deltaY * (this.sensitivity.y / 2);
    this.phi = Math.min(85, Math.max(-85, this.phi));
  }

  /**
   * Runs one step of updating the camera. TODO: add offset
   */
  public update(): void {
    return;
    // wwhen following, keep position offset from target
    if (this.followMode === true) {
      this.camera.position.y = THREE.MathUtils.clamp(
        this.camera.position.y,
        this.target.y,
        Number.POSITIVE_INFINITY
      );
      this.camera.lookAt(this.target);
      const newPos = this.target
        .clone()
        .add(
          new THREE.Vector3()
            .subVectors(this.camera.position, this.target)
            .normalize()
            .multiplyScalar(this.targetRadius)
        );
      this.camera.position.x = newPos.x;
      this.camera.position.y = newPos.y;
      this.camera.position.z = newPos.z;
      // when free, just calculate the position
    } else {
      this.radius = THREE.MathUtils.lerp(this.radius, this.targetRadius, 0.1);
      this.camera.position.x =
        this.target.x +
        this.radius *
          Math.sin((this.theta * Math.PI) / 180) *
          Math.cos((this.phi * Math.PI) / 180);
      this.camera.position.y =
        this.target.y + this.radius * Math.sin((this.phi * Math.PI) / 180);
      this.camera.position.z =
        this.target.z +
        this.radius *
          Math.cos((this.theta * Math.PI) / 180) *
          Math.cos((this.phi * Math.PI) / 180);
      const diff = new THREE.Vector3()
        .subVectors(this.camera.position, this.target)
        .normalize();
      // raycast between target and camera with
      this.raycaster.set(
        new THREE.Vector3().copy(diff).multiplyScalar(0.2).add(this.target),
        diff
      );
      // intersect between the camera
      const intersects = this.raycaster.intersectObjects(
        this.world.raycastScene
      );
      if (intersects[0] && intersects[0].distance < this.targetRadius) {
        this.camera.position.copy(
          intersects[0].point.sub(diff.multiplyScalar(0.15))
        );
      }
      this.camera.updateMatrix();
      this.camera.lookAt(this.target);
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                  LISTENERS                                 */
  /* -------------------------------------------------------------------------- */

  /**
   * Handler for the mouse moving. Use this to provide a slight offset to the
   * camera from the nobot, but not so much that this would make clicking on
   * things in the scene difficult.
   * @param event
   * @param deltaX
   * @param deltaY
   */
  public handleMouseMove(
    event: MouseEvent,
    deltaX: number,
    deltaY: number
  ): void {
    this.move(deltaX, deltaY);
  }

  /**
   * Handler for the mouse scrolling. Use this to zoom in and out the camera,
   * clamped to prevent zooming too far in.
   * @param event
   * @param deltaY
   */
  public handleMouseWheel(event: WheelEvent, deltaY: number): void {
    // TODO: Zoom in the camera
    // console.log(this);
    const a = this;
  }

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
    // TODO: Connect keyboard evnets to the camera. Is this character controls?
    // console.log(this);
    const a = this;
  }

  /**
   * Handle nipple input to the camera.
   * @param state the nipple state
   */
  public handleNippleEvent(state: string): void {
    const a = this;
  }

  /* -------------------------------------------------------------------------- */
  /*                               INPUT RECEIVER                               */
  /* -------------------------------------------------------------------------- */

  /**
   * Initialize the input receiver, by simply placing the camera in the scene.
   */
  public inputReceiverInit(): void {
    this.target.copy(this.camera.position);
    this.setRadius(0, true);
  }

  /**
   * When the camera is the input receiver, allow it to fly around
   * @param timeStep
   */
  public inputReceiverUpdate(timeStep: number): void {
    // Set fly speed
    const speed =
      this.movementSpeed *
      (this.actions.fast.isPressed ? timeStep * 600 : timeStep * 60);
    const up = Utils.getUp(this.camera);
    const right = Utils.getRight(this.camera);
    const forward = Utils.getBack(this.camera);
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
    this.target.add(up.multiplyScalar(speed * this.upVelocity));
    this.target.add(forward.multiplyScalar(speed * this.forwardVelocity));
    this.target.add(right.multiplyScalar(speed * this.rightVelocity));
  }
}
