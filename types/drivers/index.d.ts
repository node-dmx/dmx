export const DMX_MAX_CHANNELS: 512;
export const INTERVAL: 50;
export const EVENT_START: "start";
export const EVENT_STOP: "stop";
export const EVENT_READY: "ready";
export default class Driver extends EventEmitter<[never]> {
    constructor(options?: {});
    universe: Buffer;
    interval: number;
    timeout: NodeJS.Timeout;
    init(error: any): void;
    start(): void;
    stop(): void;
    get(address: any): number;
    set(address: any, value: any): void;
    getPercent(address: any): number;
    toArray(begin?: number, end?: number): number[];
    update(values: any): void;
    fill(value: any, begin?: number, end?: number): void;
    updateAll(value: any): void;
    send(): void;
}
import { EventEmitter } from 'events';
