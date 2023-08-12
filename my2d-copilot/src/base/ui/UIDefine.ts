


export class PropertyType {
    static Visible      = 2 ** 0;
    static Awake        = 2 ** 1;     //是否已经创建
    static Active       = 2 ** 3;     //是否可交互 控件是否可交互
    static Clip         = 2 ** 4;     //是否开启裁剪
    static ImgReady     = 2 ** 5;     //图片下载完毕
}

export class DebugType {
    static Origin      = 2 ** 0;  //圆点位置
    static LabelRect   = 2 ** 1;  //显示label的rect
    static Geometry    = 2 ** 2;  //显示几何体辅助线
    static UIRect    = 2 ** 3;    //显示UI的rect
}

export let Scroll_Dir = {
    None: 0,
    Horizontal: 1,
    Vertical: 2,
    Both: 3,
}

export let Scroll_Move_Style = 1;  //1滑动方向和滑块方向一致 2滑动方向和滑块方向相反
export let BTN_CLICK_DIS_SQ = 20;  //鼠标滑动点击 最大距离的平方