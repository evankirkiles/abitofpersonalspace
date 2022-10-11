/*
 * Falling.ts
 * author: evan kirkiles
 * created on Mon Jun 27 2022
 * 2022 the nobot space,
 */

import { Nobot } from '../Nobot';
import { NobotStateBase } from './NobotStateBase';

export class Falling extends NobotStateBase {
  /**
   * Add a falling state to the nobot
   * @param nobot
   */
  constructor(nobot: Nobot) {
    super(nobot);
    this.nobot.velocitySimulator.mass = 100;
    this.nobot.rotationSimulator.damping = 0.3;
    this.nobot.arcadeVelocityIsAdditive = true;
    this.nobot.setArcadeVelocityTarget(0.05, 0, 0.05);
    this.playAnimation('falling', 0.3);
  }

  /**
   * Update listeners for changing state on ground hit
   * @param timestep
   */
  public update(timestep: number): void {
    super.update(timestep);
    this.nobot.setCameraRelativeOrientationTarget();
    this.nobot.setArcadeVelocityTarget(this.anyDirection() ? 0.8 : 0);
    if (this.nobot.rayHasHit) {
      this.setAppropriateDropState();
    }
  }
}
