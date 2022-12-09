/*
 * KeyboardInputProvider.ts
 * author: evan kirkiles
 * created on Thu Dec 08 2022
 * 2022 the nobot space,
 */
import { InputManager } from '../../core/InputManager';
import { InputJoystick, InputButton } from '../../enums/UserInputs';
import { IInputProvider } from '../../interfaces/IInputProvider';
import { ButtonBinding } from '../ButtonBinding';

export default class KeyboardInputProvider implements IInputProvider {
  private manager: InputManager;
  isListening: boolean = false;

  // keybindings to buttons
  bindings: { [key: string]: InputButton } = {
    Space: InputButton.UP,
    ShiftLeft: InputButton.DOWN,
    ControlLeft: InputButton.SPEED,
    KeyC: InputButton.VIEWTOGGLE,
  };

  // actions for WASD movements
  fakejoystick: { [key: string]: ButtonBinding } = {
    KeyW: new ButtonBinding(),
    KeyA: new ButtonBinding(),
    KeyS: new ButtonBinding(),
    KeyD: new ButtonBinding(),
  };

  // bound listeners
  public boundOnKeyDown: (evt: KeyboardEvent) => void;
  public boundOnKeyUp: (evt: KeyboardEvent) => void;

  constructor(manager: InputManager) {
    this.manager = manager;

    //  - keys
    this.boundOnKeyDown = (evt) => this.onKeyDown(evt);
    this.boundOnKeyUp = (evt) => this.onKeyUp(evt);
  }

  /* -------------------------------------------------------------------------- */
  /*                                  STATEFULS                                 */
  /* -------------------------------------------------------------------------- */

  /**
   * Applies all the handlers to the DOM, if not already applied
   */
  listen() {
    if (this.isListening) return;
    this.isListening = true;
    document.addEventListener('keydown', this.boundOnKeyDown, false);
    document.addEventListener('keyup', this.boundOnKeyUp, false);
  }

  /**
   * Removes all the mouse handlers to the DOM, if not already removed
   */
  deafen(): void {
    if (!this.isListening) return;
    this.isListening = false;
    document.removeEventListener('keydown', this.boundOnKeyDown, false);
    document.removeEventListener('keyup', this.boundOnKeyUp, false);
  }

  /* -------------------------------------------------------------------------- */
  /*                                  LISTENERS                                 */
  /* -------------------------------------------------------------------------- */

  /**
   * Funnels an OnKeyDown event through to the input receiver
   * @param event A KeyDown event
   */
  public onKeyDown(event: KeyboardEvent): void {
    // standard keyboard input (buttons)
    if (this.bindings[event.code] !== undefined)
      this.manager.handleButtonEvent(
        this.bindings[event.code as InputButton],
        true
      );
    // fake joystick events (WASD)
    else if (this.fakejoystick[event.code] !== undefined) {
      this.fakejoystick[event.code].isPressed = true;
      // recalculate joystick "angle"
      const x =
        Number(this.fakejoystick.KeyD.isPressed) -
        Number(this.fakejoystick.KeyA.isPressed);
      const y =
        Number(this.fakejoystick.KeyW.isPressed) -
        Number(this.fakejoystick.KeyS.isPressed);
      this.manager.handleJoystickEvent(
        InputJoystick.MAIN,
        Math.atan2(y, x),
        1,
        true
      );
    }
  }

  /**
   * Funnels an OnKeyUp event through to the input receiver
   * @param event A KeyUp event
   */
  public onKeyUp(event: KeyboardEvent): void {
    if (this.bindings[event.code] !== undefined)
      this.manager.handleButtonEvent(
        this.bindings[event.code as InputButton],
        false
      );
    // fake joystick events (WASD)
    else if (this.fakejoystick[event.code] !== undefined) {
      this.fakejoystick[event.code].isPressed = false;
      // recalculate joystick "angle"
      const x =
        Number(this.fakejoystick.KeyD.isPressed) -
        Number(this.fakejoystick.KeyA.isPressed);
      const y =
        Number(this.fakejoystick.KeyW.isPressed) -
        Number(this.fakejoystick.KeyS.isPressed);
      // possible that joystick is deactivated here
      if (x !== 0 || y !== 0) {
        this.manager.handleJoystickEvent(
          InputJoystick.MAIN,
          Math.atan2(y, x),
          1,
          true
        );
      } else {
        this.manager.handleJoystickEvent(InputJoystick.MAIN, 0, 0, false);
      }
    }
  }
}
