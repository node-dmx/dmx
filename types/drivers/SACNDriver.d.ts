export class SACNDriver extends AbstractDriver {
    constructor(options?: {});
    SACNServer: Sender;
    send(): Promise<void>;
}
import { AbstractDriver } from './index.js';
import { Sender } from 'sacn';
