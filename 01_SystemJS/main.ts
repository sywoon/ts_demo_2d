import { Canvas2D } from "./Canvas2D.js"

let canvas: HTMLCanvasElement | null = document.getElementById( 'canvas' ) as HTMLCanvasElement;
if ( canvas === null ) {
    alert( "无法获取HTMLCanvasElement !!! " );
    throw new Error( "无法获取HTMLCanvasElement !!! " );
}

let canvas2d: Canvas2D = new Canvas2D( canvas );
canvas2d.drawText("Hello World");