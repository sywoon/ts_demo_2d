import { GameEvent } from "../../EventDefine";
import { Color } from "../../math/Color";
import { Size } from "../../math/Size";
import { UIGeometry } from "./UIGeometry";


export class UIColorGrid extends UIGeometry {
    // w h 格式大小  cw ch格子数量
    static Create(w: number, h: number, cw: number, ch: number): UIColorGrid {
        let ui = new UIColorGrid();
        ui.onCreate(w, h, cw, ch);
        return ui;
    }

    cellSize: Size = new Size(30, 30);
    cellCount:Size = new Size(10, 10);

    colorFrom: Color = new Color(1, 0, 0, 1);
    colorTo: Color = new Color(1, 1, 1, 1);
    selectedColor: Color = new Color(1, 1, 1, 1);

    constructor() {
        super();
    }

    public onCreate(w:number, h:number, cw:number, ch:number): void {
        super.onCreate();
        this.cellSize.width = w;
        this.cellSize.height = h;
        this.cellCount.width = cw;
        this.cellCount.height = ch;
        this.width = w * cw;
        this.height = h * ch;
        
        this.setInteractAble(true);
        this.onEvent(GameEvent.CLICK, this._onClicked, this);
    }

    private _onClicked(x:number, y:number) {
        let i = Math.floor(x / this.cellSize.width);
        let j = Math.floor(y / this.cellSize.height);

        let cw = this.cellCount.width;
        let ch = this.cellCount.height;
        this.calculateColor(i, j, cw-1, ch-1, this.colorFrom, this.colorTo, this.selectedColor);

        this.sendEvent(GameEvent.COLOR_SELECTED, this.selectedColor, this);
        console.log(this.selectedColor.toString())
    }

    public onRender(x: number, y: number): void {
        super.onRender(x, y);

        this.fillRect(25, 25, 100, 100);

        let _x = 0;
        let _y = 0;
        let w = this.cellSize.width;
        let h = this.cellSize.height;
        let cw = this.cellCount.width;
        let ch = this.cellCount.height;
        let colorFrom = this.colorFrom;
        let colorTo = this.colorTo;
        let color = Color.temp;
        for (var i = 0; i < cw; i++) {
            for (var j = 0; j < ch; j++) {
                _x = i * w;
                _y = j * h;

                this.calculateColor(i, j, cw-1, ch-1, colorFrom, colorTo, color);
                this.fillRect(_x, _y, w, h, color);
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