class ZsBossRankWin extends BaseEuiView {

	public closeBtn: eui.Button;
	public list: eui.List;


	constructor() {
		super();
	}

	public initUI(): void {
		super.initUI();

		this.skinName = "ZSBossJoinSkin";
		this.isTopLevel = true;
	}

	public open(...param: any[]): void {
		this.addTouchEvent(this.closeBtn, this.onTap);
		this.observe(ZsBoss.ins().postRankInfo, this.refushListInfo);
		this.refushListInfo();
	}
	public close(...param: any[]): void {
		this.removeTouchEvent(this.closeBtn, this.onTap);
		this.removeObserve();
	}

	private refushListInfo(): void {
		this.list.dataProvider = new eui.ArrayCollection(ZsBoss.ins().bossRankList);
	}

	private onTap(e: egret.TouchEvent): void {
		switch (e.currentTarget) {
			case this.closeBtn:
				ViewManager.ins().close(this);
				break;
		}
	}
}

ViewManager.ins().reg(ZsBossRankWin, LayerManager.UI_Main);