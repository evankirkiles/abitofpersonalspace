/*
 * InputManager.ts
 * author: evan kirkiles
 * created on Sat Jun 25 2022
 * 2022 the nobot space,
 */
import { IInputReceiver } from '../interfaces/IInputReceiver';
import { IUpdatable } from '../interfaces/IUpdatable';
import { World } from '../world/World';
import type NippleJs from 'nipplejs';

let nipplejs: typeof NippleJs;

export class InputManager implements IUpdatable {
  public updateOrder: number = 3;

  // reference to the world and target
  public world: World;
  public domElement: HTMLElement;

  // nipple for mobile controls
  public nippleDomElement: HTMLDivElement;
  public vNippleDomElement: HTMLDivElement;
  public nippleManager?: ReturnType<typeof nipplejs.create>;
  public vNippleManager?: ReturnType<typeof nipplejs.create>;
  public nippleState: string = 'end';
  public vNippleState: string = 'end';

  // is the device a touch screen? if so, add nipple
  public isTouchScreen: boolean = false;

  // is listening to input?
  public isListening: boolean = false;
  public pointerLock: boolean = true;
  public isLocked: boolean = false;

  // bind listeners
  public boundOnKeyDown: (evt: KeyboardEvent) => void;
  public boundOnKeyUp: (evt: KeyboardEvent) => void;
  // full joystick movement
  public boundOnNippleMove: (
    evt: NippleJs.EventData,
    data: NippleJs.JoystickOutputData
  ) => void;
  public boundOnNippleStop: (evt: NippleJs.EventData) => void;
  // vertical joystick movement
  public boundOnVNippleMove: (
    evt: NippleJs.EventData,
    data: NippleJs.JoystickOutputData
  ) => void;
  public boundOnVNippleStop: (evt: NippleJs.EventData) => void;

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

    // check if we're on a touch screen
    this.isTouchScreen =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      (navigator as any).msMaxTouchPoints > 0;

    // joystick nipple dom element
    this.nippleDomElement = document.createElement('div');
    this.nippleDomElement.style.position = 'absolute';
    this.nippleDomElement.style.bottom = '0px';
    this.nippleDomElement.style.right = '0px';
    this.nippleDomElement.style.width = '75px';
    this.nippleDomElement.style.height = '75px';
    this.nippleDomElement.style.zIndex = '1';
    // joystick nipple dom label
    // const label = document.createElement('div');
    // label.style.position = 'absolute';
    // label.style.top = '-3px';
    // label.style.left = '0px';
    // label.style.transform = 'translate(50px, -50px) translate(-100%, -100%)';
    // label.style.fontSize = '12px';
    // label.style.opacity = '0.3';
    // label.style.letterSpacing = '3px';
    // // label.style.fontFamily = 'monospace';
    // label.innerText = 'MOVE';
    // this.nippleDomElement.appendChild(label);

    // vertical nipple dom element
    this.vNippleDomElement = document.createElement('div');
    this.vNippleDomElement.style.position = 'absolute';
    this.vNippleDomElement.style.bottom = '0px';
    this.vNippleDomElement.style.left = '0px';
    this.vNippleDomElement.style.width = '75px';
    this.vNippleDomElement.style.height = '75px';
    this.vNippleDomElement.style.zIndex = '1';
    // vertical nipple dom label
    // const vLabel = document.createElement('div');
    // vLabel.style.position = 'absolute';
    // vLabel.style.top = '-3px';
    // vLabel.style.right = '0px';
    // vLabel.style.transform = 'translate(-50px, -50px) translate(100%, -100%)';
    // vLabel.style.fontSize = '12px';
    // vLabel.style.opacity = '0.3';
    // vLabel.style.letterSpacing = '3px';
    // // vLabel.style.fontFamily = 'monospace';
    // vLabel.innerText = 'JUMP';
    // this.vNippleDomElement.appendChild(vLabel);

    // nipple dom element
    if (this.isTouchScreen) {
      nipplejs = require('nipplejs');
    }

    //  - keys
    this.boundOnKeyDown = (evt) => this.onKeyDown(evt);
    this.boundOnKeyUp = (evt) => this.onKeyUp(evt);
    //  - nipple
    this.boundOnNippleMove = (evt, data) => this.onNippleMove(evt, data);
    this.boundOnNippleStop = (evt) => this.onNippleStop(evt);
    //  - vNipple
    this.boundOnVNippleMove = (evt, data) => this.onVNippleMove(evt, data);
    this.boundOnVNippleStop = (evt) => this.onVNippleStop(evt);

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

    // Keys
    document.addEventListener('keydown', this.boundOnKeyDown, false);
    document.addEventListener('keyup', this.boundOnKeyUp, false);

    // add nipple
    if (this.isTouchScreen) {
      // add 360º nipple
      this.domElement.append(this.nippleDomElement);
      this.nippleManager = nipplejs.create({
        zone: this.nippleDomElement,
        mode: 'static',
        dynamicPage: true,
        shape: 'circle',
      });
      this.nippleManager.on('end', this.boundOnNippleStop);
      this.nippleManager.on('move', this.boundOnNippleMove);
      // add vertical nipple
      this.domElement.append(this.vNippleDomElement);
      this.vNippleManager = nipplejs.create({
        zone: this.vNippleDomElement,
        mode: 'static',
        dynamicPage: true,
        lockY: true,
        shape: 'circle',
        position: { top: '0', right: '0', left: 'unset' },
      });
      this.vNippleManager.on('end', this.boundOnVNippleStop);
      this.vNippleManager.on('move', this.boundOnVNippleMove);
    }
  }

  /**
   * Removes all the mouse handlers to the DOM, if not already removed
   */
  public deafen(): void {
    if (!this.isListening) return;
    this.isListening = false;

    // Keys
    document.removeEventListener('keydown', this.boundOnKeyDown, false);
    document.removeEventListener('keyup', this.boundOnKeyUp, false);

    // remove nipple
    if (this.isTouchScreen) {
      this.nippleDomElement.remove();
      this.vNippleDomElement.remove();
      if (this.nippleManager) this.nippleManager.destroy();
      if (this.vNippleManager) this.vNippleManager.destroy();
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                  LISTENERS                                 */
  /* -------------------------------------------------------------------------- */

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

  /* -------------------------------- NIPPLE -------------------------------- */

  /**
   * Funnels an OnKeyDown event through to the input receiver
   * @param event A KeyDown event
   */
  public onNippleMove(
    evt: NippleJs.EventData,
    data: NippleJs.JoystickOutputData
  ): void {
    if (this.inputReceiver) {
      this.inputReceiver.handleNippleEvent(true, data.angle.radian ?? 0);
    }
  }

  /**
   * Funnels an OnKeyDown event through to the input receiver
   * @param event A KeyDown event
   */
  public onNippleStop(evt: NippleJs.EventData): void {
    if (this.inputReceiver) {
      this.inputReceiver.handleNippleEvent(false, 0);
    }
  }

  /* ------------------------------- VERT NIPPLE ------------------------------ */

  /**
   * Funnels an OnKeyDown event through to the input receiver
   * @param event A KeyDown event
   */
  public onVNippleMove(
    evt: NippleJs.EventData,
    data: NippleJs.JoystickOutputData
  ): void {
    if (this.inputReceiver) {
      this.inputReceiver.handleVNippleEvent(
        true,
        (data.distance / 50) * data.vector.y
      );
    }
  }

  /**
   * Funnels an OnKeyDown event through to the input receiver
   * @param event A KeyDown event
   */
  public onVNippleStop(evt: NippleJs.EventData): void {
    if (this.inputReceiver) {
      this.inputReceiver.handleVNippleEvent(false, 0);
    }
  }

  /* --------------------------------- BUTTON --------------------------------- */

  /**
   * Funnels a Button click event throuhg to the input receiver
   */
  public onButtonPress(): boolean {
    return !!this.inputReceiver?.handleButtonEvent();
  }
}
