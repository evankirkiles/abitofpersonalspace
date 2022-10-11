/*
 * INobotAI.ts
 * author: evan kirkiles
 * created on Sat Jun 25 2022
 * 2022 the nobot space,
 */
import { Nobot } from '../nobots/Nobot';

export interface INobotAI {
  nobot: Nobot;
  update(timeStep: number): void;
}
