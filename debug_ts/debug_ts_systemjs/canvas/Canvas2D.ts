export class Canvas2D {
    public context: CanvasRenderingContext2D | null;

    constructor(canvas: HTMLCanvasElement) {
        this.context = canvas.getContext("2d");
    }

    drawText(text: string) : void {
        if (this.context === null) {
            alert("2d context is null");
            return;
        }

        this.context.save();
        this.context.textBaseline = "middle";
        this.context.textAlign = "center";

        let centerX: number = this.context.canvas.width * 0.5;
        let centerY: number = this.context.canvas.height * 0.5;
        this.context.fillText(text, centerX, centerY);
        this.context.strokeStyle = "green";  //绿色描边
        this.context.strokeText(text, centerX, centerY);
        this.context.restore();
    }
}