import { Canvas2D } from "./Canvas2D"

let canvas: HTMLCanvasElement | null = document.getElementById( 'canvas' ) as HTMLCanvasElement;
if ( canvas === null ) {
    alert( "无法获取HTMLCanvasElement !!! " );
    throw new Error( "无法获取HTMLCanvasElement !!! " );
}

let canvas2d: Canvas2D = new Canvas2D( canvas );
canvas2d.drawText("Hello World");

//import { Canvas3D } from "./Canvas3D"
let canvas3d: Canvas3D = new Canvas3D( canvas );
canvas3d.drawText("Hello World");