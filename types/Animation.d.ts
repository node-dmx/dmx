export default class Animation {
    constructor(options?: {
        frameDelay?: number;
        loop?: number;
        filter?: Function;
    });
    frameDelay: number;
    animations: any[];
    lastAnimation: number;
    timeout: NodeJS.Timeout;
    duration: number;
    startTime: number;
    loops: number;
    currentLoop: number;
    filter: Function;
    add(to: object, duration?: number, options?: {
        easing?: Function;
    }): this;
    delay(duration?: number): Animation;
    stop(): void;
    reset(startTime?: number): void;
    runNextLoop(universe: InstanceType<Driver>, onFinish?: Function): Animation;
    run(universe: InstanceType<Driver>, onFinish?: Function): void;
    runLoop(universe: InstanceType<Driver>, onFinish?: Function, loops?: number): this;
}
export type Driver = typeof import("./drivers/index.js").AbstractDriver;
