import { ViewBase } from "../base/ui/ViewBase";
import { UIGeometry } from "../base/ui/ctrl/UIGeometry";
import { Color } from "../base/math/Color";

export class UIRectTest extends ViewBase {
    geo: UIGeometry;

    onCreate() {
        super.onCreate();

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

    onRender(x: number, y: number): void {
        super.onRender(x, y);

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
    }
}