//============================
// 舞台类
// 1. 焦点管理 可见性管理 大小监听
// 2. 事件管理 鼠标 键盘 
// 3. 屏幕坐标 相当于webgl的viewport 可视部分 并非整个canvas
// 4. 主渲染循环 update render
// 5. ui树管理 
//============================

import { UINode } from "./ui/ctrl/UINode";
import { Canvas2D } from "./Canvas2D";
import { MyKeyboardEvent, MyMouseEvent } from "./EventDefine";
import { Timer } from "./Timer";

export class Stage extends UINode {
    canvas2d: Canvas2D
    timerUI: Timer;
    

    constructor(canvas2d: Canvas2D) {
        super();
        this.canvas2d = canvas2d;
        this.timerUI = new Timer();
    }

    init() {
        this.width = this.canvas2d.size.width;
        this.height = this.canvas2d.size.height;
    }

    public resize(width: number, height: number): void {
        this.width = width;
        this.height = height;
    }

    public update(): void {
        this.timerUI.runCallLater();  //上一帧积累的回调
        this.timerUI.update();
    }

    public render(): void {
        //所有ui节点都挂在它下面
        this.onRender(this.x, this.y);
    }

    public onTouchEvent(evt: MyMouseEvent): boolean {
        super.onTouchEvent(evt);
        return true;
    }

    public onKeyEvent(evt: MyKeyboardEvent): boolean {
        super.onKeyEvent(evt);
        return true;
    }
}