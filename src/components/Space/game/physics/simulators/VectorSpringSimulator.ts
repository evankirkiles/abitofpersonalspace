/*
 * VectorSpringSimulator.ts
 * author: evan kirkiles
 * created on Sat Jun 25 2022
 * 2022 the nobot space,
 */
import * as THREE from 'three';
import * as Utils from '../../core/FunctionLibrary';
import { SimulationFrame } from './SimulationFrame';
import { SimulatorBase } from './SimulatorBase';

export class VectorSpringSimulator extends SimulatorBase<
  SimulationFrame<THREE.Vector3>
> {
  // simulator state
  public position: THREE.Vector3;
  public velocity: THREE.Vector3;
  public target: THREE.Vector3;

  /**
   * Builds a spring simulator that works on vectors
   * @param fps The frames per second of the simulator
   * @param mass The mass of the object being simulated
   * @param damping How much to dampen calculations
   */
  constructor(fps: number, mass: number, damping: number) {
    // construct base
    super(fps, mass, damping);

    // simulated values
    this.position = new THREE.Vector3();
    this.velocity = new THREE.Vector3();
    this.target = new THREE.Vector3();

    // initialize cache by pushing two frames
    for (let i = 0; i < 2; i += 1) {
      this.cache.push(
        new SimulationFrame<THREE.Vector3>(
          new THREE.Vector3(),
          new THREE.Vector3()
        )
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
    this.position.lerpVectors(
      this.cache[0].position,
      this.cache[1].position,
      this.offset / this.frameTime
    );
    this.velocity.lerpVectors(
      this.cache[0].velocity,
      this.cache[1].velocity,
      this.offset / this.frameTime
    );
  }

  /**
   * Gets another simulation frame
   * @param isLastFrame
   */
  public getFrame(isLastFrame: boolean): SimulationFrame<THREE.Vector3> {
    // deep clone data from previous frame
    const newSpring = new SimulationFrame<THREE.Vector3>(
      this.lastFrame().position.clone(),
      this.lastFrame().velocity.clone()
    );
    // calculate new spring
    Utils.springVector(
      newSpring.position,
      this.target,
      newSpring.velocity,
      this.mass,
      this.damping
    );
    // return new spring
    return newSpring;
  }
}
