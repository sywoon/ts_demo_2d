import { UINode } from "./UINode";

//内容容器 带滑动功能
export class UIPanel extends UINode {
    static Create(...args:any[]): UIPanel {
        let ui = new UIPanel();
        ui.onCreate(...args);
        return ui;
    }


    public constructor() {
        super();
    }
}