import { Canvas2D } from "./Canvas2D";
import { MyKeyboardEvent, MyMouseEvent, MyWheelEvent } from "./EventDefine";
import { EventDispatcher } from "./EventDispatcher";
import { Graphic } from "./Graphic";
import { Stage } from "./Stage";
import { Timer } from "./Timer";
import { Size } from "./math/Size";
import { UIMgr } from "./ui/UIMgr";
import { GameEvent } from "./EventDefine";
import { UIEdit } from "./ui/ctrl/UIEdit";
import Time from "./Time";


//EventListenerObject dom中注册的addEventListener回调监听
export class AppRoot extends EventDispatcher implements EventListenerObject {
    canvas2d: Canvas2D;
    graphic: Graphic;
    stage: Stage;
    uimgr: UIMgr;
    time: Time;
    timer: Timer;
    visible: boolean = true;
    inputElement: HTMLInputElement = null;
    inputUI: UIEdit = null;
    urlParams: any = {};  //html入口带的参数 ?a=1&b=2&c=3

    private _timeId: number = 0;

    public static instance: AppRoot = null; //基类中实例化
    public static getInstance(): AppRoot {
        return AppRoot.instance;
    }

    public constructor() {
        super();
        let canvas: HTMLCanvasElement = document.getElementById(
            "canvas"
        ) as HTMLCanvasElement;
        this.canvas2d = new Canvas2D(canvas);

        this.graphic = new Graphic(this.canvas2d);
        this.stage = new Stage(this.canvas2d)
        this.time = new Time();
        this.timer = new Timer();
        this.uimgr = new UIMgr();

        this._registerCanvasEvent();
        this._createInput();
    }

    init() {
        this._initUrlParams();
        this.stage.init();
    }

    checkUrlParam(key: string, value:string): boolean {
        return this.urlParams[key] == value;
    }

    private _initUrlParams() {
        let urlParams = this.urlParams;
        if (window.location && window.location.search) {  //search本身就是从?开始的内容
            let searchHref = window.location.search.replace('?', '');  //去除?后 后面内容全是参数
            let params = searchHref.split('&');
            for (let param of params) {
                if (param == "" || param.indexOf("=") == -1)
                    continue;

                let paramSplit = param.split('=');
                urlParams[paramSplit[0]] = paramSplit[1];
            }
        }
    }

    public getCanvasSize(): Size {
        return this.canvas2d.size;
    }

    private _registerCanvasEvent(): void {
        let canvas: HTMLCanvasElement = this.canvas2d.canvas;
        canvas.addEventListener("mousedown", this, false);
        canvas.addEventListener("mouseup", this, false);
        canvas.addEventListener("mousemove", this, false);
        window.addEventListener("keydown", this, false);
        window.addEventListener("keyup", this, false);
        window.addEventListener("keypress", this, false);
        window.addEventListener("wheel", this, false);

        window.addEventListener("focus", ()=>{
			this.sendEvent(GameEvent.FOCUS);
		});
		window.addEventListener("blur", ()=> {
			this.sendEvent(GameEvent.BLUR);
		});

        {
            var state = "visibilityState", visibilityChange = "visibilitychange";
            var document: any = window.document;
            if (typeof document.hidden !== "undefined") {
                visibilityChange = "visibilitychange";
                state = "visibilityState";
            } else if (typeof document.mozHidden !== "undefined") {
                visibilityChange = "mozvisibilitychange";
                state = "mozVisibilityState";
            } else if (typeof document.msHidden !== "undefined") {
                visibilityChange = "msvisibilitychange";
                state = "msVisibilityState";
            } else if (typeof document.webkitHidden !== "undefined") {
                visibilityChange = "webkitvisibilitychange";
                state = "webkitVisibilityState";
            }

            window.document.addEventListener(visibilityChange, ()=> {
                let visible;
                if (document[state] == "hidden") {
                    visible = false;
                } else {
                    visible = true;
                }
                this.visible = visible;
                this.sendEvent(GameEvent.VISIBILITY_CHANGE, visible);
                this._switchLoopType();
            });
        }

        {
            window.addEventListener("resize", ()=> {
                // 处理屏幕旋转。旋转后收起输入法。
                // var orientation: any = window.orientation;
                this.onResize();
            });

            // 微信的iframe不触发orientationchange
            window.addEventListener("orientationchange", (e: any)=>{
                this.onResize();
            });
        }

        
    }

    private _createInput(): void {
        {
            let input = document.createElement("input");
            input.type = "text";  //text password
            input.style.position = "absolute";
            input.style.right = "0px";
            input.style.top = "-20px";
            // input.style.opacity = "0";
            input.style.width = "100px";
            input.style.height = "20px";
            // input.style.border = "none";
            // input.style.outline = "none";
            // input.style.zIndex = "-100";
            // input.style.background = "none";
            // input.style.resize = "none";
            // input.style.overflow = "hidden";
            input.maxLength = 99;
            input.placeholder = "place holder";
            input.value = "input test";
            input.focus();
            document.body.appendChild(input);
            this.inputElement = input;

            input.addEventListener('change', (evt: Event) => {  //InputEvent
                console.log('The input has changed', evt);
                this.inputUI && this.inputUI.onInputEvent('change', evt);
            },);
            input.addEventListener('input', (evt: Event) => {
                console.log('The input has input', evt);
                this.inputUI && this.inputUI.onInputEvent('change', evt);
            });
            input.addEventListener('focus', () => {
                console.log('The input got focus');
                this.inputUI && this.inputUI.onInputEvent('change', null);
            });
            input.addEventListener('blur', () => {
                console.log('The input got blur');
                this.inputUI && this.inputUI.onInputEvent('change', null);
            });
            input.addEventListener('keydown', (evt:KeyboardEvent) => {
                console.log('A key was pressed down', evt);
                this.inputUI && this.inputUI.onInputEvent('change', evt);
            });
            input.addEventListener('select', (v:any) => {
                console.log('Some text was selected', v);
                this.inputUI && this.inputUI.onInputEvent('select', null);
            });
    
        }
    }

    //游戏控件主动调用 UIEdit -> input element
    inputFocus(ui:UIEdit) {
        if (this.inputUI == ui)
            return;
        if (this.inputUI) {
            this.inputUI.onBlur();
        }
        this.inputUI = ui;
        ui.onFocus();
    }

    inputBlur(ui:UIEdit) {
        if (this.inputUI == ui) {
            ui.onBlur();
            this.inputUI = null;
        }
    }

    public handleEvent(evt: Event): void {
        switch (evt.type) {
            case "mousedown":
            case "mouseup":
            case "mousemove":
                let mouseEvt: MyMouseEvent = this.canvas2d.toMouseEvent(
                    evt as MouseEvent
                );
                this.dispatchMouseEvent(mouseEvt);
                break;
            case "keypress":
            case "keydown":
            case "keyup":
                let keboardEvt: MyKeyboardEvent = this.canvas2d.toKeyboardEvent(
                    evt as KeyboardEvent
                );
                this.dispatchKeyEvent(keboardEvt);
                break;
            case "wheel":
                let wheelEvt: MyWheelEvent = new MyWheelEvent();
                wheelEvt.type = GameEvent.MOUSE_WHEEL;
                wheelEvt.deltaY = (evt as WheelEvent).deltaY;
                this.dispatchWheelEvent(wheelEvt);
                break;
            default:
                break;
        }
    }

    protected dispatchWheelEvent(wheelEvt: MyWheelEvent) {
        this.stage.dispatchWheelEvent(wheelEvt);
    }

    protected dispatchMouseEvent(evt: MyMouseEvent): void {
        if (this.inputUI && evt.type == GameEvent.MOUSE_DOWN) {
            //就算点击到输入框内 也会触发input element的blur事件
            // let pos = this.inputUI.globalToLocal(evt.x, evt.y);
            // if (this.inputUI.hitTest(pos.x, pos.y)) {
            //     return;
            // } else {  //点击游戏输入框外部 结束本次输入
                this.inputUI.onBlur();
                this.inputUI = null;
            // }
        }

        this.stage.dispatchTouchEvent(evt);
    }

    protected dispatchKeyEvent(evt: MyKeyboardEvent): void {
        if (this.inputUI && evt.type == GameEvent.KEY_DOWN) {
            if (evt.key == "Enter") {
                this.inputUI.onBlur();
                this.inputUI = null;
                return;
            }
        }

        this.stage.dispatchKeyEvent(evt);
    }

    run() {
        //timestamp:启动到现在的时间差
        let step = (timestamp: number) => {
            this._loop();
            requestAnimationFrame(step);
        };

        //注意：切后台后 不会再调用
        requestAnimationFrame(step);
    }

    private _loop() {
        // console.log("approot loop", this.time.getTimeStr());
        this.update();
        this.render();
    }

    private _switchLoopType() {
        //切后台后 保留一定的刷新功能 维持业务逻辑 比如心跳
        if (this.visible) {
            this._timeId = window.setInterval(this._loop.bind(this), 1000);
        } else {
            window.clearInterval(this._timeId);
        }
    }

    update() {
        this.timer.runCallLater();  //上一帧积累的回调
        this.timer.update();
        this.stage.update();
    }

    render() {
        if (!this.visible)
            return;
        this.graphic.clear();
        this.stage.render();
    }

    protected onResize() {
        let width = window.innerWidth;
        let height = window.innerHeight;
        this.canvas2d.resize(width, height);
        this.stage.resize(width, height);
    }
}
