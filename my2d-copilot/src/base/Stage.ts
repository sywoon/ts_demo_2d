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
import { MyKeyboardEvent, MyMouseEvent, MyWheelEvent } from "./EventDefine";
import { Timer } from "./Timer";
import { GameEvent } from "./EventDefine";
import { Vec2 } from "./math/Vec2";

export class Stage extends UINode {
    canvas2d: Canvas2D
    timerUI: Timer;
    mouseTarget:UINode;  //当前捕获的鼠标对象 down时设置 up时清空 即使移出外部 依然能得到鼠标事件
    mouseDown: Vec2 = new Vec2();  //鼠标按下时的坐标
    mouseDownTime:number = 0;
    mouseLast: Vec2 = new Vec2();  //上一帧的坐标

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

    public dispatchWheelEvent(evt: MyWheelEvent): boolean {
        if (this.mouseTarget) {
            this.mouseTarget.onWheelEvent(evt); 
            return;
        }

        super.dispatchWheelEvent(evt);
        return true;
    }

    public dispatchTouchEvent(evt: MyMouseEvent): boolean {
        if (evt.type == GameEvent.MOUSE_DOWN) {
            this.mouseDown.x = evt.x;
            this.mouseDown.y = evt.y;
            this.mouseDownTime = Date.now();
        }
        evt.mouseDown = this.mouseDown;
        evt.mouseLast = this.mouseLast;
        evt.mouseDownTime = this.mouseDownTime;

        if (this.mouseTarget) {
            if (evt.type == GameEvent.MOUSE_DOWN) {
                this.mouseTarget = null;  //清楚上一个记录 重新捕获
            } else if (evt.type == GameEvent.MOUSE_MOVE) {
                this.mouseTarget.onTouchEvent(evt);  //直接发给捕获的对象
                return;
            } else if (evt.type == GameEvent.MOUSE_UP) {
                this.mouseTarget.onTouchEvent(evt);
                this.mouseTarget = null;   //本次捕获结束
                return;
            }
        }

        super.dispatchTouchEvent(evt);

        this.mouseLast.x = evt.x;
        this.mouseLast.y = evt.y;

        return true;
    }

    public dispatchKeyEvent(evt: MyKeyboardEvent): boolean {
        super.dispatchKeyEvent(evt);
        return true;
    }
}