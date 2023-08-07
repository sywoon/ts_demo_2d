import { DebugType, Scroll_Dir } from "../UIDefine";
import { UINode } from "./UINode";
import { IUIScrollAble, UIScrollBar } from "./UIScrollBar";


//内容容器 带滑动功能
export class UIPanel extends UINode implements IUIScrollAble {
    private _content: UINode = null;
    dir: number = Scroll_Dir.Vertical;
    hscroll: UIScrollBar = null;
    vscroll: UIScrollBar = null;

    set content(v:UINode) {
        this._content.removeFromParent();
        this._content = v;
        this.addChildAt(this._content, 0);

        this.hscroll && this.hscroll.refreshSize();
        this.vscroll && this.vscroll.refreshSize();
    }

    set scrollDir(v:number) {
        this.dir = v;
        if (v == Scroll_Dir.Horizontal) {
            this._createScrollH();
        } else if (v == Scroll_Dir.Vertical) {
            this._createScrollV();
        } else if (v == Scroll_Dir.Both) {
            this._createScrollH();
            this._createScrollV();
        }
    }

    public constructor() {
        super();
        this.debug = DebugType.UIRect;
        
        this.width = 200;
        this.height = 200;

        this._content = new UINode();
        this._content.width = 400;
        this._content.height = 400;
        this.addChild(this._content);
    }

    getScrollContent(): UINode {
        return this._content;
    }

    scrollTo(v1:number, v2:number=0) {
        if (this.dir == Scroll_Dir.Horizontal) {
            this.hscroll.scrollTo(v1);
        } else if (this.dir == Scroll_Dir.Vertical) {
            this.vscroll.scrollTo(v1);
        } else if (this.dir == Scroll_Dir.Both) {
            this.hscroll.scrollTo(v1);
            this.vscroll.scrollTo(v2);
        }
    }

    private _createScrollH() {
        let scroll = new UIScrollBar(this.dir);
        this.addChild(scroll);
        this.hscroll = scroll;
    }

    private _createScrollV() {
        let scroll = new UIScrollBar(this.dir);
        this.addChild(scroll);
        this.vscroll = scroll;
    }
}