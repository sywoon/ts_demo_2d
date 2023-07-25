


export class PropertyType {
    static Visible      = 2 ** 0;
    static Awake        = 2 ** 1;      //是否已经创建
    static InteractAble = 2 ** 2;  //是否可交互
}

export class DebugType {
    static Origin      = 2 ** 0;  //圆点位置
    static LabelRect   = 2 ** 1;  //显示label的rect
    static Geometry    = 2 ** 2;  //显示几何体辅助线
}



