import { GameEvent } from "../../EventDefine";
import { Color } from "../../math/Color";
import { Vec2 } from "../../math/Vec2";
import { UIColorUnit } from "./UIColorUnit";
import { UIGeometry } from "./UIGeometry";
import { UILabel } from "./UILabel";


export class UIColorGradient extends UIGeometry {
    grd: CanvasGradient;
    colorUnit: UIColorUnit;

    private _curSelPt: Vec2 = new Vec2();
    private _curSelColor: Color = new Color(1,0,0);
    private _colorGrd: any[] = [];

    constructor() {
        super();
        this.width = 300;
        this.height = 20;
        this._colorGrd = [
            [0, Color.Create(1,0,0)],
            [1/6, Color.Create(1,0,1)],
            [2/6, Color.Create(0,0,1)],
            [3/6, Color.Create(0,1,1)],
            [4/6, Color.Create(0,1,0)],
            [5/6, Color.Create(1,1,0)],
            [1, Color.Create(1,0,0)],
        ];

        let colorUnit = new UIColorUnit();
        this.addChild(colorUnit);
        this.colorUnit = colorUnit;
        colorUnit.y = 30;
        colorUnit.setColor(this._curSelColor);

        this.setInteractAble(true);
        this.onEvent(GameEvent.CLICK, this._onClick, this);
        this.onEvent(GameEvent.MOUSE_MOVE, this._onMouseMove, this);
    }

    get selectedColor(): Color {
        return this._curSelColor;
    }
    
    protected onSizeChanged() {
        let pt = this.localToGlobal(0, 0);

        let grd = this.appRoot.canvas2d.context.createLinearGradient(pt.x, pt.y, this.width+pt.x, this.height+pt.y);
        for (let v of this._colorGrd) {
            grd.addColorStop(v[0], v[1].toCssColor());   //grd.addColorStop(0, "rgb(255,0,0)");      
        }
        this.grd = grd;
    }

    public onRender(x: number, y: number): void {
        super.onRender(x, y);

        if (!this.grd)
            return;

        // 填充渐变
        this.appRoot.canvas2d.context.fillStyle = this.grd;
        this.appRoot.canvas2d.context.fillRect(this.x+x, this.y+y, this.width, this.height);

        this.drawArc(this._curSelPt.x, this._curSelPt.y, 5, 0, Math.PI * 2, true, "stroke", null, Color.Black)
    }

    private _onClick(x:number, y:number) {
        let pt = this.globalToLocal(x, y, this._curSelPt);
        this._setSelPt(pt);
    }

    private _onMouseMove(x:number, y:number) {
        if (!this.isMouseDown)
            return;
        if (!this.isMouseIn) {
            if (x < this.x || x > this.x + this.width)
                return;

            if (y < this.y) {
                y = this.y;
            } else if (y > this.y + this.height) {
                y = this.y + this.height;
            }
        }

        let pt = this.globalToLocal(x, y, this._curSelPt);
        this._setSelPt(pt);
    }

    private _setSelPt(pt:Vec2) {
        this._curSelPt = pt;
        this._parseSelectedColor(this._curSelColor)
        this.colorUnit.setColor(this._curSelColor);
        this.sendEvent(GameEvent.COLOR_SELECTED, this);
    }

    private _parseSelectedColor(out:Color): Color {
        let percent = this._curSelPt.x / this.width;
        let idxFind = 0;
        for (let v of this._colorGrd) {
            if (percent < v[0])
                break;
            idxFind++;
        }
        if (idxFind == 0)
            return this._colorGrd[0][1];
        if (idxFind >= this._colorGrd.length)
            return this._colorGrd[this._colorGrd.length-1][1];

        let from = this._colorGrd[idxFind-1];
        let to = this._colorGrd[idxFind];
        let percent2 = (percent - from[0]) / (to[0] - from[0]);

        let color = out || new Color();
        color.copyFrom(from[1]);
        color.lerp(to[1], percent2, color);
        return color;
    }
}