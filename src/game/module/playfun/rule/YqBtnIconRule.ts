class YqBtnIconRule extends RuleIconBase {

	public static isShowIcon: boolean = false;

	constructor(id:number, t: egret.DisplayObjectContainer) {
		super(id, t);

		this.showMessage = [
			PfActivity.ins().postInviteInfoUpdate
		];
	}

	checkShowIcon(): boolean {
		let isOpen = true;
		if(PfActivity.ins().wxInviteCount >= 3) {
			isOpen = false;
		}

		return isOpen && YqBtnIconRule.isShowIcon;
	}

	tapExecute(): void {
		ViewManager.ins().open(YqWin);
	}
}