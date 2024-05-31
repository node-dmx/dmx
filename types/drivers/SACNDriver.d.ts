export default class SACNDriver extends Driver {
    SACNServer: sacn.Sender;
    close(): void;
    send(): Promise<void>;
}
import Driver from './index.js';
import sacn from 'sacn';
