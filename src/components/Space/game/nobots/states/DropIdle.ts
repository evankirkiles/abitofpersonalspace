/*
 * DropIdle.ts
 * author: evan kirkiles
 * created on Tue Jun 28 2022
 * 2022 the nobot space,
 */

import { Nobot } from '../Nobot';
import { Idle } from './Idle';
import { JumpIdle } from './JumpIdle';
import { NobotStateBase } from './NobotStateBase';
import { StartWalkForward } from './StartWalkForward';
import { Walk } from './Walk';

export class DropIdle extends NobotStateBase {
  /**
   * Drop state, when the Nobot is not moving too fast.
   * @param nobot
   */
  constructor(nobot: Nobot) {
    super(nobot);
    this.nobot.velocitySimulator.damping = 0.5;
    this.nobot.velocitySimulator.mass = 7;
    this.nobot.setArcadeVelocityTarget(0);
    this.playAnimation('drop_idle', 0.1);
    if (this.anyDirection()) {
      this.nobot.setState(new StartWalkForward(nobot));
    }
  }

  public update(timestep: number): void {
    super.update(timestep);
    this.nobot.setCameraRelativeOrientationTarget();
    if (this.animationEnded(timestep)) {
      this.nobot.setState(new Idle(this.nobot));
    }
    this.checkFallInAir();
  }

  public onInputChange(): void {
    super.onInputChange();
    if (this.nobot.actions.jump.justPressed) {
      this.nobot.setState(new JumpIdle(this.nobot));
    }
    if (this.anyDirection()) {
      this.nobot.setState(new Walk(this.nobot));
    }
  }
}
