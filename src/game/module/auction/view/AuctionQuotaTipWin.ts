/**
 * Created by wanghengshuai on 2018/3/8.
 *    拍卖行活跃度不足界面
 */
class AuctionQuotaTipWin extends BaseEuiView {
	public bgClose: eui.Rect;
	public rechargeQuotaNum: eui.Label;
	public positiveQuotaNum: eui.Label;
	public goRechargeBtn: eui.Button;


	public constructor() {
		super();
		this.skinName = "auctionQuotaTipSkin";
	}

	protected childrenCreated(): void {
		super.childrenCreated();
	}

	public open(...param: any[]): void {
		this.addTouchEndEvent(this, this.onTouch);

		this.positiveQuotaNum.text = param[0];
		this.rechargeQuotaNum.text = param[1];
	}

	private onTouch(e: egret.TouchEvent): void {
		switch (e.target) {
			case this.bgClose:
				ViewManager.ins().close(this);
				break;
			case this.goRechargeBtn:
				let reData: RechargeData = Recharge.ins().getRechargeData(0);
				if (!reData || reData.num != 2) {
					ViewManager.ins().open(Recharge1Win);
				} else {
					ViewManager.ins().open(ChargeFirstWin);
				}

				ViewManager.ins().close(AuctionQuotaTipWin);
				break;
		}
	}
}

ViewManager.ins().reg(AuctionQuotaTipWin, LayerManager.UI_Popup);