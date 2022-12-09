/*
 * IInputReceiver.ts
 * author: evan kirkiles
 * created on Sat Jun 25 2022
 * 2022 the nobot space,
 */

import { KeyBinding } from '../core/KeyBinding';
import { InputManager } from '../core/InputManager';
import { InputButton, InputJoystick } from '../enums/UserInputs';

export interface IInputReceiver {
  // control handlers
  // handleButtonEvent();

  // // event handlers
  // handleKeyboardEvent(e: KeyboardEvent, code: string, pressed: boolean): void;
  // handleNippleEvent(active: boolean, angle: number): void;
  // handleVNippleEvent(active: boolean, distance: number): void;
  // handleButtonEvent(): boolean;
  inputManager: InputManager;

  // initialization and updating
  inputReceiverInit(): void;
  inputReceiverUpdate(timeStep: number): void;
  inputReceiverChange(): void;

  // handling of input and button events
  handleButtonEvent?(button: InputButton, pressed: boolean): void;
  handleJoystickEvent?(
    joystick: InputJoystick,
    angle: number,
    magnitude: number,
    active: boolean
  ): void;
}
