/*
 * JumpRunning.ts
 * author: evan kirkiles
 * created on Tue Jun 28 2022
 * 2022 the nobot space,
 */
import { Nobot } from '../Nobot';
import { Falling } from './Falling';
import { NobotStateBase } from './NobotStateBase';

export class JumpRunning extends NobotStateBase {
  private alreadyJumped: boolean;

  /**
   * The nobot jump state when running
   * @param nobot
   */
  constructor(nobot: Nobot) {
    super(nobot);
    this.nobot.velocitySimulator.mass = 100;
    this.playAnimation('jump', 0.03);
    this.alreadyJumped = false;
  }

  /**
   * Recalculate the jump
   * @param timeStep
   */
  public update(timeStep: number): void {
    super.update(timeStep);
    this.nobot.setCameraRelativeOrientationTarget();
    // move in the air
    if (this.alreadyJumped) {
      this.nobot.setArcadeVelocityTarget(this.anyDirection() ? 0.8 : 0);
    }
    // physically jump
    if (this.timer > 0.13 && !this.alreadyJumped) {
      this.nobot.jump(4);
      this.alreadyJumped = true;
      this.nobot.rotationSimulator.damping = 0.3;
      this.nobot.arcadeVelocityIsAdditive = true;
      this.nobot.setArcadeVelocityInfluence(0.05, 0, 0.05);
    } else if (this.timer > 0.24 && this.nobot.rayHasHit) {
      this.setAppropriateDropState();
    } else if (this.animationEnded(timeStep)) {
      this.nobot.setState(new Falling(this.nobot));
    }
  }
}
