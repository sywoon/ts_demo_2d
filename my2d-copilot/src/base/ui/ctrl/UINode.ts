//==============================================
// ui控件设计
// UINode: 子节点 transform:pos rot scale  size anchor 
//    UITransform: 后期若按组件试设计 可考虑抽取部分UINode逻辑 放这个组件
// UIWidget 适配：横向 纵向 具体像素值或百分比
// UILayout: 子节点布局容器 支持横向 纵向 grid 用于比较少的子控件
// UIScrollView: 滑动容器
// UIList： 列表容器 动态缓存子节点 效率高 但只支持同样的子节点  后期可考虑支持不同大小的子节点
// UIGrid: 网格容器 动态缓存子节点 效率高 
// UIGeometry: 几何图形 矩形 线段
// UILabel UIButton UIProgress UIRichText UIEdit
//==============================================


import { AppRoot } from "../../AppRoot";
import { IGraphic } from "../../IGraphic";
import { Vec2 } from "../../math/Vec2";
import { MyMouseEvent, MyKeyboardEvent } from "../../EventDefine";
import { Timer } from "../../Timer";


export enum PropertyType {
    Visible = 2 ^ 0,
    Awake = 2 ^ 1,      //是否已经创建
    InteractAble = 2 ^ 2,  //是否可交互
}


//坐标系：采用opengl坐标系  左下角为原点 同cocos creator
//锚点：0-1  左上为[0,0] 右下为[1,1] 同canvas坐标 方便画文字
//子节点的位置是相对于父节点的锚点位置 同cocos creator 这点和cocos2dx不一样
//即：每个控件都以自己的锚点为原点 创建特有的坐标系
// UINode
// |-子节点管理  addChild removeChild setVisible isVisible-通过位来控制多个状态属性
// |-创建和释放  create destory
// |-渲染 onRender 
// |-鼠标和键盘 控件事件(焦点 大小改变)  onTouchEvent onKeyEvent onCtrlEvent
export class UINode {
    static create(): UINode {
        return new UINode();
    }

    get graphic(): IGraphic {
        return AppRoot.getInstance().graphic;
    }

    //所有ui共享独立的uitimer
    get timer(): Timer {
        return AppRoot.getInstance().stage.timerUI;
    }

    public x: number = 0;
    public y: number = 0;
    public width: number = 100;
    public height: number = 100;
    public anchor: Vec2 = new Vec2(0.5, 0.5);
    private _parent: UINode = null;
    private _children: Array<UINode> = new Array<UINode>();

    public constructor() {}
    public destory() {
        for (let child of this._children) {
            child.destory();
        }
        this.onDestroy();
    }

    //创建节点  和构造函数一样 为了统一好看些
    public onCreate(): void {
        for (let child of this._children) {
            child.onCreate();
        }
    }
    //第一次加入节点
    public onAwake(): void {
        for (let child of this._children) {
            child.onAwake();
        }
    }

    //每次加入节点
    public onEnable(): void {
        for (let child of this._children) {
            child.onEnable();
        }
    }

    //每次离开节点
    public onDisable(): void {
        for (let child of this._children) {
            child.onDisable();
        }
    }

    //每次销毁节点
    public onDestroy(): void {
        for (let child of this._children) {
            child.onDestroy();
        }
    }

    public onRender(x:number, y:number): void {
        for (let child of this._children) {
            child.onRender(x+this.x, y+this.y);
        }
    }

    public onTouchEvent(evt: MyMouseEvent): boolean {  //返回true表示事件被处理了
        for (let child of this._children) {
            if (child.isInteractAble() && child.onTouchEvent(evt)) {
                return true;
            }
        }
        return false; 
    }  

    public onKeyEvent(evt: MyKeyboardEvent): boolean { 
        for (let child of this._children) {
            if (child.isInteractAble() && child.onKeyEvent(evt)) {
                return true;
            }
        }
        return false; 
    }

    public onCtrlEvent(): boolean { 
        for (let child of this._children) {
            if (child.onCtrlEvent()) {
                return true;
            }
        }
        return false; 
    }

    public hitTest(x:number, y:number, includeChild:boolean=false): boolean {
        if (!this.isVisible()) {
            return false;
        }
        if (x < this.x || x > this.x + this.width || y < this.y || y > this.y + this.height) {
            return false;
        }
        if (!includeChild) {
            return false;
        }

        for (let child of this._children) {
            if (child.hitTest(x, y)) {
                return true;
            }
        }
        return false;
    }


    //-------------------------------------------
    // 属性部分
    private _property:number = 1;
    public setVisible(v:boolean): void {
        if (v) {
            this._property = this._property | PropertyType.Visible;
        } else {
            this._property = this._property & ~PropertyType.Visible;
        }
    }

    public isVisible(): boolean {
        return (this._property & PropertyType.Visible) > 0;
    }

    public setAwake(v:boolean): void {
        if (v) {
            this._property = this._property | PropertyType.Awake;
        } else {
            this._property = this._property & ~PropertyType.Awake;
        }
    }

    public isAwake(): boolean {
        return (this._property & PropertyType.Awake) > 0;
    }

    public isInteractAble(): boolean {
        return (this._property & PropertyType.InteractAble) > 0;
    }

    public setInteractAble(v:boolean): void {
        if (v) {
            this._property = this._property | PropertyType.InteractAble;
        } else {
            this._property = this._property & ~PropertyType.InteractAble;
        }
    }
    //
    //-------------------------------------------

    //-------------------------------------------
    // 子节点
    public addChild(node: UINode): void {
        node._parent = this;
        if (!node.isAwake()) {
            node.setAwake(true);
            node.onAwake();
        }
        node.onEnable();
        this._children.push(node);
    }
    public removeChild(node: UINode): void {
        node.onDisable();
        let index = this._children.indexOf(node);
        if (index >= 0) {
            this._children.splice(index, 1);
        }
    }
    public removeChildAt(index: number): void {
        if (index >= 0 && index < this._children.length) {
            this.removeChild(this._children[index]);
        }
    }
    public removeFromParent(): void {
        if (this._parent) {
            this._parent.removeChild(this);
            this._parent = null;
        }
    }
    public removeAllChildren(): void {
        for (let child of this._children) {
            child.removeAllChildren();
        }
        this._children = [];
        this.removeFromParent();
    }

    public getChild(index: number): UINode {
        if (index >= 0 && index < this._children.length) {
            return this._children[index];
        }
        return null;
    }
    public getChildCount(): number {
        return this._children.length;
    }
    //
    //-------------------------------------------


    //-------------------------------------------
    // 定时器
    timerOnce(delay: number, caller: any, method: Function, args: any[] = null, coverBefore: boolean = true): void {
        this.timer.once(delay, caller, method, args, coverBefore);
    }

    timerLoop(delay: number, interval:number, repeat:number, caller: any, method: Function, args: any[] = null, coverBefore: boolean = true): void {
        this.timer.loop(delay, interval, repeat, caller, method, args, coverBefore);
    }

    timerClear(caller: any, method: Function): void {
        this.timer.clear(caller, method);
    }
    //
    //-------------------------------------------
}