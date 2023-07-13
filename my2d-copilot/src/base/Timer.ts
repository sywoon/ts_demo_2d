export class Timer {
    scale: number = 1;

    private _handlers: any[] = [];
    private _currTimer: number = Date.now();
    private _lastTimer: number = Date.now();

    public constructor() {
    }

    update(): void {
        let now = Date.now();
        this._currTimer = Date.now();
        var dt: number = (now - this._lastTimer) * this.scale;
        this._currTimer += dt;
        this._lastTimer = now;

        let time = this._currTimer;
        for (let handler of this._handlers) {  
            if (handler.exeTime > time)  //之前按执行时间排序过
                break;

            handler.run();
            if (handler.repeat > 0) {
                handler.repeat--;
                if (handler.repeat == 0) {
                    handler.clear();  //后面统一处理
                } else {
                    handler.exeTime = time + handler.invertal;
                }
            } else if (handler.repeat == 0) {
                handler.exeTime = time + handler.invertal;
            } else {
                handler.clear();
            }
        }

        this._dealHandler();
    }

    private _dealHandler() {
        let handlers = [];

        for (let handler of this._handlers) {
            if (handler.method == null)
                continue;

            handlers.push(handler);
        }

        handlers.sort((a, b) => {
            return a.exeTime - b.exeTime;
        });
        this._handlers = handlers;
    }

    once(delay: number, caller: any, method: Function, args: any[] = null, coverBefore: boolean = true): void {
        this._create(delay, 0, 1, caller, method, args, coverBefore);
    }

    //repeat:0无限
    loop(delay: number, interval:number, repeat:number, caller: any, method: Function, args: any[] = null, coverBefore: boolean = true): void {
        this._create(delay, interval, repeat, caller, method, args, coverBefore);
    }

    private _create(delay: number, interval:number, repeat: number, caller: any, method: Function, args: any[], coverBefore: boolean): TimerHandler {
        //如果延迟为0，则立即执行
        if (delay <= 0) {
            method.apply(caller, args);
            return null;
        }

        //先覆盖相同函数的计时
        let handler: TimerHandler;
        if (coverBefore) {
            handler = this._getHandler(caller, method);
        } else {
            handler = TimerHandler.create();
        }

        handler.delay = delay;
        handler.interval = interval;
        handler.repeat = repeat;
        handler.caller = caller;
        handler.method = method;
        handler.args = args;
        handler.exeTime = delay + this._currTimer;

        this._handlers.push(handler);
        return handler;
    }

    private _getHandler(caller: any, method: any): TimerHandler {
        for (let handler of this._handlers) {
            if (handler.caller == caller && handler.method == method) {
                return handler;
            }
        }
       return null;
    }

}

class TimerHandler {
    static pool: TimerHandler[] = [];
    static create(): TimerHandler {
        if (TimerHandler.pool.length > 0) {
            return TimerHandler.pool.pop();
        }
        return new TimerHandler();
    }

    public caller: any;
    public method: Function;
    public args: any[];
    public delay: number;
    public interval: number;
    public repeat: number;
    public exeTime: number;

    run(): void {
        this.method.apply(this.caller, this.args);
    }

    clear(): void {
        this.caller = null;
        this.method = null;
        this.args = null;
        this.delay = 0;
        this.interval = 0;
        this.repeat = 1;
        this.exeTime = 0;
    }

    recycle() {
        this.clear();
        TimerHandler.pool.push(this);
    }
}