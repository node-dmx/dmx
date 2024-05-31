export const BAUD_RATE: 250000;
export const DATA_BITS: 8;
export const STOP_BITS: 2;
export const EVENT_CLOSE: "close";
export default class SerialDriver extends Driver {
    ready: boolean;
    serial: SerialPort<import("@serialport/bindings-cpp").AutoDetectTypes>;
    close(): void;
}
import Driver from './index.js';
import { SerialPort } from 'serialport';
