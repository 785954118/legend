/**
 * Created by wanghengshuai on 2018/3/6.
 *    拍卖盒使用界面
 */
class AuctionItemChoiceWin extends BaseEuiView {

	public bgClose: eui.Rect;
	public title: eui.Label;
	public price: eui.Group;
	public price1: eui.Label;
	public price2: eui.Label;
	public auctionBtn: eui.Button;
	public ownUse: eui.Button;
	public item: ItemBase;

	private itemID: number;

	private auID: number;

	public constructor() {
		super();
		this.skinName = "auctionItemChoiceSkin";
		this.isTopLevel = true;
	}

	protected childrenCreated(): void {
		super.childrenCreated();
	}

	public open(...param: any[]): void {
		this.itemID = param[0];
		this.auID = param[1];

		this.addTouchEndEvent(this, this.onTouch);
		this.update();
	}

	private update(): void {
		let cfg: AuctionItem = GlobalConfig.AuctionItem[this.auID];
		this.item.data = cfg.item;
		this.price1.text = cfg.bid + "";
		this.price2.text = cfg.buy + "";
	}

	private onTouch(e: egret.TouchEvent): void {
		switch (e.target) {
			case this.bgClose:
				ViewManager.ins().close(this);
				break;
			case this.ownUse:
			case this.auctionBtn:
				Auction.ins().sendUseAuBox(e.target == this.ownUse ? 0 : 1, this.itemID);
				ViewManager.ins().close(this);
				break;
		}
	}
}

ViewManager.ins().reg(AuctionItemChoiceWin, LayerManager.UI_Main)