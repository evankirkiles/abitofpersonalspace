/*
 * EndWalk.ts
 * author: evan kirkiles
 * created on Sun Jun 26 2022
 * 2022 the nobot space,
 */
import { Nobot } from '../Nobot';
import { Idle } from './Idle';
import { NobotStateBase } from './NobotStateBase';

export class EndWalk extends NobotStateBase {
  /**
   * Stops the nobot from walking.
   * @param nobot
   */
  constructor(nobot: Nobot) {
    super(nobot);
    this.nobot.setArcadeVelocityTarget(0);
    this.animationLength = nobot.setAnimation('stop', 0.1);
  }

  /**
   * Check for animation finish and fall begins
   * @param timeStep
   */
  public update(timeStep: number): void {
    super.update(timeStep);
    if (this.animationEnded(timeStep)) {
      this.nobot.setState(new Idle(this.nobot));
    }
    this.checkFallInAir();
  }
}
