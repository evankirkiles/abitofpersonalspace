/*
 * LoadingManager.ts
 * author: evan kirkiles
 * created on Sat Jun 25 2022
 * 2022 the nobot space,
 */

import { GLTF, GLTFLoader } from 'three-stdlib';
import { World } from '../world/World';
import { LoadingTrackerEntry } from './LoadingTrackerEntry';

export enum LoadingManagerEvent {
  START = 'start',
  PROGRESS = 'progress',
  FINISH = 'finish',
}

export class LoadingManager {
  // statefuls
  public firstLoad: boolean = true;
  public onStart?: () => void;
  public onProgress?: (progress: number) => void;
  public onFinished?: () => void;

  private world: World;
  private gltfLoader: GLTFLoader;
  private loadingTracker: LoadingTrackerEntry[] = [];

  /**
   * Build a manager for loading new scenes and assets into the world.
   * @param world
   */
  constructor(
    world: World,
    callbacks: {
      onStart?: () => void;
      onProgress?: (progress: number) => void;
      onFinished?: () => void;
    } = {}
  ) {
    // reference the world to load into
    this.world = world;
    this.gltfLoader = new GLTFLoader();
    this.world.setTimeScale(0);

    const { onStart, onProgress, onFinished } = callbacks;
    this.onStart = onStart;
    this.onProgress = onProgress;
    this.onFinished = onFinished;
  }

  /* -------------------------------------------------------------------------- */
  /*                                   LOADING                                  */
  /* -------------------------------------------------------------------------- */

  /**
   * Downloads a GLTF while tracking its success through a LoadingEntry.
   * @param path Where to download the GLTF from.
   * @param onProgress A callback to run on load progress
   */
  public async loadGLTF(path: string): Promise<GLTF> {
    return new Promise((res, rej) => {
      this.onStart && this.onStart();
      const trackerEntry = this.addLoadingEntry(path);
      this.gltfLoader.load(
        path,
        (gltf) => {
          this.doneLoading(trackerEntry);
          res(gltf);
        },
        (xhr) => {
          if (xhr.lengthComputable) {
            trackerEntry.total = xhr.total; // set the total for relative sizes
            trackerEntry.progress = xhr.loaded / xhr.total;
            this.onProgress && this.onProgress(this.getLoadingPercentage());
          }
        },
        (error) => {
          rej(error);
        }
      );
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                               DOWNLOAD STATE                               */
  /* -------------------------------------------------------------------------- */

  /**
   * Logs a step in the download process
   * @param path
   */
  public addLoadingEntry(path: string): LoadingTrackerEntry {
    const entry = new LoadingTrackerEntry(path);
    this.loadingTracker.push(entry);
    return entry;
  }

  /**
   * Sets a loading entry as completed
   * @param trackerEntry
   */
  public doneLoading(trackerEntry: LoadingTrackerEntry): void {
    trackerEntry.finished = true;
    trackerEntry.progress = 1;
    this.isLoadingDone() && this.onFinished && this.onFinished();
  }

  /**
   * Checks to see if all loading entries have finished downloading.
   * @returns
   */
  public isLoadingDone(): boolean {
    for (let i = 0; i < this.loadingTracker.length; i += 1) {
      if (!this.loadingTracker[i].finished) return false;
    }
    return true;
  }

  /* -------------------------------------------------------------------------- */
  /*                                COMMUNICATION                               */
  /* -------------------------------------------------------------------------- */

  /**
   * Check on the total load status of all loading elements
   * @returns A number from 0-1 telling how much has loaded
   */
  public getLoadingPercentage(): number {
    let done = true;
    let total = 0;
    let finished = 0;
    // iterate over all loaders and calculate total size / progress
    for (let i = 0; i < this.loadingTracker.length; i += 1) {
      if (this.loadingTracker[i].finished) continue;
      total += this.loadingTracker[i].total;
      finished +=
        this.loadingTracker[i].progress * this.loadingTracker[i].total;
      if (!this.loadingTracker[i].finished) done = false;
    }
    if (total === 0) return 0;
    return finished / total;
  }
}
