import { UINode } from "./UINode";
import { Color } from "../../math/Color";
import { UIGeometryStyle } from "./UIStyle";
import { DebugType } from "../UIDefine";

export class UIGeometry extends UINode {
    static Create(...args:any[]): UIGeometry {
        let ui = new UIGeometry();
        ui.onCreate(...args);
        return ui;
    }

    style: UIGeometryStyle = new UIGeometryStyle();

    public set fillColor(color:Color) {
        this.style.fillColor = color;
    }

    public set strokeColor(color:Color) {
        this.style.strokeColor = color;
    }

    constructor() {
        super();
        this.setDebugType(DebugType.Geometry);
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
        colorFill = colorFill || this.style.fillColor;
        colorStroke = colorStroke || this.style.strokeColor;
        this.graphic.drawArc(this.x+x, this.y+y, radius, startAngle, endAngle, antiClockWise, 
                    mode, colorFill, colorStroke);
    }

    public drawQuadraticCurve(x1:number, y1:number, x2:number, y2:number, 
            xcp1:number, ycp1:number,
            mode:string="stroke", colorFill:Color = null, colorStroke:Color = null) {
        colorFill = colorFill || this.style.fillColor;
        colorStroke = colorStroke || this.style.strokeColor;
        this.graphic.drawQuadraticCurve(this.x+x1, this.y+y1, this.x+x2, this.y+y2, 
                this.x+xcp1, this.y+ycp1, mode, colorFill, colorStroke);

        if (this.debug) {
            if (this.isDebugType(DebugType.Geometry)) {
                this.graphic.drawLine(this.x+xcp1, this.y+ycp1, this.x+x1, this.y+y1, "stroke", null, Color.Green);
                this.graphic.drawLine(this.x+xcp1, this.y+ycp1, this.x+x2, this.y+y2, "stroke", null, Color.Green);

                this.graphic.drawArc(this.x+xcp1, this.y+ycp1, 3, 0, Math.PI * 2, true, "fill", Color.Red);
                this.graphic.drawArc(this.x+x1, this.y+y1, 3, 0, Math.PI * 2, true, "fill", Color.Green);
                this.graphic.drawArc(this.x+x2, this.y+y2, 3, 0, Math.PI * 2, true, "fill", Color.Green);
            }
        }
    }

    public drawQuadraticCurveEx(xFrom:number, yFrom:number, 
            arrPoints:Array<Array<number>>,  //[[xcp1,ycp1,x1,y1],[],...]
            mode:string="stroke", colorFill:Color = null, colorStroke:Color = null) {
        colorFill = colorFill || this.style.fillColor;
        colorStroke = colorStroke || this.style.strokeColor;

        for (let arr of arrPoints) {
            arr[0] += this.x;
            arr[1] += this.y;
            arr[2] += this.x;
            arr[3] += this.y;
        }
        this.graphic.drawQuadraticCurveEx(this.x+xFrom, this.y+yFrom, arrPoints, mode, colorFill, colorStroke);
    }

    public drawCubicCurve(x1:number, y1:number, x2:number, y2:number, 
            xcp1:number, ycp1:number, xcp2:number, ycp2:number,
            mode:string="stroke", colorFill:Color = null, colorStroke:Color = null) {
        colorFill = colorFill || this.style.fillColor;
        colorStroke = colorStroke || this.style.strokeColor;
        this.graphic.drawCubicCurve(this.x+x1, this.y+y1, this.x+x2, this.y+y2, 
            this.x+xcp1, this.y+ycp1, this.x+xcp2, this.y+ycp2, mode, colorFill, colorStroke);

        if (this.debug) {
            if (this.isDebugType(DebugType.Geometry)) {
                this.graphic.drawLine(this.x+xcp1, this.y+ycp1, this.x+x1, this.y+y1, "stroke", null, Color.Green);
                this.graphic.drawLine(this.x+xcp2, this.y+ycp2, this.x+x2, this.y+y2, "stroke", null, Color.Green);

                this.graphic.drawArc(this.x+xcp1, this.y+ycp1, 3, 0, Math.PI * 2, true, "fill", Color.Red);
                this.graphic.drawArc(this.x+xcp2, this.y+ycp2, 3, 0, Math.PI * 2, true, "fill", Color.Red);
                this.graphic.drawArc(this.x+x1, this.y+y1, 3, 0, Math.PI * 2, true, "fill", Color.Green);
                this.graphic.drawArc(this.x+x2, this.y+y2, 3, 0, Math.PI * 2, true, "fill", Color.Green);
            }
        }
    }

    public drawCubicCurveEx(xFrom:number, yFrom:number, 
            arrPoints:Array<Array<number>>,  //[[xcp1,ycp1,xcp2,ycp2,x1,y1],[],...]
            mode:string="stroke", colorFill:Color = null, colorStroke:Color = null) {
        colorFill = colorFill || this.style.fillColor;
        colorStroke = colorStroke || this.style.strokeColor;

        for (let arr of arrPoints) {
            arr[0] += this.x;
            arr[1] += this.y;
            arr[2] += this.x;
            arr[3] += this.y;
            arr[4] += this.x;
            arr[5] += this.y;
        }
        this.graphic.drawCubicCurveEx(this.x+xFrom, this.y+yFrom, arrPoints, mode, colorFill, colorStroke);
    }
}