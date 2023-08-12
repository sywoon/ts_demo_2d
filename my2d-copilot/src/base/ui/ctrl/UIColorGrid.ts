import { GameEvent, MyMouseEvent } from "../../EventDefine";
import { Color } from "../../math/Color";
import { Size } from "../../math/Size";
import { Vec2 } from "../../math/Vec2";
import { UIGeometry } from "./UIGeometry";


export class UIColorGrid extends UIGeometry {
    cellSize: Size = new Size(30, 30);
    cellCount:Size = new Size(10, 10);

    colorFrom: Color = new Color(1, 0, 0, 1);
    colorTo: Color = new Color(1, 1, 1, 1);
    selectedColor: Color = new Color(1, 1, 1, 1);

    colorMode: number = 0; // 0:梯度颜色, 1: 外部函数控制
    private _calculateColor: Function = null;

    constructor(w:number, h:number, cw:number, ch:number) {
        super();

        this.cellSize.width = w;
        this.cellSize.height = h;
        this.cellCount.width = cw;
        this.cellCount.height = ch;
        this.width = w * cw;
        this.height = h * ch;

        this.setActive(true);
        this.onEvent(GameEvent.CLICK, this._onClicked, this);
    }

    public setCalculateColor(func: Function) {
        this._calculateColor = func;
        this.colorMode = 1;
    }

    private _onClicked(evt: MyMouseEvent) {
        let pt = this.globalToLocal(evt.x, evt.y, Vec2.temp);

        let i = Math.floor(pt.x / this.cellSize.width);
        let j = Math.floor(pt.y / this.cellSize.height);

        let cw = this.cellCount.width;
        let ch = this.cellCount.height;

        let showColor;
        if (this.colorMode == 0) {
            showColor = this.calculateColor(i, j, cw, ch, this.colorFrom, this.colorTo, this.selectedColor);
        } else {
            showColor = this._calculateColor(i, j, cw, ch, this.selectedColor);
        }

        if (!showColor)
            return;

        this.sendEvent(GameEvent.COLOR_SELECTED, this.selectedColor, this);
        console.log(this.selectedColor.toString());
    }

    public onRender(x: number, y: number): void {
        if (!this.isVisible())
            return;

        super.onRender(x, y);

        let _x = 0;
        let _y = 0;
        let w = this.cellSize.width;
        let h = this.cellSize.height;
        let cw = this.cellCount.width;
        let ch = this.cellCount.height;
        let colorFrom = this.colorFrom;
        let colorTo = this.colorTo;
        let color = Color.temp;
        let showColor;

        for (var j = 0; j < ch; j++) {
            for (var i = 0; i < cw; i++) {
                _x = i * w;
                _y = j * h;

                if (this.colorMode == 0) {
                    showColor = this.calculateColor(i, j, cw, ch, colorFrom, colorTo, color);
                } else {
                    showColor = this._calculateColor(i, j, cw, ch, color);
                }
                showColor && this.fillRect(_x, _y, w, h, color);
            }
        }
    }

    calculateColor(x:number, y:number, w:number, h:number, colorFrom:Color, colorTo:Color, outColor:Color=null):Color {
        // 计算t
        var t = Math.sqrt(x*x + y*y) / Math.sqrt(w*w + h*h);
    
        // 计算颜色值
        var r = colorFrom.r + (colorTo.r - colorFrom.r) * t;
        var g = colorFrom.g + (colorTo.g - colorFrom.g) * t;
        var b = colorFrom.b + (colorTo.b - colorFrom.b) * t;
    
        if (outColor == null) {
            outColor = new Color();
        }
        outColor.r = r;
        outColor.g = g;
        outColor.b = b;
        outColor.a = 1;
        return outColor;
    }
}