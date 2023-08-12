import { UINode } from "./UINode";
import { UILabel } from "./UILabel";
import { Color } from "../../math/Color";
import { GameEvent, MyMouseEvent } from "../../EventDefine";
import { PropertyType, DebugType } from "../UIDefine";
import { UIProgressStyle } from "./UIStyle";

export class UIProgress extends UINode {
    label:UILabel;
    style: UIProgressStyle = new UIProgressStyle();
    private _progress:number;

    set bgColor(color:Color) {
        this.style.bgColor = color;
    }

    set proColor(color:Color) {
        this.style.proColor = color;
    }

    //0-1
    set progress(v:number) {
        v = Math.max(0, Math.min(1, v));
        this._progress = v;
        this.label.text = Math.floor(v * 100) + "%";
    }

    get progress():number {
        return this._progress;
    }

    public constructor() {
        super();
        this.debug = DebugType.Origin;

        this.label = new UILabel();
        this.addChild(this.label);
        this.label.hAlign = "center";
        this.label.onEvent(GameEvent.RESIZE, this._onLabelResize, this);
    }

    set text(text:string) {
        this.label.text = text;
    }

    get text():string {
        return this.label.text;
    }

    private _onLabelResize(width:number, height:number):void {
        let x = (this.width - width) / 2;
        let y = (this.height - height) / 2;

        let pt = this.label.adjustByAlign(0, 0);
        this.label.x = x - pt.x;
        this.label.y = y - pt.y;
    }

    public onRender(x:number, y:number): void {
        if (!this.isVisible())
            return;

        this.label.fontColor = this.isActive() ? Color.Black : Color.Silver;
            
        let _x = x + this.x;  //不能修改x的值 需要上传
        let _y = y + this.y;

        this.graphic.fillRect(_x, _y, this.width, this.height, this.style.bgColor);

        let w = this.width * this._progress;
        this.graphic.fillRect(_x, _y, w, this.height, this.style.proColor);
    }
}