import { ViewBase } from "../base/ui/ViewBase";
import { UIGeometry } from "../base/ui/ctrl/UIGeometry";
import { Color } from "../base/math/Color";
import { UIButton } from "../base/ui/ctrl/UIButton";
import { UINode } from "../base/ui/ctrl/UINode";
import { GameEvent } from "../base/EventDefine";

export class UIMain extends ViewBase {
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

        {
            let btn = new UIButton();
            nodeRoot.addChild(btn);
            btn.text = "文字测试";
            btn.onEvent(GameEvent.CLICK, this._onBtnText, this);
        }

        {
            let btn = new UIButton();
            nodeRoot.addChild(btn);
            btn.text = "矩形测试";
            btn.x = 120;
            btn.onEvent(GameEvent.CLICK, this._onBtnRect, this);
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
}