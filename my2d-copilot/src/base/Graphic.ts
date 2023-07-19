import { Canvas2D } from "./Canvas2D";
import { IGraphic } from "./IGraphic";
import { Color } from "./math/Color";
import { UIStyle } from "./ui/ctrl/UIStyle";

export class Graphic implements IGraphic {
    canvas2d:Canvas2D;

    public constructor(canvas2d: Canvas2D) {
        this.canvas2d = canvas2d;
    }

    clear(): void {
        this.canvas2d.clear();
    }

    saveStyle() {
        this.canvas2d.save();
    }

    restoreStyle() {   
        this.canvas2d.restore();
    }

    setStyle(style:UIStyle): void {
        this.canvas2d.setStyle(style.toCssStyle());
    }

    drawText(text:string, x:number, y:number, color:Color = null) {
        if (color) {
            let cssColor = color.toCssColor();
            this.canvas2d.context.fillStyle = cssColor;
        }
        this.canvas2d.drawText(text, x, y);
    }

    fillRect(x:number, y:number, width:number, height:number, color:Color = null) {
        if (color) {
            let cssColor = color.toCssColor();
            this.canvas2d.context.fillStyle = cssColor;
        }
        this.canvas2d.context.fillRect(x, y, width, height);
    }

    strokeRect(x:number, y:number, width:number, height:number, color:Color = null) {
        if (color) {
            let cssColor = color.toCssColor();
            this.canvas2d.context.strokeStyle = cssColor;
        }
        this.canvas2d.context.strokeRect(x, y, width, height);
    }

    clearRect(x:number, y:number, width:number, height:number) {
        this.canvas2d.context.clearRect(x, y, width, height);
    }
}