import { GameEvent } from "../base/EventDefine";
import { Scroll_Dir } from "../base/ui/UIDefine";
import { ViewBase } from "../base/ui/ViewBase";
import { UIButton } from "../base/ui/ctrl/UIButton";
import { UIImage } from "../base/ui/ctrl/UIImage";
import { UINode } from "../base/ui/ctrl/UINode";
import { UIPanel } from "../base/ui/ctrl/UIPanel";
import { Editor } from "./Editor";


export class ViewEditor extends ViewBase {
    get editor(): Editor {
        return Editor.instance;
    }

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
}

