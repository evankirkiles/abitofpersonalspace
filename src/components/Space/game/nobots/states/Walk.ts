/*
 * Walk.ts
 * author: evan kirkiles
 * created on Sun Jun 26 2022
 * 2022 the nobot space,
 */

import { Nobot } from '../Nobot';
import { EndWalk } from './EndWalk';
import { NobotStateBase } from './NobotStateBase';
// eslint-disable-next-line
import { Idle, JumpRunning } from './_stateLibrary';

export class Walk extends NobotStateBase {
  /**
   * Represents the walking animation for the nobot.
   * @param nobot
   */
  constructor(nobot: Nobot) {
    super(nobot);
    this.canEnterInteraction = true;
    this.nobot.setArcadeVelocityTarget(0.8);
    this.playAnimation('walk', 0.2);
  }

  /* -------------------------------------------------------------------------- */
  /*                                 UPDATE LOOP                                */
  /* -------------------------------------------------------------------------- */

  /**
   * Updates the camera and checks if falling
   * @param timeStep
   */
  public update(timeStep: number): void {
    super.update(timeStep);
    this.nobot.setCameraRelativeOrientationTarget();
    this.checkFallInAir();
  }

  /**
   * When a button input changes
   */
  public onInputChange(): void {
    super.onInputChange();
    if (!this.anyDirection()) this.nobot.setState(new EndWalk(this.nobot));
    if (this.nobot.actions.jump.justPressed)
      this.nobot.setState(new JumpRunning(this.nobot));
    if (!this.anyDirection()) {
      if (this.nobot.velocity.length() > 1) {
        // this.nobot.setState(new EndWalk(this.nobot));
        this.nobot.setState(new Idle(this.nobot));
      } else {
        this.nobot.setState(new Idle(this.nobot));
      }
    }
  }
}
