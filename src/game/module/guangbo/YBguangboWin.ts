class YBguangboWin extends BaseEuiView {

	private huishou: eui.Label;
	private huishou0: eui.Label;
	private content: eui.Label;
	private content0: eui.Label;

	private group1:eui.Group;
	private group2:eui.Group;

	public arr: Array<any> = [];
	public groupList: Array<any> = [];

	constructor() {
		super();
		this.skinName = "YBguangbo";
		this.addTouchEvent(this.huishou, this.onTap)
		this.addTouchEvent(this.huishou0, this.onTap)
		this.groupList.push(this.group1)
		this.groupList.push(this.group2)
	}

	public open(...param: any[]) {
		if (this.arr.length >= 2) {
			this.arr[0] = param[0]
		} else {
			this.arr.push(param[0])
		}

		this.updateList()
	}
	public updateList() {
		TimerManager.ins().remove(this.updateLabel, this);
		for(let i = 0; i< this.arr.length;i++){
			this.groupList[i].visible = true
			this.groupList[i].$children[1].textFlow = TextFlowMaker.generateTextFlow(this.arr[i]); 
		}
		TimerManager.ins().doTimer(3000, 1, this.updateLabel,this)
	}
	private updateLabel(){
		for(let i = this.arr.length -1; i>=0;i--){
			this.arr.splice(i,1)
			this.groupList[i].visible = false
			TimerManager.ins().doTimer(3000, 1, this.updateLabel,this)
			break;
		}
	}
	public close() {
		this.removeTouchEvent(this.huishou, this.onTap)
		this.removeTouchEvent(this.huishou0, this.onTap)
	}
	public onTap(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.huishou0:
			case this.huishou:
				ViewManager.ins().close(this);
				ViewManager.ins().open(SmeltEquipTotalWin);
				break;
		}
	}

}

ViewManager.ins().reg(YBguangboWin, LayerManager.UI_Tips);