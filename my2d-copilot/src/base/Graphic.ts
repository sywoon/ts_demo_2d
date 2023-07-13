import { Canvas2D } from "./Canvas2D";
import { IGraphic } from "./IGraphic";

export class Graphic implements IGraphic {
    canvas2d:Canvas2D;

    public constructor(canvas2d: Canvas2D) {
        this.canvas2d = canvas2d;
    }

    saveStyle() {
        this.canvas2d.save();
    }

    restoreStyle() {   
        this.canvas2d.restore();
    }

    setStyle(style:any): void {
        this.canvas2d.setStyle(style);
    }

    drawText(text:string, x:number, y:number) {
        this.canvas2d.drawText(text, x, y);
    }

    fillRect(x:number, y:number, width:number, height:number) {
        this.canvas2d.context.fillRect(x, y, width, height);
    }

    strokeRect(x:number, y:number, width:number, height:number) {
        this.canvas2d.context.strokeRect(x, y, width, height);
    }

    clearRect(x:number, y:number, width:number, height:number) {
        this.canvas2d.context.clearRect(x, y, width, height);
    }
}