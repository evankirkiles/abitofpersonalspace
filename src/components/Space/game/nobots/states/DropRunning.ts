/*
 * DropRunning.ts
 * author: evan kirkiles
 * created on Tue Jun 28 2022
 * 2022 the nobot space,
 */

import { Nobot } from '../Nobot';
import { EndWalk } from './EndWalk';
import { JumpRunning } from './JumpRunning';
import { NobotStateBase } from './NobotStateBase';
import { Walk } from './Walk';

export class DropRunning extends NobotStateBase {
  constructor(nobot: Nobot) {
    super(nobot);
    this.nobot.setArcadeVelocityTarget(0.8);
    this.playAnimation('drop_running', 0.1);
  }
  public update(timeStep: number): void {
    super.update(timeStep);
    this.nobot.setCameraRelativeOrientationTarget();
    if (this.animationEnded(timeStep)) {
      this.nobot.setState(new Walk(this.nobot));
    }
  }
  public onInputChange(): void {
    super.onInputChange();
    if (!this.anyDirection()) {
      this.nobot.setState(new EndWalk(this.nobot));
    }
    if (this.nobot.inputManager.buttons.up.justPressed) {
      this.nobot.setState(new JumpRunning(this.nobot));
    }
  }
}
