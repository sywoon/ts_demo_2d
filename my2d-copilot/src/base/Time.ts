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

export default class Time {
	private _serverTime: number;
	private _svrUtcOff: number;  //与服务器所在时区差值
	private _localUtcOff: number;
	private _localTime: number;
	private _formatCall:any = {};
	private _bootTime:number;  //启动用时

	constructor() {
		this._localUtcOff = new Date().getTimezoneOffset() * 60 * 1000;  //获得的是分钟 转为毫秒
		this._svrUtcOff = this._localUtcOff;
		this._bootTime = Date.now();

		this._formatCall = {
			"F0": this._formatTimeStr0,
			"F0_1": this._formatTimeStr0_1,
			"F1": this._formatTimeStr1,
			"F2": this._formatTimeStr2,
			"F3": this._formatTimeStr3,
			"F4": this._formatTimeStr4,
			"F5": this._formatTimeStr5,
			"F6": this._formatTimeStr6,
			"F7": this._formatTimeStr7,
			"F8": this._formatTimeStr8,
			"F9": this._formatTimeStr9,
			"F10": this._formatTimeStr10,
			"F11":this._formatTimeStr11,
		};

		this.setServerTime(this.getLocalTime(), this._svrUtcOff);
	}

	//启动到现在的时间
	getUsedTime():number {
		return Date.now() - this._bootTime;
	}

	// 同步服务器时间
	// 服务器当前时间戳(毫秒) + utc差值(转换毫秒)  东区为负数 西区为正 和getTimezoneOffset一致
	setServerTime(time:number, svrUtcOff:number=0) {  
		this._svrUtcOff = svrUtcOff;
		this._serverTime = time;
		this._localTime = this.getLocalTime();
	}

	//本地时区和服务器时区的差值 毫秒
	getUtcOff(): number {
		return this._localUtcOff - this._svrUtcOff;
	}

	//毫秒级别 1970年1月1日至今的毫秒数
	//时间戳是基于协调世界时（UTC，Coordinated Universal Time）
	// 是一种与时区无关的时间标准
	getLocalTime(): number {  
		return Date.now();
	}

	//时间戳 毫秒
	//设置服务器时间后 以下时间就和服务器时间同步 
	getTime(): number {
		let time = this._serverTime + (this.getLocalTime() - this._localTime);
		return time;
	}

	//秒
	getSecondTime(): number {
		return Math.floor(this.getTime() / 1000);
	}
	
	//得到Date
	//utcStamp：毫秒 时间戳 
	//设置服务器时区差后 得到的Date对象就是服务器时区的
	getDate(utcStamp:number=0) {  
		if (utcStamp === 0) {
			utcStamp = this.getTime();  
		}

		utcStamp += this.getUtcOff();  //转为服务器时区
		//date.setTime(this.getTime() + this.getUtcOff());  //两者用法等同
		return new Date(utcStamp);
	}


	// getDateStr(utcStamp:number=0): string {
	// 	let date = this.getDate(utcStamp);
	// }

	// fmt: "yyyy-MM-dd hh:mm:ss"
	formatDateStr(fmt:string, utcStamp:number=0): string {
		const date = this.getDate(utcStamp);

		const year = date.getFullYear();
		const month = StringEx.padStart(date.getMonth() + 1, 2, '0');
		const day = StringEx.padStart(date.getDate(), 2, '0');
		const hours = StringEx.padStart(date.getHours(), 2, '0');
		const minutes = StringEx.padStart(date.getMinutes(), 2, '0');
		const seconds = StringEx.padStart(date.getSeconds(), 2, '0');

		const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
		return formattedDateTime;
	}


	getNowStr() : string {
		let date = new Date();
		date.setTime(Date.now() + this.getUtcOff());

		let str = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`;
		return str;
	}

	getNowStrUTC() : string {
		let date = new Date();
		date.setTime(Date.now() + this.getUtcOff());

		let str = `${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}.${date.getUTCMilliseconds()}`;
		return str;
	}

	

	getTimeStr(): string {
		let time = this.getTime();
		return this.formatTimeStrT("F3", time);
	}

	

	

	

	//用于计算倒计时
	getNextTime(second: number): number {
		let time = this.getTime();
		return time + second * 1000;
	}

	// 获取第二天零点
	getTimeZeroToDay(): number {
		var data = new Date(this.getTime() - this._svrUtcOff);
		data.setUTCHours(0, 0, 0, 0);
		let dayCount = 86400;
		return data.getTime() / 1000 + dayCount + this._svrUtcOff / 1000;
	}

	// 获取第二天零点  以服务器时区为准
	getTimeZeroToDay2UTC(time: number): number {
		var data = new Date(time * 1000 - this._svrUtcOff);
		data.setUTCHours(0, 0, 0, 0);
		let dayCount = 86400;
		return data.getTime() / 1000 + dayCount + this._svrUtcOff / 1000;
	}

	// 获取相对当前时间下周一零点(s)
	getNextWeekZeroTime(): number {
		let targetDay = new Date(this.getTime() - this._svrUtcOff);
		let weekDay = targetDay.getUTCDay() == 0 ? 7 : targetDay.getUTCDay();
		targetDay.setUTCDate(targetDay.getUTCDate() + (8 - weekDay));
		targetDay.setUTCHours(0, 0, 0, 0);
		return targetDay.getTime() / 1000 + this._svrUtcOff / 1000;
	}

	// 获取相对当前时间下个月1号零点(s)
	getNextMonthZeroTime(): number {
		let targetDay = new Date(this.getTime() - this._svrUtcOff);
		let monthDay = targetDay.getUTCMonth();
		targetDay.setUTCMonth(monthDay + 1);
		targetDay.setUTCDate(1);
		targetDay.setUTCHours(0, 0, 0, 0);
		return targetDay.getTime() / 1000 + this._svrUtcOff / 1000;
	}

	// 获取相对当前时间下周某天的零点(s) day 星期几 1-7
	getNextWeekZeroTime2(day:number): number {
		let targetDay = new Date(this.getTime() - this._svrUtcOff);
		let weekDay = targetDay.getUTCDay() == 0 ? 7 : targetDay.getUTCDay();
		let dayNum = 0;
		if(weekDay > day){
			dayNum = 7 - weekDay + day;
		}else{
			dayNum = day - weekDay;
		}
		let time = targetDay.getTime() + dayNum * ( 60 * 60 * 24 * 1000 );
		targetDay.setTime(time);
		targetDay.setUTCHours(0, 0, 0, 0);
		return targetDay.getTime() / 1000 + this._svrUtcOff / 1000;
	}

	/**
	 * 获取当天指定时间的时间戳 "00:00" 格式 时:分
	 * @param str "00:00:00" 格式
	 */
	getTimeStampBystr(str: string) {
		var data = new Date(this.getTime() - this._svrUtcOff);
		data.setUTCHours(0, 0, 0, 0);
		var strl = str.split(":");
		data.setUTCHours(parseInt(strl[0]));
		data.setUTCMinutes(parseInt(strl[1]));
		return data.getTime() + this._svrUtcOff;
	}

	

	//-------------------时间转换显示-----------------

	// 最普通的用法
	// hh:mm:ss
	formatTimeStr(second: number): string {
		return this.formatTimeStrT("F0", second);
	}

	// 格式类型 		            	调用参数
	// F0: hh:mm:ss						second:秒 1000 -> 02:46:40
	// F0_1: n天n时n分n秒				 second:秒 1000 -> 00天02时46分40秒
	// F1: mm:ss						second:秒 1000 -> 166:40
	// F2: hh:mm:ss(hh auto)			second:秒 倒计时 1小时以上?F0:F1
	// F3: xx年xx月xx日 xx:xx:x			utc:时间戳(秒) 2023-08-20 12:36:12
	// F4: xx年xx月xx日 xx时xx分xx秒	 utc:时间戳(秒) needYear=true 2023年08月20日12时37分41秒
	// F5: mm:ss.ms	    00:00.000		second:秒 小数部分表示毫秒 166:40.000
	// F6: xx/xx/xx 年/月/日			utc:时间戳(秒) 2023/8/20
	// F7: xx/xx xx:xx:x				utc:时间戳(秒) 08/20 12:38:35
	// F8: xx-xx-xx xx:xx:x				utc:时间戳(秒) 2023-08-20 12:39:02
	// F9: dd:hh or hh:mm or mm:ss		second:秒 1000 -> 16分钟40秒
	// F10: 天?:时?:分?:秒				 second:秒 1000 -> 16分40秒
	// F11: 天前?时前?分前?秒前		 	  second:秒 1000 -> 16分前
	//
	//服务器给的时间戳为秒 所以这里都以秒为单位
	//注意：Date.now()返回的是毫秒
	formatTimeStrT(type: string, ...args:any[]): string {
		let func:Function = this._formatCall[type];
		if (func == null) {
			console.error("formatTimeStr type error:" + type);
			return;
		}
		return func.apply(this, args);
	}

	formatTimeStrTUTC(type: string, ...args:any[]): string {
		return this.formatTimeStrT(type, ...args);  //放到format内部处理utc偏移  保持gettime和服务器时间戳一致

		switch (type) {
			//差值计算  与时间戳无关
			case "F0":
			case "F0_1":
			case "F1":
			case "F2":
			case "F5":
			case "F9":
			case "F10":
				return this.formatTimeStrT(type, ...args);
			case "F3":
			case "F4":
			case "F6":
			case "F7":
			case "F8":
				let utc = args.shift();
				utc += this.getUtcOff()/1000;  //这里以秒为单位
				return this.formatTimeStrT(type, utc, ...args);
		}
	}

	// 时间格式0 hh:mm:ss
	private _formatTimeStr0(second: number): string {
		let hour = Math.floor(second / (60 * 60));
		let minute = Math.floor((second - hour * 60 * 60) / (60));
		let sec = Math.floor((second - hour * 60 * 60 - minute * 60));
		return '' + (hour >= 0 && hour < 10 ? '0' + hour : hour) + ':' + (minute < 10 ? '0' + minute : minute) + ':' + (sec < 10 ? '0' + sec : sec);
	}

	private _formatTimeStr0_1(second: number): string {
		let day = Math.floor(second / (24 * 60 * 60));
		let hour = Math.floor(((second - day * (24 * 60 * 60)) / (60 * 60)));
		let minute = Math.floor(((second - day * (24 * 60 * 60)) - hour * (60 * 60)) / 60);
		let sec = Math.floor((((second - day * (24 * 60 * 60)) - hour * (60 * 60)) - minute * 60));

		let v1 = day >= 0 && day < 10 ? '0' + day : day;
		let v2 = hour < 10 ? '0' + hour : hour;
		let v3 = minute < 10 ? '0' + minute : minute;
		let v4 = sec < 10 ? '0' + sec : sec;
		return `${v1}天${v2}时${v3}分${v4}秒`;
	}

	// 时间格式1 mm:ss
	private _formatTimeStr1(second: number): string {
		let minute = Math.floor(second / 60);
		let sec = Math.floor(second - minute * 60);
		return (minute < 10 ? '0' + minute : minute) + ':' + (sec < 10 ? '0' + sec : sec);
	}

	// 时间格式2 hh:mm:ss(hh auto)
	private _formatTimeStr2(second: number): string {
		return second >= 3600 ? this._formatTimeStr0(second) : this._formatTimeStr1(second)
	}

	// 时间格式3 xx年xx月xx日 xx:xx:x
	// utc:时间戳(秒)
	private _formatTimeStr3(utc: number): string {
		if (utc == 0)
			return "";

		var date: Date = new Date();
		date.setTime(utc * 1000 + this.getUtcOff());

		var str: string = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " ";
		str += date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
		return str.replace(/\b(\d)\b/g, "0$1");
	}

	// 时间格4  xx年xx月xx日 xx时xx分xx秒
	// utc:时间戳(秒)
	private _formatTimeStr4(utc: number, needYear: boolean = true): string {
		if (utc == 0)
			return "";

		var date: Date = new Date();
		date.setTime(utc * 1000 + this.getUtcOff());

		let yearStr: string = needYear ? (date.getFullYear() + "年") : "";
		var str: string = yearStr + (date.getMonth() + 1) + "月" + date.getDate() + "日" + date.getHours() + "时" + date.getMinutes() + "分" + date.getSeconds() + "秒";
		return str.replace(/\b(\d)\b/g, "0$1");
	}

	// F5: mm:ss.ms		second:秒 小数部分表示毫秒   00:00.000
	private _formatTimeStr5(second: number): string {
		let time = Math.floor(second);
		let ms = second - time;

		let pre = this._formatTimeStr1(time);
		let str = ms.toFixed(3);  //0.001
		str = str.substr(1); // .001
		return pre + str;
	}

	// 时间格式6 xx/xx/xx 年/月/日
	// utc:时间戳(秒)
	private _formatTimeStr6(utc: number): string {
		if (utc == 0)
			return "";

		var date: Date = new Date();
		date.setTime(utc * 1000 + this.getUtcOff());

		var str: string = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
		return str;
	}

	// 时间格式7 xx/xx xx:xx:x
	// utc:时间戳(秒)
	private _formatTimeStr7(utc: number): string {
		if (utc == 0)
			return "";

		var date: Date = new Date();
		date.setTime(utc * 1000 + this.getUtcOff());

		var str: string = (date.getMonth() + 1) + "/" + date.getDate() + " ";
		str += date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
		return str.replace(/\b(\d)\b/g, "0$1");
	}


	// 时间格式8 xx-xx-xx xx:xx:x
	// utc:时间戳(秒)
	private _formatTimeStr8(utc: number): string {
		if (utc == 0)
			return "";

		var date: Date = new Date();
		date.setTime(utc * 1000 + this.getUtcOff());

		var str: string = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " ";
		str += date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
		return str.replace(/\b(\d)\b/g, "0$1");
	}

	/** dd:hh or hh:mm or mm:ss */
	private _formatTimeStr9(second: number): string {
		let day = Math.floor(second / (24 * 60 * 60));
		let hour = Math.floor(((second - day * (24 * 60 * 60)) / (60 * 60)));
		let minute = Math.floor(((second - day * (24 * 60 * 60)) - hour * (60 * 60)) / 60);
		let sec = Math.floor((((second - day * (24 * 60 * 60)) - hour * (60 * 60)) - minute * 60));
		let str = "";
		if (day > 0) {
			if (day < 10) {
				str += "0" + `${day}天${hour}小时`;
			} else {
				str += `${day}天${hour}小时`;
			}
		}
		else if (hour > 0) {
			str += `${hour}小时${minute}分`;
		} else {
			str += `${minute}分钟${sec}秒`;
		}
		return str;
	}

	/** 天：时：分：秒 */
	private _formatTimeStr10(second: number, needSecond: boolean = true): string {
		let day = Math.floor(second / (24 * 60 * 60));
		let hour = Math.floor(((second - day * (24 * 60 * 60)) / (60 * 60)));
		let minute = Math.floor(((second - day * (24 * 60 * 60)) - hour * (60 * 60)) / 60);
		let sec = Math.floor((((second - day * (24 * 60 * 60)) - hour * (60 * 60)) - minute * 60));
		let str = "";

		if (day > 0)
			str += `${day}天`;
		if (hour > 0)
			str += `${hour}时`;
		if (minute > 0)
			str += `${minute}分`;
		if (needSecond) {
			str += `${sec}秒`;
		}
		return str;
	}

	private _formatTimeStr11(second: number): string {
		let day = Math.floor(second / (24 * 60 * 60));
		let hour = Math.floor(((second - day * (24 * 60 * 60)) / (60 * 60)));
		let minute = Math.floor(((second - day * (24 * 60 * 60)) - hour * (60 * 60)) / 60);
		let str = "";

		if (day > 0)
			str += `${day}天前`;
		else if (hour > 0)
			str += `${hour}时前`;
		else if (minute > 0)
			str += `${minute}分前`;
		else 
			str += `${second}秒前`;
		return str;
	}

    /**
	 * 是否在同一天
	 * @param date1 时间1
	 * @param date2 时间2
	 */
	isSameDay(date1: number | Date, date2: number | Date) {
		let d1 = typeof date1 === 'number' ? new Date(date1 * 1000 + this.getUtcOff()) : date1;
		let d2 = typeof date2 === 'number' ? new Date(date2 * 1000 + this.getUtcOff()) : date2;
		return d1.getFullYear() === d2.getFullYear() &&
			d1.getMonth() === d2.getMonth() &&
			d1.getDate() === d2.getDate();
	}

    /**
	 * 比较两个日期相差的天数
	 * @param startTimes  //毫秒
	 * @param endTimes
	 * @param start
	 * @param end
	 * @return 
	 * 
	 */
	subtractDate(startTimes: number = 0, endTimes: number = 0, start: Date = null, end: Date = null, isRounding: boolean = true): number {
		// 先个自计算出距离 1970-1-1 的日期差，然后相减
		const ONE_DAY: number = 24 * 60 * 60 * 1000;
		let timezoneOffset: number = (new Date()).getTimezoneOffset() * 60 * 1000;//计算机的本地时间和通用时间 (UTC) 之间的差值

		let stime: number = startTimes;
		let etime: number = endTimes;
		if (start && end) {
			stime = start.getTime();
			etime = end.getTime();
		}

		var sdays: number = (stime - timezoneOffset) / ONE_DAY;
		var edays: number = (etime - timezoneOffset) / ONE_DAY;
		//若start < 1970-1-1,则日期差了一天,需要修正
		if (stime < 0) {
			sdays--;
		}
		//若end < 1970-1-1,则日期差了一天,需要修正
		if (etime < 0) {
			edays--;
		}
		return isRounding ? Math.floor(edays - sdays) : edays - sdays;
	}
}