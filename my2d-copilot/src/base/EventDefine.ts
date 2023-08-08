import { Vec2 } from "./math/Vec2";

export class GameEvent {
    static FOCUS = "focus";  //获得焦点
    static BLUR = "blur";   //失去焦点
    static VISIBILITY_CHANGE = "visibility_change"; //页面可见性改变

    static MOUSE_DOWN = "mouse_down";
    static MOUSE_UP = "mouse_up";
    static MOUSE_MOVE = "mouse_move";
    static CLICK = "click";
    static MOUSE_WHEEL = "mouse_wheel";  //鼠标滚动 

    static KEY_DOWN = "key_down";
    static KEY_UP = "key_up";
    static KEY_PRESS = "key_press";  //只对能够输入可打印字符的键有效

    static RESIZE = "resize";


    //自定义事件 UI扩展
    static COLOR_SELECTED = "color_selected";  //颜色选择器颜色改变
}

//避免和dom的MouseEvent冲突 换个名字
export class MyMouseEvent {
    type: string = "";
    x: number = 0;
    y: number = 0;
    mouseDown:Vec2;
    mouseDownTime:number;
    mouseLast:Vec2;
}

export class MyWheelEvent {
    public type: string;
    public deltaY: number;
    mouseDown:Vec2;
    mouseDownTime:number;
    mouseLast:Vec2;
}

export class MyKeyboardEvent {
    public type: string;
    public altKey: boolean = false;
    public ctrlKey: boolean = false;
    public shiftKey: boolean = false;

    public key: string;
    public code: string;
    public repeat: boolean;

    target: any;
}