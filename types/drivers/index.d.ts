export const DMX_MAX_CHANNELS: 512;
export const INTERVAL: 50;
export const EVENT_START: "start";
export const EVENT_STOP: "stop";
export const EVENT_READY: "ready";
export class AbstractDriver extends EventEmitter<[never]> {
    constructor(options?: any);
    protected universe: Buffer;
    protected interval: number;
    protected timeout: NodeJS.Timeout;
    init(error: any | null): void;
    start(): void;
    stop(): void;
    get(address: number): number;
    set(address: number, value: number): void;
    getPercent(address: number): number;
    toArray(begin?: number, end?: number): number[];
    update(values: Record<number, number> | {}): void;
    fill(value: number, begin?: number, end?: number): void;
    updateAll(value: number): void;
    send(): void;
}

import {EventEmitter} from 'events';
