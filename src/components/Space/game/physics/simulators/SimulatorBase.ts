/*
 * SimulatorBase.ts
 * author: evan kirkiles
 * created on Sat Jun 25 2022
 * 2022 the nobot space,
 */
export abstract class SimulatorBase<T> {
  public mass: number;
  public damping: number;
  public frameTime: number;
  public offset: number;
  public cache: T[] = [];

  /**
   * A base class for all simulators to inherit frome
   * @param fps The frames per second this simulator will run at
   * @param mass The mass of the simulated object
   * @param damping A damping factor for the simulation effects
   */
  constructor(fps: number, mass: number, damping: number) {
    this.mass = mass;
    this.damping = damping;
    this.frameTime = 1 / fps;
    this.offset = 0;
  }

  /* -------------------------------------------------------------------------- */
  /*                                  STATEFULS                                 */
  /* -------------------------------------------------------------------------- */

  /**
   * Reset the FPS of the simulator to a new value
   * @param fps The frames per second of the simulator
   */
  public setFPS(fps: number): void {
    this.frameTime = 1 / fps;
  }

  /**
   * Returns the last frame from the cache.
   */
  public lastFrame(): T {
    return this.cache[this.cache.length - 1];
  }

  /* -------------------------------------------------------------------------- */
  /*                                  FUNCTION                                  */
  /* -------------------------------------------------------------------------- */

  /**
   * Generates frames between last simulation call and the current one
   * @param timeStep The timestep of the calculation
   */
  public generateFrames(timeStep: number): void {
    // update the cache, find out how many frames need to be generated
    const totalTimeStep = this.offset + timeStep;
    const framesToGenerate = Math.floor(totalTimeStep / this.frameTime);
    this.offset = totalTimeStep % this.frameTime;
    // generate simulation frames
    if (framesToGenerate > 0) {
      for (let i = 0; i < framesToGenerate; i += 1) {
        this.cache.push(this.getFrame(i + 1 === framesToGenerate));
      }
      // only cache the last two frames
      this.cache = this.cache.slice(-2);
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                  OVERRIDES                                 */
  /* -------------------------------------------------------------------------- */

  /**
   * Overridable function for getting a frame of the simulation
   * @param isLastFrame Whether or not this frame is the last one
   */
  public abstract getFrame(isLastFrame: boolean): T;

  /**
   * A function to actually run the simulator for generating a frame
   * @param timeStep The timestep of the calculation
   */
  public abstract simulate(timeStep: number): void;
}
