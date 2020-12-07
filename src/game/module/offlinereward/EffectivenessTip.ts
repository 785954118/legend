/**
 *
 * @author hepeiye
 *
 */
class EffectivenessTip extends BaseEuiView {

	private nextExp: eui.Label;
	private nextMoney: eui.Label;
	private curExp: eui.Label;
	private curMoney: eui.Label;
	private groupGold: eui.Group;
	private groupExp: eui.Group;
	private groupInfoGold: eui.Group;
	private groupInfoExp: eui.Group;
	private showType: number = 0;
	private nextInfoMoney: eui.Label;
	private nextInfoExp: eui.Label;
	private descTxt: eui.Label;
	private mainGroup: eui.Group;
	private doubleTime: eui.Group;
	private endTime: eui.Label;

	constructor() {
		super();
		this.skinName = "CheckEfficienSkin";
	}

	public open(...param: any[]): void {
		this.showType = param[0] ? param[0] : 0;
		this.update();
		this.addTouchEvent(this, this.onTap);
		TimerManager.ins().doTimer(3000, 1, this.playTween, this);
	}

	private playTween(): void {
		if (this.showType || true) {
			let tt: egret.Tween = egret.Tween.get(this.mainGroup);
			tt.to({ scaleX: 0, scaleY: 0, horizontalCenter: 170, top: 52 }, 500).call(() => {
				ViewManager.ins().close(this);
			});
		} else {
			let t: egret.Tween = egret.Tween.get(this);
			t.to({ "alpha": 0 }, 1000).call(() => {
				this.alpha = 1;
				ViewManager.ins().close(this);
			}, this);
		}
	}

	public close(...param: any[]): void {
		UserFb.ins().showAni = false;
		this.removeTouchEvent(this, this.onTap);
		TimerManager.ins().remove(this.playTween, this);
		egret.Tween.removeTweens(this.mainGroup);
		egret.Tween.removeTweens(this);
	}

	private onTap(e: egret.TouchEvent): void {
		this.removeTouchEvent(this, this.onTap);
		TimerManager.ins().remove(this.playTween, this);
		this.playTween();
	}

	private update() {



		let curId: number = UserFb.ins().guanqiaID;
		let lastID: number = curId - 1;

		if (UserFb.ins().expEff == UserFb.ins().expEffLast) {
			this.groupExp.visible = false;
		} else {
			this.groupExp.visible = true;
			this.curExp.text = UserFb.ins().expEffLast + "";
			this.nextExp.text = UserFb.ins().expEff + "";
		}

		if (UserFb.ins().goldEff == UserFb.ins().goldEffLast) {
			this.groupGold.visible = false;
		} else {
			this.groupGold.visible = true;
			this.curMoney.text = UserFb.ins().goldEffLast + "";
			this.nextMoney.text = UserFb.ins().goldEff + "";
		}

		if (this.showType) {
			this.groupGold.visible = this.groupExp.visible = false;
			this.groupInfoGold.visible = this.groupInfoExp.visible = true;
			this.nextInfoExp.text = UserFb.ins().expEff + "";
			this.nextInfoMoney.text = UserFb.ins().goldEff + "";
			this.descTxt.text = "关卡效率";
		} else {
			this.groupGold.visible = this.groupExp.visible = true;
			this.groupInfoGold.visible = this.groupInfoExp.visible = false;
			this.descTxt.text = "关卡效率提升";
		}

		if (UserFb.ins().doubleTime > 0) {
			this.doubleTime.visible = true
			// 防止重复定时器
			// this.nextInfoExp.textColor = '20C020'
			this.nextInfoExp.text = UserFb.ins().doubleExp + "";
			this.nextInfoExp.textColor = 0xF40909;
			let str = ''
			if (UserFb.ins().doubleTime >= 60 * 60 * 1000) {
				str = DateUtils.getFormatBySecond(UserFb.ins().doubleTime / 1000, 9)
			} else {
				str = DateUtils.getFormatBySecond(UserFb.ins().doubleTime / 1000, 3)
			} 
			this.endTime.text = str
			TimerManager.ins().remove(this.updateNextHongBaoTime, this);
			TimerManager.ins().doTimer(1000, 0, this.updateNextHongBaoTime, this);
		} else {
			// this.nextInfoExp.textColor = 'F40909'
			this.nextInfoExp.text = UserFb.ins().expEff + "";
			this.nextInfoExp.textColor = 0x20C020;
			this.doubleTime.visible = false
		}

	}
	public updateNextHongBaoTime() {

		if (UserFb.ins().doubleTime > 0) {
			this.doubleTime.visible = true
			let str = ''
			if (UserFb.ins().doubleTime >= 60 * 60 * 1000) {
				str = DateUtils.getFormatBySecond(UserFb.ins().doubleTime / 1000, 9)
			} else {
				str = DateUtils.getFormatBySecond(UserFb.ins().doubleTime / 1000, 3)
			} 
			this.endTime.text = str
		} else {
			this.doubleTime.visible = false
			TimerManager.ins().remove(this.updateNextHongBaoTime, this);
		}

	}
}
ViewManager.ins().reg(EffectivenessTip, LayerManager.UI_Main);
