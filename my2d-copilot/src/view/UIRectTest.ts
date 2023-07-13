import { ViewBase } from "../base/ui/ViewBase";

export class UIRectTest extends ViewBase {

    onCreate() {
        super.onCreate();
    }

    onRender(x: number, y: number): void {
        let graphic = this.graphic;
        graphic.saveStyle();

        graphic.setStyle({
            fillStyle: "rgb(200,0,0)",}
        );

        let offx = 0;
        let offy = 0;
        graphic.fillRect(10, 10, 55, 50);

        graphic.setStyle({
            fillStyle: "rgba(0, 0, 200, 0.5)",
        });
        graphic.fillRect(30, 30, 55, 50);

        //挖空案例 可看到背后的canvas背景色
        offx += 70;
        graphic.fillRect(25 + offx, 25, 100, 100);
        graphic.clearRect(45 + offx, 45, 60, 60);
        graphic.strokeRect(50 + offx, 50, 50, 50);

        graphic.restoreStyle();
    }
}