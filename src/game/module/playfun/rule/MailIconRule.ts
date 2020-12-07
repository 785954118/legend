/**
 * Created by Administrator on 2016/7/21.
 */
class MailIconRule extends RuleIconBase {

	constructor(id:number, t: egret.DisplayObjectContainer) {
		super(id, t);

		this.showMessage = [
			UserMail.ins().postMailData,
			UserMail.ins().postGetItemFromMail,
			UserMail.ins().postMailDetail,
		];
	}

	checkShowIcon(): boolean {
		let data = UserMail.ins().getUnreadMail();
		// egret.Tween.removeTweens(this.tar);
		if (data <= 0) {
			return false;
		} else {
			// this.blink();
			return true;
		}
	}
	checkShowRedPoint(): number {
		if (UserMail.ins().mailData) {
			return 1;//UserMail.ins().getUnreadMail();
		}
		return 0;
	}

	blink() {
		let t = egret.Tween.get(this.tar);
		t.to({ alpha: 0 }, 500).to({ alpha: 1 }, 500).call(this.blink.bind(this));
	}

	tapExecute(): void {
		ViewManager.ins().open(FriendBgWin, 4);
	}
}