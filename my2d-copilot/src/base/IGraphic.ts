import { Color } from "./math/Color";
import { UIStyle } from "./ui/ctrl/UIStyle";

export interface IGraphic {
    saveStyle(): void;
    restoreStyle(): void;
    setStyle(style:UIStyle): void;
    
    drawText(text:string, x:number, y:number, color?:Color): void;
    fillRect(x:number, y:number, width:number, height:number, color?:Color): void;
    strokeRect(x:number, y:number, width:number, height:number, color?:Color): void;
    clearRect(x:number, y:number, width:number, height:number): void;

    drawLine(x1:number, y1:number, x2:number, y2:number, mode?:string, colorFill?:Color, colorStroke?:Color): void;
    drawTriangle(x1:number, y1:number, x2:number, y2:number, x3:number, y3:number, mode?:string, colorFill?:Color, colorStroke?:Color): void;
    drawArc(x:number, y:number, radius:number, startAngle:number, endAngle:number, 
        antiClockWise?:boolean, mode?:string, colorFill?:Color, colorStroke?:Color): void;
}

