import { Scroll_Dir } from "../UIDefine";
import { UINode } from "./UINode";
import { UIButton } from "./UIButton";
import { UIPanel } from "./UIPanel";
import { GameEvent } from "../../EventDefine";

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

    percent: number = 0.5;

    constructor(dir: number) {
        super();

        this.dir = dir;

        this.slider = new UIButton();
        this.slider.roundCorner = false;
        this.begin = new UIButton();
        this.begin.roundCorner = false;
        this.end = new UIButton();
        this.end.roundCorner = false;
        this.block = new UIButton();
        
        this.addChild(this.slider);
        this.slider.addChild(this.begin);
        this.slider.addChild(this.end);
        this.slider.addChild(this.block);
    }

    public onAwake(): void {
        super.onAwake();
        this.refreshSize();
        this.parent.onEvent(GameEvent.RESIZE, this.refreshSize, this);
    }

    public refreshSize() {
        let parent = this.parent;
        if (!parent)
            return;

        if (this.dir == Scroll_Dir.Horizontal) {
            this._refrshSize_Horizontal();
        } else if (this.dir == Scroll_Dir.Vertical) {
            this._refrshSize_Vertical();
        }
        this.updateBlock();
    }

    //滑动区域 或 大小改变 滑块的位置和大小会跟随变化
    private updateBlock() {
        let w = this.parent.width;
        let h = this.parent.height;
        let scrollAble = this.parent as UIPanel;
        let cw = scrollAble.getScrollContent().width;
        let ch = scrollAble.getScrollContent().height;

        let fixSize = 20;  //固定值 影响：滑块大小 滑动区域大小

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
                this.block.x = fixSize + scrollDis * this.percent;
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
                this.block.y = fixSize + scrollDis * this.percent;
            }
        }
    }

    private _refrshSize_Horizontal() {
        let w = this.parent.width;
        let h = this.parent.height;
        let scrollAble = this.parent as UIPanel;
        let cw = scrollAble.getScrollContent().width;
        let ch = scrollAble.getScrollContent().height;

        let fixSize = 20;  //固定值 影响：滑块大小 滑动区域大小
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

        let fixSize = 20;  //固定值 影响：滑块大小 滑动区域大小
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
        this.begin.text = "▼"

        this.block.width = fixSize;
        this.block.height = fixSize;
        this.block.x = 0;
        this.block.y = fixSize;
        this.block.text = "";
    }
}