import { GameEvent } from "./EventDefine";
import { EventDispatcher } from "./EventDispatcher";

export class HttpRequest extends EventDispatcher {
    protected _http = new XMLHttpRequest();
    protected _url: string;
    protected _method: string;
    protected _data: any;
    protected _responseType: string;

    get url(): string {
        return this._url;
    }

    get data(): any {
        return this._data;
    }

    get http(): any {
        return this._http;
    }


    send(url: string, data: any = null, method: string = "get", responseType: string = "text", headers: any[] = null) {
        this._url = url;
        this._data = data;
        this._method = method;
        this._responseType = responseType;

        let http = this._http;
        http.open(method, url, true);

        let isJson = false;
        if (headers) {
            for (let i = 0; i < headers.length; i++) {
                let header = headers[i];
                http.setRequestHeader(header[0], header[1]);
            }
        } else {
            if (!data || typeof (data) == "string") {
                http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            } else {
                http.setRequestHeader("Content-Type", "application/application/json");
                isJson = true;
            }
        }

        let that = this;
        let resType: XMLHttpRequestResponseType = responseType !== "arraybuffer" ? "text" : "arraybuffer";
        http.responseType = resType;
        http.onerror = function (e: any): void {
            that._onError(e);
        }
        http.onabort = function (e: any): void {
            that._onAbort(e);
        }
        http.onprogress = function (e: any): void {
            that._onProgress(e);
        }
        http.onload = function (e: any): void {
            that._onLoad(e);
        }
        http.send(isJson ? JSON.stringify(data) : data);
    }

    // 请求进度的侦听处理函数。
    protected _onProgress(e: any): void {
        if (e && e.lengthComputable) this.sendEvent(GameEvent.PROGRESS, e.loaded / e.total);
    }

    // 请求中断的侦听处理函数。
    protected _onAbort(e: any): void {
        this.error("Request was aborted by user");
    }

    protected _onError(e: any): void {
        this.error("Request failed Status:" + this._http.status + " text:" + this._http.statusText);
    }

    // 请求消息返回的侦听处理函数。
    protected _onLoad(e: any): void {
        var http: any = this._http;
        var status: number = http.status !== undefined ? http.status : 200;

        if (status === 200 || status === 204 || status === 0 ) {
            this.complete();
        } else {
            this.error("[" + http.status + "]" + http.statusText + ":" + http.responseURL);
        }
    }

    /**
     * @private
     * 请求错误的处理函数。
     * @param	message 错误信息。
     */
    protected error(message: string): void {
        this.clear();
        console.warn(this.url, message);
        this.sendEvent(GameEvent.ERROR, message);
    }

    protected complete(): void {
        this.clear();
        var flag: boolean = true;
        try {
            if (this._responseType === "json") {
                this._data = JSON.parse(this._http.responseText);
            } else if (this._responseType === "xml") {
                this._data = HttpRequest.parseXMLFromString(this._http.responseText);
            } else {
                this._data = this._http.response || this._http.responseText;
            }
        } catch (e:any) {
            flag = false;
            this.error(e.message);
            return;
        }
        
        flag && this.sendEvent(GameEvent.COMPLETE, this._data, this._http.responseURL)
    }

    //清除当前请求 已经执行的XMLHttpRequest并不会挺 只是不会再回调函数
    protected clear(): void {
        var http: any = this._http;
        http.onerror = http.onabort = http.onprogress = http.onload = null;
    }


    static parseXMLFromString(value: string): XMLDocument {
        var rst: any;
        value = value.replace(/>\s+</g, '><');
        rst = (new DOMParser()).parseFromString(value, 'text/xml');
        if (rst.firstChild.textContent.indexOf("This page contains the following errors") > -1) {
            throw new Error(rst.firstChild.firstChild.textContent);
        }
        return rst;
    }
}