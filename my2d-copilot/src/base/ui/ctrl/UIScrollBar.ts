import { Scroll_Dir } from "../UIDefine";
import { UINode } from "./UINode";
import { UIButton } from "./UIButton";
import { UIPanel } from "./UIPanel";
import { GameEvent, MyMouseEvent } from "../../EventDefine";
import { Vec2 } from "../../math/Vec2";
import { Color } from "../../math/Color";

export interface IUIScrollAble {
    getScrollContent(): UINode;
}

// 上下按钮 中间滑块 滑动区域 都可点击操作
// 给一个方向和速度 阻尼效果滑动
// 跳到某个百分比位置
// 滑块大小和滑动区域大小成比例
export class UIScrollBar extends UINode {
    dir: number = Scroll_Dir.Vertical;

    begin:UIButton = null;
    end:UIButton = null;
    block:UIButton = null;  //滑块
    slider:UIButton = null; //滑动区域
    private _fixSize = 20;

    private _percent: number = 0;
    private _speed: number = 0;
    private _inAutoMoving = false;

    set fixSize(v:number) {
        this._fixSize = v;
        this.refreshSize();
    }

    get percent(): number {
        return this._percent;
    }

    set percent(v: number) {
        if (v < 0) {
            if (this._percent == 0)
                return;
            v = 0;
        } else if (v > 1) {
            if (this._percent == 1)
                return;
            v = 1;
        }
        this._percent = v;
        this.timer.callLater(this.onScrollChanged, this);
    }

    set speed(v: number) {
        this._speed = v;
        if (v == 0) {
            this._inAutoMoving = false;
            this.timer.clear(this, this._onAutoMove);    
        } else {
            this._inAutoMoving = true;
            this.timer.loop(0, 100, 0, this, this._onAutoMove);
        }
    }

    constructor(dir: number) {
        super();

        this.dir = dir;

        this.slider = new UIButton();
        this.slider.roundCorner = false;
        this.slider.onEvent(GameEvent.CLICK, this._onBtnSlider, this);

        this.begin = new UIButton();
        this.begin.roundCorner = false;
        this.begin.onEvent(GameEvent.CLICK, this._onBtnBegin, this);
        this.end = new UIButton();
        this.end.roundCorner = false;
        this.end.onEvent(GameEvent.CLICK, this._onBtnEnd, this);

        this.block = new UIButton();
        this.block.roundCorner = false;
        this.block.bgColor = Color.Silver;
        this.block.onEvent(GameEvent.MOUSE_MOVE, this._onBtnBlockMove, this);
        
        this.addChild(this.slider);
        this.slider.addChild(this.begin);
        this.slider.addChild(this.end);
        this.slider.addChild(this.block);
    }

    scrollTo(v:number) {
        this.speed = 0;
        this.percent = v;
    }

    public onAwake(): void {
        super.onAwake();
        this.refreshSize();
        this.parent.onEvent(GameEvent.RESIZE, this.refreshSize, this);
    }

    public onDestroy(): void {
        this.parent.offEvent(GameEvent.RESIZE, this.refreshSize, this);
        super.onDestroy();
    }

    public refreshSize() {
        let parent = this.parent;
        if (!parent)
            return;

        let scrollAble = this.parent as UIPanel;
        if (!scrollAble.getScrollContent())
            return;

        if (this.dir == Scroll_Dir.Horizontal) {
            this._refrshSize_Horizontal();
        } else if (this.dir == Scroll_Dir.Vertical) {
            this._refrshSize_Vertical();
        }
        this._updateBlock();
    }

    private _onBtnSlider(evt:MyMouseEvent) {
        let pt = this.slider.globalToLocal(evt.x, evt.y, Vec2.temp);
        if (this.dir == Scroll_Dir.Horizontal) {
            if (pt.x < this.block.x) {
                this.percent -= 0.1;
            } else {
                this.percent += 0.1;
            }
        } else if (this.dir == Scroll_Dir.Vertical) {
            if (pt.y < this.block.y) {
                this.percent -= 0.1;
            } else {
                this.percent += 0.1;
            }
        }
    }

    private _onBtnBegin() {
        this.percent -= 0.1;
    }

    private _onBtnEnd() {
        this.percent += 0.1;
    }

    private _onBtnBlockMove(evt:MyMouseEvent, btnBlock:UIButton) {
        if (!btnBlock.isMouseDown)
            return;
        let pt = this.slider.globalToLocal(evt.x, evt.y, Vec2.temp);

        if (this.dir == Scroll_Dir.Horizontal) {
            this.percent = pt.x / this.slider.width;
        } else if (this.dir == Scroll_Dir.Vertical) {
            this.percent = pt.y / this.slider.height;
        }
    }

    public onScrollChanged() {
        this._syncScollContentPos();
        this._updateBlock();
    }


    public stopMove() {
        this.speed = 0;
    }

    private _onAutoMove() {
        let dir = this._speed > 0 ? 1 : -1;
        let newSpeed = this._speed * 0.9;
        let diff = this._speed - newSpeed;
        this._speed = newSpeed;

        if (this._speed > -0.1 && this._speed < 0.1) {
            this.speed = 0;
            return;
        }

        let factor = 0.2;  //速度简单模拟转百分比值
        this.percent += diff * factor;
    }

    //根据滑动位置 同步内容位置
    private _syncScollContentPos() {
        let w = this.parent.width;
        let h = this.parent.height;
        let scrollAble = this.parent as UIPanel;
        let cw = scrollAble.getScrollContent().width;
        let ch = scrollAble.getScrollContent().height;

        if (this.dir == Scroll_Dir.Horizontal) {
            let scrollDis = cw - w;
            let contentX = scrollDis * this._percent;
            scrollAble.getScrollContent().x = -contentX;
        } else if (this.dir == Scroll_Dir.Vertical) {
            let scrollDis = ch - h;
            let contentY = scrollDis * this._percent;
            scrollAble.getScrollContent().y = -contentY;
        }
    }

    //滑动区域 或 大小改变 滑块的位置和大小会跟随变化
    private _updateBlock() {
        let w = this.parent.width;
        let h = this.parent.height;
        let scrollAble = this.parent as UIPanel;
        let cw = scrollAble.getScrollContent().width;
        let ch = scrollAble.getScrollContent().height;

        let fixSize = this._fixSize;;  //固定值 影响：滑块大小 滑动区域大小

        if (this.dir == Scroll_Dir.Horizontal) {
            if (cw <= w) {
                this.block.setVisible(false);
                this.begin.setVisible(false);
                this.end.setVisible(false);
                this.slider.setVisible(false);
            } else {
                //滑动区域 / 内容大小  == 可滑动长度 / panel大小  注意：精准点 还需要减去两头按钮
                this.block.setVisible(true);
                this.begin.setVisible(true);
                this.end.setVisible(true);
                this.slider.setVisible(true);

                let scrollPercent = (cw - w) / cw;  //可滑动区域占比
                let scrollDis = scrollPercent * (w - fixSize*2);
                let blockWidth = w - fixSize*2 - scrollDis;
                this.block.width = blockWidth;
                this.block.x = fixSize + scrollDis * this._percent;
            }
        } else if (this.dir == Scroll_Dir.Vertical) {
            if (ch <= h) {
                this.block.setVisible(false);
                this.begin.setVisible(false);
                this.end.setVisible(false);
                this.slider.setVisible(false);
            } else {
                //滑动区域 / 内容大小  == 可滑动长度 / panel大小  注意：精准点 还需要减去两头按钮
                this.block.setVisible(true);
                this.begin.setVisible(true);
                this.end.setVisible(true);
                this.slider.setVisible(true);

                let scrollPercent = (ch - h) / ch;  //可滑动区域占比
                let scrollDis = scrollPercent * (h - fixSize*2);
                let blockHeight = h - fixSize*2 - scrollDis;
                this.block.height = blockHeight;
                this.block.y = fixSize + scrollDis * this._percent;
            }
        }
    }

    private _refrshSize_Horizontal() {
        let w = this.parent.width;
        let h = this.parent.height;
        let scrollAble = this.parent as UIPanel;
        let cw = scrollAble.getScrollContent().width;
        let ch = scrollAble.getScrollContent().height;

        let fixSize = this._fixSize;;  //固定值 影响：滑块大小 滑动区域大小
        this.width = w;
        this.height = fixSize;

        this.slider.x = 0;
        this.slider.y = h - fixSize;
        this.slider.width = w;
        this.slider.height = fixSize;
        this.slider.text = ""

        this.begin.width = fixSize;
        this.begin.height = fixSize;
        this.begin.x = 0;
        this.begin.y = 0;
        this.begin.text = "◀"

        this.end.width = fixSize;
        this.end.height = fixSize;
        this.end.x = w - fixSize;
        this.end.y = 0;
        this.end.text = "▶"

        this.block.width = fixSize;
        this.block.height = fixSize;
        this.block.x = fixSize;
        this.block.y = 0;
        this.block.text = "";
    }

    private _refrshSize_Vertical() {
        let w = this.parent.width;
        let h = this.parent.height;
        let scrollAble = this.parent as UIPanel;
        let cw = scrollAble.getScrollContent().width;
        let ch = scrollAble.getScrollContent().height;

        let fixSize = this._fixSize;  //固定值 影响：滑块大小 滑动区域大小
        this.width = fixSize;
        this.height = h;

        this.slider.x = w - fixSize;
        this.slider.y = 0;
        this.slider.width = fixSize;
        this.slider.height = h;
        this.slider.text = ""

        this.begin.width = fixSize;
        this.begin.height = fixSize;
        this.begin.x = 0;
        this.begin.y = 0;
        this.begin.text = "▲"

        this.end.width = fixSize;
        this.end.height = fixSize;
        this.end.x = 0;
        this.end.y = h - fixSize;
        this.end.text = "▼"

        this.block.width = fixSize;
        this.block.height = fixSize;
        this.block.x = 0;
        this.block.y = fixSize;
        this.block.text = "";
    }
}