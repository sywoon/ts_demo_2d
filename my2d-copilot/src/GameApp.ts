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
    }
}

