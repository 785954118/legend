/**
 *
 * @author
 *
 */
class Recharge3Win extends BaseView {

	private date: eui.Label;
	private desc: eui.Label;
	private list: eui.List;
	private recharge: eui.Button;


	private _data: RechargeData;

	private _oneDay: number = DateUtils.HOURS_PER_DAY * DateUtils.SECOND_PER_HOUR;

	public activityID: number = 20;
	private stateDic:any = {};
	constructor() {
		super();
		this.initUI();
	}

	public initUI(): void {

		this.skinName = "TotalChargeActSkin";
		this.name = "累计充值";
		this.list.itemRenderer = TotalChargeActItem;
	}

	public open(...param: any[]): void {
		this.setWinData();
		this.observe(Recharge.ins().postUpdateRecharge, this.setWinData);
		this.addTouchEvent(this.recharge, this.onTabTouch);
	}

	public close(...param: any[]): void {
		this.removeTouchEvent(this.recharge, this.onTabTouch);

		this.removeObserve();
	}

	private onTabTouch(e: egret.TouchEvent): void {
		switch (e.currentTarget) {
			case this.recharge:
				ViewManager.ins().open(ChargeFirstWin);
				break;
		}
	}

	private setWinData(): void {

		this._data = Recharge.ins().getRechargeData(1);

		this.desc.text = "已累计充值" + this._data.num + "元宝";

		let config: ChongZhi2Config[] = GlobalConfig.ChongZhi2Config[((this._data.day / DateUtils.DAYS_PER_WEEK) >= 1) ? 2 : 1][this._data.day % 7];

		let dataArr: ChongZhi2Config[] = [];
		for (let k in config) {
			dataArr.push(config[k]);
			this.stateDic[config[k].index] = ((this._data.isAwards >> config[k].index) & 1)
		}

		dataArr = dataArr.sort(this.sort);

		this.list.dataProvider = new eui.ArrayCollection(dataArr);
		let times: number = GameServer.serverTime / 1000 - (new Date).getTimezoneOffset() * 60;
		if (times > this._oneDay)
			times -= this._oneDay;
		let endedTime: number = this._oneDay - times % this._oneDay;
		let hourst: number = Math.floor(endedTime / DateUtils.SECOND_PER_HOUR);
		let minst: number = Math.floor(endedTime % DateUtils.SECOND_PER_HOUR / 60);
		this.date.text = `${hourst}时${minst}分`;
	}

	private sort(a: ChongZhi2Config, b: ChongZhi2Config): number {
		let s1: number = a.pay;
		let s2: number = b.pay;
		if (this.stateDic[a.index] == 0 && this.stateDic[b.index] == 1) {
			return -1;
		} else if (this.stateDic[a.index] == 1 && this.stateDic[b.index] == 0) {
			return 1;
		}
		if (s1 > s2)
			return 1;
		else if (s1 < s2)
			return -1;
		else
			return 0;

	}

}

ViewManager.ins().reg(Recharge3Win, LayerManager.UI_Main);
