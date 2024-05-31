export * from "./Animation.js";
export * from "./drivers/index.js";
export const DRIVERS: string[];
export default class DMX extends EventEmitter<[never]> {
    constructor();
    protected universes: Map<string, Driver>;
    drivers: Map<any, any>;
    registerDriver(name: string, constructor: any): void;
    addUniverse(id: string, driver: string, options?: {}): Driver;
    deleteUniverse(id: string): void;
    deleteAllUniverses(): void;
    getUniverse(id: string): Driver;
    getUniverses(): string[];
    getValue(id: string, address: number): number;
    getValues(id: string, begin?: number, end?: number): number[];
    setValue(id: string, address: number, value: number): void;
    update(id: string, channels: Record<number, number>): void;
    fill(id: string, value: number, begin?: number, end?: number): void;
    updateAll(id: string, value: number): void;
}
export type Driver = import('./drivers/index.js').default;
import { EventEmitter } from 'events';
