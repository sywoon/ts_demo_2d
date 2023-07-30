import { AppRoot } from "../AppRoot";
import { UINode } from "./ctrl/UINode";
import { UIButton } from "./ctrl/UIButton";
import { GameEvent } from "../EventDefine";
import { Color } from "../math/Color";

export class ViewBase extends UINode {
    uiName:string;
    config: any;
    bgColor: Color = new Color(0.8, 0.8, 0.8, 1);
    hasCloseBtn:boolean = true;

    get gameApp(): any {
        return AppRoot.instance;
    }

    get uimgr(): any {
        return AppRoot.instance.uimgr;
    }

    public constructor() {
        super();
        this.setInteractAble(true);  //接收鼠标事件  防止透到下一层
    }

    
    //创建时调用 此时子控件和ui配置还未加载
    public onCreate(...args:any[]): void {
        let size = this.gameApp.getCanvasSize();
        this.width = size.width;
        this.height = size.height;

        if (this.hasCloseBtn) {
            let btn = new UIButton();
            this.addChild(btn);
            btn.width = 30;
            btn.height = 30;
            btn.text = "X";
            btn.x = this.width - btn.width;
            btn.y = 0;
            btn.onEvent(GameEvent.CLICK, this.onBtnClose, this);
        }
    }

    //控件层没有update功能 只有render
    public onUpdate(): void {}

    onRender(x: number, y: number): void {
        this.graphic.fillRect(this.x+x, this.y+y, this.width, this.height, this.bgColor);

        super.onRender(x, y);
    }

    protected onBtnClose(x:number, y:number, btn:UIButton) {
        this.uimgr.closeUI(this.uiName);
    }
}
