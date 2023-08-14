import { GameEvent, MyMouseEvent } from "../base/EventDefine";
import { Vec2 } from "../base/math/Vec2";
import { Scroll_Dir } from "../base/ui/UIDefine";
import { ViewBase } from "../base/ui/ViewBase";
import { UIButton } from "../base/ui/ctrl/UIButton";
import { UIImage } from "../base/ui/ctrl/UIImage";
import { UILabel } from "../base/ui/ctrl/UILabel";
import { UINode } from "../base/ui/ctrl/UINode";
import { UIPanel } from "../base/ui/ctrl/UIPanel";
import { Editor } from "./Editor";


export class ViewEditor extends ViewBase {
    get editor(): Editor {
        return Editor.instance;
    }

    uiTools: UINode;
    private toolsBtnDownPos:Vec2 = new Vec2();

    constructor() {
        super();
        this.hasCloseBtn = false;
    }
    
    onCreate() {
        super.onCreate();

        this.editor.getViewCfg(()=> {
            let viewList = this._createViewList();
            this.addChild(viewList);
        });

        this._createTools();
    }

    private _createViewList(): UIPanel {
        let panel = new UIPanel();
        panel.width = 100;
        panel.height = this.stage.height;
        panel.x = this.width - panel.width;
        panel.y = 0;
        
        this.addChild(panel);

        let content = new UINode();
        panel.content = content;

        let viewCfg = this.editor.viewCfg;
        let height = 0;
        for (let i=0; i<viewCfg.length; ++i) {
            let cfg = viewCfg[i];
            let btn = new UIButton();
            content.addChild(btn);
            btn.x = 0;
            btn.y = i * 35;
            btn.height = 30;
            btn.text = cfg.name;
            btn.fontSize = 12;
            btn.roundCorner = false;
            btn.onEvent(GameEvent.CLICK, ()=>{
                this._openView(cfg.name);
            }, this);
            height = btn.y + btn.height;
        }

        content.width = panel.width;
        content.height = height;
        if (height > panel.height) {
            panel.scrollDir = Scroll_Dir.Vertical;
            panel.vscroll.fixSize = 10;
            panel.width += 15;
        }
        return panel;
    }

    private _openView(viewName:string) {
        console.log("open view:", viewName);
    }

    private _createTools(): UINode {
        let tools = new UINode();
        tools.width = 300;
        tools.height = 100;
        tools.x = this.width - tools.width;
        tools.y = this.height/2;
        this.addChild(tools);
        this.uiTools = tools;

        let interval = 5;
        let x = 0;
        let y = 0;
        let btnHead = new UIButton();
        btnHead.text = " == "
        btnHead.width = tools.width;
        btnHead.height = 10;
        btnHead.x = x;
        btnHead.y = y;
        btnHead.onEvent(GameEvent.MOUSE_DOWN, this._onBtnHeadDown, this);
        btnHead.onEvent(GameEvent.MOUSE_MOVE, this._onBtnHeadMove, this);
        tools.addChild(btnHead);

        y += btnHead.height + interval;

        let types = ["lable", "button", "image"];
        let idx = 0;
        let line_count = 4;
        let i = 0;
        let j = 0;
        while (idx < types.length) {
            let name = types[i];
            let btn = new UIButton();
            btn.text = name;
            btn.height = 30;
            btn.width = 70;
            btn.fontSize = 15;
            btn.x = x + i * (btn.width + interval);
            btn.y = y + j * (btn.height + interval);
            tools.addChild(btn);
            btn.onEvent(GameEvent.CLICK, ()=>{
                this._onCreateCtrl(name);
            }, this);

            idx++;
            i = idx % line_count;
            j = Math.floor(idx / line_count);
        }
       
        return tools;
    }

    private _onBtnHeadDown(evt:MyMouseEvent, btnHead:UIButton) {
        this.toolsBtnDownPos.x = this.uiTools.x;
        this.toolsBtnDownPos.y = this.uiTools.y;
    }

    private _onBtnHeadMove(evt:MyMouseEvent, btnHead:UIButton) {
        if (!btnHead.isMouseDown)
            return;

        let diffX = evt.x - evt.mouseDown.x;
        let diffY = evt.y - evt.mouseDown.y;
        this.uiTools.x = this.toolsBtnDownPos.x + diffX;
        this.uiTools.y = this.toolsBtnDownPos.y + diffY;
    }

    private _onCreateCtrl(name:string) {
        console.log("create ctrl:", name);
    }
}

