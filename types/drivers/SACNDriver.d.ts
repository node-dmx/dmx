export default class SACNDriver extends Driver {
    SACNServer: Sender;
    close(): void;
    send(): Promise<void>;
}
import Driver from './index.js';
import { Sender } from 'sacn';
