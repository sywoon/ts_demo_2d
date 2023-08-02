import { GameEvent } from "../../EventDefine";
import { Color } from "../../math/Color";
import { Vec2 } from "../../math/Vec2";
import { UIGeometry } from "./UIGeometry";
import { UILabel } from "./UILabel";


export class UIColorUnit extends UIGeometry {
    label: UILabel;
    color: Color = new Color();

    constructor() {
        super();

        let lable = new UILabel();
        lable.text = "#ffffff";
        lable.x = 25;
        lable.y = 3;
        lable.style.vAlign = "top";
        lable.fontSize = 18;
        lable.debug = 0;
        this.addChild(lable);
        this.label = lable;
    }

    setColor(v:Color) {
        this.color.copyFrom(v);
        this.label.text = v.toString() + " " + v.toRGBString();
    }

    public onRender(x: number, y: number): void {
        super.onRender(x, y);
        this.fillRect(x, y, 20, 20, this.color);
    }
}