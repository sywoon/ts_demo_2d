import { Color } from "../../math/Color";

export class UIStyle {
    font: string = "sans-serif";
    fontSize: number = 20;
    fontColor: Color = Color.Black;
    strokeColor: Color = Color.Gray;
    hAlign: string = "left";  //left center right
    vAlign: string = "middle";  //top middle bottom

    toCssStyle(): Object {
        return {
            font: `${this.fontSize}px ${this.font}`,  //"20px sans-serif"
            fillStyle: this.fontColor.toCssColor(),  //"black" rgb(255,0,0) rgba(255,0,0,0.5)
            strokeStyle: this.strokeColor.toCssColor(),
            textAlign: this.hAlign,
            textBaseline: this.vAlign,
        }
    }
}


