/// <reference types="@vk/dmx-types" />
export const DRIVERS: import("@vk/dmx-types").SerialDriver;
export default class DMX extends EventEmitter<[never]> {
    constructor();
    protected universes: Map<string, DriverInstance>;
    drivers: Map<string, Driver>;
    registerDriver(name: string, constructor: Driver): void;
    addUniverse(id: string, driver: string, options?: {}): DriverInstance;
    deleteUniverse(id: string): void;
    deleteAllUniverses(): void;
    getUniverse(id: string): DriverInstance;
    getUniverses(): string[];
    getValue(id: string, address: number): number;
    getValues(id: string, begin?: number, end?: number): number[];
    setValue(id: string, address: number, value: number): void;
    update(id: string, channels: Record<number, number>): void;
    fill(id: string, value: number, begin?: number, end?: number): void;
    updateAll(id: string, value: number): void;
}
export type Serial = import('@vk/dmx-types').Serial;
export type SerialDriver = import('@vk/dmx-types').SerialDriver;
export type Driver = typeof import('./drivers/index.js').default;
export type DriverInstance = InstanceType<Driver>;
import { EventEmitter } from 'events';
