export default class SACNDriver extends Driver {
    SACNServer: Sender;
    send(): Promise<void>;
}
import Driver from './index.js';
import { Sender } from 'sacn';
