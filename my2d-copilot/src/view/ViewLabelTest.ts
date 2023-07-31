import { ViewBase } from "../base/ui/ViewBase";
import { UILabel } from "../base/ui/ctrl/UILabel";
import { UIButton } from "../base/ui/ctrl/UIButton";
import { Color } from "../base/math/Color";


export class ViewLabelTest extends ViewBase {

    onCreate() {
        super.onCreate();

        {
            let lable;
            let text = "你好，世界！ Hello World!";
            lable = this._createLable(text, this.width * 0.5, this.height * 0.5);

            lable = this._createLable(text, 0, 0);
            lable.hAlign = "left";
            lable.vAlign = "top";

            lable = this._createLable(text, this.width, this.height);
            lable.hAlign = "right";
            lable.vAlign = "bottom";
        }

        {
            let btn = new UIButton();
            this.addChild(btn);

            btn.text = "按钮";
            btn.x = 100;
            btn.y = 100;
        }
        
    }

    private _createLable(text:string, x:number, y:number) {
        let lable = new UILabel();
        this.addChild(lable);

        lable.fontColor = Color.Red;
        lable.strokeColor = Color.Black;
        lable.fontSize = 22;
        lable.hAlign = "center";
        lable.vAlign = "middle";

        lable.x = x;
        lable.y = y;
        lable.text = text;
        return lable;
    }


    public onRender(x:number, y:number): void {
        super.onRender(x, y);
    }
}