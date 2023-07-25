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
            geo.strokeColor = Color.FromHex(0x00fff1);
            geo.x = 0;
            geo.y = 100;
        }
    }

    onRender(x: number, y: number): void {
        super.onRender(x, y);

        let geo = this.geo;
        geo.x = 0;
        geo.y = 0;

        geo.fillRect(25, 25, 100, 100);
        geo.clearRect(45, 45, 60, 60);
        geo.strokeRect(50, 50, 50, 50);
        geo.drawLine(25, 25, 125, 125, "stroke", Color.Green);  //1像素 若水平/垂直 竟然看不见

        geo.y += 100;
        geo.drawTriangle(75, 50, 100, 75, 100, 25, "fill", Color.Blue); //1像素 若水平/垂直 竟然看不见

        geo.y += 50;
        geo.drawArc(175, 75, 50, 0, Math.PI * 2, true); // 绘制
        geo.drawArc(160, 65, 5, 0, Math.PI * 2, true, "fill");
        geo.drawArc(190, 65, 5, 0, Math.PI * 2, true, "fill");
        geo.drawArc(175, 75, 35, 0, Math.PI, false);

        geo.y += 120;
        geo.drawQuadraticCurve(25, 35, 125, 62.5, 65, 10);

        geo.x += 120;
        geo.drawQuadraticCurveEx(75, 25, [
            [25, 25, 25, 62.5],
            [25, 100, 50, 100],
            [50, 120, 30, 125],
            [60, 120, 65, 100],
            [125, 100, 125, 62.5],
            [125, 25, 75, 25],
        ]);
        geo.y += 100;
        geo.x = 0;
        geo.drawCubicCurve(25, 40, 125, 80, 70, 17, 110, 25);

        geo.x += 120;
        geo.drawCubicCurveEx(75, 40, [
            [75, 37, 70, 25, 50, 25],
            [20, 25, 20, 62.5, 20, 62.5],
            [20, 80, 40, 102, 75, 120],
            [110, 102, 130, 80, 130, 62.5],
            [130, 62.5, 130, 25, 100, 25],
            [85, 25, 75, 37, 75, 40],
        ], "fill");
    }
}