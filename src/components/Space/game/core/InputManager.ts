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
  public nippleManager?: ReturnType<typeof nipplejs.create>;
  public nippleState: string = 'end';

  // is the device a touch screen? if so, add nipple
  public isTouchScreen: boolean = false;

  // is listening to input?
  public isListening: boolean = false;
  public pointerLock: boolean = true;
  public isLocked: boolean = false;

  // bind listeners
  public boundOnKeyDown: (evt: KeyboardEvent) => void;
  public boundOnKeyUp: (evt: KeyboardEvent) => void;
  public boundOnNippleMove: (
    evt: NippleJs.EventData,
    data: NippleJs.JoystickOutputData
  ) => void;
  public boundOnNippleStop: (evt: NippleJs.EventData) => void;

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
    this.nippleDomElement = document.createElement('div');
    this.nippleDomElement.style.position = 'absolute';
    this.nippleDomElement.style.bottom = '0px';
    this.nippleDomElement.style.right = '0px';
    this.nippleDomElement.style.width = '85px';
    this.nippleDomElement.style.height = '85px';
    this.nippleDomElement.style.zIndex = '1';

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
      this.domElement.append(this.nippleDomElement);
      this.nippleManager = nipplejs.create({
        zone: this.nippleDomElement,
        mode: 'static',
        dynamicPage: true,
      });
      this.nippleManager.on('end', this.boundOnNippleStop);
      this.nippleManager.on('move', this.boundOnNippleMove);
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
      if (this.nippleManager) {
        this.nippleManager.destroy();
      }
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
}
