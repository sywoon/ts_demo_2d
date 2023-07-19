import { ViewBase } from "../base/ui/ViewBase";
import { UILabel } from "../base/ui/ctrl/UILabel";
import { Color } from "../base/math/Color";
import { UIGeometry } from "../base/ui/ctrl/UIGeometry";

export class UILabelTest extends ViewBase {
    geo: UIGeometry;

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
            let geo = new UIGeometry();
            this.addChild(geo);
            this.geo = geo;

            geo.fillColor = Color.FromHex(0xff8765);
            geo.strokeColor = Color.FromHex(0x00ff00);
            geo.x = 0;
            geo.y = 100;
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
        let geo = this.geo;

        geo.fillRect(25, 25, 100, 100);
        geo.clearRect(45, 45, 60, 60);
        geo.strokeRect(50, 50, 50, 50);

        geo.drawLine(25, 25, 125, 125, "stroke", Color.Green);  //1像素 若水平/垂直 竟然看不见
        geo.drawTriangle(75, 50, 100, 75, 100, 25, "fill", Color.Blue); //1像素 若水平/垂直 竟然看不见

        geo.drawArc(175, 75, 50, 0, Math.PI * 2, true); // 绘制
        geo.drawArc(160, 65, 5, 0, Math.PI * 2, true, "fill");
        geo.drawArc(190, 65, 5, 0, Math.PI * 2, true, "fill");
        geo.drawArc(175, 75, 35, 0, Math.PI, false);

        super.onRender(x, y);
    }
}