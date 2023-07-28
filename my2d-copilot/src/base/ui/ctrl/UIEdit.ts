import { AppRoot } from "../../AppRoot";
import { GameEvent, MyMouseEvent } from "../../EventDefine";
import { Color } from "../../math/Color";
import { UILabel } from "./UILabel";
import { UINode } from "./UINode";
import { UIInputStyle } from "./UIStyle";

export class UIEdit extends UINode {
    input: HTMLInputElement = AppRoot.getInstance().inputElement;
    style: UIInputStyle = new UIInputStyle();
    label: UILabel;
    strokeColors:Color[] = [Color.Black, Color.Red];

    private _focus: boolean = false;

    public constructor() {
        super();
        this.width = 120;
        this.height = 40;
        this.setInteractAble(true);

        let label = new UILabel();
        this.label = label;
        this.addChild(this.label);
        label.debug = 0;
        label.hAlign = "left";
        label.vAlign = "top";
        label.onEvent(GameEvent.RESIZE, this._onLabelResize, this);
    }

    set text(v: string) {
        this.label.text = v;
    }
    get text(): string {
        return this.label.text;
    }

    //text password
    set type(v: string) {
        this.style.type = v;
        this.input.type = v;
    }

    private _onLabelResize(width:number, height:number):void {
        let x = (this.width - width) / 2;
        let y = (this.height - height) / 2;

        //单行居中
        if (!this.style.mutiLine) {
            let pt = this.label.adjustByAlign(0, 0);
            // this.label.x = x - pt.x;
            this.label.y = y - pt.y;
        }
    }

    public onCreate(): void {
        super.onCreate();
    }

    public onDestroy(): void {
        super.onDestroy();
    }

    public onTouchEvent(evt: MyMouseEvent): boolean {
        let pos = this.globalToLocal(evt.x, evt.y);
        //只有down才做命中测试 捕获控件
        //后续事件move up都只发给它 直到up后才释放控件 或移出浏览器导致up事件丢失
        if (!this.hitTest(pos.x, pos.y)) {
            return false;
        }

        switch (evt.type) {
            case GameEvent.MOUSE_DOWN:
                break;
            case GameEvent.MOUSE_UP:
                this.appRoot.inputFocus(this);
                break;
            case GameEvent.MOUSE_MOVE:
                break;
            default:
                break;
        }
        return true; 
    }

    public onFocus(): void {
        this._focus = true;
        this.input.type = this.style.type;
        this.input.maxLength = this.style.maxLength;
        this.input.value = this.text;
        this.input.focus();
    }

    public onBlur(): void {
        this._focus = false;
        this.input.blur();
    }

    public onInputEvent(type:string, evt:Event) {
        switch (type) {
            case "change":
                this.text = this.input.value;
                break;
            case "input":
                this.text = this.input.value;
                break;
            case "focus":
                break;
            case "blur":
                break;
            case "keydown":
                {
                    let e = evt as KeyboardEvent;
                    if (e.code == "Enter") {
                        this.appRoot.inputFocus(this);
                    }
                }
                break;
            case "select":
                break;
        }
    }

    public onRender(x:number, y:number): void {
        let _x = x + this.x;  //不能修改x的值 需要上传
        let _y = y + this.y;

        this.graphic.fillRect(_x, _y, this.width, this.height, Color.Gray);
        let color = this._focus ? this.strokeColors[1] : this.strokeColors[0];
        this.graphic.strokeRect(_x, _y, this.width, this.height, color);

        //先画自己 再画子节点
        super.onRender(x, y);
    }
}