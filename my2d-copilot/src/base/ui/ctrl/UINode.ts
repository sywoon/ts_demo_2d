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
import { EventDispatcher } from "../../EventDispatcher";
import { Color } from "../../math/Color";
import { GameEvent } from "../../EventDefine";
import { PropertyType, DebugType } from "../UIDefine";


//坐标系：采用opengl坐标系  左下角为原点 同cocos creator
//锚点：0-1  左上为[0,0] 右下为[1,1] 同canvas坐标 方便画文字
//子节点的位置是相对于父节点的锚点位置 同cocos creator 这点和cocos2dx不一样
//即：每个控件都以自己的锚点为原点 创建特有的坐标系
// UINode
// |-子节点管理  addChild removeChild setVisible isVisible-通过位来控制多个状态属性
// |-创建和释放  create destory
// |-渲染 onRender 
// |-鼠标和键盘 控件事件(焦点 大小改变)  onTouchEvent onKeyEvent onCtrlEvent
export class UINode extends EventDispatcher {
    get appRoot(): AppRoot {
        return AppRoot.getInstance();
    }

    get graphic(): IGraphic {
        return AppRoot.getInstance().graphic;
    }

    get stage(): any {
        return AppRoot.getInstance().stage;
    }

    //所有ui共享独立的uitimer
    get timer(): Timer {
        return AppRoot.getInstance().stage.timerUI;
    }

    public debug: number = 0;
    public x: number = 0;
    public y: number = 0;
    public isMouseDown:boolean = false;
    public isMouseIn:boolean = false;  //down后 就算移出控件外部 也可以接收move事件
    public anchor: Vec2 = new Vec2(0.5, 0.5);

    private _width: number = 100;
    private _height: number = 100;
    private _property:number = 1;
    private _parent: UINode = null;
    private _children: Array<UINode> = new Array<UINode>();

    get width(): number {
        return this._width;
    }
    get height(): number {
        return this._height;
    }
    set width(w: number) {
        this._width = w;
        this.timer.callLater(this.onSizeChanged, this);
    }
    set height(h: number) {
        this._height = h;
        this.timer.callLater(this.onSizeChanged, this);
    }

    get parent(): UINode {
        return this._parent;
    }

    public constructor() {
        super();
    }

    public destory() {
        for (let child of this._children) {
            child.destory();
        }
        this.onDestroy();
    }

    protected onSizeChanged(): void {
        this.sendEvent(GameEvent.RESIZE, this.width, this.height);
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
        this.offAll();
        this.removeFromParent();
    }

    public onRender(x:number, y:number): void {
        if (!this.isVisible())
            return;

        let _x = x + this.x;  //不能修改x的值 需要上传
        let _y = y + this.y;

        if (this.debug > 0) {
            //原点位置
            if (this.hasDebugType(DebugType.Origin)) {
                this.graphic.drawArc(_x, _y, 3, 0, Math.PI * 2, true, "fill", Color.Red);
            }

            if (this.hasDebugType(DebugType.UIRect)) {
                this.graphic.strokeRect(_x, _y, this.width, this.height, Color.Yellow);
            }
        }

        for (let child of this._children) {
            child.onRender(_x, _y);
        }
    }

    public dispatchTouchEvent(evt: MyMouseEvent): boolean {
        //从上层到下层 从子节点到自己
        for (let i = this._children.length-1; i>=0; i--) {
            let child = this._children[i];
            if (child.dispatchTouchEvent(evt)) {
                return true;
            }
        }

        if (!this.isInteractAble())
            return false;

        let rtn = this.onTouchEvent(evt);
        if (rtn && evt.type == GameEvent.MOUSE_DOWN) {
            this.stage.mouseTarget = this;
        }
        return rtn;
    }

    public onTouchEvent(evt: MyMouseEvent): boolean {  //返回true表示事件被处理了
        if (!this.isInteractAble())
            return false;

        let pos = this.globalToLocal(evt.x, evt.y);
        //只有down才做命中测试 捕获控件
        //后续事件move up都只发给它 直到up后才释放控件 或移出浏览器导致up事件丢失
        let hit = this.hitTest(pos.x, pos.y);
        this.isMouseIn = hit;

        if (this.isMouseDown) {
            //异常情况 上次被down 但没up 又down了 可能鼠标移出浏览器导致up事件丢失
            if (evt.type == GameEvent.MOUSE_DOWN) {
                if (!hit) {
                    this.isMouseDown = false;
                    return false;
                }
            } else {
                //其他情况 无需做hit测试
            }
        } else {
            if (!hit)
                return false;
        }

        switch (evt.type) {
            case GameEvent.MOUSE_DOWN:
                this.isMouseDown = true;
                break;
            case GameEvent.MOUSE_UP:
                this.isMouseDown = false;
                break;
            case GameEvent.MOUSE_MOVE:
                break;
            default:
                break;
        }
        this.sendEvent(evt.type, evt, this);
        // console.log("Touch", hit, evt.type, evt.x, evt.y, pos.x, pos.y)
        
        if (hit && evt.type == GameEvent.MOUSE_UP) {
            // console.log("CLICK", evt.type, evt.x, evt.y, pos.x, pos.y)
            this.sendEvent(GameEvent.CLICK, evt, this);
        }
        return true; 
    }  

    public dispatchKeyEvent(evt: MyKeyboardEvent): boolean { 
        for (let i = this._children.length-1; i>=0; i--) {
            let child = this._children[i];
            if (child.dispatchKeyEvent(evt)) {
                return true;
            }
        }
        return this.onKeyEvent(evt);
    }

    public onKeyEvent(evt: MyKeyboardEvent): boolean { 
        //子类实现
        return false; 
    }

    public dispatchCtrlEvent(): boolean { 
        for (let i = this._children.length-1; i>=0; i--) {
            let child = this._children[i];
            if (child.dispatchCtrlEvent()) {
                return true;
            }
        }
        return this.onCtrlEvent();
    }

    public onCtrlEvent(): boolean { 
        //子类实现
        return false; 
    }

    public globalToLocal(x:number, y:number, out:Vec2=null): Vec2 {
        let pos = out || new Vec2();
        pos.x = x-this.x;
        pos.y = y-this.y;

        let parent = this._parent;
        while (parent) {
            pos.x -= parent.x;
            pos.y -= parent.y;
            parent = parent._parent;
        }
        return pos;
    }

    public localToGlobal(x:number, y:number, out:Vec2=null): Vec2 {
        let pos = new Vec2();
        pos.x = x+this.x;
        pos.y = y+this.y;

        let parent = this._parent;
        while (parent) {
            pos.x += parent.x;
            pos.y += parent.y;
            parent = parent._parent;
        }
        return pos;
    }

    //本地局部坐标
    public hitTest(x:number, y:number): boolean {
        if (!this.isVisible()) {
            return false;
        }

        //后期加入锚点运算
        if (x < 0 || x > this.width || y < 0 || y > this.height) {
            return false;
        }

        return true;
    }

    public addDebugType(flag:number): void {
        this.debug = this.debug | flag;
    }

    public hasDebugType(flag:number): boolean {
        return (this.debug & flag) > 0;
    }

    //-------------------------------------------
    // 属性部分
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
        this._children.push(node);

        if (!node.isAwake()) {
            node.setAwake(true);
            node.onAwake();
        }
        node.onEnable();
    }

    public addChildAt(node: UINode, idx:number): void {
        node._parent = this;
        this._children.splice(idx, 0, node);

        if (!node.isAwake()) {
            node.setAwake(true);
            node.onAwake();
        }
        node.onEnable();
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