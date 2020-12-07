/**
 * Created by Administrator on 2016/9/9.
 */
class BBSIconRule extends RuleIconBase {

	constructor(id:number, t: egret.DisplayObjectContainer) {
		super(id, t);
		this.showMessage = [
			//MessagerEvent.ENCOUNTER_DATA_CHANGE
		];
	}

	checkShowIcon(): boolean {
		return LocationProperty.appid == PlatFormID.QQ_BROWSER;
	}

	tapExecute(): void {
		window['openTopicCircle']();
	}
}