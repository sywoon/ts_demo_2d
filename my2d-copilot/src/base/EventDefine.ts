
export enum GameEvent {
    UNKNOWN = 0,

    MOUSE_DOWN,
    MOUSE_UP,
    MOUSE_MOVE,
    MOUSE_CLICK,
    MOUSE_DOUBLE_CLICK,

    KEY_DOWN,
    KEY_UP,

    TOUCH_START,
    TOUCH_MOVE,
    TOUCH_END,
    TOUCH_CANCEL,
}

//避免和dom的MouseEvent冲突 换个名字
export class MyMouseEvent {
    type: GameEvent = GameEvent.UNKNOWN;
    x: number = 0;
    y: number = 0;
}

export class MyKeyboardEvent {
    public type: GameEvent = GameEvent.UNKNOWN;
    public altKey: boolean = false;
    public ctrlKey: boolean = false;
    public shiftKey: boolean = false;

    public key: string;
    public keyCode: number;
    public repeat: boolean;
}