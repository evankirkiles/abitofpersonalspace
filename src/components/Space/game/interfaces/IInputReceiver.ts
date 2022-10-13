/*
 * IInputReceiver.ts
 * author: evan kirkiles
 * created on Sat Jun 25 2022
 * 2022 the nobot space,
 */

import { KeyBinding } from '../core/KeyBinding';
import type NippleJs from 'nipplejs';

export interface IInputReceiver {
  actions: { [action: string]: KeyBinding };

  // event handlers
  handleKeyboardEvent(e: KeyboardEvent, code: string, pressed: boolean): void;
  handleNippleEvent(state: string): void;

  // initialization and updating
  inputReceiverInit(): void;
  inputReceiverUpdate(timeStep: number): void;
}
