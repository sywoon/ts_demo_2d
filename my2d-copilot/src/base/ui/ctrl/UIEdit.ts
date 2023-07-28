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

    private _inputEvents: any = {};
    private _focus: boolean = false;

    public constructor() {
        super();
        this.width = 100;
        this.height = 50;
        this.setInteractAble(true);

        let label = new UILabel();
        this.label = label;
        this.addChild(this.label);
        label.debug = 0;
        label.hAlign = "left";
        label.vAlign = "top";
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

    public onCreate(): void {
        super.onCreate();
        this._inputEvents = {
            'change' : (v:InputEvent) => {
                console.log('The input has changed', v);
            },
            'input' : (v:InputEvent) => {
                console.log('The input is being changed', v);
                this.text = this.input.value;
            },
            'focus' : () => {
                console.log('The input got focus');
            },
            'blur' : () => {
                console.log('The input lost focus');
            },
            'keydown' : (v:KeyboardEvent) => {
                console.log('A key was pressed down', v);
                if (v.key == 'Enter') {
                    this.appRoot.inputBlur(this);
                }
            },
            'select' : (v:any) => {
                console.log('Some text was selected', v);
            },
        };

        
    }

    public onDestroy(): void {
        super.onDestroy();
        this._unregisterEvent();
        this._inputEvents = {};
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
        this.input.focus();
        this.input.type = this.style.type;
        this.input.maxLength = this.style.maxLength;
        this.input.value = this.text;
        this._registerEvent();
    }

    public onBlur(): void {
        this._focus = false;
        this.input.blur();
        this._unregisterEvent();
    }

    private _registerEvent(): void {
        let input = this.input;
        let events = this._inputEvents;
        // 当输入框的内容改变，并且失去焦点时，会触发这个事件
        input.addEventListener('change', events['change']);

        // 当输入框的内容改变时，无论是否失去焦点，都会触发这个事件
        input.addEventListener('input', events['input']);

        // 当输入框获得焦点时，会触发这个事件
        input.addEventListener('focus', events['focus']);

        // 当输入框失去焦点时，会触发这个事件
        input.addEventListener('blur', events['blur']);

        // 当用户在输入框中按下一个键时，会触发这个事件
        input.addEventListener('keydown', events['keydown']);

        // 当用户在输入框中选择一段文本时，会触发这个事件
        input.addEventListener('select', events['select']);
    }

    private _unregisterEvent(): void {
        let input = this.input;
        let events = this._inputEvents;
        // 当输入框的内容改变，并且失去焦点时，会触发这个事件
        input.removeEventListener('change', events['change']);

        // 当输入框的内容改变时，无论是否失去焦点，都会触发这个事件
        input.removeEventListener('input', events['input']);

        // 当输入框获得焦点时，会触发这个事件
        input.removeEventListener('focus', events['focus']);

        // 当输入框失去焦点时，会触发这个事件
        input.removeEventListener('blur', events['blur']);

        // 当用户在输入框中按下一个键时，会触发这个事件
        input.removeEventListener('keydown', events['keydown']);

        // 当用户在输入框中选择一段文本时，会触发这个事件
        input.removeEventListener('select', events['select']);
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