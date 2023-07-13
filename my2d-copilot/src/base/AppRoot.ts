import { Size } from "../Size";
import { Canvas2D } from "./Canvas2D";
import { Graphic } from "./Graphic";
import { UIMgr } from "./ui/UIMgr";

export class AppRoot {
    canvas2d: Canvas2D;
    graphic: Graphic;
    uimgr: UIMgr;

    public static instance: AppRoot = null;  //基类中实例化
    public static getInstance(): AppRoot {
        return AppRoot.instance;
    }

    public constructor() {
        let canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
        this.canvas2d = new Canvas2D(canvas);

        this.graphic = new Graphic(this.canvas2d);
        this.uimgr = new UIMgr();
    }

    public getCanvasSize(): Size {
        return this.canvas2d.size;
    }
}