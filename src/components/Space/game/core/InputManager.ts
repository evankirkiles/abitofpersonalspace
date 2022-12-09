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
import { InputButton, InputJoystick } from '../enums/UserInputs';
import { JoystickBinding } from '../input/JoystickBinding';
import { ButtonBinding } from '../input/ButtonBinding';
import { IInputProvider } from '../interfaces/IInputProvider';
import KeyboardInputProvider from '../input/providers/KeyboardInputProvider';
import TouchInputProvider from '../input/providers/TouchInputProvider';
import GamepadInputProvider from '../input/providers/GamepadInputProvider';

let nipplejs: typeof NippleJs;

export class InputManager implements IUpdatable {
  public updateOrder: number = 3;

  // reference to the world and target
  public world: World;

  /* -------------------------------------------------------------------------- */
  /*                              CONTROL ELEMENTS                              */
  /* -------------------------------------------------------------------------- */

  // bindings to keep track of input state from input receivers
  public joysticks: { [joystick in InputJoystick]: JoystickBinding } = {
    main: new JoystickBinding(),
    secondary: new JoystickBinding(),
  };
  public buttons: { [button in InputButton]: ButtonBinding } = {
    up: new ButtonBinding(),
    down: new ButtonBinding(),
    viewtoggle: new ButtonBinding(),
    use: new ButtonBinding(),
    speed: new ButtonBinding(),
  };

  // is listening to input?
  public isListening: boolean = false;
  public pointerLock: boolean = true;
  public isLocked: boolean = false;

  // providers
  public inputProviders: IInputProvider[] = [];

  // receiver of the inputs
  public inputReceiver?: IInputReceiver;

  /**
   * Initialize the listeners to the world
   * @param world
   */
  constructor(world: World, domElement?: HTMLElement) {
    // init properties
    this.world = world;

    // add input providers for different modes of use
    this.inputProviders = [
      new KeyboardInputProvider(this),
      new TouchInputProvider(this, domElement),
      new GamepadInputProvider(this),
    ];

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
    this.inputProviders.forEach((provider) => {
      if (provider.update) provider.update();
    });
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
    this.inputProviders.forEach((provider) => provider.listen());
  }

  /**
   * Removes all the mouse handlers to the DOM, if not already removed
   */
  public deafen(): void {
    if (!this.isListening) return;
    this.isListening = false;
    this.inputProviders.forEach((provider) => provider.deafen());
  }

  /* -------------------------------------------------------------------------- */
  /*                                  LISTENERS                                 */
  /* -------------------------------------------------------------------------- */

  /**
   * Listener for button events from input providers.
   * @param button
   * @param isPressed
   */
  public handleButtonEvent(button: InputButton, value: boolean) {
    this.buttons[button]?.handle(
      value,
      !!this.inputReceiver
        ? () => this.inputReceiver!.inputReceiverChange()
        : undefined
    );
    if (this.inputReceiver?.handleButtonEvent)
      this.inputReceiver.handleButtonEvent(button, value);
  }

  /**
   * Listener for joystick events from input providers.
   * @param joystick
   */
  public handleJoystickEvent(
    joystick: InputJoystick,
    angle: number,
    magnitude: number,
    active: boolean
  ) {
    this.joysticks[joystick]?.handle(
      angle,
      magnitude,
      active,
      !!this.inputReceiver
        ? () => this.inputReceiver!.inputReceiverChange()
        : undefined
    );
    if (this.inputReceiver?.handleJoystickEvent)
      this.inputReceiver.handleJoystickEvent(
        joystick,
        angle,
        magnitude,
        active
      );
  }
}
