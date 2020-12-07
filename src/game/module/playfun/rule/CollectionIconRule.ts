/**
 * Created by Administrator on 2016/9/9.
 */

class CollectionIconRule extends RuleIconBase {

	constructor(id:number, t: egret.DisplayObjectContainer) {
		super(id, t);
	}

	checkShowIcon(): boolean {
		return LocationProperty.appid == PlatFormID.QQ_BROWSER ||
			LocationProperty.appid == PlatFormID.XIN_LANG;
	}

	tapExecute(): void {
		window['sendToDesktop']();
	}
}