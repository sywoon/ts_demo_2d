import { Canvas2D } from "./Canvas2D";
import { IGraphic } from "./IGraphic";
import { Color } from "./math/Color";
import { UIStyle } from "./ui/ctrl/UIStyle";
import { Size } from "./math/Size";

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

    measureText(text:string): Size {
        return this.canvas2d.measureText(text);
    }

    drawText(text:string, x:number, y:number, color:Color = null) {
        this.canvas2d.drawText(text, x, y, color);
    }

    fillRect(x:number, y:number, width:number, height:number, color:Color = null) {
        this.canvas2d.fillRect(x, y, width, height, color);
    }

    strokeRect(x:number, y:number, width:number, height:number, color:Color = null) {
        this.canvas2d.strokeRect(x, y, width, height, color);
    }

    clearRect(x:number, y:number, width:number, height:number) {
        this.canvas2d.clearRect(x, y, width, height);
    }

    //mode:fill stroke all
    drawLine(x1:number, y1:number, x2:number, y2:number, mode:string="stroke", 
            colorFill:Color = null, colorStroke:Color = null) {
        this.canvas2d.drawLine(x1, y1, x2, y2, mode, colorFill, colorStroke);
    }

    drawTriangle(x1:number, y1:number, x2:number, y2:number, 
            x3:number, y3:number, mode:string="stroke",
            colorFill:Color = null, colorStroke:Color = null) {
        this.canvas2d.drawTriangle(x1, y1, x2, y2, x3, y3, mode, colorFill, colorStroke);
    }

    drawArc(x:number, y:number, radius:number, startAngle:number, endAngle:number, 
            antiClockWise:boolean=true, mode:string="stroke",
            colorFill:Color = null, colorStroke:Color = null) {
        this.canvas2d.drawArc(x, y, radius, startAngle, endAngle, antiClockWise, 
                mode, colorFill, colorStroke); 
    }

    drawQuadraticCurve(x1:number, y1:number, x2:number, y2:number, 
        xcp1:number, ycp1:number,
        mode:string="stroke", colorFill:Color = null, colorStroke:Color = null) {
        this.canvas2d.drawQuadraticCurve(x1, y1, x2, y2, xcp1, ycp1, mode, colorFill, colorStroke);
    }

    drawQuadraticCurveEx(xFrom:number, yFrom:number, 
        arrPoints:Array<Array<number>>,  //[[xcp1,ycp1,x1,y1],[],...]
        mode:string="stroke", colorFill:Color = null, colorStroke:Color = null) {
        this.canvas2d.drawQuadraticCurveEx(xFrom, yFrom, arrPoints, mode, colorFill, colorStroke);
    }

    drawCubicCurve(x1:number, y1:number, x2:number, y2:number, 
        xcp1:number, ycp1:number, xcp2:number, ycp2:number,
        mode:string="stroke", colorFill:Color = null, colorStroke:Color = null) {
        this.canvas2d.drawCubicCurve(x1, y1, x2, y2, xcp1, ycp1, xcp2, ycp2, mode, colorFill, colorStroke);
    }

    drawCubicCurveEx(xFrom:number, yFrom:number, 
        arrPoints:Array<Array<number>>,  //[[xcp1,ycp1,xcp2,ycp2x1,y1],[],...]
        mode:string="stroke", colorFill:Color = null, colorStroke:Color = null) {
        this.canvas2d.drawCubicCurveEx(xFrom, yFrom, arrPoints, mode, colorFill, colorStroke);
    }
}