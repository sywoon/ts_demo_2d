import { GameConfig } from "./GameConfig";
import { AppRoot } from "./base/AppRoot";
import { Editor } from "./editor/Editor";


export class GameApp extends AppRoot {
    public constructor() {
        super();
    }

    init() {
        super.init();
    }

    run() {
        super.run();
        GameConfig.init();
        
        let editorMode = this.checkUrlParam("editor", "1");
        if (editorMode) {
            Editor.instance.init();
            this.uimgr.openUI("ui_editor");
        } else {
            this.uimgr.openUI("ui_main");
        }

        let types = [
            ["F0", 10000],
			["F0_1", 10000],
			["F1", 10000],
			["F2", 10000],
			["F3", Date.now()/1000],
			["F4", Date.now()/1000],
			["F5", 10000],
			["F6", Date.now()/1000],
			["F7", Date.now()/1000],
			["F8", Date.now()/1000],
			["F9", 1000],
			["F10", 1000],
			["F11", 1000],
        ];
        for (let arr of types) {
            let t = this.time.formatTimeStrT(arr[0] as string, arr[1])
            console.log(arr[0], t)
        }

        const timestamp = Date.now();
        const localDate = new Date(timestamp);
        // 2023/8/20 12:55:55 
        console.log(localDate.toLocaleString()); // 输出本地时间
        // Sun, 20 Aug 2023 04:55:55 GMT
        console.log(localDate.toUTCString())

        console.log(localDate.getHours(), localDate.getUTCHours())
    }
}

