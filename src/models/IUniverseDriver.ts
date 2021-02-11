import { EventEmitter } from 'events';

export type UniverseData = {
  [channel: number]: number;
}

export interface IUniverseDriver extends EventEmitter {
  update(channels: UniverseData, extraData?: any): void;

  get(c: number): number;

  updateAll(value: number): void;

  start(): Promise<void> | void;
  stop(): Promise<void> | void;
  close(): Promise<void> | void;
}
