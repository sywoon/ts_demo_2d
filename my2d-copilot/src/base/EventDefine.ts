
export class GameEvent {
    static FOCUS = "focus";  //获得焦点
    static BLUR = "blur";   //失去焦点
    static VISIBILITY_CHANGE = "visibility_change"; //页面可见性改变

    static MOUSE_DOWN = "mouse_down";
    static MOUSE_UP = "mouse_up";
    static MOUSE_MOVE = "mouse_move";
    static MOUSE_OUT = "mouse_out";  //自己扩展的事件
    static CLICK = "click";

    static KEY_DOWN = "key_down";
    static KEY_UP = "key_up";

    static RESIZE = "resize";
}

//避免和dom的MouseEvent冲突 换个名字
export class MyMouseEvent {
    type: string = "";
    x: number = 0;
    y: number = 0;
}

export class MyKeyboardEvent {
    public type: string;
    public altKey: boolean = false;
    public ctrlKey: boolean = false;
    public shiftKey: boolean = false;

    public key: string;
    public keyCode: number;
    public repeat: boolean;
}