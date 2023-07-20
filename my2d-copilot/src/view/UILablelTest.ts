import { ViewBase } from "../base/mvc/ViewBase";
import { UILabel } from "../base/ui/ctrl/UILabel";
import { Color } from "../base/math/Color";


export class UILabelTest extends ViewBase {
    

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