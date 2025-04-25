export const DRIVERS: SerialDrivers;
export default class DMX extends EventEmitter<[never]> {
    constructor();
    universes: Map<any, any>;
    drivers: Map<any, any>;
    registerDriver(name: string, constructor: Driver): void;
    addUniverse(id: string, driver: string, options?: object): InstanceType<Driver>;
    deleteUniverse(id: string): void;
    deleteAllUniverses(): void;
    getUniverse(id: string): InstanceType<Driver>;
    getUniverses(): string[];
    getValue(id: string, address: number): number;
    getValues(id: string, begin?: number, end?: number): number[];
    setValue(id: string, address: number, value: number): void;
    update(id: string, channels: Record<number, number>): void;
    fill(id: string, value: number, begin?: number, end?: number): void;
    updateAll(id: string, value: number): void;
    _ensureUniverseExists(id: string): void;
    _ensureUniverseDoesNotExist(id: string): void;
    _ensureDriverExists(driver: string): void;
}
export type Driver = typeof import("./drivers/index.js").AbstractDriver;
export type SerialDrivers = import("@dmx-cloud/dmx-types").SerialDrivers;
import {EventEmitter} from 'events'
