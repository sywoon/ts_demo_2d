import { UINode } from "./UINode";
import { UILabel } from "./UILabel";
import { Color } from "../../math/Color";
import { MyMouseEvent } from "../../EventDefine";
import { Vec2 } from "../../math/Vec2";

export class UIButton extends UINode {
    label:UILabel;

    public constructor() {
        super();
        this.width = 100;
        this.height = 50;
        this.label = new UILabel();
        this.setInteractAble(true);
    }

    set text(text:string) {
        this.label.text = text;
    }

    get text():string {
        return this.label.text;
    }

    public onRender(x:number, y:number): void {
        this.graphic.fillRect(this.x+x, this.y+y, this.width, this.height, Color.Gray);
        this.graphic.strokeRect(this.x+x, this.y+y, this.width, this.height, Color.Black);
        this.label.onRender(this.x+x, this.y+y);
        
        //先画自己 再画子节点
        super.onRender(x, y);
    }

    public onTouchEvent(evt: MyMouseEvent): boolean {
        if (!this.hitTest(evt.x, evt.y))
            return false;

        return true; 
    }
}

 