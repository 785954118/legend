/**
 * Created by Administrator on 2016/8/1.
 */
class WanBaGiftWin extends BaseEuiView {

	public okBtn: eui.Button;
	public text: eui.Label;

	constructor() {
		super();
	}

	public initUI(): void {
		super.initUI();

		this.skinName = "GiftNoticeSkin";
	}

	public open(...param: any[]): void {

		let day: number = param[0];
		let result: boolean = param[1];

		this.currentState = result ? "success" : "fail";

		this.addTouchEvent(this.okBtn, this.onTap);

		let config: WanBaGiftbagBasic = GlobalConfig.WanBaGiftbagBasic[day];

		let s: string = "";
		for (let i: number = 0; i < config.items.length; i++) {
			if (config.items[i].type == 0)
				s += RewardData.getCurrencyName(config.items[i].id);
			else
				s += GlobalConfig.ItemConfig[config.items[i].id].name;
			s += "×" + config.items[i].count;
			if (i + 1 < config.items.length)
				s += "、";
		}
		this.text.text = s;
	}

	public close(...param: any[]): void {
		this.addTouchEvent(this.okBtn, this.onTap);
	}

	private onTap(e: egret.TouchEvent): void {

		ViewManager.ins().close(this);
	}
}

ViewManager.ins().reg(WanBaGiftWin, LayerManager.UI_Main);