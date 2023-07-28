import { ClassUtils } from "../ClassUtils";
import { ViewBase } from "./ViewBase";
import { AppRoot } from "../AppRoot";
import { Stage } from "../Stage";

export class UIMgr {
    public static instance: UIMgr = null;
    public static getInstance(): UIMgr {
        if (UIMgr.instance === null) {
            UIMgr.instance = new UIMgr();
        }
        return UIMgr.instance;
    }

    private _uiList: Array<ViewBase> = new Array<ViewBase>();

    get stage(): Stage {
        return  AppRoot.getInstance().stage;
    }
    
    public constructor() {
    }

    public init(): void {
    }

    public openUI(uiName:string, ...args:any[]): void {
        let cfg = ClassUtils.getRegClass(uiName);
        if (!cfg) {
            console.error("openUI error: uiName not found", uiName);
            return;
        }

        let ui: ViewBase = new cfg.cls();
        ui.uiName = uiName;
        ui.config = cfg;
        ui.onCreate(...args);
        this._uiList.push(ui);
        this.stage.addChild(ui);
    }

    public closeUI(uiName: string): void {
        for (let ui of this._uiList) {
            if (ui.uiName == uiName) {
                ui.destory();
                this._uiList.splice(this._uiList.indexOf(ui), 1);
                break;
            }
        }
    }
}