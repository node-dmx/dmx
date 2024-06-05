export default class Animation {
    constructor(options?: {});
    frameDelay: number;
    animations: any[];
    lastAnimation: number;
    timeout: NodeJS.Timeout;
    duration: number;
    startTime: number;
    loops: any;
    currentLoop: number;
    filter: any;
    add(to: object, duration?: number, options?: object): Animation;
    delay(duration?: number): Animation;
    stop(): void;
    reset(startTime?: number): void;
    runNextLoop(universe: any, onFinish: any): this;
    run(universe: any, onFinish: any): void;
    runLoop(universe: any, onFinish: any, loops?: number): this;
}
