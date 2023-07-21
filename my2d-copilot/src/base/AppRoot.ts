import { Canvas2D } from "./Canvas2D";
import { MyKeyboardEvent, MyMouseEvent } from "./EventDefine";
import { EventDispatcher } from "./EventDispatcher";
import { Graphic } from "./Graphic";
import { Stage } from "./Stage";
import { Timer } from "./Timer";
import { Size } from "./math/Size";
import { UIMgr } from "./ui/UIMgr";
import { GameEvent } from "./EventDefine";


//EventListenerObject dom中注册的addEventListener回调监听
export class AppRoot extends EventDispatcher implements EventListenerObject {
    canvas2d: Canvas2D;
    graphic: Graphic;
    stage: Stage;
    uimgr: UIMgr;
    timer: Timer;
    visible: boolean = true;

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
        this.stage = new Stage(this.canvas2d);
        this.timer = new Timer();
        this.uimgr = new UIMgr();

        this._registerCanvasEvent();
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
        }
    }

    protected dispatchMouseEvent(evt: MyMouseEvent): void {
        this.stage.onTouchEvent(evt);
    }

    protected dispatchKeyEvent(evt: MyKeyboardEvent): void {
        this.stage.onKeyEvent(evt);
    }

    run() {
        let step = (timestamp: number) => {

            this.update(timestamp);
            this.render();
            requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
    }

    update(timestamp: number) {
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
