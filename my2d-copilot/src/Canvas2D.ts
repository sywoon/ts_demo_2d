import { Size } from "./Size";

export class Canvas2D {
    //声明public访问级别的成员变量
    public context: CanvasRenderingContext2D;
    public size: Size = new Size();

    // public访问级别的构造函数
    public constructor(canvas: HTMLCanvasElement) {
        this.context = canvas.getContext("2d");
        this.size.width = canvas.width;
        this.size.height = canvas.height;

        this.context.imageSmoothingEnabled = true; //启用平滑处理，以减少锯齿效果 实践没区别

        this.setStatus({
            fillStyle : "white",
            strokeStyle : "black",
            font : "24px sans-serif",
            textBaseline : "middle",
            textAlign : "left"
        
        })
    }

    public setStatus(status: any): void {
        if (this.context === null) return;

        let ctx = this.context;
        status["fillStyle"] ? ctx.fillStyle = status["fillStyle"] : null;  //red rgb(200,0,0)
        status["font"] ? ctx.font = status["font"] : null;  //"20px sans-serif"
        status["textBaseline"] ? ctx.textBaseline = status["textBaseline"] : null;  //top middle bottom
        status["textAlign"] ? ctx.textAlign = status["textAlign"] : null;  //left center right
    }

    public save(): void {
        if (this.context === null) return;
        this.context.save();
    }

    public restore(): void {
        if (this.context === null) return;
        this.context.restore();
    }

    // public访问级别的成员函数
    public drawText(text: string, x:number, y:number): void {
        if (this.context === null) return;
        let ctx = this.context;

        //调用文字填充命令
        ctx.fillText(text, x, y);
        //调用文字描边命令
        ctx.strokeText(text, x, y);
    }
}
