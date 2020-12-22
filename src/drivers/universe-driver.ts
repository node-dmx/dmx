export interface UniverseDriver {
  update(channels: any, extraData: any): void;

  updateAll(value: any): void;

  onUpdate(cb: (u: number[] | string[], extraData: any) => void): void;
}
