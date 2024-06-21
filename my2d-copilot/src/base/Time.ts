//-----------------------------------------------
// 时间类
//
// @author Songyw
// 2020.4.12 21:10
// 时间相关概念：
// 1. Date.now()   Unix 纪元（1970 年 1 月 1 日）以来的当前时间戳，以毫秒为单位 
//	和时区无关 或可理解为基于0时区； 所有的时间戳都和时区无关 只有转为Date对象后 才会受到时区影响
//  注意：new Date() 会受到时区的影响 包含日期、时间和时区信息
// 2. date.toLocaleString()  转换为本地时间格式的字符串表示 考虑用户的本地设置，包括时区、日期格式和时间格式
//    date.toUTCString() 转换为一个符合 UTC（协调世界时） 不考虑时区设置
//    date.getTimezoneOffset() 获取当前时区偏移的方法 返回当前时区与 UTC（协调世界时）之间的分钟差值
//      正值表示当前时区比 UTC 时间晚，负值表示当前时区比 UTC 时间早
//      比如：北京时间为东8区UTC+8 比UTC时间晚8小时 
//		注意：getTimezoneOffset返回值的符号 正好与之相反 -480分钟 
// 3. 本类一旦设置了服务器时间和时区后 所有得到的时间戳和日期都是基于服务器时区的
//-----------------------------------------------

import { StringEx } from "./StringExt";


export default class Time {
    private _bootTime: number = Date.now(); //游戏启动用时
    private _serverTime: number;
    private _svrUtcOff: number; //与服务器所在时区差值
    private _localUtcOff: number;
    private _localTime: number;
    private _formatCall: { [key: string]: Function } = {};

    constructor() {
        this._localUtcOff = new Date().getTimezoneOffset() * 60 * 1000; //获得的是分钟 转为毫秒
        this._svrUtcOff = this._localUtcOff;

        this._formatCall = {
            F0: this._formatTimeStr0,
        };

        this.setServerTime(this.getLocalTime(), this.getLocalTime(), this._svrUtcOff);
    }

    registerFormats(data: { [type: string]: Function }) {
        for (let type in data) {
            this._formatCall[type] = data[type];
        }
    }

    //游戏已经运行的时间(毫秒)
    getRunTime() {
        return Date.now() - this._bootTime;
    }

    getRunTimeStr() {
        let diff = this.getRunTime();
        return this.formatSecondsAuto(diff / 1000);
    }

    // 同步服务器时间
    setServerTime(svrTime: number, localTime: number, svrUtcOff: number = 0) {
        //服务器当前时间戳(毫秒) + utc差值  东区为负数 西区为正 和getTimezoneOffset一致
        this._svrUtcOff = svrUtcOff;
        this._serverTime = svrTime;
        this._localTime = localTime;
    }

    //时间戳：毫秒级别 1970年1月1日至今的毫秒数  本地时间和服务器无关
    getLocalTime(): number {
        return Date.now();
    }

    //-------------------具体时间相关-----------------

    //登录后 以下时间就是服务器时间  时区也和服务器相同  时间戳也是基于这个时区
    //return number 毫秒
    getTime(): number {
        let time = this._serverTime + (this.getLocalTime() - this._localTime);
        return time;
    }

    //return 秒
    //fix 0:带小数 1:四舍五入 2:向下取整 3:向上取整
    //避免比服务器快 默认采用向下取整
    getSecondTime(fix: number = 2): number {
        let t = this.getTime() / 1000;
        switch (fix) {
            case 0:
                return t;
            case 1:
                return Math.round(t);
            case 2:
                return Math.floor(t);
            case 3:
                return Math.ceil(t);
            default:
                return t;
        }
    }

    //return 服务器时区的date
    getDate(stamp?: number): Date {
        stamp = stamp ? stamp : this.getTime();
        let date = new Date();
        date.setTime(stamp + this._getUtcOff());
        return date;
    }

    private _getUtcOff(): number {
        return this._localUtcOff - this._svrUtcOff;
    }


    //-------------------倒计时相关 以秒为单位-------------------

	// hh:mm:ss						second:秒 1000 -> 02:46:40
	// dd天hh:mm:ss					second:秒 1000 -> 1天02:46:40
	// dd天hh时mm分ss秒				 second:秒 1000 -> 00天02时46分40秒
	// fmt:"hh:mm:ss.iii" 自定义输出格式  小数部分表示毫秒00:00:00.000
	formatSeconds(second: number, fmt:string="hh:mm:ss"): string {
		let days = Math.floor(second / (24 * 60 * 60));
		let hours = Math.floor((second - days * (24 * 60 * 60)) / (60 * 60));
		let minutes = Math.floor(((second - days * (24 * 60 * 60)) - hours * (60 * 60)) / 60);
		let secondsAll = ((second - days * (24 * 60 * 60)) - hours * (60 * 60)) - minutes * 60;
		let seconds = Math.floor(secondsAll);
		let milliseconds = Math.floor((secondsAll - seconds) * 1000);

		const formattedDate = fmt
				.replace("dd", days.toString())
				.replace("hh", StringEx.padStart(hours, 2, '0'))
				.replace("mm", StringEx.padStart(minutes, 2, '0'))
				.replace("ss", StringEx.padStart(seconds, 2, '0'))
				.replace("iii", StringEx.padStart(milliseconds, 3, '0'));

		return formattedDate;
	}

    //根据剩余长度 显示不同的格式
	formatSecondsAuto(second: number): string {
		if (second >= 24 * 60 * 60) {
			return this.formatSeconds(second, "dd天hh:mm:ss");
		}
        if (second >= 3600) {
            return this.formatSeconds(second, "hh:mm:ss");
        }
		return this.formatSeconds(second, "mm:ss");
	}


    //-------------------时间戳转换显示-----------------

    //fmt:"hh:mm:ss.iii"带毫秒 "hh:mm:ss"
    getTimeStr(stamp: number = 0, fmt = "hh:mm:ss"): string {
        return this.formatDateStr(stamp, fmt);
    }

    getTimeUtcStr(stamp: number = 0, fmt = "hh:mm:ss"): string {
        return this.formatDateUtcStr(stamp, fmt);
    }

    // hh:mm:ss 由外部扩展转换方式  保留手段 优先使用getTimeStr
    getTimeStrEx(stamp: number): string {
        return this.formatTimeStrT("F0", stamp);
    }

    // 格式类型 		         调用参数
    // F0: hh:mm:ss				second:秒
    formatTimeStrT(type: string, ...args: any[]): string {
        let func = this._formatCall[type];
        if (func == null) {
            console.error("formatTimeStr type error:" + type);
            return;
        }
        return func.apply(this, args);
    }

    // 时间格式0 hh:mm:ss  秒转倒计时
    private _formatTimeStr0(second: number): string {
        return this.formatSeconds(second, "hh:mm:ss");
    }

    //-------------------日期转换显示-----------------

    getDateStr(stamp: number = 0, fmt = "yyyy-MM-dd hh:mm:ss"): string {
        return this.formatDateStr(stamp, fmt);
    }

    getDateUtcStr(stamp: number = 0, fmt = "yyyy-MM-dd hh:mm:ss"): string {
        return this.formatDateUtcStr(stamp, fmt);
    }

    // yyyy-MM-dd hh:mm:ss				utc:时间戳(秒) 2023-08-20 12:36:12
    // yyyy年MM月dd日 hh时mm分ss秒	 	 utc:时间戳(秒) 2023年08月20日12时37分41秒
    // yyyy/MM/dd						utc:时间戳(秒) 2023/8/20
    // fmt: "yyyy-MM-dd hh:mm:ss.iii" 自定义输出格式
    formatDateStr(stamp: number = 0, fmt: string = "yyyy-MM-dd hh:mm:ss"): string {
        const date = this.getDate(stamp);
        const year = date.getFullYear().toString();
        const month = StringEx.padStart(date.getMonth() + 1, 2, "0");
        const day = StringEx.padStart(date.getDate(), 2, "0");
        const hours = StringEx.padStart(date.getHours(), 2, "0");
        const minutes = StringEx.padStart(date.getMinutes(), 2, "0");
        const seconds = StringEx.padStart(date.getSeconds(), 2, "0");
        const milliseconds = StringEx.padStart(date.getMilliseconds(), 3, "0");

        const formattedDate = fmt.replace("yyyy", year).replace("MM", month)
                .replace("dd", day).replace("hh", hours).replace("mm", minutes)
                .replace("ss", seconds).replace("iii", milliseconds);
        return formattedDate;
    }

    //根据当前地区的日期时间 得到标准时区日期和时间
    formatDateUtcStr(stamp: number = 0, fmt: string): string {
        const date = this.getDate(stamp);
        const year = date.getUTCFullYear().toString();
        const month = StringEx.padStart(date.getUTCMonth() + 1, 2, "0");
        const day = StringEx.padStart(date.getUTCDate(), 2, "0");
        const hours = StringEx.padStart(date.getUTCHours(), 2, "0");
        const minutes = StringEx.padStart(date.getUTCMinutes(), 2, "0");
        const seconds = StringEx.padStart(date.getUTCSeconds(), 2, "0");
        const milliseconds = StringEx.padStart(date.getUTCMilliseconds(), 3, "0");

        const formattedDate = fmt.replace("yyyy", year).replace("MM", month)
                .replace("dd", day).replace("hh", hours).replace("mm", minutes)
                .replace("ss", seconds).replace("iii", milliseconds);
        return formattedDate;
    }


    //-------------------跨天 跨周 跨月-----------------

    // 获取第二天零点 以服务器时区为准
    getTimeZeroToDay(stamp?: number): number {
        //方案1: 使用0时区重置
        stamp = stamp ? stamp : this.getTime();
        let data = new Date(stamp - this._svrUtcOff); //转为0时区 时间调成服务器一致
        data.setUTCHours(0, 0, 0, 0);
        let dayCount = 86400;
        return data.getTime() / 1000 + dayCount + this._svrUtcOff / 1000;  //补上之前减少的时间差


        //方案2: 使用本地时区重置
        // let data = new Date(stamp + this._getUtcOff());
        // data.setHours(0, 0, 0, 0);
        // return data.getTime() / 1000 + dayCount - this._getUtcOff() / 1000;
    }

    // 获取相对当前时间下周一零点(s)
    getNextWeekZeroTime(stamp?: number): number {
        stamp = stamp ? stamp : this.getTime();
        let targetDay = new Date(stamp - this._svrUtcOff);
        let weekDay = targetDay.getUTCDay() == 0 ? 7 : targetDay.getUTCDay();
        targetDay.setUTCDate(targetDay.getUTCDate() + (8 - weekDay));
        targetDay.setUTCHours(0, 0, 0, 0);
        return targetDay.getTime() / 1000 + this._svrUtcOff / 1000;
    }

    // 获取相对当前时间下个月1号零点(s)
    getNextMonthZeroTime(stamp?: number): number {
        stamp = stamp ? stamp : this.getTime();
        let targetDay = new Date(this.getTime() - this._svrUtcOff);
        let monthDay = targetDay.getUTCMonth();
        targetDay.setUTCMonth(monthDay + 1);
        targetDay.setUTCDate(1);
        targetDay.setUTCHours(0, 0, 0, 0);
        return targetDay.getTime() / 1000 + this._svrUtcOff / 1000;
    }

    // 获取相对当前时间下周某天的零点(s) day 星期几 1-7
    getNextWeekZeroTime2(day: number): number {
        let targetDay = new Date(this.getTime() - this._svrUtcOff);
        let weekDay = targetDay.getUTCDay() == 0 ? 7 : targetDay.getUTCDay();
        let dayNum = 0;
        if (weekDay > day) {
            dayNum = 7 - weekDay + day;
        } else {
            dayNum = day - weekDay;
        }
        let time = targetDay.getTime() + dayNum * (60 * 60 * 24 * 1000);
        targetDay.setTime(time);
        targetDay.setUTCHours(0, 0, 0, 0);
        return targetDay.getTime() / 1000 + this._svrUtcOff / 1000;
    }


    //-------------------其他--------------------

    //获取当天指定时间的时间戳 "00:00" or "00:00:00" 格式 时:分 or 时:分:秒
    getTimeStampByStr(str: string) {
        let data = new Date();
        data.setTime(this.getTime() - this._svrUtcOff);
        data.setUTCHours(0, 0, 0, 0);

        let strl = str.split(":");
        data.setUTCHours(parseInt(strl[0]));
        data.setUTCMinutes(parseInt(strl[1]));
        if (strl.length > 2) {
            data.setUTCSeconds(parseInt(strl[2]));
        }
        return data.getTime() + this._svrUtcOff;
    }

    // 是否在同一天
    // @param date1 时间戳1
    // @param date2 时间戳2
    isSameDay(stamp1: number, stamp2: number) {
        let d1 = this.getDate(stamp1);
        let d2 = this.getDate(stamp2);
        return d1.getFullYear() === d2.getFullYear() 
            && d1.getMonth() === d2.getMonth() 
            && d1.getDate() === d2.getDate();
    }
}
