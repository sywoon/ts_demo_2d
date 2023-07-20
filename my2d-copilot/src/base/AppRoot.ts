import { Canvas2D } from "./Canvas2D";
import { MyKeyboardEvent, MyMouseEvent } from "./EventDefine";
import { Graphic } from "./Graphic";
import { Stage } from "./Stage";
import { Timer } from "./Timer";
import { Size } from "./math/Size";
import { UIMgr } from "./mvc/UIMgr";

export class AppRoot implements EventListenerObject {
    canvas2d: Canvas2D;
    graphic: Graphic;
    stage: Stage;
    uimgr: UIMgr;
    timer: Timer;

    public static instance: AppRoot = null; //基类中实例化
    public static getInstance(): AppRoot {
        return AppRoot.instance;
    }

    public constructor() {
        let canvas: HTMLCanvasElement = document.getElementById(
            "canvas"
        ) as HTMLCanvasElement;
        this.canvas2d = new Canvas2D(canvas);

        this.graphic = new Graphic(this.canvas2d);
        this.stage = new Stage(this.canvas2d);
        this.timer = new Timer();
        this.uimgr = new UIMgr();

        canvas.addEventListener("mousedown", this, false);
        canvas.addEventListener("mouseup", this, false);
        canvas.addEventListener("mousemove", this, false);
        window.addEventListener("keydown", this, false);
        window.addEventListener("keyup", this, false);
        window.addEventListener("keypress", this, false);
    }

    public getCanvasSize(): Size {
        return this.canvas2d.size;
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
        this.timer.update();
        this.stage.update();
    }

    render() {
        this.graphic.clear();
        this.stage.render();
    }
}
