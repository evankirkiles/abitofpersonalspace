/*
 * Idle.ts
 * author: evan kirkiles
 * created on Sat Jun 25 2022
 * 2022 the nobot space,
 */

import { Nobot } from '../Nobot';
import { JumpIdle } from './JumpIdle';
import { NobotStateBase } from './NobotStateBase';
import { Walk } from './Walk';

export class Idle extends NobotStateBase {
  /**
   * Add an Idle state to the Nobot, which immediately plays it.
   * @param nobot
   */
  constructor(nobot: Nobot) {
    super(nobot);
    // set simulator options
    this.nobot.velocitySimulator.damping = 0.6;
    this.nobot.velocitySimulator.mass = 10;
    this.nobot.setArcadeVelocityTarget(0);
    this.playAnimation('idle', 0.1);
  }

  /**
   * Updates the animation and checks if the nobot should be falling
   * @param timeStep The timestep to use in calculations
   */
  public update(timeStep: number): void {
    super.update(timeStep);
    this.checkFallInAir();
  }

  /**
   * When an input event happens, listen for new state transitions.
   */
  public onInputChange(): void {
    super.onInputChange();
    if (this.nobot.inputManager.buttons.up.justPressed) {
      this.nobot.setState(new JumpIdle(this.nobot));
    }
    if (this.anyDirection()) {
      if (this.nobot.velocity.length() > 0.5) {
        this.nobot.setState(new Walk(this.nobot));
      } else {
        this.nobot.setState(new Walk(this.nobot));
        // this.setAppropriateStartWalkState();
      }
    }
  }
}
