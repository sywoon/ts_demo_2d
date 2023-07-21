import { UINode } from "./UINode";
import { Color } from "../../math/Color";
import { UIFontStyle } from "./UIStyle";
import { Size } from "../../math/Size";
import { GameEvent } from "../../EventDefine";
import { Vec2 } from "../../math/Vec2";


export class UILabel extends UINode {
    private _text: string = "";
    style: UIFontStyle = new UIFontStyle();
    autoResize: boolean = true;  //根据文字内容 自动计算大小

    public constructor() {
        super();
        this.width = 100;
        this.height = 50;
    }

    set text(v:string) {
        this._text = v;

        if (this.autoResize) {
            let size = this.measureText();
            this.width = size.width;
            this.height = this.style.fontSize;  //采用自己的字体大小
            this.timer.callLater(this.onResize, this);
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

    protected measureText(): Size {
        return this.graphic.measureText(this.text);
    }

    protected onResize(): void {
        this.sendEvent(GameEvent.RESIZE, this.width, this.height)
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
        this.graphic.setStyle(this.style);
        this.graphic.drawText(this.text, this.x+x, this.y+y);

        if (this.debug) {
            x = this.x+x;
            y = this.y+y;
            this.graphic.drawArc(x, y, 3, 0, Math.PI * 2, true, "fill", Color.Red);
            
            let pt = this.adjustByAlign(x, y);
            this.graphic.strokeRect(pt.x, pt.y, this.width, this.height, Color.Green);
            
        }
    }
}

