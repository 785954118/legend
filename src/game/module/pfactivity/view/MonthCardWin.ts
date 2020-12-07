class MonthCardWin extends BaseView {


	public monthGroup: eui.Group;

	private btn1: eui.Button;
	private btn0: eui.Button;
	
	private leftTime: eui.Label;
	private feng: eui.Label;
	private first1: eui.Label;
	public xianshi1: eui.Group;
	public xianshi2: eui.Group;
	constructor() {
		super();
		this.skinName = "MonthCardSkin";
	}

	public open(...param: any[]): void {
		this.observe(Recharge.ins().postUpdateRecharge, this.setView);
		this.addTouchEvent(this.btn1, this.onTap);
		this.addTouchEvent(this.btn0, this.onTap);
		if (this.feng.visible) {
			this.btn1.visible = false;
			this.btn0.visible = false;
			this.xianshi1.visible = false;
			this.xianshi2.visible = false;
		} else {
			if (Recharge.ins().monthDay > 0) {
				TimerManager.ins().doTimer(1000, 0, this.setTimeLbel, this);
				this.setTimeLbel();
				this.btn1.visible = false;
				this.btn0.visible = false;
				this.xianshi1.visible = false;
				this.xianshi2.visible = false;
			} else {
				this.btn1.visible = true;
				// this.btn0.visible = true;
				TimerManager.ins().remove(this.setTimeLbel, this);
			}
			this.leftTime.visible = Recharge.ins().monthDay > 0 ? true : false;
			this.setView();
		}

		//颜色矩阵数组
		var colorMatrix = [
			0.3, 0.6, 0, 0, 0,
			0.3, 0.6, 0, 0, 0,
			0.3, 0.6, 0, 0, 0,
			0, 0, 0, 1, 0
		];
		var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
		let monthCardPriceInfo = window['getmonthCardPriceInfo']()
		// this.btn1.filters = [colorFlilter];
		if (monthCardPriceInfo[0].status != 1) {
			this.btn1.filters = [colorFlilter];
		}
		//
		// if (Recharge.ins().getIsForeve()) {
		//
		// } else {
		//
		// }
		// // let data: RechargeData = Recharge.ins().getRechargeData(0);
		// this.setView();
	}

	private setView(): void {
		this.first1.visible = !Setting.ins().getValue(ClientSet.firstMonthCard);
	}

	private setTimeLbel(): void {
		let endedTime: number = Recharge.ins().monthDay;//Math.ceil((Recharge.ins().monthDay - egret.getTimer()) / 1000);
		let str: string = DateUtils.getFormatBySecond(endedTime, DateUtils.TIME_FORMAT_5, 1);
		str = `<font color='#35e62d'>剩余时间:${str}</font>`;
		this.leftTime.textFlow = new egret.HtmlTextParser().parser(str);

	}

	public close(...param: any[]): void {
		this.removeObserve();
		this.removeTouchEvent(this.btn1, this.onTap);
		this.removeTouchEvent(this.btn0, this.onTap);
		TimerManager.ins().remove(this.setTimeLbel, this);
	}

	private onTap(e: egret.TouchEvent): void {
		let monthCardPriceInfo = window['getmonthCardPriceInfo']()
		switch (e.currentTarget) {
			case this.btn1:

				if (monthCardPriceInfo[0].status != 1) {
					WarnWin.show(monthCardPriceInfo[0].msg, function () { }, this, function () { }, this, 'sure');
				} else {
					Recharge.ins().showReCharge(28, 2800,0);
				}

				// Pay.ins().sendPayStyte('28',1);
				break;
			case this.btn0:
				Recharge.ins().showReCharge(100, 1,1);

				break;
		}
	}
}

// ViewManager.ins().reg(MonthCardWin, LayerManager.UI_Main);