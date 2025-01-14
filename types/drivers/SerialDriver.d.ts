export const BAUD_RATE: 250000;
export const DATA_BITS: 8;
export const STOP_BITS: 2;
export const EVENT_CLOSE: "close";
export class SerialDriver extends AbstractDriver {
    constructor(options?: {});
    ready: boolean;
    serial: SerialPort<import("@serialport/bindings-cpp").AutoDetectTypes>;
}

import {AbstractDriver} from './index.js';
import {SerialPort} from 'serialport';
