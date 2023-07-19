import { UINode } from "./UINode";
import { Color } from "../../math/Color";
import { UIGeometryStyle } from "./UIStyle";

export class UIGeometry extends UINode {
    style: UIGeometryStyle = new UIGeometryStyle();

    public set fillColor(color:Color) {
        this.style.fillColor = color;
    }

    public set strokeColor(color:Color) {
        this.style.strokeColor = color;
    }

    public fillRect(x:number, y:number, width:number, height:number, color:Color = null): void {
        color = color || this.style.fillColor;
        this.graphic.fillRect(this.x+x, this.y+y, width, height, color);
    }

    public strokeRect(x:number, y:number, width:number, height:number, color:Color = null): void {
        color = color || this.style.strokeColor;
        this.graphic.strokeRect(this.x+x, this.y+y, width, height, color);
    }

    public clearRect(x:number, y:number, width:number, height:number): void {
        this.graphic.clearRect(this.x+x, this.y+y, width, height);
    }

    public drawLine(x1:number, y1:number, x2:number, y2:number, mode:string="stroke", 
            colorFill:Color = null, colorStroke:Color = null): void {
        colorFill = colorFill || this.style.fillColor;
        colorStroke = colorStroke || this.style.strokeColor;
        this.graphic.drawLine(this.x+x1, this.y+y1, this.x+x2, this.y+y2, mode, colorFill, colorStroke);
    }

    public drawTriangle(x1:number, y1:number, x2:number, y2:number, 
            x3:number, y3:number, mode:string="stroke",
            colorFill:Color = null, colorStroke:Color = null) {
        colorFill = colorFill || this.style.fillColor;
        colorStroke = colorStroke || this.style.strokeColor;
        this.graphic.drawTriangle(this.x+x1, this.y+y1, this.x+x2, this.y+y2, 
                                    this.x+x3, this.y+y3, mode, colorFill, colorStroke);
    }

    public drawArc(x:number, y:number, radius:number, startAngle:number, endAngle:number, 
            antiClockWise:boolean=true, mode:string="stroke",
            colorFill:Color = null, colorStroke:Color = null) {
        this.graphic.drawArc(this.x+x, this.y+y, radius, startAngle, endAngle, antiClockWise, 
                    mode, colorFill, colorStroke);
    }
}