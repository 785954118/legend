class MonthCardIconRule extends RuleIconBase {
	private firstTap: boolean = true;
	constructor(id:number, t: egret.DisplayObjectContainer) {
		super(id, t);

		this.showMessage = [
			Actor.ins().postLevelChange,
			UserExpGold.ins().postExpUpdate
		];
	}

	checkShowIcon(): boolean {
		let b:boolean = true;
		if( Recharge.ins().monthDay>0 && Recharge.ins().franchise>0 ){
			b = false;
		}
		return OpenSystem.ins().checkSysOpen(SystemType.MONTHCARD) && b;
	}

	checkShowRedPoint(): number {
		return 0;
	}

	getEffName(redPointNum: number): string {
		if (this.firstTap) {
			this.effX = 38;
			this.effY = 38;
			return "actIconCircle";
		}
		return undefined;
	}

	tapExecute(): void {
		let index = 2;//月卡标签
		if( Recharge.ins().monthDay>0 )
			index = 3;//特权标签
		ViewManager.ins().open(FuliWin, index);
		this.firstTap = false;
		this.update();
	}
}