import { AppRoot } from "../AppRoot";
import { UINode } from "./ctrl/UINode";

export class ViewBase extends UINode {
    uiName:string;
    config: any;

    get gameApp(): any {
        return AppRoot.instance;
    }

    public constructor() {
        super();
    }

    //控件层没有update功能 只有render
    public onUpdate(): void {}
}
