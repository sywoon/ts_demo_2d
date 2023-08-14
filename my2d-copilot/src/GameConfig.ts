import { ClassUtils } from "./base/ClassUtils";
import { ViewLabelTest } from "./view/ViewLabelTest";
import { ViewRectTest } from "./view/ViewRectTest";
import { ViewMain } from "./view/ViewMain";
import { ViewColorPalette } from "./view/ViewColorPalette";
import { ViewImageTest } from "./view/ViewImageTest";
import { ViewEditor } from "./editor/ViewEditor";

export let ViewConfig:any = {
    ui_editor: {
        cls: ViewEditor, desc: "编辑器界面", isFullScreen: true,
    },
    ui_main: {
        cls: ViewMain, desc: "主界面", isFullScreen: true,
    },
    ui_labelTest: {
        cls: ViewLabelTest, desc: "测试文本", isFullScreen: true,
    },
    ui_rectTest: {
        cls: ViewRectTest, desc: "测试矩形", isFullScreen: true,
    },
    ui_colorPalette: {
        cls: ViewColorPalette, desc: "调色板", isFullScreen: true,
    },
    ui_imageTest: {
        cls: ViewImageTest, desc: "图片测试", isFullScreen: true,
    },
};

export class GameConfig {
    static width: number = 600;
    static height: number = 600;

    static init() {
        var reg: Function = ClassUtils.regClass;

        for (let name in ViewConfig) {
            let cfg = ViewConfig[name];
            reg(name, cfg);
        }
    }
}
