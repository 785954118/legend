class ChatMessageIconRule extends RuleIconBase {

	constructor(id:number, t: egret.DisplayObjectContainer) {
		super(id, t);
	}

	checkShowRedPoint(): number {
		return 0;
	}


	tapExecute(): void {
		ViewManager.ins().open(ChatWin);
	}
}