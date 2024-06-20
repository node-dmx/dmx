export const DRIVERS: string[];
export default class DMX extends EventEmitter<[never]> {
    constructor();
    protected universes: Map<string, InstanceType<Driver>>;
    drivers: Map<string, Driver>;
    registerDriver(name: string, constructor: Driver): void;
    addUniverse(id: string, driver: string, options?: {}): InstanceType<Driver>;
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
}
export type Driver = typeof import("./drivers/index.js").AbstractDriver;
import { EventEmitter } from 'events';
