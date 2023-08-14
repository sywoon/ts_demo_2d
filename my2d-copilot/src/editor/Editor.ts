import { GameEvent } from "../base/EventDefine";
import { EventDispatcher } from "../base/EventDispatcher";
import { HttpRequest } from "../base/HttpRequest";

export class Editor extends EventDispatcher {
    static _instance: Editor;
    static get instance(): Editor {
        if (!Editor._instance) {
            Editor._instance = new Editor();
        }
        return Editor._instance;
    }

    private _viewCfg:any;
    get viewCfg():any {
        return this._viewCfg;
    }

    init() {
        this._loadConfig();
    }

    private _loadConfig() {
        let url = "res/config/view_config.json";
        let request = new HttpRequest();
        request.send(url, null, "get", "text", [["Accept", "application/json"]]);
        request.onEvent(GameEvent.COMPLETE, this._onConfigLoaded, this);
    }

    private _onConfigLoaded(data: any, url:string) {
        this._viewCfg = JSON.parse(data);
        console.log(url, this._viewCfg);
        this.sendEvent(GameEvent.LOADED); 
    }

    getViewCfg(cbk:Function) {
        if (this._viewCfg) {
            cbk(this._viewCfg);
        } else {
            this.onEvent(GameEvent.LOADED, ()=>{
                cbk(this._viewCfg);
            }, this);
        }
    }
}