import { UINode } from "./UINode";
import { UILabel } from "./UILabel";
import { Color } from "../../math/Color";
import { GameEvent, MyMouseEvent } from "../../EventDefine";

export class UIButton extends UINode {
    label:UILabel;

    public constructor() {
        super();
        this.width = 100;
        this.height = 50;
        this.setInteractAble(true);

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

    protected onSizeChanged(): void {
    }

    public onRender(x:number, y:number): void {
        let _x = x + this.x;  //不能修改x的值 需要上传
        let _y = y + this.y;
        this.graphic.fillRect(_x, _y, this.width, this.height, Color.Gray);
        this.graphic.strokeRect(_x, _y, this.width, this.height, Color.Black);

        //先画自己 再画子节点
        super.onRender(x, y);
    }

    public onTouchEvent(evt: MyMouseEvent): boolean {
        let pos = this.globalToLocal(evt.x, evt.y);
        if (!this.hitTest(pos.x, pos.y))
            return false;

        switch (evt.type) {
            case GameEvent.MOUSE_DOWN:
                this.label.fontColor = Color.Red;
                break;
            case GameEvent.MOUSE_UP:
                this.label.fontColor = Color.Black;
                break;
            default:
                break;
        }
        this.sendEvent(evt.type, evt.x, evt.y);
        console.log("UIButton.onTouchEvent", evt.type, evt.x, evt.y, pos.x, pos.y)
        
        if (evt.type == GameEvent.MOUSE_UP) {
            this.sendEvent(GameEvent.CLICK, evt.x, evt.y);
        }
        return true; 
    }
}

 