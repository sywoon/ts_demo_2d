import { UINode } from "./UINode";
import { Color } from "../../math/Color";
import { UIFontStyle } from "./UIStyle";


export class UILabel extends UINode {
    text: string = "";
    style: UIFontStyle = new UIFontStyle();
    debug: boolean = true;

    public constructor() {
        super();
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

    public onRender(x:number, y:number): void {
        // this.graphic.saveStyle();
        this.graphic.setStyle(this.style);
        this.graphic.drawText(this.text, this.x+x, this.y+y);
        // this.graphic.restoreStyle();

        if (this.debug) {
            this.graphic.strokeRect(this.x+x, this.y+y, this.width, this.height, Color.Green);
        }
    }
}

