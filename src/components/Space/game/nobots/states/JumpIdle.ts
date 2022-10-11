/*
 * JumpIdle.ts
 * author: evan kirkiles
 * created on Mon Jun 27 2022
 * 2022 the nobot space,
 */

import { Nobot } from '../Nobot';
import { Falling } from './Falling';
import { NobotStateBase } from './NobotStateBase';

export class JumpIdle extends NobotStateBase {
  private alreadyJumped: boolean;

  /**
   * Begins a jump from idle nobot
   * @param nobot
   */
  constructor(nobot: Nobot) {
    super(nobot);
    this.nobot.velocitySimulator.mass = 30;
    this.nobot.setArcadeVelocityTarget(0);
    this.playAnimation('jump', 0.1);
    this.alreadyJumped = false;
  }

  /**
   * Updates the nobot's Y position while in a jump
   * @param timestep
   */
  public update(timestep: number) {
    super.update(timestep);
    // move in air
    if (this.alreadyJumped) {
      this.nobot.setCameraRelativeOrientationTarget();
      this.nobot.setArcadeVelocityTarget(this.anyDirection() ? 0.8 : 0);
    }
    // physicall jump
    if (this.timer > 0.2 && !this.alreadyJumped) {
      this.nobot.jump();
      this.alreadyJumped = true;
      this.nobot.velocitySimulator.mass = 100;
      this.nobot.rotationSimulator.damping = 0.3;
      if (
        this.nobot.rayResult.body &&
        this.nobot.rayResult.body.velocity.length() > 0
      ) {
        this.nobot.setArcadeVelocityInfluence(0, 0, 0);
      } else {
        this.nobot.setArcadeVelocityInfluence(0.3, 0, 0.3);
      }
    } else if (this.timer > 0.3 && this.nobot.rayHasHit) {
      this.setAppropriateDropState();
    } else if (this.animationEnded(timestep)) {
      this.nobot.setState(new Falling(this.nobot));
    }
  }
}
