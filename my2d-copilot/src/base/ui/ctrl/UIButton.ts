import { UINode } from "./UINode";
import { UILabel } from "./UILabel";
import { Color } from "../../math/Color";
import { GameEvent, MyMouseEvent } from "../../EventDefine";
import { PropertyType, DebugType } from "../UIDefine";

export class UIButton extends UINode {
    label:UILabel;
    strokeColors:Color[] = [Color.Black, Color.Red];
    mouseDown:boolean = false;

    public constructor() {
        super();
        this.debug = DebugType.Origin;

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

        this.graphic.roundRect(_x, _y, this.width, this.height, 10, "fill", Color.Gray);
        // this.graphic.fillRect(_x, _y, this.width, this.height, Color.Gray);

        let color = this.mouseDown ? this.strokeColors[1] : this.strokeColors[0];
        this.graphic.roundRect(_x, _y, this.width, this.height, 10, "stroke", null, color);
        // this.graphic.strokeRect(_x, _y, this.width, this.height, color);

        //先画自己 再画子节点
        super.onRender(x, y);
    }

    public onTouchEvent(evt: MyMouseEvent): boolean {
        let pos = this.globalToLocal(evt.x, evt.y);
        //只有down才做命中测试 捕获控件
        //后续事件move up都只发给它 直到up后才释放控件 或移出浏览器导致up事件丢失
        let hit = undefined;
        if (this.mouseDown && evt.type != GameEvent.MOUSE_DOWN) {
            //当前已经捕获中
        } else {
            if (!this.hitTest(pos.x, pos.y)) {
                this.mouseDown = false;
                return false;
            }
        }

        switch (evt.type) {
            case GameEvent.MOUSE_DOWN:
                this.mouseDown = true;
                // this.label.fontColor = Color.Red;
                break;
            case GameEvent.MOUSE_UP:
                if (hit == undefined) {
                    hit = this.hitTest(pos.x, pos.y);
                }
                this.mouseDown = false;
                // this.label.fontColor = Color.Black;
                break;
            case GameEvent.MOUSE_MOVE:
                break;
            default:
                break;
        }
        this.sendEvent(evt.type, evt.x, evt.y);
        // console.log("UIButton.Touch", hit, evt.type, evt.x, evt.y, pos.x, pos.y)
        
        if (hit && evt.type == GameEvent.MOUSE_UP) {
            console.log("UIButton.CLICK", evt.type, evt.x, evt.y, pos.x, pos.y)
            this.sendEvent(GameEvent.CLICK, evt.x, evt.y, this);
        }
        return true; 
    }
}

 