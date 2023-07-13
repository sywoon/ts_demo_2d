import { UINode } from "./UINode";

export class UILable extends UINode {
    text: string = "";
    style: any = {
        fillStyle: "red",
        strokeStyle: "green",
        font: "20px sans-serif",
        textBaseline: "middle",
        textAlign: "center",
    };

    public constructor() {
        super();
    }

    setStyle(status: any): void {
        let style = this.style;
        status["fillStyle"] ? style.fillStyle = status["fillStyle"] : null;  //red rgb(200,0,0) 画文字 矩形
        status["font"] ? style.font = status["font"] : null;  //"20px sans-serif"
        status["textBaseline"] ? style.textBaseline = status["textBaseline"] : null;  //top middle bottom
        status["textAlign"] ? style.textAlign = status["textAlign"] : null;  //left center right
    }

    public onRender(x:number, y:number): void {
        this.graphic.saveStyle();
        this.graphic.setStyle(this.style);
        this.graphic.drawText(this.text, this.x+x, this.y+y);
        this.graphic.restoreStyle();
    }
}

