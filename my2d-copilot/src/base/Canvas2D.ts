import { GameEvent, MyKeyboardEvent, MyMouseEvent } from "./EventDefine";
import { Color } from "./math/Color";
import { Rect } from "./math/Rect";
import { Size } from "./math/Size";

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
        this.context.globalAlpha = 1.0; //全局透明度

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
        //除了color外 还可以是色带ctx.createLinearGradient()
        status["fillStyle"] ? ctx.fillStyle = status["fillStyle"] : null;  //red rgb(200,0,0) 填充文字 矩形
        status["strokeStyle"] ? ctx.strokeStyle = status["strokeStyle"] : null;  //red rgb(200,0,0) 画文字 矩形边框
        status["font"] ? ctx.font = status["font"] : null;  //"20px sans-serif"
        status["textBaseline"] ? ctx.textBaseline = status["textBaseline"] : null;  //top middle bottom
        status["textAlign"] ? ctx.textAlign = status["textAlign"] : null;  //left center right

        status["lineWidth"] ? ctx.lineWidth = status["lineWidth"] : null;  //left center right
        status["lineCap"] ? ctx.lineCap = status["lineCap"] : null;  //butt round square
        status["lineJoin"] ? ctx.lineJoin = status["lineJoin"] : null;  //bevel round miter
    }

    public resize(width: number, height: number): void {
        this.size.width = width;
        this.size.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
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

    public clip(rect:Rect) {
        // beginPath() 和 closePath() 不一定要成对出现或匹配
        // beginPath()：此方法用于开始创建一个新的路径。当你调用此方法时，任何先前定义的路径都将被清除，开始定义一个新的路径
        // closePath()：此方法用于关闭当前路径，这样它可以形成一个闭合的形状。它实际上是将当前路径的最后一个点与其第一个点连接起来
        if (this.context === null) return;
        this.save();
        let ctx = this.context;
        ctx.beginPath();
        ctx.rect(rect.x, rect.y, rect.width, rect.height);
        ctx.clip();  //注意这个函数有叠加效果 并不能通过设置为canvas大小来还原 他们会叠加取相交区域

        //test
        // this.strokeRect(rect.x, rect.y, rect.width, rect.height, Color.Red);
    }

    public resetClip() {
        this.restore();
    }

    //只能拿到宽度 怎么拿高度？
    public measureText(text:string): Size {
        let obj:TextMetrics  = this.context.measureText(text);
        let size:Size = new Size();
        size.width = obj.width;
        size.height = parseInt(this.context.font.match(/\d+/g)[0]);  //"24px sans-serif"
        return size;
    }

    // public访问级别的成员函数
    public drawText(text: string, x: number, y: number, color:Color = null): void {
        if (this.context === null) return;
        let ctx = this.context;
        if (color) {
            let cssColor = color.toCssColor();
            ctx.fillStyle = cssColor;
        }

        //调用文字填充命令
        ctx.fillText(text, x, y);
        //调用文字描边命令
        ctx.strokeText(text, x, y);
    }

    public fillRect(x:number, y:number, width:number, height:number, color:Color = null) {
        if (this.context === null) return;
        let ctx = this.context;
        if (color) {
            let cssColor = color.toCssColor();
            ctx.fillStyle = cssColor;
        }
        ctx.fillRect(x, y, width, height);
    }

    public strokeRect(x:number, y:number, width:number, height:number, color:Color = null) {
        if (this.context === null) return;
        let ctx = this.context;
        if (color) {
            let cssColor = color.toCssColor();
            ctx.strokeStyle = cssColor;
        }
        ctx.strokeRect(x, y, width, height);
    }

    public clearRect(x:number, y:number, width:number, height:number) {
        if (this.context === null) return;
        this.context.clearRect(x, y, width, height);
    }

    //圆角矩形
    public roundRect(x:number, y:number, width:number, height:number, radius:number, 
            mode:string="stroke", colorFill:Color = null, colorStroke:Color = null) {
        if (this.context === null) return;

        let ctx = this.context;
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.arc(x + width - radius, y + radius, radius, Math.PI * 3 / 2, Math.PI * 2);
        ctx.lineTo(x + width, y + height - radius);
        ctx.arc(x + width - radius, y + height - radius, radius, 0, Math.PI / 2);
        ctx.lineTo(x + radius, y + height);
        ctx.arc(x + radius, y + height - radius, radius, Math.PI / 2, Math.PI);
        ctx.lineTo(x, y + radius);
        ctx.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 3 / 2);
        // ctx.closePath();

        this._drawByMode(mode, colorFill, colorStroke);
    }

    private _drawByMode(mode:string, colorFill:Color = null, colorStroke:Color = null) {
        let ctx = this.context;
        let oldFillStyle;
        if (colorFill) {
            let cssColor = colorFill.toCssColor();
            oldFillStyle = ctx.fillStyle;
            ctx.fillStyle = cssColor;
        }

        let oldStrokeStyle;
        if (colorStroke) {
            let cssColor = colorStroke.toCssColor();
            oldStrokeStyle = ctx.strokeStyle;
            ctx.strokeStyle = cssColor;
        }

        if (mode === "fill") {
            ctx.fill();
        } else if (mode === "stroke") {
            ctx.stroke();
        } else if (mode === "all") {
            ctx.fill();
            ctx.stroke();
        }

        if (oldFillStyle) {
            ctx.fillStyle = oldFillStyle;
        }
        if (oldStrokeStyle)    {
            ctx.strokeStyle = oldStrokeStyle;
        }
    }

    public setLineDash(segments:number[]): void {
        if (this.context === null) return;
        this.context.setLineDash(segments);
    }

    public getLineDash(): number[] {
        if (this.context === null) return null;
        return this.context.getLineDash();
    }

    //mode:fill stroke all
    //注意: 1像素 若水平/垂直 fill模式 看不见
    public drawLine(x1:number, y1:number, x2:number, y2:number, mode:string="stroke",
                    colorFill:Color = null, colorStroke:Color = null): void {
        if (this.context === null) return;
        let ctx = this.context;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        // ctx.closePath();

        this._drawByMode(mode, colorFill, colorStroke);
    }

    public drawTriangle(x1:number, y1:number, x2:number, y2:number, 
                        x3:number, y3:number, mode:string="stroke",
                        colorFill:Color = null, colorStroke:Color = null) {
        if (this.context === null) return;
        let ctx = this.context;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.closePath();

        this._drawByMode(mode, colorFill, colorStroke);
    }

    drawArc(x:number, y:number, radius:number, startAngle:number, endAngle:number, 
            antiClockWise:boolean=true, mode:string="stroke",
            colorFill:Color = null, colorStroke:Color = null) {
        if (this.context === null) return;
        let ctx = this.context;
        ctx.beginPath();
        ctx.arc(x, y, radius, startAngle, endAngle, antiClockWise);
        this._drawByMode(mode, colorFill, colorStroke);
        // ctx.closePath();
    }

    //二次曲线 起点、终点、控制点
    drawQuadraticCurve(x1:number, y1:number, x2:number, y2:number, 
            xcp1:number, ycp1:number,
            mode:string="stroke", colorFill:Color = null, colorStroke:Color = null) {
        if (this.context === null) return;
        let ctx = this.context;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(xcp1, ycp1, x2, y2);
        this._drawByMode(mode, colorFill, colorStroke);
        // ctx.closePath();
    }

    //二次曲线 支持多组点  一次画一个闭环
    drawQuadraticCurveEx(xFrom:number, yFrom:number, 
        arrPoints:Array<Array<number>>,  //[[xcp1,ycp1,x1,y1],[],...]
        mode:string="stroke", colorFill:Color = null, colorStroke:Color = null) {
        if (this.context === null) return;
        let ctx = this.context;
        ctx.beginPath();
        ctx.moveTo(xFrom, yFrom);

        for (let arr of arrPoints) {
            let xcp1 = arr[0];
            let ycp1 = arr[1];
            let x1 = arr[2];
            let y1 = arr[3];
            ctx.quadraticCurveTo(xcp1, ycp1, x1, y1);
        }

        this._drawByMode(mode, colorFill, colorStroke);
        // ctx.closePath();
    }

    //三次曲线 起点、终点、控制点1 控制点2
    drawCubicCurve(x1:number, y1:number, x2:number, y2:number, 
            xcp1:number, ycp1:number, xcp2:number, ycp2:number,
            mode:string="stroke", colorFill:Color = null, colorStroke:Color = null) {
        if (this.context === null) return;
        let ctx = this.context;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.bezierCurveTo(xcp1, ycp1, xcp2, ycp2, x2, y2);
        this._drawByMode(mode, colorFill, colorStroke);
        // ctx.closePath();
    }

    //三次曲线 支持多组点
    drawCubicCurveEx(xFrom:number, yFrom:number, 
        arrPoints:Array<Array<number>>,  //[[xcp1,ycp1,xcp2,ycp2,x1,y1],[],...]
        mode:string="stroke", colorFill:Color = null, colorStroke:Color = null) {
        if (this.context === null) return;
        let ctx = this.context;
        ctx.beginPath();
        ctx.moveTo(xFrom, yFrom);
        for (let arr of arrPoints) {
            let xcp1 = arr[0];
            let ycp1 = arr[1];
            let xcp2 = arr[2];
            let ycp2 = arr[3];
            let x1 = arr[4];
            let y1 = arr[5];
            ctx.bezierCurveTo(xcp1, ycp1, xcp2, ycp2, x1, y1);
        }
        this._drawByMode(mode, colorFill, colorStroke);
        // ctx.closePath();
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
            case "keypress":  //只对能够输入可打印字符的键有效  输入内容时会触发
                keyboardEvt.type = GameEvent.KEY_PRESS;
                break;
            default:
                console.error("evt type error:", evt.type);
                break;
        }

        keyboardEvt.key = evt.key;   //键的字符
        keyboardEvt.code = evt.code;  //键盘事件的键的物理代码
        keyboardEvt.repeat = evt.repeat;
        keyboardEvt.altKey = evt.altKey;
        keyboardEvt.ctrlKey = evt.ctrlKey;
        keyboardEvt.shiftKey = evt.shiftKey;
        return keyboardEvt;
    }
}
