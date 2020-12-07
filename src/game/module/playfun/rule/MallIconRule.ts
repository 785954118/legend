/**
 * 商城
 */
class MallIconRule extends RuleIconBase {

	constructor(id:number, t: egret.DisplayObjectContainer = null) {
		super(id, t);
		this.showMessage = [
			Actor.ins().postLevelChange,
			UserFb.ins().postGuanqiaInfo,
			UserFb.ins().postGuanKaIdChange,
		];
		this.updateMessage = [
			ShopRedPoint.ins().postShopRedPoint,
		];
	}

	checkShowIcon(): boolean {
		return OpenSystem.ins().checkSysOpen(SystemType.MALL);
	}

	checkShowRedPoint(): number {
		if( ShopRedPoint.ins().shopRedPoint || !ShopRedPoint.ins().nfirstLogin ){

			return 1;
		}

		return 0;
	}

	tapExecute(): void {
		ViewManager.ins().open(ShopWin);
		ShopRedPoint.ins().nfirstLogin = true;
		this.update();
	}
}