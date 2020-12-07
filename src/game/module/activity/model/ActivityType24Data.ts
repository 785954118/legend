/** 活动类型24数据 */
class ActivityType24Data extends ActivityBaseData {

	public score: number;//积分
	// public logs:{name:string,serverId:number,index:number}[];
	private _envelopeData: RedEnvelope[];//红包数据 红包id 红包cd
	public QenvelopeData: QenvelopeData[];  // 所有抢红包的人的数据
	public MyQenvelopeData: MyQenvelopeData[];  // wo de 红包数据
	public eWaiYuanBao: number;
	public rechargeNum: number;
	public isSuccess:boolean = true;
	public shengYuKeLingHongBao:number;
	public recordMax:number = 100;
	public maxRecord:number = 0;
	


	constructor(bytes: GameByteArray, id: number) {
		super(bytes);
		this.init(bytes, id);
	}
	public init(bytes: GameByteArray, id: number) {
		// 今日充值数
		this.rechargeNum = bytes.readInt();
		// 额外元宝
		this.eWaiYuanBao = bytes.readInt();
		let len = bytes.readShort();
		this.shengYuKeLingHongBao = 5 - len
		let _MyQenvelopeData = []
		for (let i = 0; i < len; i++) {
			let MyQinfo: MyQenvelopeData = new MyQenvelopeData;
			MyQinfo.eId = bytes.readShort();
			MyQinfo.yuanbao = bytes.readInt();
			MyQinfo.Ewai_yuanbao = bytes.readInt();
			_MyQenvelopeData.push(MyQinfo)
		}
		this.update_MyQenvelopeData(_MyQenvelopeData)

		let _QenvelopeData = []
		let num = bytes.readShort();

		for (let i = 0; i < num; i++) {
			let Qinfo: QenvelopeData = new QenvelopeData;
			Qinfo.recordId = bytes.readInt();
			Qinfo.name = bytes.readString();
			Qinfo.eId = bytes.readShort();
			Qinfo.job = bytes.readShort();
			Qinfo.sex = bytes.readShort();
			Qinfo.isEwai = bytes.readByte();
			Qinfo.yuanbao = bytes.readInt();
			_QenvelopeData.push(Qinfo)
			if(Qinfo.recordId > this.maxRecord){
				this.maxRecord = Qinfo.recordId
			}
		}
		this.update_QenvelopeData(_QenvelopeData)


		if (Activity.ins().activityTimers.indexOf(id) == -1)
			Activity.ins().activityTimers.push(id);
	}

	// 更新已抢红包数据
	public update_MyQenvelopeData(data: any): void {
		this.MyQenvelopeData = [];
		for (let i = 0; i < data.length; i++) {
			this.MyQenvelopeData.push(data[i])
		}
	}
	
	// 更新已抢红包数据
	public update_QenvelopeData(data: any): void {
		this.QenvelopeData = [];
		for (let i = 0; i < data.length; i++) {
			this.QenvelopeData.push(data[i])
		}
	}
	public addQenvelopeData(data: any): void {
		this.QenvelopeData =  this.QenvelopeData.concat(data);
		for (let i = 0; i < this.QenvelopeData.length; i++) {
			if(this.QenvelopeData[i].recordId > this.maxRecord){
				this.maxRecord = this.QenvelopeData[i].recordId
			}
		}
	}

	public getMax_hongbao() {
		let maxid = 0;
		for (let i = 0; i < this.MyQenvelopeData.length; i++) {
			if (this.MyQenvelopeData[i].eId > maxid) {
				// 拿出最大红包
				maxid = this.MyQenvelopeData[i].eId
			}
		}
		for (let i = 0; i < this.MyQenvelopeData.length; i++) {
			if (this.MyQenvelopeData[i].eId == maxid) {
				// 拿出最大红包
				return this.MyQenvelopeData[i];
			}
		}
		return null
	}

	public update(bytes: GameByteArray): void {

		if (Activity.ins().isSuccee) {
			this.isSuccess = true
			let type = bytes.readShort();
			if (type == 1) {
				this.shengYuKeLingHongBao -= 1;
				let MyQinfo: MyQenvelopeData = new MyQenvelopeData;
				MyQinfo.eId = bytes.readShort();
				MyQinfo.yuanbao = bytes.readInt();
				MyQinfo.Ewai_yuanbao = bytes.readInt();
				this.MyQenvelopeData.push(MyQinfo)
				this.eWaiYuanBao = MyQinfo.Ewai_yuanbao;
			} else {
				let ewai = bytes.readInt()
				this.eWaiYuanBao = 0;
				let MaxHongbaoInfo =  this.getMax_hongbao()
				MaxHongbaoInfo.Ewai_yuanbao = ewai
			}
		} else {
			console.log('领取失败')
			this.isSuccess = false
		}

		HBSystem2.ins().removeHongbao();
	}

	public get envelopeData(): RedEnvelope[] {
		this._envelopeData = this._envelopeData ? this._envelopeData : [];
		return this._envelopeData;
	}
	public set envelopeData(value: RedEnvelope[]) {
		this._envelopeData = value;
	}
    /**
     * 清理红包数量
     * 每秒秒进入检测清理
     * */
	private static maxEnvelope = 10;
	private envelopeSum = ActivityType24Data.maxEnvelope;//检测最大红包数
	private SecondCount = 0;//跑过的秒数
	public checkClear() {
		if (this.envelopeData.length >= this.envelopeSum) {
			this.SecondCount = 0;
			this.clearEnvelopeData();//清理红包列表
			//至少多余maxEnvelope个红包才做最大增加红包上限数检测 因为可能堆积的红包都没有过期
			if (this.envelopeSum > ActivityType24Data.maxEnvelope) {
				this.envelopeSum = this.envelopeData.length + ActivityType24Data.maxEnvelope;
			}
		}
		//10秒内如果仍然大于最大值就重新赋值 保持红包列表仅保存少于10封红包
		else if (this.SecondCount > 10 && this.envelopeSum > ActivityType24Data.maxEnvelope) {
			this.SecondCount = 0;
			this.envelopeSum = ActivityType24Data.maxEnvelope;
		}
		//1分钟都少于最大红包数就清理红包列表
		else if (this.SecondCount > 60 && this.envelopeData.length < ActivityType24Data.maxEnvelope) {
			this.SecondCount = 0;
			this.clearEnvelopeData();
		}
		this.SecondCount++;
	}
	//清理过期红包
	public clearEnvelopeData() {
	}
	public clearAll() {
	}
	//移除红包
	public popEnvelope(eId: number) {
	}
	public canReward(): boolean {
		return this.checkRedPoint();

	}

	public isOpenActivity(): boolean {
		let beganTime = Math.floor((DateUtils.formatMiniDateTime(this.startTime) - GameServer.serverTime) / 1000);
		let endedTime = Math.floor((DateUtils.formatMiniDateTime(this.endTime) - GameServer.serverTime) / 1000);
		if (beganTime < 0 && endedTime > 0)
			return true;

		return false;
	}

	//判断红点
	public checkRedPoint(): boolean {

		// let config:ActivityType24Config[] = GlobalConfig.ActivityType24Config[this.id];
		// for( let k in config ){
		//     if( this.score >= config[k].score )
		//         return true;
		// }
		return false;
	}

	public getRemainTime(): string {
		let beganTime = Math.floor((DateUtils.formatMiniDateTime(this.startTime) - GameServer.serverTime) / 1000);
		let endedTime = Math.floor((DateUtils.formatMiniDateTime(this.endTime) - GameServer.serverTime) / 1000);
		let desc: string;
		if (beganTime >= 0) {
			desc = "活动未开启";
		} else if (endedTime <= 0) {
			desc = "活动已结束";
		} else {
			desc = DateUtils.getFormatBySecond(endedTime, DateUtils.TIME_FORMAT_5, 3)
		}
		return desc;
	}

}
/**红包数据*/
// class RedEnvelope{
//     public id:number;//红包id
//     public timer:number;//红包结束时间 2010时间戳
//     public constructor(){
//         this.id = 0;
//         this.timer = 0;
//     }
//     public isOverTimer(){
//         let endedTime = Math.floor((DateUtils.formatMiniDateTime(this.timer) - GameServer.serverTime) / 1000);
//         return endedTime <= 0?true:false;
//     }
//     // public updateTimer(){
//     //     if( this.id && this.timer > 0 ){
//     //         this.timer--;
//     //     }
//     // }
// }
/**红包具体数据*/
class QenvelopeData {
	public recordId:number;
	public name: string;
	public eId: number;
	public job: number;
	public sex: number;
	public isEwai: number;
	public yuanbao: number;
	public constructor() {
		this.recordId = 0;
		this.eId = 0;
		this.job = 0;
		this.sex = 0;
		this.yuanbao = 0;
		this.name = "";
		this.isEwai = 0;
	}
}
class MyQenvelopeData {
	public eId: number;
	public Ewai_yuanbao: number;
	public yuanbao: number;
}
// /**25-2协议类型*/
// enum EnvelopeType{
//     SEND = 1,//发红包(25-2发送参数: 活动id, 活动序号index, EnvelopeType.SEND, 祝福语? )
//     GET  = 2,//领红包(25-2发送参数: 活动id, 红包id, EnvelopeType.GET )
// }
