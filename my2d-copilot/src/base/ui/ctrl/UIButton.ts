import { UINode } from "./UINode";
import { UILabel } from "./UILabel";
import { Color } from "../../math/Color";
import { GameEvent, MyMouseEvent } from "../../EventDefine";
import { PropertyType, DebugType } from "../UIDefine";

export class UIButton extends UINode {
    label:UILabel;
    strokeColors:Color[] = [Color.Black, Color.Red];
    isMouseDown:boolean = false;
    roundCorner:boolean = true;

    public constructor() {
        super();
        this.debug = DebugType.Origin;

        this.width = 100;
        this.height = 50;
        this.setActive(true);

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

        let color = this.isMouseDown ? this.strokeColors[1] : this.strokeColors[0];
        if (this.roundCorner) {
            this.graphic.roundRect(_x, _y, this.width, this.height, 10, "fill", Color.Gray);
            this.graphic.roundRect(_x, _y, this.width, this.height, 10, "stroke", null, color);
        } else {
            this.graphic.fillRect(_x, _y, this.width, this.height, Color.Gray);
            this.graphic.strokeRect(_x, _y, this.width, this.height, color);
        }

        //先画自己 再画子节点
        super.onRender(x, y);
    }
}

 