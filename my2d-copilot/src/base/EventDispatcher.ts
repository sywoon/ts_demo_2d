
class EventHandler {
    protected static _pool: EventHandler[] = [];
    static create(type:string, caller:any, listener:Function, args:any[], once:boolean): EventHandler {
        if (EventHandler._pool.length > 0) {
            let evt = EventHandler._pool.pop();
            evt.type = type;
            evt.caller = caller;
            evt.listener = listener;
            evt.args = args;
            evt.once = once;
            return evt;
        }
        return new EventHandler(type, caller, listener, args, once);
    }

    type:string;
    caller:any;
    listener:Function;
    args:any[];
    once:boolean;
    constructor(type:string, caller:any, listener:Function, args:any[], once:boolean) {
        this.type = type;
        this.caller = caller;
        this.listener = listener;
        this.args = args;
        this.once = once;
    }

    run(): any {
        if (!this.listener)
            return;
        let result = this.listener.apply(this.caller, this.args);
        return result;
    }

    runWith(data:any) {
        if (!this.listener)
            return;

        let result: any = null;
        if (!this.args) {
            result = this.listener.call(this.caller, data);
        } else if (this.args.length == 1) {
            result = this.listener.call(this.caller, this.args[0], data);
        } else {
            result = this.listener.apply(this.caller, this.args.concat(data));
        }
        return result;
    }

    clear() {
        this.type = null;
        this.caller = null;
        this.listener = null;
        this.args = null;
        this.once = false;
    }

    recyle() {
        this.clear();
        EventHandler._pool.push(this);
    }
}

export class EventDispatcher {
    private _events: Map<string, EventHandler[]> = new Map<string, EventHandler[]>();  
    private _inLock:boolean = false;
    private _handlersWait: EventHandler[] = [];

    sendEvent(type: string, data: any=null): void {
        //找到type对应的EventHandler执行内部函数
        let arr = this._events.get(type);
        if (!arr) {
            return;
        }

        this._inLock = true;
        for (let handler of arr) {
            if (!handler.listener)
                continue;

            if (data) {
                handler.runWith(data);
            } else {
                handler.run();
            }

            if (handler.once) {
                handler.clear();  //等待清理
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
        //先删除已经clear的事件队列 再将_handlersWait中的事件加入到事件队列中
        for (let [type, arr] of this._events) {
            for (let i = arr.length - 1; i >= 0; i--) {
                if (!arr[i].listener) {
                    arr.splice(i, 1);
                }
            }
        }

        for (let handler of this._handlersWait) {
            this._createListener(handler.type, handler.caller, handler.listener, handler.args, handler.once);
            handler.recyle();
        }
    }

    onEvent(type:string, caller:any, listener:Function, args:any[] = null): void {
        this._createListener(type, caller, listener, args, false);
    }

    onceEvent(type:string, caller:any, listener:Function, args:any[] = null): void {
        this._createListener(type, caller, listener, args, true);
    }

    private _createListener(type:string, caller:any, listener:Function, args:any[], once:boolean): void {
        if (this._inLock) {
            let handler = EventHandler.create(type, caller, listener, args, once);
            this._handlersWait.push(handler);
            return;
        }

        this.offEvent(type, caller, listener);
        let evt = EventHandler.create(type, caller, listener, args, once);
        let arr = this._events.get(type);
        if (!arr) {
            arr = [];
            this._events.set(type, arr);
        }
        arr.push(evt);
    }

    //取消某一个类型的所有监听者中的某一个
    //caller可以为null
    offEvent(type:string, caller:any, listener:Function): void {
        let arr = this._events.get(type);
        if (!arr) {
            return;
        }

        for (let i = 0; i < arr.length; i++) {
            let evt = arr[i];
            if (evt.caller == caller && evt.listener == listener) {
                evt.recyle();
                arr.splice(i, 1);
                return;
            }
        }
    }

    //统一类型 可能有多个监听者
    offEventByType(type:string): void {
        let arr = this._events.get(type);
        if (!arr) {
            return;
        }

        for (let i = 0; i < arr.length; i++) {
            let evt = arr[i];
            evt.recyle();
        }
    }

    //所有这个监听者注册过的所有类型的事件
    offEventByCaller(caller:any): void {
        for (let arr of this._events.values()) {
            for (let i = 0; i < arr.length; i++) {
                let evt = arr[i];
                if (evt.caller == caller) {
                    evt.recyle();
                    arr.splice(i, 1);
                    i--;
                }
            }
        }

        for (let key of this._events.keys()) {
            let arr = this._events.get(key);
            if (arr.length == 0) {
                this._events.delete(key);
            }
        }
    }
}