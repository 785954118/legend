

/**
 * 抢红包的活动id是 2001 
 * 由于没有配置文件，之类直接写上 2001
 * 
 * 
 * 
 */


class QHBPanle extends BaseView {

	public list: eui.List;
	public scroller: eui.Scroller;
	private listH: number;
	private qianghongbao: eui.Group;
	private showhongbao: eui.Group;
	private eid: number;
	private hbbtn: eui.Button;

	private yuanbao1: eui.Label;
	private yuanbao2: eui.Label;
	private btn1: eui.Button;


	private hongbaoNum: eui.Label;
	private kqTime: eui.Label;

	private scrollLength: number;

	private hasHongbao: eui.Group;
	private noHongbao: eui.Label;

	constructor() {
		super();
		this.skinName = "qianghongbaoSkin";
		this.hbbtn.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouch, this);
		this.btn1.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouch, this);
		this.observe(Activity.ins().postEnvelopeData, this.initHongbaoInfo);//下发新红包
		this.observe(Activity.ins().postRewardResult, this.initShowHongBao);//下发新红包
	}


	public open(...param: any[]): void {
		this.init()
	}

	//只要没过时就可以领取
	public initHongbaoInfo(...param: any[]): void {
		let actData: ActivityType24Data = Activity.ins().activityData[2001] as ActivityType24Data;


		let bytes = param[0]
		// let id = bytes.readInt();
		let isSuccess = bytes.readByte();
		if (isSuccess) {
			let reld: RedEnvelope = new RedEnvelope();
			reld.id = bytes.readUnsignedShort();
			reld.timer = bytes.readInt();
			this.initQhongbaoInfo(reld.id)
		} else {
			this.initShowHongBao()
			console.log('没有红包可以领取')
		}



		let noName = bytes.readInt();
		let rechargeNum = bytes.readInt();

		let eWaiYBNum = bytes.readInt();
		let len = bytes.readShort();
		let _MyQenvelopeData = []
		for (let i = 0; i < len; i++) {
			let MyQinfo: MyQenvelopeData = new MyQenvelopeData;
			MyQinfo.eId = bytes.readShort();
			MyQinfo.yuanbao = bytes.readInt();
			MyQinfo.Ewai_yuanbao = bytes.readInt();
			_MyQenvelopeData.push(MyQinfo)
		}
		let Num = bytes.readShort();
		let obj = []
		for (let i = 0; i < Num; i++) {
			let Qinfo: QenvelopeData = new QenvelopeData;
			Qinfo.recordId = bytes.readInt();
			Qinfo.name = bytes.readString();
			Qinfo.eId = bytes.readShort();
			Qinfo.job = bytes.readShort();
			Qinfo.sex = bytes.readShort();
			Qinfo.isEwai = bytes.readByte();
			Qinfo.yuanbao = bytes.readInt();
			obj.push(Qinfo)
			// if (Qinfo.recordId > actData.maxRecord) {
			// 	actData.maxRecord = Qinfo.recordId
			// }
		}
		actData.update_MyQenvelopeData(_MyQenvelopeData)
		// actData.addQenvelopeData(obj)


	}

	private initQhongbaoInfo(eid): void {
		this.qianghongbao.visible = true;
		this.showhongbao.visible = false;
		this.eid = eid
	}
	public updateNextHongBaoTime() {

		let actData: ActivityType24Data = Activity.ins().activityData[2001] as ActivityType24Data;
		if (actData.envelopeData.length > 0) {
			let str = DateUtils.getFormatBySecond(actData.envelopeData[0].getStartTimer(), 10)
			this.kqTime.text = str
			if (actData.envelopeData[0].getStartTimer() <= 0) {
				this.kqTime.text = '0';
				TimerManager.ins().remove(this.updateNextHongBaoTime, this);
				this.init()
			}
		} else {
			this.kqTime.text = '无可领取'
			TimerManager.ins().remove(this.updateNextHongBaoTime, this);
		}

	}
	private initShowHongBao(): void {

		Activity.ins().sendChangePage(2001)

		TimerManager.ins().doTimer(500, 1, function () {
			if (Activity.ins().activityData[2001] as ActivityType24Data) {
				let actData: ActivityType24Data = Activity.ins().activityData[2001] as ActivityType24Data;

				if (actData.isSuccess) {
					let eWaiYuanBao = actData.eWaiYuanBao;
					let MyQenvelope = actData.getMax_hongbao();
					let QenvelopeData = actData.QenvelopeData;
					this.qianghongbao.visible = false;
					this.showhongbao.visible = true;

					if (actData.shengYuKeLingHongBao <= 0) {
						this.hongbaoNum.text = '0';
					} else {
						this.hongbaoNum.text = actData.shengYuKeLingHongBao.toString();
					}

					// 防止重复定时器
					TimerManager.ins().remove(this.updateNextHongBaoTime, this);
					TimerManager.ins().doTimer(1000, 0, this.updateNextHongBaoTime, this);


					let arrName = []
					for (let i = QenvelopeData.length - 1; i > 0; i--) {
						// let str = QenvelopeData[i].name + '抢到了' + QenvelopeData[i].yuanbao + ' 元宝'
						let obj = {
							name: QenvelopeData[i].name,
							yuanbao: QenvelopeData[i].yuanbao
						}
						arrName.push(obj)
					}
					this.scrollLength = arrName.length;
					this.list.dataProvider = new eui.ArrayCollection(arrName);
					// this.scroller.touchChildren = false;
					// this.scroller.touchEnabled = false;
					// this.listH = this.list.height;
					// TimerManager.ins().doTimer(500, 1, function () {
					// 	if (arrName.length * this.listH > 135) {
					// 		this.scroller.viewport.scrollV = 0;
					// 		let t = egret.Tween.get(this.scroller.viewport);
					// 		let h = (arrName.length * this.listH) > 270 ? (arrName.length * this.listH) : 270;
					// 		t.to({ scrollV: h }, arrName.length * 700).call(this.loopT, this);
					// 	}
					// }, this);


					// 拿出最大红包
					if (MyQenvelope) {
						this.hasHongbao.visible = true
						this.noHongbao.visible = false

						this.yuanbao1.text = MyQenvelope.yuanbao.toString()
						if (eWaiYuanBao) {
							this.yuanbao2.text = eWaiYuanBao.toString();
							this.btn1.visible = true;
						} else {
							this.yuanbao2.text = MyQenvelope.Ewai_yuanbao.toString();
							this.btn1.visible = false;
						}
					} else {
						this.hasHongbao.visible = false
						this.noHongbao.visible = true
					}

				} else {
					this.hasHongbao.visible = false
					this.noHongbao.visible = true
					// alert('领取失败')
				}
			}
		}, this);

	}
	public init(): void {

		// 先判断有没有红包没有领取如果有就
		if (Activity.ins().activityData[2001] as ActivityType24Data) {
			let actData: ActivityType24Data = Activity.ins().activityData[2001] as ActivityType24Data;
			// Activity.ins().sendEnvelopeData(2001, actData.envelopeData[0].id, actData.maxRecord)
			if (actData.envelopeData.length > 0 && actData.envelopeData[0].canStartTimer()) {
				Activity.ins().sendEnvelopeData(2001, actData.envelopeData[0].id, actData.maxRecord)
			} else {
				//没有红包
				this.initShowHongBao()
			}
		} else {
			this.hasHongbao.visible = false
			this.noHongbao.visible = true
		}

		this.list.itemRenderer = QHBItem;

	}

	private loopT() {
		this.scroller.viewport.scrollV = 0;
		let t = egret.Tween.get(this.scroller.viewport);
		let h = (this.scrollLength * this.listH) > 270 ? (this.scrollLength * this.listH) : 270;
		t.to({ scrollV: h }, this.scrollLength * 700).call(this.loopT, this);
	}
	private update(): void {

	}

	public close(...param: any[]): void {
		this.removeObserve();
		this.hbbtn.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouch, this);
		this.btn1.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouch, this);
		this.removeTouchEvent(this, this.onTouch);
	}

	private onTouch(e: egret.TouchEvent): void {
		switch (e.target) {
			case this.hbbtn:
				Activity.ins().sendReward(2001, this.eid, 1);
				break;
			case this.btn1:
				if (Activity.ins().activityData[2001] as ActivityType24Data) {
					let actData: ActivityType24Data = Activity.ins().activityData[2001] as ActivityType24Data;
					let rechargeNum = actData.rechargeNum;
					if (rechargeNum > 0) {
						Activity.ins().sendReward(2001, this.eid, 2);
					} else {
						//
						WarnWin.show("充值任意金额才能领取红包", function () {
							ViewManager.ins().close(FuliWin);
							RechargeData.checkOpenWin();
						}, this, function () {
						}, this);

					}
				}

				break;
		}
	}
}