import { EventEmitter } from 'events';

export type UniverseData = {
  [channel: number]: number;
}

export interface IUniverseDriver extends EventEmitter {
  update(channels: UniverseData, extraData?: any): void;

  get(c: number): number;

  updateAll(value: number): void;

  close(): Promise<void> | void;
}
