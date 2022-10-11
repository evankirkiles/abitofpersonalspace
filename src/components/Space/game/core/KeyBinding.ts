/*
 * KeyBinding.ts
 * author: evan kirkiles
 * created on Sat Jun 25 2022
 * 2022 the nobot space,
 */
export class KeyBinding {
  public eventCodes: string[];
  public isPressed: boolean = false;
  public justPressed: boolean = false;
  public justReleased: boolean = false;

  constructor(...code: string[]) {
    this.eventCodes = code;
  }
}
