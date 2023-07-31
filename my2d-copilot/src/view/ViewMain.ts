import { ViewBase } from "../base/ui/ViewBase";
import { UIGeometry } from "../base/ui/ctrl/UIGeometry";
import { Color } from "../base/math/Color";
import { UIButton } from "../base/ui/ctrl/UIButton";
import { UINode } from "../base/ui/ctrl/UINode";
import { GameEvent } from "../base/EventDefine";

export class ViewMain extends ViewBase {
    geo: UIGeometry;

    constructor() {
        super();
        this.hasCloseBtn = false;
    }

    onCreate() {
        super.onCreate();

        let nodeRoot = new UINode();
        this.addChild(nodeRoot);
        nodeRoot.x = 10;
        nodeRoot.y = 10;

        let x = 0;
        let y = 0;
        {
            let btn = new UIButton();
            nodeRoot.addChild(btn);
            btn.x = x;
            btn.y = y;
            btn.text = "文字测试";
            btn.onEvent(GameEvent.CLICK, this._onBtnText, this);
        }

        {
            x += 120;
            let btn = new UIButton();
            nodeRoot.addChild(btn);
            btn.x = x;
            btn.y = y;
            btn.text = "矩形测试";
            btn.onEvent(GameEvent.CLICK, this._onBtnRect, this);
        }

        {
            x += 120;
            let btn = new UIButton();
            nodeRoot.addChild(btn);
            btn.x = x;
            btn.y = y;
            btn.text = "调色板";
            btn.onEvent(GameEvent.CLICK, this._onBtnColor, this);
        }
    }

    onRender(x: number, y: number): void {
        super.onRender(x, y);
    }

    private _onBtnText(x:number, y:number, btn:UIButton) {
        this.uimgr.openUI("ui_labelTest");
    }

    private _onBtnRect(x:number, y:number, btn:UIButton) {
        this.uimgr.openUI("ui_rectTest");
    }

    private _onBtnColor(x:number, y:number, btn:UIButton) {
        this.uimgr.openUI("ui_colorPalette");
    }
}