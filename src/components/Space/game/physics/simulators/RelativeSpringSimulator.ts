/*
 * RelativeSpringSimulator.ts
 * author: evan kirkiles
 * created on Sat Jun 25 2022
 * 2022 the nobot space,
 */
import * as THREE from 'three';
import * as Utils from '../../core/FunctionLibrary';
import { SimulationFrame } from './SimulationFrame';
import { SimulatorBase } from './SimulatorBase';

export class RelativeSpringSimulator extends SimulatorBase<
  SimulationFrame<number>
> {
  // simulator state
  public position: number;
  public velocity: number;
  public target: number;
  public lastLerp: number;

  /**
   * Builds a spring simulator that works on vectors
   * @param fps The frames per second of the simulator
   * @param mass The mass of the object being simulated
   * @param damping How much to dampen calculations
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
    this.lastLerp = 0;

    // initialize cache by pushing two frames
    for (let i = 0; i < 2; i += 1) {
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
    // lerp from 0 to next frame
    const lerp = THREE.MathUtils.lerp(
      0,
      this.cache[1].position,
      this.offset / this.frameTime
    );
    // subtract last lerp from current to make output relative
    this.position = lerp - this.lastLerp;
    this.lastLerp = lerp;
    // velocity functions as normal
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
    // deep clone data from previous frame
    const newFrame = { ...this.lastFrame() };
    if (isLastFrame) {
      // reset position
      newFrame.position = 0;
      // transition to next frame
      this.lastLerp -= this.lastFrame().position;
    }
    // return new spring
    return Utils.spring(
      newFrame.position,
      this.target,
      newFrame.velocity,
      this.mass,
      this.damping
    );
  }
}
