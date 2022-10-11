/*
 * StartWalkBase.ts
 * author: evan kirkiles
 * created on Sun Jun 26 2022
 * 2022 the nobot space,
 */
import { Nobot } from '../Nobot';
import { NobotStateBase } from './NobotStateBase';
import { Walk } from './Walk';

export class StartWalkBase extends NobotStateBase {
  /**
   * Inherited constructor for a nobot state for beginning to walk.
   * @param nobot
   */
  constructor(nobot: Nobot) {
    super(nobot);
    this.canEnterInteraction = true;
    this.nobot.rotationSimulator.mass = 20;
    this.nobot.rotationSimulator.damping = 0.7;
    this.nobot.setArcadeVelocityTarget(0.8);
  }

  /* -------------------------------------------------------------------------- */
  /*                                 UPDATE LOOP                                */
  /* -------------------------------------------------------------------------- */

  /**
   * Runs the start walk animation until it finishes, and then begins the real
   * walk animation.
   * @param timestep
   */
  public update(timestep: number): void {
    super.update(timestep);
    if (this.animationEnded(timestep)) {
      this.nobot.setState(new Walk(this.nobot));
    }
    this.nobot.setCameraRelativeOrientationTarget();
    this.checkFallInAir();
  }

  /**
   * When the input to the nobot from user changes
   */
  public onInputChange(): void {
    super.onInputChange();
  }
}
