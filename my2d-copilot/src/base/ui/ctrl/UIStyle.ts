import { Color } from "../../math/Color";

//定义所有属性 没有值 具体由子类决定
export class UIStyle {
    font: string;
    fontSize: number;
    fillColor: Color;  //填充矩形 "black" rgb(255,0,0) rgba(255,0,0,0.5)
    strokeColor: Color; //画矩形框 
    hAlign: string;  //left center right
    vAlign: string;  //top middle bottom

    toCssStyle(): Object {
        return {};
    }
}

//css3 color: https://www.w3.org/TR/css-color-3/
//颜色工具：https://tool.oschina.net/commons?type=3
export class UILabelStyle extends UIStyle {
    constructor() {
        super();
        this.font = "sans-serif";
        this.fontSize = 20;
        this.fillColor = Color.Black; //独立文字颜色 虽然canvas实现时 还是转换为fillStyle
        this.strokeColor = Color.Black; //画矩形框
        this.hAlign = "left";  //left center right
        this.vAlign = "middle";  //top middle bottom
    }

    toCssStyle(): Object {
        return {
            font: `${this.fontSize}px ${this.font}`,  //"20px sans-serif"
            fillStyle : this.fillColor.toCssColor(),
            strokeStyle: this.strokeColor.toCssColor(),
            textAlign: this.hAlign,
            textBaseline: this.vAlign,
        }
    }
}

export class UIInputStyle extends UILabelStyle {
    type: string = "text"; //text password
    mutiLine: boolean = false;
    maxLength: number = 999;
}

export class UIGeometryStyle extends UIStyle {
    lineWidth: number = 1;
    lineCap: string = "butt"; //butt round square
    lineJoin: string = "miter"; //bevel round miter

    constructor() {
        super();
        this.fillColor = Color.Black; //独立文字颜色 虽然canvas实现时 还是转换为fillStyle
        this.strokeColor = Color.Black; //画矩形框
    }

    toCssStyle(): Object {
        return {
            fillStyle : this.fillColor.toCssColor(),
            strokeStyle: this.strokeColor.toCssColor(),
        }
    }
}