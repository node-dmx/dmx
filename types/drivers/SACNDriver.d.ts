export class SACNDriver extends AbstractDriver {
    constructor(options?: {});
    SACNServer: Sender;
    update(values: Record<number, number>): void;
    send(): Promise<void>;
}
import { AbstractDriver } from './index.js';
import { Sender } from 'sacn';
