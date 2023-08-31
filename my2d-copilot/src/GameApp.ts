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

        this.time.setServerTime(Date.now(), -420 * 60 * 1000)
        const timestamp = Date.now();
        const localDate = new Date(timestamp);
        
        console.log("---本地时间")
        // 2023/8/20 12:55:55 
        console.log(localDate.toLocaleString()); // 输出本地时间
        // Sun, 20 Aug 2023 04:55:55 GMT
        console.log(localDate.toUTCString())
        console.log(localDate.getHours(), localDate.getUTCHours())

        console.log("---服务器时间")
        console.log(this.time.getDateStr(), this.time.getTimeStr())
        console.log("utc", this.time.getDateUtcStr(), this.time.getTimeUtcStr())

        let zeroTomorrow = this.time.getNextWeekZeroTime() * 1000
        // let zeroTomorrow = this.time.getTimeZeroTomorrow()
        console.log("getTimeZeroToDay", zeroTomorrow, this.time.formatSecondsAuto((zeroTomorrow-Date.now())/1000),
        this.time.formatSeconds((zeroTomorrow-this.time.getDate().getTime())/1000))

        let date = new Date();
        date.setHours(0, 0, 0, 0);
        console.log(date.getTime(), Date.now(), zeroTomorrow - date.getTime(), zeroTomorrow - Date.now())
        console.log("zero date", date.toDateString(), date.toLocaleString(), date.toUTCString())
    }
}

