/**
 * Created by Administrator on 2016/7/18.
 */
class ReportData {

	static LOAD: string = "load";
	static GM: string = "gm";
	static ERROR: string = "error";

	private static _ins: ReportData;

	private httpRequest: egret.HttpRequest;

	private httpRequestUrl: HrInfo[];
	private isComplete: boolean = false;

	private lastErrMsg:string;

	static getIns(): ReportData {
		this._ins = this._ins || new ReportData();
		return this._ins;
	}

	constructor() {
		this.httpRequest = new egret.HttpRequest();
		this.httpRequestUrl = [];
	}

	/** 上报打点记录 */
	report(str: string, reportType?: string) {
		// console.log('上报打点记录 ' + str)
		return
		let roleCount: number = LocationProperty.roleCount;
		reportType = reportType || ReportData.LOAD;

		if(reportType == ReportData.LOAD) {
			//不是新账号不需要上报数据
			if (roleCount != 0)
				return;
		}

		if (reportType == ReportData.ERROR && str == this.lastErrMsg) {
			return;
		}
		this.lastErrMsg = str;

		/*
		 参数说明：
		 pfrom_id: 平台标识 string（16）//登陆时新增登陆参数 pfid
		 server_id：区服id smallint（5）
		 account: 平台帐号 string(64)
		 counter: 打点标识 固定值load
		 kingdom：记录打点位置 string 32
		 is_new：是否新帐号 默认为 1
		 exts：扩展字段 string（32） 非必要字段
		 ip 登陆ip
		 logdate:2016-03-07 04:23:48请求时间精确到秒
		 */

		let ua: string = navigator.userAgent.toLowerCase();
		if (/iphone|ipad|ipod/.test(ua)) {
			ua = "1";
		} else if (/android/.test(ua)) {
			ua = "2";
		}
		else ua = "0";

		//3e6d590812e1f1d370c135feeef60f97
		let key = md5.hex_md5(md5.hex_md5(reportType + "027a47eabf1ebcb409b7fe680ff69008"));

		let data: string = "&data=";
		data += LocationProperty.pfid;
		data += "|" + LocationProperty.srvid;
		data += "|" + LocationProperty.openID;
		data += "|" + reportType;
		data += "|" + str;
		data += "|" + LocationProperty.isnew;
		data += "|" + ua;
		data += "|" + LocationProperty.login_ip;
		data += "|" + DateUtils.getFormatBySecond(Math.floor((GameServer.serverTime || Date.now()) / 1000), 2);
		data += "|" + LocationProperty.appid;
		if (reportType != ReportData.ERROR) data += "|" + Actor.level || 1;


		// http://damete.com/undefined/report?appv=1.0&counter=chat&key=f23bbf4dbc45be5bc2910da269f6a064&data=1|xh123456|262145|%E5%A5%B3%E4%BE%A0%E5%B9%B8%E8%BF%90|4|%E5%8E%89%E5%AE%B3|2019-12-3%2014:15:30|undefined| 502 (Bad Gateway)

		this.reportUrl(`${LocationProperty.loadurl}/report?appv=1.0&counter=${reportType}&key=${key}${data}`);
	}

	//上报聊天
	reportChat(str:string,chatType:number) {
		// console.log('上报聊天 ' + str)
		// return
		

		if(LocationProperty.isLocation) {
			return;
		}

		// if (window['reportChat']) {
		// 	let obj = {
		// 		serverid:LocationProperty.srvid,
		// 		qid:LocationProperty.openID,
		// 		actorid:Actor.actorID,
		// 		name:Actor.myName,
		// 		chattype:chatType,
		// 		content:str,
		// 		chatdate:DateUtils.getFormatBySecond(Math.floor((GameServer.serverTime || Date.now()) / 1000), 2),
		// 		ip:LocationProperty.login_ip,
		// 		pf:LocationProperty.pf
		// 	};
		// 	window['reportChat'](obj);
		// 	return;
		// }
		let arr = window['getChatControlUrl']()
		var paraUrl = arr
		+ "logdate=" + DateUtils.getFormatBySecond(Math.floor((GameServer.serverTime || Date.now()) / 1000), 2)
		+ "&actorid=" + LocationProperty.roleID
		+ "&user_level=" + Actor.level
		+ "&counter=" + str
		+ "&value=" + chatType
		+ "&kingdom=" + LocationProperty.serverIP
		+ "&serverid=" + LocationProperty.srvid;

		// console.log(paraUrl)

		this.reportUrl(paraUrl);
		// let reportType = "chat";

		// str = str.replace(/\|/g, '、');

		//3e6d590812e1f1d370c135feeef60f97
		// let key = md5.hex_md5(md5.hex_md5(reportType + "027a47eabf1ebcb409b7fe680ff69008"));

		// let data: string = "&data=";
		// data += LocationProperty.srvid;
		// data += "|" + LocationProperty.openID;
		// data += "|" + Actor.actorID;
		// data += "|" + Actor.myName;
		// data += "|" + chatType;
		// data += "|" + str;
		// data += "|" + DateUtils.getFormatBySecond(Math.floor((GameServer.serverTime || Date.now()) / 1000), 2);
		// data += "|" + LocationProperty.login_ip;
		// data += "|" + LocationProperty.pf;




		/*
		 counter是chat，参数格式是
		 serverid|account|actorid|name|chattype|content|chatdate|ip|pf

		 参数说明：
		 pfrom_id: 平台标识 string（16）//登陆时新增登陆参数 pfid
		 server_id：区服id smallint（5）
		 account: 平台帐号 string(64)
		 counter: 打点标识 固定值load
		 kingdom：记录打点位置 string 32
		 is_new：是否新帐号 默认为 1
		 exts：扩展字段 string（32） 非必要字段
		 ip 登陆ip
		 chatdate:2016-03-07 04:23:48请求时间精确到秒

		 chatType:
		 1：私聊
		 2：喇叭
		 3：邮件
		 4：世界
		 5：阵营
		 6：帮派
		 7：队伍
		 8：附近
		 9：其他
		 10：建议
		 */
		// this.reportUrl(`http://47.75.114.116/gm/index.php?m=Chat&a=chat_controls&appv=1.0&counter=${reportType}&key=${key}${data}`);
	}

	//上报建议
	advice(str: string, func: Function, funcThis: any) {
		UserTips.ins().showTips("提交问题成功！");
		func.call(funcThis);
		let arr = window['getChatControlUrl']()
		var paraUrl = arr
		+ "logdate=" + DateUtils.getFormatBySecond(Math.floor((GameServer.serverTime || Date.now()) / 1000), 2)
		+ "&actorid=" + LocationProperty.roleID
		+ "&user_level=" + Actor.level
		+ "&counter=" + str
		+ "&value=" + 10
		+ "&kingdom=" + LocationProperty.serverIP
		+ "&serverid=" + LocationProperty.srvid;

		// console.log(paraUrl)

		this.reportUrl(paraUrl);
		return
		let f: Function = function (v: egret.Event) {
			this.httpRequest.removeEventListener(egret.Event.COMPLETE, f, this);
			let request = <egret.HttpRequest>v.currentTarget;
			if (request.response == "true" || request.response == "true\n") {
				UserTips.ins().showTips("提交问题成功！");
				func.call(funcThis);
			}
			else
				UserTips.ins().showTips("网络出故障，请重新提交问题！");
		};
		this.httpRequest.addEventListener(egret.Event.COMPLETE, f, this);

		let ua: string = navigator.userAgent.toLowerCase();
		if (/iphone|ipad|ipod/.test(ua)) {
			ua = "1";
		} else if (/android/.test(ua)) {
			ua = "2";
		}
		else ua = "0";

		let counter = 'gm';

		str = str.replace(/\|/g, '、');

		let data: string = "&data=";
		data += LocationProperty.pfid;
		data += "|" + LocationProperty.srvid;
		data += "|" + LocationProperty.openID;
		data += "|" + counter;
		data += "|" + str;
		data += "|" + LocationProperty.isnew;
		data += "|" + ua;
		data += "|" + LocationProperty.login_ip;
		data += "|" + DateUtils.getFormatBySecond(Math.floor((GameServer.serverTime || Date.now()) / 1000), 2);
		data += "|" + LocationProperty.appid;
		data += "|" + Actor.level;
		
		console.log(data)

		//key = md5.hex_md5(md5.hex_md5(counter+"027a47eabf1ebcb409b7fe680ff69008"));
		this.reportUrl(`${LocationProperty.loadurl}/report?appv=1.0&counter=${counter}&key=d413074da338f01ab95010fac6f0c81a${data}`);
	}

	//角色升级
	roleUp() {
		window['roleUp'](Actor.actorID, Actor.myName, Actor.level);
	}

	//进入游戏
	enterGame() {
		window['enterGame'](Actor.actorID, Actor.myName, Actor.level);
	}

	createRole(roleId) {
		window['createRole'](roleId);
	}

	/** 上报建议 */
	advice1(str: string, func: Function, funcThis: any) {
		// console.log('上报建议2 ： ' + str)
		UserTips.ins().showTips("提交问题成功！");
		func.call(funcThis);
		return
		let f: Function = function (v: egret.Event) {
			this.httpRequest.removeEventListener(egret.Event.COMPLETE, f, this);
			let request = <egret.HttpRequest>v.currentTarget;
			if (request.response == "ok") {
				UserTips.ins().showTips("提交问题成功！");
				func.call(funcThis);
			}
			else
				UserTips.ins().showTips("网络出故障，请重新提交问题！");
		};
		this.httpRequest.addEventListener(egret.Event.COMPLETE, f, this);

		str = str.replace(/@/g, "");
		str = str.replace(/#/g, "");

		let data: string = "&serverid=" + LocationProperty.srvid;
		data += "&sign=" + md5.hex_md5(`${LocationProperty.srvid || 0}${Actor.actorID}enter_reportfeedbackqiyaohudongyule!@#`);
		data += "&actorid=" + Actor.actorID;
		data += "&actorname=" + Actor.myName;
		data += "&feedcnt=" + str;
		data += "&openid=" + LocationProperty.openID;
		data += "&userlevel=" + Actor.level;
		data += "&viplevel=" + UserVip.ins().lv;
		data += "&appid=" + LocationProperty.appid;

		this.reportUrl(LocationProperty.loadurl + "/api/load?counter=enter_report" + data);

	}


	reportUrl(url: string, method?: string) {
		let vo = new HrInfo();
		vo.url = url;
		vo.method = method;
		this.httpRequestUrl.push(vo);
		this.sendReportUrl();
	}

	private sendReportUrl(): void {
		if (this.isComplete == false && this.httpRequestUrl.length > 0) {
			let url = this.httpRequestUrl[0].url;
			let method = this.httpRequestUrl[0].method;
			this.httpRequest.open(url, method ? method : egret.HttpMethod.GET);
			this.httpRequest.send();
			this.isComplete = true;
			this.httpRequest.addEventListener(egret.Event.COMPLETE, this.onGetComplete, this);
			this.httpRequest.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetIOError, this)
		}
	}

	private onGetComplete(event: egret.Event): void {
		this.isComplete = false;
		this.httpRequestUrl.shift();
		this.sendReportUrl();
	}

	private onGetIOError(event: egret.IOErrorEvent): void {
		this.isComplete = false;
		this.sendReportUrl();
	}
}

class HrInfo {
	public url: string;
	public method: string;
}