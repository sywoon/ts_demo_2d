import { Rect } from "../../math/Rect";
import { Size } from "../../math/Size";
import { Vec2 } from "../../math/Vec2";
import { PropertyType } from "../UIDefine";
import { UINode } from "./UINode";

//9宫格数据
class NineGrid {
    //图片 用于渲染源头 用4个点形成4条竖线 划分为9块区域
    //[x0,y0]左上原点 [x1,y1] [x2,y2]对应左上和右下的分割点 [x3,y3]右下点
    //注意：若启用裁剪 可能是图片的一部分 一般用于合图
    sw:number;
    sh:number;
    sx0:number;
    sy0:number;
    sx1:number;
    sy1:number;
    sx2:number;
    sy2:number;
    sx3:number;
    sy3:number;

    //图片 渲染目标的 大小同控件本身 4个角大小同源头 中间和4边拉长
    dw:number;
    dh:number;
    dx0:number;
    dy0:number;
    dx1:number;
    dy1:number;
    dx2:number;
    dy2:number;
    dx3:number;
    dy3:number;
}

export class UIImage extends UINode {
    imgHtml: HTMLImageElement;

    private _path: string;
    private _cutRect: Rect;
    private _nineRect: Rect;
    private _nineGrid: NineGrid;

    set src(path:string) {
        if (this.imgHtml == null) {
            this.imgHtml = new Image();
            this.imgHtml.onload = ()=>{
                this._onImageReady();
            }
            this.imgHtml.onerror = ()=>{
                console.error("load image error: " + path);
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

    onSizeChanged() {
        super.onSizeChanged();
        this.timer.callLater(this._parseNineGrid, this);
    }

    setCutRect(x:number, y:number, w:number, h:number) {
        if (this._cutRect == null) {
            this._cutRect = new Rect();
        }
        this._cutRect.set(x, y, w, h);
    }

    //对应原头图片的中间区域 四个角+四条边 共形成9宫格
    setNineRect(x:number, y:number, w:number, h:number) {
        if (this._nineRect == null) {
            this._nineRect = new Rect();
        }
        this._nineRect.set(x, y, w, h);
        this.timer.callLater(this._parseNineGrid, this);
    }

    private _parseNineGrid(): void {
        if (!this._nineRect || !this.isImageReady())
            return;

        if (this._nineGrid == null) {
            this._nineGrid = new NineGrid();
        }

        let cutRect = this._cutRect;
        let nineRect = this._nineRect;  //基于原始图片的划分区域
        let grid = this._nineGrid;

        let w = cutRect ? cutRect.width : this.originWidth;
        let h = cutRect ? cutRect.height : this.originHeight;

        grid.sw = w;
        grid.sh = h;
        grid.sx0 = cutRect ? cutRect.x : 0;
        grid.sy0 = cutRect ? cutRect.y : 0;
        grid.sx1 = grid.sx0 + nineRect.x;
        grid.sy1 = grid.sy0 + nineRect.y;
        grid.sx2 = grid.sx1 + nineRect.width;  //图片起点+左边宽度+中间宽度
        grid.sy2 = grid.sy1 + nineRect.height;
        grid.sx3 = grid.sx0 + w;
        grid.sy3 = grid.sy0 + h;

        grid.dw = this.width;
        grid.dh = this.height;
        grid.dx0 = this.x;
        grid.dy0 = this.y;
        grid.dx1 = this.x + nineRect.x;  //左上角的大小同源头9宫格的左上角
        grid.dy1 = this.y + nineRect.y;
        grid.dx2 = grid.dx0 + grid.dw - (w - nineRect.x - nineRect.width);
        grid.dy2 = grid.dy0 + grid.dh - (h - nineRect.y - nineRect.height);
        grid.dx3 = grid.dx0 + grid.dw;
        grid.dy3 = grid.dy0 + grid.dh;
    }

    private _onImageReady() {
        if (this.width == 0) {
            this.width = this.imgHtml.width;
        }

        if (this.height == 0) {
            this.height = this.imgHtml.height;
        }
        this.setImageReady(true);
        this.timer.callLater(this._parseNineGrid, this);

        if (this._nineRect) {
            let rect = this._nineRect;
            if (rect.x <= 0 || rect.y <= 0 || (rect.x+rect.width) >= this.originWidth 
                || (rect.y+rect.height) >= this.originHeight) {
                console.error("setNineRect error size", rect, this.originWidth, this.originWidth);
                this._nineRect = null;
            }
        }
    }


    public setImageReady(v:boolean): void {
        this.setProperty(PropertyType.ImgReady, v);
    }

    public isImageReady(): boolean {
        return this.hasProperty(PropertyType.ImgReady);
    }

    public onRender(x: number, y: number): void {
        if (this.width == 0 || this.height == 0)
            return;
        super.onRender(x, y);
        if (!this.isImageReady())
            return;

        if (this._nineRect) {
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
        let grid = this._nineGrid;

        {  //左上
            let sx = grid.sx0;
            let sy = grid.sy0;
            let sw = grid.sx1 - grid.sx0;
            let sh = grid.sy1 - grid.sy0;
            let dx = grid.dx0 + x;
            let dy = grid.dy0 + y;
            let dw = grid.dx1 - grid.dx0;
            let dh = grid.dy1 - grid.dy0;
            this.graphic.drawImageEx(this.imgHtml, sx, sy, sw, sh, dx, dy, dw, dh);
        }

        {  //右上
            let sx = grid.sx2;
            let sy = grid.sy0;
            let sw = grid.sx3 - grid.sx2;
            let sh = grid.sy1 - grid.sy0;
            let dx = grid.dx2 + x;
            let dy = grid.dy0 + y;
            let dw = grid.dx3 - grid.dx2;
            let dh = grid.dy1 - grid.dy0;
            this.graphic.drawImageEx(this.imgHtml, sx, sy, sw, sh, dx, dy, dw, dh);
        }

        {  //左下
            let sx = grid.sx0;
            let sy = grid.sy2;
            let sw = grid.sx1 - grid.sx0;
            let sh = grid.sy3 - grid.sy2;
            let dx = grid.dx0 + x;
            let dy = grid.dy2 + y;
            let dw = grid.dx1 - grid.dx0;
            let dh = grid.dy3 - grid.dy2;
            this.graphic.drawImageEx(this.imgHtml, sx, sy, sw, sh, dx, dy, dw, dh);
        }

        {  //右下
            let sx = grid.sx2;
            let sy = grid.sy2;
            let sw = grid.sx3 - grid.sx2;
            let sh = grid.sy3 - grid.sy2;
            let dx = grid.dx2 + x;
            let dy = grid.dy2 + y;
            let dw = grid.dx3 - grid.dx2;
            let dh = grid.dy3 - grid.dy2;
            this.graphic.drawImageEx(this.imgHtml, sx, sy, sw, sh, dx, dy, dw, dh);
        }

        {  //上中
            let sx = grid.sx1;
            let sy = grid.sy0;
            let sw = grid.sx2 - grid.sx1;
            let sh = grid.sy1 - grid.sy0;
            let dx = grid.dx1 + x;
            let dy = grid.dy0 + y;
            let dw = grid.dx2 - grid.dx1;
            let dh = grid.dy1 - grid.dy0;
            this.graphic.drawImageEx(this.imgHtml, sx, sy, sw, sh, dx, dy, dw, dh);
        }

        {  //下中
            let sx = grid.sx1;
            let sy = grid.sy2;
            let sw = grid.sx2 - grid.sx1;
            let sh = grid.sy3 - grid.sy2;
            let dx = grid.dx1 + x;
            let dy = grid.dy2 + y;
            let dw = grid.dx2 - grid.dx1;
            let dh = grid.dy3 - grid.dy2;
            this.graphic.drawImageEx(this.imgHtml, sx, sy, sw, sh, dx, dy, dw, dh);
        }

        {  //左中
            let sx = grid.sx0;
            let sy = grid.sy1;
            let sw = grid.sx1 - grid.sx0;
            let sh = grid.sy2 - grid.sy1;
            let dx = grid.dx0 + x;
            let dy = grid.dy1 + y;
            let dw = grid.dx1 - grid.dx0;
            let dh = grid.dy2 - grid.dy1;
            this.graphic.drawImageEx(this.imgHtml, sx, sy, sw, sh, dx, dy, dw, dh);
        }

        {  //右中
            let sx = grid.sx2;
            let sy = grid.sy1;
            let sw = grid.sx3 - grid.sx2;
            let sh = grid.sy2 - grid.sy1;
            let dx = grid.dx2 + x;
            let dy = grid.dy1 + y;
            let dw = grid.dx3 - grid.dx2;
            let dh = grid.dy2 - grid.dy1;
            this.graphic.drawImageEx(this.imgHtml, sx, sy, sw, sh, dx, dy, dw, dh);
        }

        {  //中
            let sx = grid.sx1;
            let sy = grid.sy1;
            let sw = grid.sx2 - grid.sx1;
            let sh = grid.sy2 - grid.sy1;
            let dx = grid.dx1 + x;
            let dy = grid.dy1 + y;
            let dw = grid.dx2 - grid.dx1;
            let dh = grid.dy2 - grid.dy1;
            this.graphic.drawImageEx(this.imgHtml, sx, sy, sw, sh, dx, dy, dw, dh);
        }
    }
}