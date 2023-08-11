import { Rect } from "../../math/Rect";
import { Size } from "../../math/Size";
import { Vec2 } from "../../math/Vec2";
import { PropertyType } from "../UIDefine";
import { UINode } from "./UINode";


export class UIImage extends UINode {
    imgHtml: HTMLImageElement;

    private _path: string;
    private _cutRect: Rect;
    private _ningRect: Rect;

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

    get originWidth(): number {
        if (!this.imgHtml || !this.isImageReady())
            return 0;

        return this.imgHtml.width;
    }

    get originHeight(): number {
        if (!this.imgHtml || !this.isImageReady())
            return 0;

        return this.imgHtml.height;
    }

    constructor() {
        super();
        this.width = 0;
        this.height = 0;
    }

    setCutRect(x:number, y:number, w:number, h:number) {
        if (this._cutRect == null) {
            this._cutRect = new Rect();
        }
        this._cutRect.set(x, y, w, h);
    }

    //对应原头图片的中间区域 四个角+四条边 共形成9宫格
    setNineRect(x:number, y:number, w:number, h:number) {
        if (this._ningRect == null) {
            this._ningRect = new Rect();
        }
        this._ningRect.set(x, y, w, h);
    }

    private _onImageReady() {
        if (this.width == 0) {
            this.width = this.imgHtml.width;
        }

        if (this.height == 0) {
            this.height = this.imgHtml.height;
        }
        this.setImageReady(true);

        if (this._ningRect) {
            let rect = this._ningRect;
            if (rect.x <= 0 || rect.y <= 0 || (rect.x+rect.width) >= this.originWidth 
                || (rect.y+rect.height) >= this.originHeight) {
                console.error("setNineRect error size", rect, this.originWidth, this.originWidth);
                return;
            }
        }
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

        if (this._ningRect) {
            this._renderNine(x, y);
            return;
        }

        if (this._cutRect) {
            let cut = this._cutRect;
            this.graphic.drawImageEx(this.imgHtml, cut.x, cut.y, cut.width, cut.height,
                            this.x+x, this.y+y, this.width, this.height);
        } else {
            this.graphic.drawImage(this.imgHtml, this.x+x, this.y+y, this.width, this.height);
        }
    }

    private _renderNine(x: number, y: number): void {
        let cutRect = this._cutRect;
        let w = cutRect ? cutRect.width : this.originWidth;
        let h = cutRect ? cutRect.height : this.originHeight;

        {  //左上
            let sx = cutRect ? cutRect.x : 0;
            let sy = cutRect ? cutRect.y : 0;
            let sw = this._ningRect.x;
            let sh = this._ningRect.y;
            let dx = this.x + x;
            let dy = this.y + y;
            let dw = sw;
            let dh = sh;
            this.graphic.drawImageEx(this.imgHtml, sx, sy, sw, sh, dx, dy, dw, dh);
        }

        {  //右上
            let sx = (cutRect ? cutRect.x : 0) + this._ningRect.x + this._ningRect.width;
            let sy = cutRect ? cutRect.y : 0;
            let sw = w - this._ningRect.x - this._ningRect.width;
            let sh = this._ningRect.y;
            let dx = this.x + x + this.width - sw;
            let dy = this.y + y;
            let dw = sw;
            let dh = sh;
            this.graphic.drawImageEx(this.imgHtml, sx, sy, sw, sh, dx, dy, dw, dh);
        }

        {  //左下
            let sx = cutRect ? cutRect.x : 0;
            let sy = (cutRect ? cutRect.y : 0) + this._ningRect.y + this._ningRect.height;
            let sw = this._ningRect.x;
            let sh = h - this._ningRect.y - this._ningRect.height;
            let dx = this.x + x;
            let dy = this.y + y + this.height - sh;
            let dw = sw;
            let dh = sh;
            this.graphic.drawImageEx(this.imgHtml, sx, sy, sw, sh, dx, dy, dw, dh);
        }

        {  //右下
            let sx = (cutRect ? cutRect.x : 0) + this._ningRect.x + this._ningRect.width;
            let sy = (cutRect ? cutRect.y : 0) + this._ningRect.y + this._ningRect.height;
            let sw = w - this._ningRect.x - this._ningRect.width;
            let sh = h - this._ningRect.y - this._ningRect.height;
            let dx = this.x + x + this.width - sw;
            let dy = this.y + y + this.height - sh;
            let dw = sw;
            let dh = sh;
            this.graphic.drawImageEx(this.imgHtml, sx, sy, sw, sh, dx, dy, dw, dh);
        }

        {  //上中
            // let sx = (cutRect ? cutRect.x : 0) + this._ningRect.x;
            // let sy = cutRect ? cutRect.y : 0;
            // let sw = this._ningRect.width;
            // let sh = this._ningRect.y;
            // let dx = this.x + x + this._ningRect.x;
            // let dy = this.y + y;
            // let dw = this.width - this._ningRect.x;
            // let dh = sh;
            // this.graphic.drawImageEx(this.imgHtml, sx, sy, sw, sh, dx, dy, dw, dh);
        }
    }
}