import { Color } from "./math/Color";
import { UIStyle } from "./ui/ctrl/UIStyle";
import { Size } from "./math/Size";

export interface IGraphic {
    saveStyle(): void;
    restoreStyle(): void;
    setStyle(style:UIStyle): void;
    
    measureText(text:string): Size;
    drawText(text:string, x:number, y:number, color?:Color): void;
    fillRect(x:number, y:number, width:number, height:number, color?:Color): void;
    strokeRect(x:number, y:number, width:number, height:number, color?:Color): void;
    clearRect(x:number, y:number, width:number, height:number): void;

    drawLine(x1:number, y1:number, x2:number, y2:number, mode?:string, colorFill?:Color, colorStroke?:Color): void;
    drawTriangle(x1:number, y1:number, x2:number, y2:number, x3:number, y3:number, mode?:string, colorFill?:Color, colorStroke?:Color): void;
    drawArc(x:number, y:number, radius:number, startAngle:number, endAngle:number, 
        antiClockWise?:boolean, mode?:string, colorFill?:Color, colorStroke?:Color): void;

    drawQuadraticCurve(x1:number, y1:number, x2:number, y2:number, 
        xcp1:number, ycp1:number,
        mode?:string, colorFill?:Color, colorStroke?:Color): void;

    drawQuadraticCurveEx(xFrom:number, yFrom:number, 
        arrPoints:Array<Array<number>>,  //[[xcp1,ycp1,x1,y1],[],...]
        mode?:string, colorFill?:Color, colorStroke?:Color): void;
    
    drawCubicCurve(x1:number, y1:number, x2:number, y2:number, 
        xcp1:number, ycp1:number, xcp2:number, ycp2:number,
        mode?:string, colorFill?:Color, colorStroke?:Color): void;

    drawCubicCurveEx(xFrom:number, yFrom:number, 
        arrPoints:Array<Array<number>>,  //[[xcp1,ycp1,xcp2,ycp2x1,y1],[],...]
        mode?:string, colorFill?:Color, colorStroke?:Color): void;
}

