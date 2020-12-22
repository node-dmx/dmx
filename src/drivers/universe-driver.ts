export interface UniverseDriver {
  update(channels: any, extraData: any): void;

  updateAll(value: any): void;

  onUpdate(cb: (u: {[key: number]: number}, extraData: any) => void): void;
}
