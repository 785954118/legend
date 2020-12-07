class FranchiseWin extends BaseView {
	public monthGroup: eui.Group;
	private powerPanel: PowerPanel;
	private btn1: eui.Button;
	private btn0: eui.Button;
	private leftTime: eui.Label;
	private feng: eui.Label;
	private first: eui.Label;
	private mc: MovieClip;
	private titleImg: eui.Image;
	private titleMcGroup: eui.Group;
	private depictLabel: eui.Label;
	public xianshi1: eui.Group;
	public xianshi2: eui.Group;
	constructor() {
		super();
		this.skinName = "SpecialCardSkin";
	}

	public open(...param: any[]): void {
		this.observe(Recharge.ins().postFranchiseInfo, this.setView);
		this.addTouchEvent(this.btn1, this.onTap);
		this.addTouchEvent(this.btn0, this.onTap);
		if (this.feng.visible) {
			this.btn1.visible = false;
			this.xianshi1.visible = false;
			this.xianshi2.visible = false;
			this.btn0.visible = false;
			if (this.first)
				this.first.visible = false;
		} else {
			if (Recharge.ins().franchise > 0) {
				TimerManager.ins().doTimer(1000, 0, this.setTimeLbel, this);
				this.setTimeLbel();
				this.btn1.visible = true;
				this.xianshi1.visible = false;
				this.xianshi2.visible = false;
				this.btn0.visible = false;
				this.setView();
			} else {
				this.depictLabel.textFlow = TextFlowMaker.generateTextFlow1(GlobalConfig.PrivilegeData.rightDesc);
				//颜色矩阵数组
				var colorMatrix = [
					0.3, 0.6, 0, 0, 0,
					0.3, 0.6, 0, 0, 0,
					0.3, 0.6, 0, 0, 0,
					0, 0, 0, 1, 0
				];
				var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
				let monthCardPriceInfo = window['getmonthCardPriceInfo']()
				if (monthCardPriceInfo[1].status != 1) {
					this.btn1.filters = [colorFlilter];
				}
				this.btn1.visible = true;
				// this.btn0.visible = true;
				TimerManager.ins().remove(this.setTimeLbel, this);
				this.first.visible = true;
				if (this.first)
					this.first.visible = Recharge.ins().firstBuy ? true : false;
			}
			this.leftTime.visible = Recharge.ins().franchise > 0 ? true : false;

		}
		this.setIconEff();



	}

	private setView(): void {
		if (!Recharge.ins().franchiseget) {
			this.btn1.label = "已领取";
			this.btn1.currentState = "disabled";
			this.btn1.touchEnabled = false;
		}
		else {
			this.btn1.currentState = "up";
			this.btn1.touchEnabled = true;
			this.btn1.label = "领取奖励";
		}
		if (this.first)
			this.first.visible = false;
	}

	private setTimeLbel(): void {
		let endedTime: number = Recharge.ins().franchise;//Math.ceil((Recharge.ins().monthDay - egret.getTimer()) / 1000);
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
		switch (e.currentTarget) {
			case this.btn1:
				if (this.btn1.label != "领取奖励") {
					// Recharge.ins().showReCharge(100, 1, 1);
					let monthCardPriceInfo = window['getmonthCardPriceInfo']()
					if (monthCardPriceInfo[1].status != 1) {
						WarnWin.show(monthCardPriceInfo[1].msg, function () { }, this, function () { }, this, 'sure');
					} else {
						Recharge.ins().showReCharge(88, 8800, 0);
						// Recharge.ins().showReCharge(100, 1,1);
					}
				} else {
					Recharge.ins().sendGetFranchise();
				}

				break;
			case this.btn0:
				Recharge.ins().showReCharge(100, 1, 1);

				break;

		}
	}

	private setIconEff() {
		let config: TitleConf = GlobalConfig.TitleConf[17];
		if (!config) return;
		if (config.eff) {
			if (!this.mc)
				this.mc = new MovieClip;
			if (!this.mc.parent)
				this.titleMcGroup.addChild(this.mc);
			this.mc.playFile(RES_DIR_EFF + "chenghaozztq_big", -1);
		} else {
			if (!this.titleImg)
				this.titleImg = new eui.Image(config.img);
			if (!this.titleImg.parent)
				this.titleMcGroup.addChild(this.titleImg);
			// this.titleImg.source =
		}

		let power: number = 0;
		power = UserBag.getAttrPower(config.attrs) * 3;
		this.powerPanel.setPower(power);
	}
}
