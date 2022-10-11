/*
 * SpringSimulator.ts
 * author: evan kirkiles
 * created on Sat Jun 25 2022
 * 2022 the nobot space,
 */
import * as THREE from 'three';
import * as Utils from '../../core/FunctionLibrary';
import { SimulationFrame } from './SimulationFrame';
import { SimulatorBase } from './SimulatorBase';

export class SpringSimulator extends SimulatorBase<SimulationFrame<number>> {
  // simulator state
  public position: number;
  public velocity: number;
  public target: number;

  /**
   * Builds a spring simulator
   * @param fps
   * @param mass
   * @param damping
   */
  constructor(
    fps: number,
    mass: number,
    damping: number,
    startPosition: number = 0,
    startVelocity: number = 0
  ) {
    // construct base
    super(fps, mass, damping);

    // simulated values
    this.position = startPosition;
    this.velocity = startVelocity;
    this.target = 0;

    // initialize cache by pushing two frames
    for (let i = 0; i < 2; i++) {
      this.cache.push(
        new SimulationFrame<number>(startPosition, startVelocity)
      );
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                  OVERRIDES                                 */
  /* -------------------------------------------------------------------------- */

  /**
   * Advances the simulation by a given time step
   * @param timeStep The time step for the calculation
   */
  public simulate(timeStep: number): void {
    // generate new frames
    this.generateFrames(timeStep);
    // return values interpolated between cached frames
    this.position = THREE.MathUtils.lerp(
      this.cache[0].position,
      this.cache[1].position,
      this.offset / this.frameTime
    );
    this.velocity = THREE.MathUtils.lerp(
      this.cache[0].velocity,
      this.cache[1].velocity,
      this.offset / this.frameTime
    );
  }

  /**
   * Gets another simulation frame
   * @param isLastFrame
   */
  public getFrame(isLastFrame: boolean): SimulationFrame<number> {
    return Utils.spring(
      this.lastFrame().position,
      this.target,
      this.lastFrame().velocity,
      this.mass,
      this.damping
    );
  }
}
