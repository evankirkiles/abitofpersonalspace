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
import { InputButton } from '../enums/UserInputs';
import { IInputReceiver } from '../interfaces/IInputReceiver';
import { IUpdatable } from '../interfaces/IUpdatable';
import { Nobot } from '../nobots/Nobot';
import { World } from '../world/World';
import * as Utils from './FunctionLibrary';
import { InputManager } from './InputManager';
import { KeyBinding } from './KeyBinding';

THREE.Mesh.prototype.raycast = acceleratedRaycast;
// initialize camera controller
CameraControls.install({ THREE });

export class CameraOperator
  extends CameraControls
  implements IInputReceiver, IUpdatable
{
  public updateOrder: number = 4;
  public inputManager: InputManager;

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
    domElement: HTMLCanvasElement,
    inputManager: InputManager
  ) {
    super(camera, domElement);
    // set properties
    this.world = world;
    this.camera = camera;
    this.inputManager = inputManager;

    // offset state
    this.freeTarget = new THREE.Object3D();
    this.minZoom = 0.5;
    this.maxZoom = 4;
    this.movementSpeed = 0.06;
    this.restThreshold = 0.1;
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
        // calculate new target position
        const speed =
          this.movementSpeed *
          (this.inputManager.buttons.speed.isPressed
            ? delta * 600
            : delta * 120);
        const up = Utils.getUp(this.camera);
        const right = Utils.getRight(this.camera);
        const forward = Utils.getBack(this.camera);
        this.freeTarget.position.add(
          up.multiplyScalar(speed * this.upVelocity)
        );
        this.freeTarget.position.add(
          forward.multiplyScalar(speed * this.forwardVelocity)
        );
        this.freeTarget.position.add(
          right.multiplyScalar(speed * this.rightVelocity)
        );
        const x = this.freeTarget.position.x;
        const y = this.freeTarget.position.y;
        const z = this.freeTarget.position.z;
        this.moveTo(x, y, z, false);
        // decay the velocity of camera movement
        this.rightVelocity = THREE.MathUtils.lerp(this.rightVelocity, 0, 0.3);
        this.upVelocity = THREE.MathUtils.lerp(this.upVelocity, 0, 0.3);
        this.forwardVelocity = THREE.MathUtils.lerp(
          this.forwardVelocity,
          0,
          0.3
        );
      }
    }
    // call the initial camera controls update func
    this.update(delta);
  }

  /* -------------------------------------------------------------------------- */
  /*                                  LISTENERS                                 */
  /* -------------------------------------------------------------------------- */

  /**
   * Funnels a button event through to its action handler for the nobot.
   * @param event The nipple event passed from an InputManager
   * @param data The state of the joystick
   */
  public handleButtonEvent(button: InputButton, pressed: boolean): void {
    if (button === InputButton.VIEWTOGGLE && pressed) {
      this.followNobot();
    }
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
    // move target to the freetarget
    this.moveTo(
      this.target.position.x,
      this.target.position.y,
      this.target.position.z,
      true
    );
    this.minDistance = this.maxDistance = 1e-5;
    this.azimuthRotateSpeed = 0.4;
    this.polarRotateSpeed = 0.4;
    this.followMode = false;
    this.mouseButtons.wheel = CameraControls.ACTION.ZOOM;
    this.touches.two = CameraControls.ACTION.TOUCH_ZOOM;
  }

  /**
   * When the camera is the input receiver, allow it to fly around
   * @param timeStep
   */
  public inputReceiverUpdate(timeStep: number): void {
    const joystick = this.inputManager.joysticks.main;
    const buttons = this.inputManager.buttons;
    this.upVelocity = THREE.MathUtils.lerp(
      this.upVelocity,
      Number(buttons.up.isPressed) - Number(buttons.down.isPressed),
      0.3
    );
    this.forwardVelocity = THREE.MathUtils.lerp(
      this.forwardVelocity,
      Number(joystick.isActive) * Math.sin(joystick.angle),
      0.3
    );
    this.rightVelocity = THREE.MathUtils.lerp(
      this.rightVelocity,
      Number(joystick.isActive) * Math.cos(joystick.angle),
      0.3
    );
  }

  /**
   * No camera state, so we don't care about "just" values
   */
  public inputReceiverChange(): void {
    return;
  }

  /* -------------------------------------------------------------------------- */
  /*                                   HELPERS                                  */
  /* -------------------------------------------------------------------------- */

  /**
   * Moves the focus of the camera back to the nobot.
   */
  private followNobot() {
    if (this.nobotCaller !== undefined) {
      // reset our things back to defaults
      this.minDistance = 1;
      this.maxDistance = 20;
      this.azimuthRotateSpeed = 1.0;
      this.polarRotateSpeed = 1.0;
      this.transitioning = true;
      // get 1-distance offset between camera and nobot
      const newPos = this.nobotCaller.position
        .clone()
        .sub(Utils.getForward(this.nobotCaller).multiplyScalar(1.5))
        .add(new THREE.Vector3(0, 1, 0));
      // move our target back to  character
      const nobot = this.nobotCaller;
      this.zoomTo(1, true);
      this.setLookAt(
        newPos.x,
        newPos.y,
        newPos.z,
        this.nobotCaller.position.x,
        this.nobotCaller.position.y,
        this.nobotCaller.position.z,
        true
      ).then(() => {
        this.world.inputManager.setInputReceiver(nobot);
        this.nobotCaller = undefined;
        this.followMode = true;
        this.transitioning = false;
        this.distance = 2;
        this.mouseButtons.wheel = CameraControls.ACTION.DOLLY;
        this.touches.two = CameraControls.ACTION.TOUCH_DOLLY;
      });
    }
  }
}
