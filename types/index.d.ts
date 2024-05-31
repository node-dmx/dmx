export * from "./Animation.js";
export * from "./drivers";
export const DRIVERS: string[];
export default class DMX extends EventEmitter<[never]> {
    constructor();
    universes: Map<any, any>;
    drivers: Map<any, any>;
    registerDriver(name: any, constructor: any): void;
    addUniverse(id: any, driver: any, options?: {}): any;
    deleteUniverse(id: any): void;
    deleteAllUniverses(): void;
    getUniverse(id: any): any;
    getUniverses(): any[];
    getValue(id: any, address: any): any;
    getValues(id: any, begin: any, end: any): any;
    setValue(id: any, address: any, value: any): void;
    update(id: any, channels: any): void;
    fill(id: any, value: any, begin: any, end: any): void;
    updateAll(id: any, value: any): void;
}
import { EventEmitter } from 'events';
