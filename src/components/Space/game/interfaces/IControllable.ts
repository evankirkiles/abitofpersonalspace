/*
 * IControllable.ts
 * author: evan kirkiles
 * created on Sat Jun 25 2022
 * 2022 the nobot space,
 */
import { EntityType } from '../enums/EntityType';
import { Nobot } from '../nobots/Nobot';
import { IInputReceiver } from './IInputReceiver';

export interface IControllable extends IInputReceiver {
  entityType: EntityType;
  position: THREE.Vector3;
  controllingNobot: Nobot;

  triggerAction(actionName: string, value: boolean): void;
  resetControls(): void;
  allowSleep(value: boolean): void;
  onInputChange(): void;
  noDirectionPressed(): boolean;
}
