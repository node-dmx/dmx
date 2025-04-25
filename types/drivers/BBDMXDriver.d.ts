export class BBDMXDriver extends AbstractDriver {
    constructor(options?: {});
    host: any;
    port: any;
    serial: dgram.Socket;
    ready: boolean;
}

import * as dgram from 'node:dgram'
import {AbstractDriver} from './index.js'
