/**
 * Created by wanghengshuai on 2018/3/7.
 *    拍卖行入口
 */
class AuctionIconRule extends RuleIconBase {
	private firstTap: boolean = true;

	public constructor(id: number, t: egret.DisplayObjectContainer) {
		super(id, t);

		this.showMessage = [
			UserZs.ins().postZsData
		];

		this.updateMessage = [
			Auction.ins().postListData,
			Auction.ins().postAuctionResult,
			Auction.ins().postBuyResult,
			Auction.ins().postUpdate
		];
	}


	checkShowIcon(): boolean {
		if (Auction.ins().isAuctionOpen())
			return true;

		return false;
	}

	checkShowRedPoint(): number {
		return Auction.ins().checkRed() && this.firstTap ? 1 : 0;
	}

	getEffName(redPointNum: number): string {
		if (this.firstTap || redPointNum) {
			this.effX = 38;
			this.effY = 38;
			return "actIconCircle";
		}

		//return undefined;
		return `actIconCircle`;
	}

	tapExecute(): void {
		ViewManager.ins().open(AuctionWin);
		Auction.ins().sendGetList(0);
		if (this.firstTap) {
			if (Auction.ins().checkRed())
				this.firstTap = false;

			this.update();
		}
	}
}