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
}

