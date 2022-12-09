/*
 * NobotStateBase.ts
 * author: evan kirkiles
 * created on Sat Jun 25 2022
 * 2022 the nobot space,
 */
import { INobotState } from '../../interfaces/INobotState';
import { Nobot } from '../Nobot';

export enum NobotState {
  WALK = 'walk',
  DROPIDLE = 'dropIdle',
  IDLE = 'idle',
  FALLING = 'falling',
}

export abstract class NobotStateBase implements INobotState {
  public nobot: Nobot;
  public timer: number;
  public animationLength: any;

  public canFindInteractions: boolean;
  public canEnterInteraction: boolean;
  public canLeaveInteraction: boolean;

  /**
   * Builds the foundation of a state for a nobot
   * @param nobot The nobot this state applies to
   */
  constructor(nobot: Nobot) {
    this.nobot = nobot;

    // apply default values to velocity simulator
    this.nobot.velocitySimulator.damping =
      this.nobot.defaultVelocitySimulatorDamping;
    this.nobot.velocitySimulator.mass = this.nobot.defaultVelocitySimulatorMass;
    // apply default values to rotation simulator
    this.nobot.rotationSimulator.damping =
      this.nobot.defaultRotationSimulatorDamping;
    this.nobot.rotationSimulator.mass = this.nobot.defaultRotationSimulatorMass;

    // set arcade settings
    this.nobot.arcadeVelocityIsAdditive = false;
    this.nobot.setArcadeVelocityInfluence(1, 0, 1);

    // interaction settings
    this.canFindInteractions = true;
    this.canEnterInteraction = false;
    this.canLeaveInteraction = true;

    // timer starts at 0
    this.timer = 0;
  }

  /* -------------------------------------------------------------------------- */
  /*                                 UPDATE LOOP                                */
  /* -------------------------------------------------------------------------- */

  /**
   * Increments the timer of the state
   * @param timeStep The time step used for calculations
   */
  public update(timeStep: number): void {
    this.timer += timeStep;
  }

  /* -------------------------------------------------------------------------- */
  /*                                  STATEFULS                                 */
  /* -------------------------------------------------------------------------- */

  /**
   * Gets whether or not a direction is pressed
   * @returns
   */
  public anyDirection(): boolean {
    return this.nobot.inputManager.joysticks.main.isActive;
  }

  /* -------------------------------------------------------------------------- */
  /*                                 ANIMATIONS                                 */
  /* -------------------------------------------------------------------------- */

  /**
   * Plays the animation of the state
   * @param animName The name of the animation in the Nobot GLTF
   * @param fadeIn How long to take in fading in the animation
   */
  protected playAnimation(animName: string, fadeIn: number): void {
    this.animationLength = this.nobot.setAnimation(animName, fadeIn);
  }

  /**
   * Returns whether or not the animation will have ended after the frame.
   * @param timeStep The timestep this frame will take
   */
  public animationEnded(timeStep: number): boolean {
    if (!this.nobot.mixer) return true;
    if (this.animationLength) {
      return this.timer > this.animationLength - timeStep;
    }
    console.error('Error: Set this.animationLength in state constructor!');
    return false;
  }

  /* -------------------------------------------------------------------------- */
  /*                                  LISTENERS                                 */
  /* -------------------------------------------------------------------------- */

  /**
   * Checks whether a user has attempted to begin an interaction
   */
  public onInputChange(): void {
    // if the nobot can find interactions and they press enter, look for them
    if (
      this.canFindInteractions &&
      this.nobot.inputManager.buttons.use.justPressed
    ) {
      // this.nobot TODO: Find interaction
      // if the nobot can enter interactions and they are in an interaction
    } else if (
      this.canEnterInteraction &&
      this.nobot.interactionEntryInstance !== null
    ) {
      // if the nobot presses any movement key, get out of the interaction
      if (this.nobot.inputManager.joysticks.main.isActive) {
        this.nobot.interactionEntryInstance = null;
        this.nobot.inputManager.buttons.up.isPressed = false;
      }
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                              STATE TRANSITIONS                             */
  /* -------------------------------------------------------------------------- */

  /**
   * Begins the adequate drop state a Nobot enters into after falling.
   */
  public setAppropriateDropState(): void {
    // if really falling hard, drop into a heavy impact
    if (this.nobot.groundImpactData.velocity.y < -6) {
      // console.log('hard drop');
      // STATE: Drop Hard
      this.nobot.setStateSerialized(NobotState.WALK);
      // otherwise check if moving in any direction
    } else if (this.anyDirection()) {
      // on a minor drop, drop into a run (carrying velocity)
      if (this.nobot.groundImpactData.velocity.y < -2) {
        // STATE: Drop into a run
        this.nobot.setStateSerialized(NobotState.WALK);
        // otherwise, continue the action the user was doing before
      } else {
        // STATE: Walk
        this.nobot.setStateSerialized(NobotState.WALK);
      }
    } else {
      // if not moving in any direction, drop into idle
      this.nobot.setStateSerialized(NobotState.DROPIDLE);
    }
  }

  /**
   * Sets the appropriate start walk state a Nobot enters into.
   */
  public setAppropriateStartWalkState(): void {
    // const range = Math.PI;
    // const angle = Utils.getSignedAngleBetweenVectors(
    //   this.nobot.orientation,
    //   this.nobot.getCameraRelativeMovementVector()
    // );
    this.nobot.setStateSerialized(NobotState.WALK);
    // if (angle > range * 0.8) {
    //   this.nobot.setState(new StartWalkBackLeft(this.nobot));
    // } else if (angle < -range * 0.8) {
    //   this.nobot.setState(new StartWalkBackRight(this.nobot));
    // } else if (angle > range * 0.3) {
    //   this.nobot.setState(new StartWalkLeft(this.nobot));
    // } else if (angle < range * -0.3) {
    //   this.nobot.setState(new StartWalkRight(this.nobot));
    // } else {
    //   this.nobot.setState(new StartWalkForward(this.nobot));
    // }
  }

  /**
   * Runs the check if the Nobot should be falling, and, if so, begins the fall.
   */
  public checkFallInAir(): void {
    if (!this.nobot.rayHasHit) {
      this.nobot.setStateSerialized(NobotState.FALLING);
    }
  }
}
