import { UINode } from "./UINode";
import { Color } from "../../math/Color";
import { UILabelStyle } from "./UIStyle";
import { Size } from "../../math/Size";
import { GameEvent } from "../../EventDefine";
import { Vec2 } from "../../math/Vec2";
import { DebugType } from "../UIDefine";


export class UILabel extends UINode {
    private _text: string = "";
    style: UILabelStyle = new UILabelStyle();
    autoResize: boolean = true;  //根据文字内容 自动计算大小

    
    set text(v:string) {
        this._text = v;

        if (this.autoResize) {
            let size = this.measureText();
            this.width = size.width;
            this.height = this.style.fontSize;  //采用自己的字体大小
        }
    }

    get text():string {
        return this._text;
    }

    public set font(font:string) {
        this.style.font = font;
    }

    public set fontSize(size:number) {
        this.style.fontSize = size;
    }

    public set fontColor(color:Color) {
        this.style.fillColor = color;
    }

    public set strokeColor(color:Color) {
        this.style.strokeColor = color;
    }

    public set hAlign(align:string) {
        this.style.hAlign = align;
    }

    public set vAlign(align:string) {
        this.style.vAlign = align;
    }

    public constructor() {
        super();
    }

    protected measureText(): Size {
        if (this._text == "") {
            let temp = Size.temp;
            temp.width = 0;
            temp.height = 0;
            return temp;
        }
        return this.graphic.measureText(this._text);
    }

    public adjustByAlign(x:number, y:number): Vec2 {
        switch (this.style.hAlign) {
            case "left":
                break;
            case "center":
                x -= this.width/2;
                break;
            case "right":
                x -= this.width;
                break;
        }
        switch (this.style.vAlign) {
            case "top":
                break;
            case "middle":
                y -= this.height/2;
                break;
            case "bottom":
                y -= this.height;
                break;
        }
        let pt = new Vec2(x, y);
        return pt;
    }

    public onRender(x:number, y:number): void {
        if (!this.isVisible() || this._text == "")
            return;
        let _x = x + this.x;  //不能修改x的值 需要上传
        let _y = y + this.y;

        this.graphic.setStyle(this.style);
        this.graphic.drawText(this.text, _x, _y);

        if (this.debug > 0) {
            if (this.hasDebugType(DebugType.LabelRect)) {
                let pt = this.adjustByAlign(_x, _y);
                this.graphic.strokeRect(pt.x, pt.y, this.width, this.height, Color.Green);
            }
        }

        super.onRender(x, y);
    }
}

