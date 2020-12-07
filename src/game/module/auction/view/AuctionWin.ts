/**
 * Created by wanghengshuai on 2018/3/5.
 *    拍卖行界面
 */
class AuctionWin extends BaseEuiView {

	public roleSelect: RoleSelectPanel;
	public viewStack: eui.ViewStack;
	public guild: AuctionPanel;
	public server: AuctionPanel;
	public tab: eui.TabBar;
	public redPoint0: eui.Image;
	public redPoint1: eui.Image;
	public seeRule: eui.Button;
	public closeBtn: eui.Button;

	public constructor() {
		super();
		this.skinName = "auctionSkin";
		this.isTopLevel = true;
	}

	public open(...param: any[]): void {
		this.addTouchEndEvent(this, this.onTouch);
		this.addChangeEvent(this.tab, this.selectIndexChange);
		this.observe(Auction.ins().postListData, this.updateRed);
		this.observe(Auction.ins().postAuctionResult, this.updateRed);
		this.observe(Auction.ins().postBuyResult, this.updateRed);
		this.observe(Auction.ins().postUpdate, this.updateRed);

		this.updateRed();
		this.tab.selectedIndex = this.viewStack.selectedIndex = Auction.ins().checkRedByType(1) && !Auction.ins().checkRedByType(0) ? 1 : 0;
		this.selectIndexChange();
	}

	public close(): void {

	}

	private onTouch(e: egret.TouchEvent): void {
		switch (e.target) {
			case this.closeBtn:
				ViewManager.ins().close(this);
				break;
			case this.seeRule:
				ViewManager.ins().open(ZsBossRuleSpeak, 41);
				break;
		}
	}

	private selectIndexChange(e: egret.Event = null): void {
		switch (this.tab.selectedIndex) {
			case 0:
				Auction.ins().sendGetList(0);
				this.guild.open(0);
				break;
			case 1:
				Auction.ins().sendGetList(1);
				this.server.open(1);
				break;
		}
	}

	private updateRed(): void {
		this.redPoint0.visible = Auction.ins().checkRedByType(0);
		this.redPoint1.visible = Auction.ins().checkRedByType(1);
	}
}

ViewManager.ins().reg(AuctionWin, LayerManager.UI_Main);