import { ClassUtils } from "./base/ClassUtils";
import { UILabelTest } from "./view/UILablelTest";
import { UIRectTest } from "./view/UIRectTest";

export let ViewConfig:any = {
    ui_labelTest: {
        cls: UILabelTest, desc: "测试文本", isFullScreen: true,
    },
    ui_rectTest: {
        cls: UIRectTest, desc: "测试矩形", isFullScreen: true,
    }
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