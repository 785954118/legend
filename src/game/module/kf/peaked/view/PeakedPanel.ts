/**
 * Created by MPeter on 2017/12/21.
 * 跨服副本-巅峰赛季-总面板
 */
class PeakedPanel extends BaseView {
	private signupPanel: SignupPanel;
	private sixteenPanel: SixteenPanel;

	private _curPanel: BaseView;
	public constructor() {
		super();
	}
	protected childrenCreated(): void {

	}
	public open(...param): void {
		this.observe(PeakedSys.ins().postState, this.upCurState);
		this.upCurState();
	}
	public close(...param): void {
		this.$onClose();

		if (this._curPanel) {
			this._curPanel[`close`]();
			DisplayUtils.removeFromParent(this._curPanel);
		}
	}

	private upCurState(): void {
		if (this._curPanel) {
			this._curPanel[`close`]();
			DisplayUtils.removeFromParent(this._curPanel);
		}

		if (PeakedSys.ins().isKf()) {//跨服下
			let curStatus: number = PeakedSys.ins().kfStatus;
			if (curStatus == KF_PeakStatus.Knockout) {
				//淘汰赛如果结束，则直接跳转到64强界面
				if (PeakedSys.ins().kfStatusIsEnd) {
					curStatus = KF_PeakStatus.Prom64;
				}
			}


			switch (curStatus) {
				case KF_PeakStatus.None:
				case KF_PeakStatus.Knockout:
					if (!this.signupPanel) this.signupPanel = new SignupPanel();
					this._curPanel = this.signupPanel;
					break;
				case KF_PeakStatus.Prom64:
				case KF_PeakStatus.Prom32:
				case KF_PeakStatus.Prom16:
				case KF_PeakStatus.Prom8:
				case KF_PeakStatus.Prom4:
				case KF_PeakStatus.Finals:
					if (!this.sixteenPanel) this.sixteenPanel = new SixteenPanel();
					this._curPanel = this.sixteenPanel;
					break;
			}
		}
		else {
			let curStatus: number = PeakedSys.ins().bfStatus;
			if (curStatus == BF_PeakStatus.Knockout) {
				//如果淘汰赛已结束，则自动跳转到16强界面
				if (PeakedSys.ins().bfStatusIsEnd) curStatus = BF_PeakStatus.Prom16;
				//当前已经过淘汰赛，但自己还未报名，则一直在报名阶段
				else if (!PeakedSys.ins().isSignUp) {
					UserTips.ins().showTips(`您未报名，请等决出16强后再来查看`);
					curStatus = BF_PeakStatus.SignUp;
				}
			}

			switch (curStatus) {
				case BF_PeakStatus.None:
				case BF_PeakStatus.SignUp:
				case BF_PeakStatus.Knockout:
					if (!this.signupPanel) this.signupPanel = new SignupPanel();
					this._curPanel = this.signupPanel;
					break;
				case BF_PeakStatus.Prom16:
				case BF_PeakStatus.Prom8:
				case BF_PeakStatus.Prom4:
				case BF_PeakStatus.Finals:
				case BF_PeakStatus.Over:
					if (!this.sixteenPanel) this.sixteenPanel = new SixteenPanel();
					this._curPanel = this.sixteenPanel;
					break;
			}
		}
		if (this._curPanel) {
			this.addChild(this._curPanel);
			this._curPanel[`open`]();
		}
	}


}