/*
 * GamepadInputProvider.ts
 * author: evan kirkiles
 * created on Thu Dec 08 2022
 * 2022 the nobot space,
 */
import { InputManager } from '../../core/InputManager';
import { InputJoystick } from '../../enums/UserInputs';
import { IInputProvider } from '../../interfaces/IInputProvider';

export default class GamepadInputProvider implements IInputProvider {
  private manager: InputManager;
  isListening: boolean = false;

  // keep track of connected gamepads
  _haveEvents = false;
  _haveWebkitEvents = false;
  controllers: {
    [key: number]: Gamepad;
  } = {};

  // map controller joysticks (XY)
  bindings_controllers: InputJoystick[] = [
    InputJoystick.MAIN,
    InputJoystick.SECONDARY,
  ];
  // map controller buttons

  // keep track of previous state for each gamepad

  /**
   * On construction, immediately add a listener that will continually check
   * if a new gamepad has connected to the game.
   * @param manager
   */
  constructor(manager: InputManager) {
    this.manager = manager;
    // add gamepad connect / disconnected listeners
    if ('GamepadEvent' in window) {
      window.addEventListener('gamepadconnected', (e) => {
        this.controllers[e.gamepad.index] = e.gamepad;
      });
      window.addEventListener('gamepaddisconnected', (e) => {
        delete this.controllers[e.gamepad.index];
      });
    } else {
      setInterval(() => this.scanGamepads(), 500);
    }
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
  }

  /**
   * Removes all the mouse handlers to the DOM, if not already removed
   */
  deafen(): void {
    if (!this.isListening) return;
    this.isListening = false;
  }

  /**
   * Emits events of differences between previous and current gamepad state.
   * @returns
   */
  update() {
    if (!this.isListening) return;
    for (const j in this.controllers) {
      const gamepad = this.controllers[j];
      console.log(gamepad.axes);
      // emit the axes
      for (let i = 0; i < this.bindings_controllers.length; i++) {
        const x = gamepad.axes[i * 2];
        const y = gamepad.axes[i * 2 + 1];
        this.manager.handleJoystickEvent(
          this.bindings_controllers[i],
          Math.atan2(y, x),
          Math.hypot(x, y),
          x === 0 && y === 0
        );
      }
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                               INITIALIZATION                               */
  /* -------------------------------------------------------------------------- */

  /**
   * Manually populates the gamepads connected to the game.
   */
  private scanGamepads(): void {
    const gamepads: (Gamepad | null)[] = navigator.getGamepads
      ? navigator.getGamepads()
      : // @ts-ignore
      navigator.webkitGetGamepads
      ? // @ts-ignore
        navigator.webkitGetGamepads()
      : [];
    for (let i = 0; i < gamepads.length; i++) {
      if (!gamepads[i]) continue;
      if (this.controllers[gamepads[i]!.index] !== undefined) {
        this.controllers[gamepads[i]!.index] = gamepads[i]!;
      }
    }
  }
}
