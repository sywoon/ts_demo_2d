import { GameEvent, MyKeyboardEvent, MyMouseEvent } from "./EventDefine";
import { Size } from "./math/Size";
import { Vec2 } from "./math/Vec2";

export class Canvas2D {
    //声明public访问级别的成员变量
    context: CanvasRenderingContext2D;
    size: Size = new Size();
    canvas: HTMLCanvasElement;

    private _border: Size = Size.zero;
    private _padding: Size = Size.zero;
    private _rectBounding: DOMRect;

    // public访问级别的构造函数
    public constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.size.width = canvas.width;
        this.size.height = canvas.height;

        this.context.imageSmoothingEnabled = true; //启用平滑处理，以减少锯齿效果 实践没区别

        this.setStyle({
            fillStyle: "white",
            strokeStyle: "black",
            font: "24px sans-serif",
            textBaseline: "middle",
            textAlign: "left"

        })

        this._initBorderSize();
    }

    //canvas实际区域 需要排除border和padding
    private _initBorderSize() {
        this._rectBounding = this.canvas.getBoundingClientRect();

        let borderLeftWidth: number = 0;
        let borderTopWidth: number = 0;
        let paddingLeft: number = 0;
        let paddingTop: number = 0;
        let decl: CSSStyleDeclaration = window.getComputedStyle(this.canvas);
        let strNumber: string | null = decl.borderLeftWidth;

        if (strNumber !== null) {
            borderLeftWidth = parseInt(strNumber, 10);
        }

        if (strNumber !== null) {
            borderTopWidth = parseInt(strNumber, 10);
        }
        this._border.set(borderLeftWidth, borderTopWidth);

        strNumber = decl.paddingLeft;
        if (strNumber !== null) {
            paddingLeft = parseInt(strNumber, 10);
        }

        strNumber = decl.paddingTop;
        if (strNumber !== null) {
            paddingTop = parseInt(strNumber, 10);
        }
        this._padding.set(paddingLeft, paddingTop);
    }

    public setStyle(status: any): void {
        if (this.context === null) return;

        let ctx = this.context;
        status["fillStyle"] ? ctx.fillStyle = status["fillStyle"] : null;  //red rgb(200,0,0) 填充文字 矩形
        status["strokeStyle"] ? ctx.strokeStyle = status["strokeStyle"] : null;  //red rgb(200,0,0) 画文字 矩形边框
        status["font"] ? ctx.font = status["font"] : null;  //"20px sans-serif"
        status["textBaseline"] ? ctx.textBaseline = status["textBaseline"] : null;  //top middle bottom
        status["textAlign"] ? ctx.textAlign = status["textAlign"] : null;  //left center right
    }

    public clear(): void {
        if (this.context === null) return;
        let ctx = this.context;
        ctx.clearRect(0, 0, this.size.width, this.size.height);
    }

    public save(): void {
        if (this.context === null) return;
        this.context.save();
    }

    public restore(): void {
        if (this.context === null) return;
        this.context.restore();
    }

    // public访问级别的成员函数
    public drawText(text: string, x: number, y: number): void {
        if (this.context === null) return;
        let ctx = this.context;

        //调用文字填充命令
        ctx.fillText(text, x, y);
        //调用文字描边命令
        ctx.strokeText(text, x, y);
    }

    //canvas原生鼠标事件转游戏内部鼠标事件
    public toMouseEvent(evt: MouseEvent): MyMouseEvent {
        let mouseEvt = new MyMouseEvent();
        switch (evt.type) {
            case "mousedown":
                mouseEvt.type = GameEvent.MOUSE_DOWN;
                break;
            case "mouseup":
                mouseEvt.type = GameEvent.MOUSE_UP;
                break;
            case "mousemove":
                mouseEvt.type = GameEvent.MOUSE_MOVE;
                break;
            default:
                console.error("evt type error:", evt.type);
                break;
        }

        if (!evt.target) {
            console.error("mouse event target is null")
            return;
        }

        let target = evt.target as HTMLCanvasElement;
        console.assert(target == this.canvas);

        let rect = this._rectBounding;
        let x = evt.clientX - rect.left - this._border.width - this._padding.width;
        let y = evt.clientY - rect.top - this._border.height - this._padding.height;
        mouseEvt.x = x;
        mouseEvt.y = y;
        return mouseEvt;
    }

    public toKeyboardEvent(evt : KeyboardEvent): MyKeyboardEvent {
        let keyboardEvt = new MyKeyboardEvent();
        switch (evt.type) {
            case "keydown":
                keyboardEvt.type = GameEvent.KEY_DOWN;
                break;
            case "keyup":
                keyboardEvt.type = GameEvent.KEY_UP;
                break;
            default:
                console.error("evt type error:", evt.type);
                break;
        }

        keyboardEvt.key = evt.key;
        keyboardEvt.keyCode = evt.keyCode;
        keyboardEvt.repeat = evt.repeat;
        keyboardEvt.altKey = evt.altKey;
        keyboardEvt.ctrlKey = evt.ctrlKey;
        keyboardEvt.shiftKey = evt.shiftKey;
        return keyboardEvt;
    }
}
