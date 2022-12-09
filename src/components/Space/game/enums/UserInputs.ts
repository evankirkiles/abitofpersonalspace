/*
 * UserInputs.ts
 * author: evan kirkiles
 * created on Thu Dec 08 2022
 * 2022 the nobot space,
 */
export enum InputJoystick {
  MAIN = 'main', // right joystick / arcade movement
  SECONDARY = 'secondary', // left joystick / camera movement
}

export enum InputButton {
  UP = 'up', // jump button / up movement
  DOWN = 'down', // CTRL button / down movement
  SPEED = 'speed', // SHIFT button / move faster
  VIEWTOGGLE = 'viewtoggle', // C button / change camera controls
  USE = 'use', // Use an item / interact
}
