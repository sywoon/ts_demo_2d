import { ViewBase } from "../base/ui/ViewBase";
import { UILable } from "../base/ui/ctrl/UILabel";

export class UILabelTest extends ViewBase {

    onCreate() {
        super.onCreate();

        let lable = new UILable();
        this.addChild(lable);

        lable.style = {
            fillStyle: "red",
            strokeStyle: "green",
            font: "20px sans-serif",
            textBaseline: "middle",
            textAlign: "center",
        };

        let size = this.gameApp.getCanvasSize();
        lable.x = size.width * 0.5;
        lable.y = size.height * 0.5;
        lable.text = "你好，世界！ Hello World!";
    }
}