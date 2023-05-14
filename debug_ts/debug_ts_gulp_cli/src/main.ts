// class Canvas2DUtil {
//     public context: CanvasRenderingContext2D | null;

//     constructor(canvas: HTMLCanvasElement) {
//         this.context = canvas.getContext("2d");
//     }

//     drawText(text: string) : void {
//         if (this.context === null) {
//             alert("2d context is null");
//             return;
//         }

//         this.context.save();
//         this.context.textBaseline = "middle";
//         this.context.textAlign = "center";

//         let centerX: number = this.context.canvas.width * 0.5;
//         let centerY: number = this.context.canvas.height * 0.5;
//         this.context.fillText(text, centerX, centerY);
//         this.context.strokeStyle = "green";  //绿色描边
//         this.context.strokeText(text, centerX, centerY);
//         this.context.restore();
//     }
// }

import { Canvas2D } from "./Canvas2D"

let canvas: HTMLCanvasElement | null = document.getElementById("canvas") as HTMLCanvasElement;
if (canvas === null) {
    alert("can not get HTMLCanvasElement");
    throw new Error("can not get HTMLCanvasElement");
}

// let canvas2d: Canvas2DUtil = new Canvas2DUtil(canvas);
let canvas2d: Canvas2D = new Canvas2D(canvas);
canvas2d.drawText("hello webpack from Module");