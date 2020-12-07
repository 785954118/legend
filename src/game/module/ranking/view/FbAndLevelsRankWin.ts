class FbAndLevelsRankWin extends BaseEuiView {

	public closeBtn: eui.Button;
	public closeBtn0: eui.Button;
	public rank: eui.Label;
	public list: eui.List;
	public title: eui.Image;

	constructor() {
		super();
	}

	public initUI(): void {
		super.initUI();

		this.skinName = "FbRankSkin";
	}

	public open(...param: any[]): void {

		this.title.source = "fbRankSkin_" + param[0];

		let rankModel: RankModel = Rank.ins().rankModel[param[0]];
		this.rank.text = 0 < rankModel.selfPos && rankModel.selfPos <= 1000 ? rankModel.selfPos + '' : "未上榜";

		this.list.itemRenderer = FbAndLevelsRankItem;
		this.list.dataProvider = new eui.ArrayCollection(rankModel.getDataList());

		this.addTouchEvent(this.closeBtn, this.onTap);
		this.addTouchEvent(this.closeBtn0, this.onTap);
	}

	public close(...param: any[]): void {
		this.removeTouchEvent(this.closeBtn, this.onTap);
		this.removeTouchEvent(this.closeBtn0, this.onTap);
	}

	private onTap(e: egret.TouchEvent): void {
		switch (e.currentTarget) {
			case this.closeBtn:
			case this.closeBtn0:
				ViewManager.ins().close(FbAndLevelsRankWin);
				break;
		}
	}
}

ViewManager.ins().reg(FbAndLevelsRankWin, LayerManager.UI_Popup);