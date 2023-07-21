export class Timer {
    scale: number = 1;

    private _handlers: any[] = [];
    private _currTimer: number = Date.now();
    private _lastTimer: number = Date.now();

    //解决执行过程中添加和删除事件问题
    private _inLock:boolean = false;
    private _handlersWait: TimerHandler[] = [];

    private _laterHandlers: TimerHandler[] = [];

    public constructor() {
    }

    update(): void {
        let now = Date.now();
        this._currTimer = Date.now();
        var dt: number = (now - this._lastTimer) * this.scale;
        this._currTimer += dt;
        this._lastTimer = now;

        this._inLock = true;
        let time = this._currTimer;
        for (let handler of this._handlers) {  
            if (handler.method == null)  //清楚后 未及时从队列中移除
                continue;

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

        this._inLock = false;
        this._dealHandlers();
    }

    private _dealHandlers() {
        if (this._inLock) {
            console.error("EventDispatcher._dealHandlers: this._inLock == true");
            return;
        }

        let handlers = this._handlers;
        for (let i = handlers.length - 1; i >= 0; i--) {
            if (!handlers[i].method) {
                handlers.splice(i, 1);
            }
        }

        //将_handlersWait中的事件加入到事件队列中
        for (let handler of this._handlersWait) {
            this._create(handler.delay, handler.interval, handler.repeat, handler.caller, handler.method, handler.args, handler.coverBefore);
        }

        handlers.sort((a, b) => {
            return a.exeTime - b.exeTime;
        });
    }

    once(delay: number, caller: any, method: Function, args: any[] = null, coverBefore: boolean = true): void {
        this._create(delay, 0, 1, caller, method, args, coverBefore);
    }

    //repeat:0无限
    loop(delay: number, interval:number, repeat:number, caller: any, method: Function, args: any[] = null, coverBefore: boolean = true): void {
        this._create(delay, interval, repeat, caller, method, args, coverBefore);
    }

    clear(caller: any, method: Function): void {
        let handler = this._getHandler(caller, method);
        if (handler) {
            handler.clear();
        }
    }

    private _create(delay: number, interval:number, repeat: number, caller: any, method: Function, args: any[], coverBefore: boolean): void {
        if (this._inLock) {
            let handler = TimerHandler.create();
            handler.delay = delay;
            handler.interval = interval;
            handler.repeat = repeat;
            handler.caller = caller;
            handler.method = method;
            handler.args = args;
            handler.exeTime = delay + this._currTimer;
            handler.coverBefore = coverBefore;
            this._handlersWait.push(handler);
            return;
        }

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
    }

    private _getHandler(caller: any, method: any): TimerHandler {
        for (let handler of this._handlers) {
            if (handler.caller == caller && handler.method == method) {
                return handler;
            }
        }
       return null;
    }


    //===================================
    // call later
    callLater(method:Function, caller:any=null, args:any[] = null):void {
        let handler = TimerHandler.create();
        handler.caller = caller;
        handler.method = method;
        handler.args = args;
        this._laterHandlers.push(handler);
    }

    runCallLater():void {
        let handlers = this._laterHandlers;
        for (let handler of handlers) {
            handler.run();
            handler.recycle();
        }
        handlers.length = 0;
    }
    //===================================
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
    public coverBefore: boolean;

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
        this.coverBefore = false;
    }

    recycle() {
        this.clear();
        TimerHandler.pool.push(this);
    }
}