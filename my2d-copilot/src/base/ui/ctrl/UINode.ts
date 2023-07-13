import { AppRoot } from "../../AppRoot";
import { IGraphic } from "../../IGraphic";

export enum PropertyType {
    Visible = 2 ^ 0,
    Awake = 2 ^ 1,
}

export class UINode {
    // UINode 只有位置和节点管理 没有大小概念
    // |-子节点管理  addChild removeChild setVisible isVisible-通过位来控制多个状态属性
    // |-创建和释放  create destory
    // |-渲染 onRender 
    // |-鼠标和键盘 控件事件(焦点 大小改变)  onTouchEvent onKeyEvent onCtrlEvent

    static create(): UINode {
        return new UINode();
    }

    get graphic(): IGraphic {
        return AppRoot.getInstance().graphic;
    }

    public x: number = 0;
    public y: number = 0;
    private _children: Array<UINode> = new Array<UINode>();



    public constructor() {}
    public destory() {}

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

    public onTouchEvent(): boolean { return false; }  //返回true表示事件被处理了
    public onKeyEvent(): boolean { return false; }
    public onCtrlEvent(): boolean { return false; }


    //-------------------------------------------
    // 属性部分
    private _property:number = 1;
    public setVisible(v:boolean): void {
        if (v) {
            this._property = this._property | PropertyType.Visible;
        } else {
            this._property = this._property | ~PropertyType.Visible;
        }
    }

    public isVisible(): boolean {
        return (this._property & PropertyType.Visible) > 0;
    }

    public setAwake(v:boolean): void {
        if (v) {
            this._property = this._property | PropertyType.Awake;
        } else {
            this._property = this._property | ~PropertyType.Awake;
        }
    }

    public isAwake(): boolean {
        return (this._property & PropertyType.Awake) > 0;
    }
    //
    //-------------------------------------------

    //-------------------------------------------
    // 子节点
    public addChild(node: UINode): void {
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
}