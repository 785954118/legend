class YqWin extends BaseEuiView {

	public closeBtn1: eui.Button;
	public closeBtn: eui.Button;
	public bgClose: eui.Rect;
	public count: eui.Label;
	public time: eui.Label;
	public group: eui.Group;

	private fxBtn: eui.Button;

	private ybCountTxt: eui.Label;
	private icon:eui.Image;
	private item:eui.Image;

	constructor() {
		super();
	}

	public initUI(): void {
		super.initUI();
		this.skinName = "InviteFriendsSkin";
	}

	public open(...param: any[]): void {
		this.updateInfo();
		TimerManager.ins().doTimer(1000, 0, this.updateInfo, this);
		this.observe(PfActivity.ins().postInviteInfoUpdate,this.updateInfo);
		this.addTouchEvent(this.closeBtn1, this.onTap);
		this.addTouchEvent(this.closeBtn, this.onTap);
		this.addTouchEvent(this.bgClose, this.onTap);
		this.addTouchEvent(this.fxBtn, this.onTap);

		// this.currentState = LocationProperty.appid == PlatFormID.XIN_LANG ? "weibo" : "weixin";
		// this.currentState = "weixin";
		// PfActivity.ins().sendWeiXinInviteGift();
	}

	public close(...param: any[]): void {

		TimerManager.ins().remove(this.updateInfo, this);
		this.removeTouchEvent(this.closeBtn1, this.onTap);
		this.removeTouchEvent(this.closeBtn, this.onTap);
		this.removeTouchEvent(this.bgClose, this.onTap);
		this.removeTouchEvent(this.fxBtn, this.onTap);

		this.removeObserve();
	}

	private onTap(e: egret.TouchEvent): void {
		switch (e.currentTarget) {
			case this.closeBtn1:
			case this.closeBtn:
			case this.bgClose:
				ViewManager.ins().close(this);
				break;

			case this.fxBtn:
				ViewManager.ins().open(WeiBoShareWin);

				break;
		}
	}

	private updateInfo(): void {

		// let allCount: number = LocationProperty.appid == PlatFormID.XIN_LANG ? 1 : 3;
		if(PfActivity.ins().wxInviteCount >= 3) {
			ViewManager.ins().close(this);
			return;
		}

		let allCount: number = 3;
		this.count.text = "(" + PfActivity.ins().wxInviteCount + "/" + allCount + ")";

		this.fxBtn.enabled = PfActivity.ins().wxInviteCount < allCount;

		let award = GlobalConfig.SDKConfig.shareReward;
		let data = award[0];
		if (data.type == 0) {
			this.icon.source = RewardData.getCurrencyRes(data.id);
		} else {
			let itemConfig = GlobalConfig.ItemConfig[data.id];
			if (itemConfig)
				this.icon.source = itemConfig.icon+"_png";
		}

		this.item.source = this.icon.source;

		this.ybCountTxt.text = `${data.count}`;

		if (PfActivity.ins().wxInviteCount) {
			let t: number = (DateUtils.formatMiniDateTime(PfActivity.ins().inviteTime) - GameServer.serverTime)
			this.time.text = t > 0 ? DateUtils.getFormatBySecond(t / 1000) + "后可再次邀请" : "";
		}
		else
			this.time.text = "";
	}
}

ViewManager.ins().reg(YqWin, LayerManager.UI_Popup);