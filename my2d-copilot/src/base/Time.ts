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
	private _serverTime: number;
	private _svrUtcOff: number;  //与服务器所在时区差值
	private _localUtcOff: number;
	private _localTime: number;
	private _bootTime:number;  //启动用时

	constructor() {
		this._localUtcOff = new Date().getTimezoneOffset() * 60 * 1000;  //获得的是分钟 转为毫秒
		this._svrUtcOff = this._localUtcOff;
		this._bootTime = Date.now();

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

	//fmt:"hh:mm:ss.iii"带毫秒 "hh:mm:ss"
	getTimeStr(utcStamp:number=0, fmt="hh:mm:ss"): string {
		return this.formatDateStr(utcStamp, fmt);
	}

	getTimeUtcStr(utcStamp:number=0, fmt="hh:mm:ss"): string {
		return this.formatDateUtcStr(utcStamp, fmt);
	}

	// 获取当天指定时间的时间戳 "00:00:00" 格式 时:分:秒
	getTimeFromStr(str: string) {
		var data = this.getDate();
		data.setHours(0, 0, 0, 0);

		var strl = str.split(":");
		data.setHours(parseInt(strl[0]));
		data.setMinutes(parseInt(strl[1]));
		data.setSeconds(parseInt(strl[2]));
		return data.getTime();
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

	getDateStr(utcStamp:number=0, fmt="yyyy-MM-dd hh:mm:ss"): string {
		return this.formatDateStr(utcStamp, fmt);
	}

	getDateUtcStr(utcStamp:number=0, fmt="yyyy-MM-dd hh:mm:ss"): string {
		return this.formatDateUtcStr(utcStamp, fmt);
	}


	// yyyy-MM-dd hh:mm:ss				utc:时间戳(秒) 2023-08-20 12:36:12
	// yyyy年MM月dd日 hh时mm分ss秒	 	 utc:时间戳(秒) 2023年08月20日12时37分41秒
	// yyyy/MM/dd						utc:时间戳(秒) 2023/8/20
	// fmt: "yyyy-MM-dd hh:mm:ss.iii" 自定义输出格式
	formatDateStr(utcStamp:number=0, fmt:string="yyyy-MM-dd hh:mm:ss"): string {
		const date = this.getDate(utcStamp);
		const year = date.getFullYear().toString();
		const month = StringEx.padStart(date.getMonth() + 1, 2, '0');
		const day = StringEx.padStart(date.getDate(), 2, '0');
		const hours = StringEx.padStart(date.getHours(), 2, '0');
		const minutes = StringEx.padStart(date.getMinutes(), 2, '0');
		const seconds = StringEx.padStart(date.getSeconds(), 2, '0');
		const milliseconds = StringEx.padStart(date.getMilliseconds(), 3, '0');

		const formattedDate = fmt
			.replace("yyyy", year)
			.replace("MM", month)
			.replace("dd", day)
			.replace("hh", hours)
			.replace("mm", minutes)
			.replace("ss", seconds)
			.replace("iii", milliseconds);

		return formattedDate;
	}

	//根据当前地区的日期时间 得到标准时区日期和时间
	formatDateUtcStr(utcStamp:number=0, fmt:string): string {
		const date = this.getDate(utcStamp);
		const year = date.getUTCFullYear().toString();
		const month = StringEx.padStart(date.getUTCMonth() + 1, 2, '0');
		const day = StringEx.padStart(date.getUTCDate(), 2, '0');
		const hours = StringEx.padStart(date.getUTCHours(), 2, '0');
		const minutes = StringEx.padStart(date.getUTCMinutes(), 2, '0');
		const seconds = StringEx.padStart(date.getUTCSeconds(), 2, '0');
		const milliseconds = StringEx.padStart(date.getUTCMilliseconds(), 3, '0');

		const formattedDate = fmt
			.replace("yyyy", year)
			.replace("MM", month)
			.replace("dd", day)
			.replace("hh", hours)
			.replace("mm", minutes)
			.replace("ss", seconds)
			.replace("iii", milliseconds);

		return formattedDate;
	}


	//==============================================
	// 倒计时相关 以秒为单位
	//

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

	formatSecondsAuto(second: number): string {
		if (second >= 24 * 60 * 60) {
			return this.formatSeconds(second, "dd天hh:mm:ss");
		}
		return second >= 3600 ? this.formatSeconds(second, "hh:mm:ss") : this.formatSeconds(second, "mm:ss");
	}


	
	//===============================================
	// 跨天 跨周 跨月 倒计时
	//


	//用于计算倒计时
	getNextTime(second: number): number {
		let time = this.getTime();
		return time + second * 1000;
	}

	// 获取第二天零点  返回第二天0点时间戳 毫秒
	getTimeZeroTomorrow(): number {
		var data = this.getDate();  //服务器时区的date
		data.setHours(0, 0, 0, 0);  //今天的0点
		let dayCount = 24 * 60 * 60 * 1000;  //一天的毫秒数
		return data.getTime() + dayCount;
	}

	// 获取相对当前时间下周某天的零点(s) day 星期几 1-7  默认周一0点
	getNextWeekZeroTime(day:number=1): number {
		let targetDay = this.getDate();
		let weekDay = targetDay.getDay() == 0 ? 7 : targetDay.getDay();
		let dayNum = 0;
		if(weekDay > day) {
			dayNum = 7 - weekDay + day;
		} else {
			dayNum = day - weekDay;
		}
		let time = targetDay.getTime() + dayNum * ( 60 * 60 * 24 * 1000 );
		targetDay.setTime(time);  //下周某天的当前时间
		targetDay.setHours(0, 0, 0, 0);  //转为当天的0点
		return targetDay.getTime();
	}

	// 获取相对当前时间下个月1号零点(s)
	getNextMonthZeroTime(): number {
		let targetDay = this.getDate();
		let monthDay = targetDay.getMonth();
		targetDay.setMonth(monthDay + 1);
		targetDay.setDate(1);
		targetDay.setHours(0, 0, 0, 0);
		return targetDay.getTime();
	}


	

	
	//===============================================
	// 其他
	//

	// 是否在同一天
	// date1 date2: number 毫秒数
	isSameDay(date1: number | Date, date2: number | Date) {
		let d1 = typeof date1 === 'number' ? new Date(date1 + this.getUtcOff()) : date1;
		let d2 = typeof date2 === 'number' ? new Date(date2 + this.getUtcOff()) : date2;
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