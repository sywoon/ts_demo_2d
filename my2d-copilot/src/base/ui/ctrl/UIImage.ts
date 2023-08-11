import { Rect } from "../../math/Rect";
import { Size } from "../../math/Size";
import { Vec2 } from "../../math/Vec2";
import { PropertyType } from "../UIDefine";
import { UINode } from "./UINode";


export class UIImage extends UINode {
    imgHtml: HTMLImageElement;

    private _path: string;
    private _mode: string;  //normal cut
    private _cutRect: Rect;

    set src(path:string) {
        if (this.imgHtml == null) {
            this.imgHtml = new Image();
            this.imgHtml.onload = ()=>{
                this._onImageReady();
            }
        }
        this._path = path;
        this.imgHtml.src = path;
    }

    constructor() {
        super();
        this.width = 0;
        this.height = 0;
        this._mode = "normal";
    }

    setCutRect(x:number, y:number, w:number, h:number) {
        if (this._cutRect == null) {
            this._cutRect = new Rect();
        }
        this._cutRect.set(x, y, w, h);
        this._mode = "cut";
    }

    private _onImageReady() {
        if (this.width == 0) {
            this.width = this.imgHtml.width;
        }

        if (this.height == 0) {
            this.height = this.imgHtml.height;
        }
        this.setImageReady(true);
    }


    public setImageReady(v:boolean): void {
        if (v) {
            this._property = this._property | PropertyType.Enable;
        } else {
            this._property = this._property & ~PropertyType.Enable;
        }
    }

    public isImageReady(): boolean {
        return (this._property & PropertyType.Enable) > 0;
    }

    public onRender(x: number, y: number): void {
        if (this.width == 0 || this.height == 0)
            return;
        super.onRender(x, y);
        if (!this.isImageReady)
            return;

        if (this._mode == "normal") {
            this.graphic.drawImage(this.imgHtml, this.x+x, this.y+y, this.width, this.height);
        } else if (this._mode == "cut") {
            let cut = this._cutRect;
            this.graphic.drawImageEx(this.imgHtml, cut.x, cut.y, cut.width, cut.height,
                this.x+x, this.y+y, this.width, this.height);
        }
    }
}