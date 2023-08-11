import { GameEvent, MyMouseEvent, MyWheelEvent } from "../../EventDefine";
import { DebugType, Scroll_Dir } from "../UIDefine";
import { UINode } from "./UINode";
import { IUIScrollAble, UIScrollBar } from "./UIScrollBar";


//内容容器 带滑动功能
export class UIPanel extends UINode implements IUIScrollAble {
    private _content: UINode = null;
    private _startScroll: boolean = false;
    dir: number = Scroll_Dir.None;
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

    public onEnable(): void {
        super.onEnable();
        this.stage.onEvent(GameEvent.MOUSE_DOWN, this._onContentMouseDown, this);
        this.stage.onEvent(GameEvent.MOUSE_MOVE, this._onContentMouseMove, this);
        this.stage.onEvent(GameEvent.MOUSE_UP, this._onContentMouseUp, this);
        this.stage.onEvent(GameEvent.MOUSE_WHEEL, this._onContentMouseWheel, this);
    }

    public onDisable(): void {
        super.onDisable();
        this.stage.offEvent(GameEvent.MOUSE_DOWN, this._onContentMouseDown, this);
        this.stage.offEvent(GameEvent.MOUSE_MOVE, this._onContentMouseMove, this);
        this.stage.offEvent(GameEvent.MOUSE_UP, this._onContentMouseUp, this);
        this.stage.offEvent(GameEvent.MOUSE_WHEEL, this._onContentMouseWheel, this);
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

    private _onContentMouseDown(evt: MyMouseEvent, stage:UINode) {
        let pos = this.globalToLocal(evt.x, evt.y);
        let hit = this.hitTest(pos.x, pos.y);
        this._startScroll = hit;
    }

    private _onContentMouseMove(evt: MyMouseEvent, stage:UINode) {
        if (!this._startScroll)
            return;
        let pos = this.globalToLocal(evt.x, evt.y);
        let hit = this.hitTest(pos.x, pos.y);
        this.isMouseIn = hit;
        if (!hit)
            return;

        let diffx = (evt.x - evt.mouseLast.x);
        let diffy = (evt.y - evt.mouseLast.y);
        let scale = 0.2;

        if (this.dir == Scroll_Dir.Horizontal) {
            let percentx = diffx / (this._content.width - this.width) * scale;
            this.hscroll.percent = this.hscroll.percent + percentx;
        } else if (this.dir == Scroll_Dir.Vertical) {
            let percenty = diffy / (this._content.height - this.height) * scale;
            this.vscroll.percent = this.vscroll.percent + percenty;
        } else if (this.dir == Scroll_Dir.Both) {
            let percentx = diffx / (this._content.width - this.width) * scale;
            this.hscroll.percent = this.hscroll.percent + percentx;

            let percenty = diffy / (this._content.height - this.height) * scale;
            this.vscroll.percent = this.vscroll.percent + percenty;
        }
    }

    private _onContentMouseUp(evt: MyMouseEvent, stage:UINode) {
        if (!this._startScroll || !this.isMouseIn) {
            this._startScroll = false;
            return;
        }
        
        this._startScroll = false;
        let diffx = evt.x - evt.mouseDown.x;
        let diffy = evt.y - evt.mouseDown.y;
        let time = Date.now() - evt.mouseDownTime;

        if (this.dir == Scroll_Dir.Horizontal) {
            let speed = diffx / time;
            this.hscroll.speed = speed;
        } else if (this.dir == Scroll_Dir.Vertical) {
            let speed = diffy / time;
            this.vscroll.speed = speed;
        } else if (this.dir == Scroll_Dir.Both) {
            let speedx = diffx / time;
            this.hscroll.speed = speedx;

            let speedy = diffy / time;
            this.vscroll.speed = speedy;
        }
    }

    private _onContentMouseWheel(e: MyWheelEvent) {
        if (!this.isMouseIn)
            return;
        let factor = 0.002;
        if (this.dir == Scroll_Dir.Horizontal) {
            this.hscroll.percent = this.hscroll.percent + e.deltaY * factor;
        } else if (this.dir == Scroll_Dir.Vertical) {
            this.vscroll.percent = this.vscroll.percent + e.deltaY * factor;
        } else if (this.dir == Scroll_Dir.Both) {
            // this.hscroll.percent = this.hscroll.percent + e.deltaY * factor;
            this.vscroll.percent = this.vscroll.percent + e.deltaY * factor;
        }
    }

    private _createScrollH() {
        let scroll = new UIScrollBar(Scroll_Dir.Horizontal);
        this.addChild(scroll);
        this.hscroll = scroll;
    }

    private _createScrollV() {
        let scroll = new UIScrollBar(Scroll_Dir.Vertical);
        this.addChild(scroll);
        this.vscroll = scroll;
    }
}