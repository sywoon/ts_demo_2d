import { UIGeometry } from "./UIGeometry";


export class UIColorGradient extends UIGeometry {
    grd: CanvasGradient;

    constructor() {
        super();
        this.width = 300;
        this.height = 30;
        this.setInteractAble(true);
    }

    protected onSizeChanged() {
        let pt = this.localToGlobal(0, 0);

        let grd = this.appRoot.canvas2d.context.createLinearGradient(pt.x, pt.y, this.width+pt.x, this.height+pt.y);
        grd.addColorStop(0, "rgb(255,0,0)");  
        grd.addColorStop(1/6, "rgb(255,0,255)");
        grd.addColorStop(2/6, "rgb(0,0,255)");
        grd.addColorStop(3/6, "rgb(0,255,255)");
        grd.addColorStop(4/6, "rgb(0,255,0)");
        grd.addColorStop(5/6, "rgb(255,255,0)");
        grd.addColorStop(1, "rgb(255,0,0)"); 
        this.grd = grd;
    }

    public onRender(x: number, y: number): void {
        super.onRender(x, y);

        if (!this.grd)
            return;

        // 填充渐变
        this.appRoot.canvas2d.context.fillStyle = this.grd;
        this.appRoot.canvas2d.context.fillRect(this.x+x, this.y+y, this.width, this.height);
    }
}