import { Canvas2D } from "./Canvas2D";

console.log("hello world");

let canvas: HTMLCanvasElement | null = document.getElementById(
    "canvas"
) as HTMLCanvasElement;
if (canvas === null) {
    alert("无法获取HTMLCanvasElement !!! ");
    throw new Error("无法获取HTMLCanvasElement !!! ");
}

let canvas2d: Canvas2D = new Canvas2D(canvas);

//计算canvas的中心坐标
let size = canvas2d.size;

{
    //test1 text
    canvas2d.save();
    canvas2d.setStatus({
        fillStyle: "red",
        strokeStyle: "green",
        font: "20px sans-serif",
        textBaseline: "middle",
        textAlign: "center",
    });
    let centerX: number = size.width * 0.5;
    let centerY: number = size.height * 0.5;
    canvas2d.drawText("你好，世界！ Hello World!", centerX, centerY);
    canvas2d.restore();
}

{
    //test2 rect
    canvas2d.save();
    canvas2d.setStatus({
        fillStyle: "rgb(200,0,0)",
    });
    canvas2d.context.fillRect(10, 10, 55, 50);

    canvas2d.setStatus({
        fillStyle: "rgba(0, 0, 200, 0.5)",
    });
    canvas2d.context.fillRect(30, 30, 55, 50);
    canvas2d.restore();
}
