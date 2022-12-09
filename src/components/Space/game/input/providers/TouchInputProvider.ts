/*
 * TouchInputProvider.ts
 * author: evan kirkiles
 * created on Thu Dec 08 2022
 * 2022 the nobot space,
 */
import { InputManager } from '../../core/InputManager';
import { InputJoystick, InputButton } from '../../enums/UserInputs';
import { IInputProvider } from '../../interfaces/IInputProvider';
import type NippleJs from 'nipplejs';

let nipplejs: typeof NippleJs;

export default class TouchInputProvider implements IInputProvider {
  private manager: InputManager;
  isListening: boolean = false;

  // dom element in which to place the nipple
  public domElement: HTMLElement;
  // nipple for main movement
  public nippleDomElement: HTMLDivElement;
  public nippleManager?: ReturnType<typeof nipplejs.create>;
  public nippleState: string = 'end';

  // is the device a touch screen? if not, we do not show anything
  public isTouchScreen: boolean = false;

  constructor(manager: InputManager, domElement: HTMLElement = document.body) {
    this.manager = manager;
    this.domElement = domElement;

    // check if we're on a touch screen
    this.isTouchScreen =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      (navigator as any).msMaxTouchPoints > 0 ||
      true;

    // only get nipplejs if we touch screen
    if (this.isTouchScreen) {
      nipplejs = require('nipplejs');
    }

    // create the nipple dom element
    this.nippleDomElement = document.createElement('div');
    this.nippleDomElement.style.position = 'absolute';
    this.nippleDomElement.style.bottom = '0px';
    this.nippleDomElement.style.right = '0px';
    this.nippleDomElement.style.width = '75px';
    this.nippleDomElement.style.height = '75px';
    this.nippleDomElement.style.zIndex = '1';
  }

  /* -------------------------------------------------------------------------- */
  /*                                  STATEFULS                                 */
  /* -------------------------------------------------------------------------- */

  /**
   * Applies all the handlers to the DOM, if not already applied
   */
  listen() {
    if (this.isListening || !this.isTouchScreen) return;
    this.isListening = true;
    // add 360º nipple
    this.domElement.append(this.nippleDomElement);
    this.nippleManager = nipplejs.create({
      zone: this.nippleDomElement,
      mode: 'static',
      dynamicPage: true,
      shape: 'circle',
    });
    this.nippleManager.on('end', (evt) => this.onNippleStop(evt));
    this.nippleManager.on('move', (evt, data) => this.onNippleMove(evt, data));
  }

  /**
   * Removes all the mouse handlers to the DOM, if not already removed
   */
  deafen(): void {
    if (!this.isListening || !this.isTouchScreen) return;
    this.isListening = false;
    this.nippleDomElement.remove();
    if (this.nippleManager) this.nippleManager.destroy();
  }

  /* -------------------------------------------------------------------------- */
  /*                                  LISTENERS                                 */
  /* -------------------------------------------------------------------------- */

  /**
   * Funnels an OnKeyDown event through to the input receiver
   * @param event A KeyDown event
   */
  public onNippleMove(
    evt: NippleJs.EventData,
    data: NippleJs.JoystickOutputData
  ): void {
    this.manager.handleJoystickEvent(
      InputJoystick.MAIN,
      data.angle.radian ?? 0,
      data.distance / 75,
      true
    );
  }

  /**
   * Funnels an OnKeyDown event through to the input receiver
   * @param event A KeyDown event
   */
  public onNippleStop(evt: NippleJs.EventData): void {
    this.manager.handleJoystickEvent(InputJoystick.MAIN, 0, 0, false);
  }
}
