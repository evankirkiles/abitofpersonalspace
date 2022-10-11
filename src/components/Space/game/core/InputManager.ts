/*
 * InputManager.ts
 * author: evan kirkiles
 * created on Sat Jun 25 2022
 * 2022 the nobot space,
 */
import { IInputReceiver } from '../interfaces/IInputReceiver';
import { IUpdatable } from '../interfaces/IUpdatable';
import { World } from '../world/World';

export class InputManager implements IUpdatable {
  public updateOrder: number = 3;

  // reference to the world and target
  public world: World;
  public domElement: HTMLElement;

  // is listening to input?
  public isListening: boolean = false;
  public pointerLock: boolean = true;
  public isLocked: boolean = false;

  // bind listeners
  public boundOnMouseDown: (evt: MouseEvent) => void;
  public boundOnMouseMove: (evt: MouseEvent) => void;
  public boundOnMouseUp: (evt: MouseEvent) => void;
  public boundOnMouseWheelMove: (evt: WheelEvent) => void;
  public boundOnKeyDown: (evt: KeyboardEvent) => void;
  public boundOnKeyUp: (evt: KeyboardEvent) => void;
  public boundOnPointerlockChange: (evt: Event) => void;
  public boundOnPointerlockError: (evt: Event) => void;

  // receiver of the inputs
  public inputReceiver?: IInputReceiver;

  /**
   * Initialize the listeners to the world
   * @param world
   */
  constructor(world: World, domElement?: HTMLElement) {
    // init properties
    this.world = world;
    this.domElement = domElement || document.body;

    // bindings for later event use
    //  - mouse
    this.boundOnMouseDown = (evt) => this.onMouseDown(evt);
    this.boundOnMouseMove = (evt) => this.onMouseMove(evt);
    this.boundOnMouseUp = (evt) => this.onMouseUp(evt);
    this.boundOnMouseWheelMove = (evt) => this.onMouseWheelMove(evt);
    //  - keys
    this.boundOnKeyDown = (evt) => this.onKeyDown(evt);
    this.boundOnKeyUp = (evt) => this.onKeyUp(evt);
    //  - pointer lock
    this.boundOnPointerlockChange = (evt) => this.onPointerLockChange(evt);
    this.boundOnPointerlockError = (evt) => this.onPointerLockError(evt);

    // now start listening
    this.listen();

    // register as updatable
    world.registerUpdatable(this);
  }

  /**
   * Update the input receiver by one timestep.
   * @param timestep
   * @param unscaledTimeStep
   */
  public update(timestep: number): void {
    if (!this.inputReceiver && this.world && this.world.cameraOperator) {
      this.setInputReceiver(this.world.cameraOperator);
    }
    this.inputReceiver?.inputReceiverUpdate(timestep);
  }

  /**
   * Bind an input receiver to the manager to consume all of its events.
   * @param receiver The new receiver to handle key/mouse/wheel events
   */
  public setInputReceiver(receiver: IInputReceiver): void {
    this.inputReceiver = receiver;
    this.inputReceiver.inputReceiverInit();
  }

  /* -------------------------------------------------------------------------- */
  /*                                  STATEFULS                                 */
  /* -------------------------------------------------------------------------- */

  /**
   * Applies all the mouse handlers to the DOM, if not already applied
   */
  public listen(): void {
    if (this.isListening) return;
    this.isListening = true;

    // Mouse
    this.world.target.addEventListener(
      'mousedown',
      this.boundOnMouseDown,
      false
    );
    document.addEventListener('wheel', this.boundOnMouseWheelMove, false);

    // Keys
    document.addEventListener('keydown', this.boundOnKeyDown, false);
    document.addEventListener('keyup', this.boundOnKeyUp, false);

    // Pointer lock
    document.addEventListener(
      'pointerlockchange',
      this.boundOnPointerlockChange,
      false
    );
    document.addEventListener(
      'pointerlockerror',
      this.boundOnPointerlockError,
      false
    );
  }

  /**
   * Removes all the mouse handlers to the DOM, if not already removed
   */
  public deafen(): void {
    if (!this.isListening) return;
    this.isListening = false;

    // Mouse
    this.world.target.removeEventListener(
      'mousedown',
      this.boundOnMouseDown,
      false
    );
    this.world.target.removeEventListener(
      'mousemove',
      this.boundOnMouseMove,
      false
    );
    this.world.target.removeEventListener(
      'mouseup',
      this.boundOnMouseUp,
      false
    );
    document.removeEventListener('wheel', this.boundOnMouseWheelMove, false);

    // Keys
    document.removeEventListener('keydown', this.boundOnKeyDown, false);
    document.removeEventListener('keyup', this.boundOnKeyUp, false);
  }

  /* -------------------------------------------------------------------------- */
  /*                                  LISTENERS                                 */
  /* -------------------------------------------------------------------------- */

  /* ---------------------------------- MOUSE --------------------------------- */

  /**
   * Funnels a MouseDown event through to the input receiver
   * @param event A MouseDown event
   */
  public onMouseDown(event: MouseEvent): void {
    if (this.pointerLock) {
      this.domElement.requestPointerLock();
    } else {
      this.domElement.addEventListener(
        'mousemove',
        this.boundOnMouseMove,
        false
      );
      this.domElement.addEventListener('mouseup', this.boundOnMouseUp, false);
    }
    if (this.inputReceiver)
      this.inputReceiver.handleMouseButton(event, `mouse${event.button}`, true);
  }

  /**
   * Funnels a MouseMove event through to the input receiver
   * @param event A MouseMove event
   */
  public onMouseMove(event: MouseEvent): void {
    if (this.inputReceiver)
      this.inputReceiver.handleMouseMove(
        event,
        event.movementX,
        event.movementY
      );
  }

  /**
   * Funnels a MouseUp event through to the input receiver
   * @param event A MouseUp event
   */
  public onMouseUp(event: MouseEvent): void {
    if (!this.pointerLock) {
      this.domElement.removeEventListener(
        'mousemove',
        this.boundOnMouseMove,
        false
      );
      this.domElement.removeEventListener(
        'mouseup',
        this.boundOnMouseUp,
        false
      );
    }
    if (this.inputReceiver)
      this.inputReceiver.handleMouseButton(
        event,
        `mouse${event.button}`,
        false
      );
  }

  /* -------------------------------- KEYBOARD -------------------------------- */

  /**
   * Funnels an OnKeyDown event through to the input receiver
   * @param event A KeyDown event
   */
  public onKeyDown(event: KeyboardEvent): void {
    if (this.inputReceiver)
      this.inputReceiver.handleKeyboardEvent(event, event.code, true);
  }

  /**
   * Funnels an OnKeyUp event through to the input receiver
   * @param event A KeyUp event
   */
  public onKeyUp(event: KeyboardEvent): void {
    if (this.inputReceiver)
      this.inputReceiver.handleKeyboardEvent(event, event.code, false);
  }

  /* ------------------------------- MOUSE WHEEL ------------------------------ */

  /**
   * Funnels a MouseWheelMove event through to the input receiver
   * @param event A MouseWheelMove event
   */
  public onMouseWheelMove(event: WheelEvent): void {
    if (this.inputReceiver)
      this.inputReceiver.handleMouseWheel(event, event.deltaY);
  }

  /* -------------------------------------------------------------------------- */
  /*                                POINTER LOCK                                */
  /* -------------------------------------------------------------------------- */

  /**
   * Enable / disable pointer lock, keeping cursor in the dom element
   */
  public setPointerLock(enabled: boolean): void {
    this.pointerLock = enabled;
  }

  /**
   * When pointer lock begins or ends, bind / remove mouse listeners
   * @param event
   */
  public onPointerLockChange(event: Event): void {
    if (document.pointerLockElement === this.domElement) {
      this.domElement.addEventListener(
        'mousemove',
        this.boundOnMouseMove,
        false
      );
      this.domElement.addEventListener('mouseup', this.boundOnMouseUp, false);
      this.isLocked = true;
    } else {
      this.domElement.removeEventListener(
        'mousemove',
        this.boundOnMouseMove,
        false
      );
      this.domElement.removeEventListener(
        'mouseup',
        this.boundOnMouseUp,
        false
      );
      this.isLocked = false;
    }
  }

  /**
   * Sometimes, we can't use pointer lock.
   * @param event
   */
  public onPointerLockError(event: Event): void {
    console.error('PointerLockControls: Unable to use Pointer Lock API.', this);
  }
}
