import { ClassUtils } from "../ClassUtils";
import { Timer } from "../Timer";
import { ViewBase } from "./ViewBase";

export class UIMgr {
    public static instance: UIMgr = null;
    public static getInstance(): UIMgr {
        if (UIMgr.instance === null) {
            UIMgr.instance = new UIMgr();
        }
        return UIMgr.instance;
    }

    private _uiList: Array<ViewBase> = new Array<ViewBase>();
    public timer: Timer = new Timer();  //ui自己特有的定时器 
    
    public constructor() {

    }

    public init(): void {

    }
    public openUI(uiName:string): void {
        let cfg = ClassUtils.getRegClass(uiName);
        if (!cfg) {
            console.error("openUI error: uiName not found", uiName);
            return;
        }

        let ui: ViewBase = new cfg.cls();
        ui.uiName = uiName;
        ui.config = cfg;
        ui.onCreate();
        this._uiList.push(ui);
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

    public updateUI(): void {
        this.timer.update();
    }

    public renderUI(): void {
        for (let ui of this._uiList) {
            ui.onRender(0, 0);
            if (ui.config.isFullScreen)
                break;
        }
    }

    public onTouchEvent(): void {
        for (let ui of this._uiList) {
            if (ui.onTouchEvent())
                break;
        }
    }

    public onKeyEvent(): void {
        for (let ui of this._uiList) {
            if (ui.onKeyEvent())
                break;
        }
    }
}