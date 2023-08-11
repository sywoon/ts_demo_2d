import { GameConfig } from "./GameConfig";
import { AppRoot } from "./base/AppRoot";


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
        
        this.uimgr.openUI("ui_main");
    }
}

