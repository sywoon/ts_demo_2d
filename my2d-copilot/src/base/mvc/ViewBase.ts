import { AppRoot } from "../AppRoot";
import { UINode } from "../ui/ctrl/UINode";

export class ViewBase extends UINode {
    uiName:string;
    config: any;

    get gameApp(): any {
        return AppRoot.instance;
    }

    public constructor() {
        super();
    }

    public onCreate(): void {
        let size = this.gameApp.getCanvasSize();
        this.width = size.width;
        this.height = size.height;
    }

    //控件层没有update功能 只有render
    public onUpdate(): void {}
}
