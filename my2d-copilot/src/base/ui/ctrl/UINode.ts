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
import { MyMouseEvent, MyKeyboardEvent, MyWheelEvent } from "../../EventDefine";
import { Timer } from "../../Timer";
import { EventDispatcher } from "../../EventDispatcher";
import { Color } from "../../math/Color";
import { GameEvent } from "../../EventDefine";
import { PropertyType, DebugType, BTN_CLICK_DIS_SQ } from "../UIDefine";
import { Rect } from "../../math/Rect";


//坐标系：采用opengl坐标系  左下角为原点 同cocos creator
//锚点：0-1  左上为[0,0] 右下为[1,1] 同canvas坐标 方便画文字
//子节点的位置是相对于父节点的锚点位置 同cocos creator 这点和cocos2dx不一样
//即：每个控件都以自己的锚点为原点 创建特有的坐标系
// UINode
// |-子节点管理  addChild removeChild setVisible isVisible-通过位来控制多个状态属性
// |-创建和释放  create destory
// |-渲染 onRender 
// |-鼠标和键盘 控件事件(焦点 大小改变)  onTouchEvent onKeyEvent onCtrlEvent

// 节点创建 加入 移除 销毁逻辑
// 1.创建节点时 只有构造函数
// 2. 加入节点时 第一次onAwake onEnable  ;由addChild发起 不含子节点
// 3. 移除节点时 onDisable  ；由removeChild发起 不含子节点
// 4. 销毁节点时 onDestroy  ；由destroy发起 会递归调用子节点的destroy
// 
// 注意：
// 1.remove后的子节点树 如果没人引用 会引起内存泄漏 甚至业务报错 比如timer
// 2.只有调用destory才会真正销毁节点 释放事件监听和资源
// 3.移除掉的子节点树 为了方便查bug 会被临时保存到一个列表中 

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
    public _x: number = 0;
    public _y: number = 0;
    public isMouseDown:boolean = false;
    public isMouseIn:boolean = false;  //down后 就算移出控件外部 也可以接收move事件
    public anchor: Vec2 = new Vec2(0.5, 0.5);
    public swallowEvent: boolean = true;  //是否吞噬事件

    protected _width: number = 100;
    protected _height: number = 100;
    protected _property:number = 1;
    protected _parent: UINode = null;
    protected _children: Array<UINode> = new Array<UINode>();
    protected _clipRect: Rect = null;

    get x(): number {
        return this._x;
    }
    get y(): number {
        return this._y;
    }
    set x(x: number) {
        this._x = x;
    }
    set y(y: number) {
        this._y = y;
    }

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

        this.stage.removeUIFromCache(this);
        this.onDestroy();
    }

    protected onSizeChanged(): void {
        this.sendEvent(GameEvent.RESIZE, this.width, this.height);
    }

    //第一次加入节点
    public onAwake(): void {
    }

    //每次加入节点
    public onEnable(): void {
    }

    //每次离开节点
    public onDisable(): void {
    }

    //每次销毁节点
    public onDestroy(): void {
        for (let child of this._children) {
            child.onDestroy();
        }
        this.timer.clearByCaller(this);
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

        if (this.isClip()) {
            if (this._clipRect) {
                let rect = this._clipRect;
                this.stage.clip(rect.x, rect.y, rect.width, rect.height);
            } else {
                let pos = this.parent.localToGlobal(this.x, this.y, Vec2.temp);
                let _x = Math.max(0, pos.x);
                let _y = Math.max(0, pos.y);
                let _w = Math.min(this.width, this.stage.width - _x);
                let _h = Math.min(this.height, this.stage.height - _y);
                this.stage.clip(_x, _y, _w, _h);
            }
        }

        for (let child of this._children) {
            child.onRender(_x, _y);
        }

        if (this.isClip()) {
            this.stage.resetClip();
        }
    }

    public dispatchWheelEvent(evt: MyWheelEvent): boolean {
        //从上层到下层 从子节点到自己
        for (let i = this._children.length-1; i>=0; i--) {
            let child = this._children[i];
            if (child.dispatchWheelEvent(evt)) {
                return true;
            }
        }

        if (!this.isVisible() || !this.isInteractAble())
            return false;

        let rtn = this.onWheelEvent(evt);
        return rtn;
    }

    public onWheelEvent(evt: MyWheelEvent): boolean {
        if (!this.isMouseIn)
            return false;

        this.sendEvent(evt.type, evt, this);
        return this.swallowEvent;
    }

    public dispatchTouchEvent(evt: MyMouseEvent): boolean {
        //从上层到下层 从子节点到自己
        for (let i = this._children.length-1; i>=0; i--) {
            let child = this._children[i];
            if (child.dispatchTouchEvent(evt)) {
                return true;
            }
        }

        if (!this.isVisible() || !this.isInteractAble())
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
            let temp1 = Vec2.temp;
            temp1.x = evt.x;
            temp1.y = evt.y;
            let temp2 = Vec2.temp2;
            temp2.x = evt.mouseDown.x;
            temp2.y = evt.mouseDown.y;
            let diff = Vec2.distanceSq(temp1, temp2);
            if (diff < BTN_CLICK_DIS_SQ) {  //排除滑动点击
                // console.log("CLICK", evt.type, evt.x, evt.y, pos.x, pos.y)
                this.sendEvent(GameEvent.CLICK, evt, this);
            }
        }
        return this.swallowEvent; 
    }  

    public dispatchKeyEvent(evt: MyKeyboardEvent): boolean { 
        for (let i = this._children.length-1; i>=0; i--) {
            let child = this._children[i];
            if (child.dispatchKeyEvent(evt)) {
                return true;
            }
        }

        if (!this.isVisible() || !this.isInteractAble())
            return false;

        return this.onKeyEvent(evt);
    }

    public onKeyEvent(evt: MyKeyboardEvent): boolean { 
        this.sendEvent(evt.type, evt, this);
        return this.swallowEvent; 
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
        let pos = out || new Vec2();
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

    public setEnable(v:boolean): void {
        if (v) {
            this._property = this._property | PropertyType.Enable;
        } else {
            this._property = this._property & ~PropertyType.Enable;
        }
    }

    public isEnable(): boolean {
        return (this._property & PropertyType.Enable) > 0;
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

    public isClip(): boolean {
        return (this._property & PropertyType.Clip) > 0;
    }

    public setClip(v:boolean): void {
        if (v) {
            this._property = this._property | PropertyType.Clip;
        } else {
            this._property = this._property & ~PropertyType.Clip;
        }
    }

    public setClipRect(x:number, y:number, w:number, h:number) {
        if (this._clipRect == null) {
            this._clipRect = new Rect();
        }
        this._clipRect.x = x;
        this._clipRect.y = y;
        this._clipRect.width = w;
        this._clipRect.height = h;
    }
    //-------------------------------------------

    //-------------------------------------------
    // 子节点
    public addChild(node: UINode): void {
        this.stage.removeUIFromCache(node);
        node._parent = this;
        this._children.push(node);

        if (!node.isAwake()) {
            node.setAwake(true);
            node.onAwake();
        }
        if (!node.isEnable()) {
            node.setEnable(true);  //防止加入父节点后  父父再加入另一个节点触发多次
            node.onEnable();
        }
    }

    public addChildAt(node: UINode, idx:number): void {
        this.stage.removeUIFromCache(node);
        node._parent = this;
        this._children.splice(idx, 0, node);

        if (!node.isAwake()) {
            node.setAwake(true);
            node.onAwake();
        }
        node.onEnable();
    }

    public removeChild(node: UINode): void {
        this.stage.addUIInCache(node);
        node._parent = null;
        let index = this._children.indexOf(node);
        if (index >= 0) {
            this._children.splice(index, 1);
        }
        node.onDisable();
    }
    public removeChildAt(index: number): void {
        if (index >= 0 && index < this._children.length) {
            this.removeChild(this._children[index]);
        }
    }
    public removeFromParent(): void {
        if (this._parent) {
            this._parent.removeChild(this);
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