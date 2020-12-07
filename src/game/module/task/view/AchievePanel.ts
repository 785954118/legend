/**
 * AchievePanel
 */
class AchievePanel extends BaseView{

	private list: eui.List;

	private _achieve:AchievementData[];
	constructor() {
		super();

		this.skinName = "AchievePanelSkin";
		this.name = "成就";

		this.list.itemRenderer = AchieveItem;
	}

	public open(): void {
		this.addTouchEvent(this.list,this.onSendFunc);
		// MessageCenter.ins().addListener(MessagerEvent.UPDATA_TASK,this.setPanel,this);
		this.observe(UserTask.ins().postTaskChangeData, this.setPanel);
		this.setPanel();
	}
	public close(): void {
		this.removeTouchEvent(this.list,this.onSendFunc);
		// MessageCenter.ins().removeListener(MessagerEvent.UPDATA_TASK,this.setPanel,this);
		this.removeObserve();
	}

	private onSendFunc(e: egret.TouchEvent): void {
		if(!(e.target instanceof eui.Button)) return;
		let item: AchieveItem = e.target.parent as AchieveItem;
		switch(e.target) {
			case item.gotoBtn:
				GameGuider.taskGuidance((item.data as AchievementData).id,1);
				break;
			case item.awardsBtn:
				// ControllerManager.ins().applyFunc(ControllerConst.Task,TaskWinFunc.GET_ACHIEVE,(item.data as AchievementData).achievementId);
				UserTask.ins().sendGetAchieve((item.data as AchievementData).achievementId);
				break;
		}
	}

	private setPanel(): void {
		this._achieve = UserTask.ins().achiEvement;

		this.list.dataProvider = new eui.ArrayCollection(this._achieve);
	}
}