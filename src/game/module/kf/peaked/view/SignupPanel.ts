/**
 * Created by MPeter on 2017/12/21.
 * 跨服副本-巅峰赛季-报名淘汰面板
 */
class SignupPanel extends BaseView {
	//////////////////////报名//////////////////////////
	private signGroup: eui.Group;
	/**报名规则 */
	private signUpRuleTxt: eui.Label;
	/**冠军奖励 */
	private rewardList: eui.List;
	/**报名参加按钮 */
	private signUpBtn: eui.Button;
	private signed: eui.Label;
	private redPoint: eui.Image;

	/////////////////////////淘汰赛////////////////////////
	private knockoutGroup: eui.Group;
	private eliminateListScroller: eui.Scroller;
	/**淘汰赛信息列表 */
	private eliminateInfoList: eui.List;
	/**淘汰赛信息（当前淘汰赛第1轮，剩余88人，我的战绩：8胜1负） */
	private eliminateInfoLabel: eui.Label;
	/**下场开始倒计时 */
	private nextStartCountdownLabel: eui.Label;
	/**基本信息：淘汰赛负5场出局，每场间隔5分钟 */
	private info: eui.Label;
	private state2: eui.Group;

	private _eliminateInfoDt: eui.ArrayCollection;

	public constructor() {
		super();
		this.skinName = `SignupSkin`;
		//自适应
		this.left = 0;
		this.right = 0;
		this.top = 0;
		this.bottom = 0;
	}
	protected childrenCreated(): void {
		this.eliminateInfoList.itemRenderer = PeakKnockoutItemItemRender;
		this._eliminateInfoDt = new eui.ArrayCollection();
		this.eliminateInfoList.dataProvider = this._eliminateInfoDt;

		this.rewardList.itemRenderer = ItemBase;
		//淘汰赛时间
		let knockOutTime: string = DateUtils.getFormatBySecond(GlobalConfig.PeakRaceBase.KnockOutTime, DateUtils.TIME_FORMAT_10)
		this.info.text = `淘汰赛负${GlobalConfig.PeakRaceBase.signUpLose}场出局,每场间隔${knockOutTime}`;
	}
	public open(...param): void {
		this.observe(PeakedSys.ins().postState, this.upCurState);
		this.observe(PeakedSys.ins().postSignUp, this.upSignUpState);
		this.observe(PeakedRedpoint.ins().postRedPoint, this.refRedPoint);
		this.observe(PeakedSys.ins().postEliminateReportData, this.upEliminateReport);
		this.observe(PeakedSys.ins().postKFEliminateReportData, this.upEliminateReport);

		this.addTouchEvent(this.signUpBtn, this.onTouch);
		this.addTouchEvent(this.eliminateInfoList, this.onTouch);

		PeakedRedpoint.ins().postRedPoint();

		if (PeakedSys.ins().isKf()) {
			//请求本服赛16强数据，判断自己是否进入16强
			let state: number = PeakedSys.ins().kfStatus;
			if (state == KF_PeakStatus.Knockout && PeakedSys.ins().kfStatusIsEnd == 0) {
				this.observe(PeakedSys.ins().postBFInfoList, this.upCurState);
				PeakedSys.ins().sendBFInfoList();
			}
			else this.upCurState();
		}
		else this.upCurState();
	}
	public close(...param): void {
		this.$onClose();
		this.removeTouchEvent(this.signUpBtn, this.onTouch);
		this.removeTouchEvent(this.eliminateInfoList, this.onTouch);

		TimerManager.ins().remove(this.onTime, this);
	}
	/**触摸处理 */
	private onTouch(e: egret.TouchEvent): void {
		switch (e.target) {
			case this.signUpBtn:
				// if (UserZs.ins().lv < GlobalConfig.PeakRaceBase.needZsLv) {
				// 	UserTips.ins().showTips(`转生等级要到达${GlobalConfig.PeakRaceBase.needZsLv}级才可报名`);
				// 	return;
				// }
				if (PeakedRedpoint.ins().redpoint1 > 0) {
					PeakedSys.ins().sendSignUp();
				}
				else if (PeakedSys.ins().bfStatus == BF_PeakStatus.Knockout && !PeakedSys.ins().isSignUp) {
					UserTips.ins().showTips(`当前的报名时间已过！`);
				}
				else if (UserZs.ins().lv < GlobalConfig.PeakRaceBase.needZsLv) {
					UserTips.ins().showTips(`需要转生等级到达${GlobalConfig.PeakRaceBase.needZsLv}`);
				}
				else {
					UserTips.ins().showTips(`当前不在报名时间`);
				}

				break;
			case this.eliminateInfoList:

				break;
			default:
				if (e.target instanceof eui.Label && e.target.parent instanceof PeakKnockoutItemItemRender && e.target.name) {
					// UserReadPlayer.ins().sendFindPlayer(e.target.name);
					let info: KonckReportData = e.target.parent.data;
					if (info)
						UserReadPlayer.ins().sendFindPlayer(e.target.name, info.servId);
					else UserReadPlayer.ins().sendFindPlayer(e.target.name);
				}
		}
	}
	/**更新当前状态 */
	@callLater
	private upCurState(): void {
		if (PeakedSys.ins().isKf()) {//跨服下
			let state: number = PeakedSys.ins().kfStatus;
			if (state == KF_PeakStatus.Knockout && PeakedSys.ins().kfStatusIsEnd == 0) {

				//当前已经过淘汰赛，但自己还未报名，则一直在报名阶段
				if (!PeakedSys.ins().isSignUp) {
					UserTips.ins().showTips(`您未报名，请等决出64强后再来查看`);
					state = KF_PeakStatus.None;
				}
				//当前未进入单服16强，但自己还未报名，则一直在报名阶段
				else if (!PeakedHelp.isSixteenById(Actor.actorID)) {
					UserTips.ins().showTips(`您未进入单服16强，请等决出64强后再来查看`);
					state = KF_PeakStatus.None;
				}
			}
			switch (state) {
				case KF_PeakStatus.None:
					this.signGroup.visible = true;
					this.knockoutGroup.visible = false;
					this.signUpBtn.visible = false;
					this.signed.visible = false;

					this.signUpRuleTxt.textFlow = TextFlowMaker.generateTextFlow(PeakedHelp.getKFTimerRuleStr());
					this.rewardList.dataProvider = new eui.ArrayCollection(GlobalConfig.PeakRaceBase.croosRewards);
					break;
				case KF_PeakStatus.Knockout:
					this.signGroup.visible = false;
					this.knockoutGroup.visible = true;
					this.signUpBtn.visible = false;
					this.signed.visible = false;

					//查询战报信息
					PeakedSys.ins().sendKFEliminateReport();
					break;
				case KF_PeakStatus.Prom64:
				case KF_PeakStatus.Prom32:
				case KF_PeakStatus.Prom16:
				case KF_PeakStatus.Prom8:
				case KF_PeakStatus.Prom4:
				case KF_PeakStatus.Finals:

					break;
			}
		}
		else {
			let state: number = PeakedSys.ins().bfStatus;
			//当前已经过淘汰赛，但自己还未报名，则一直在报名阶段
			if (state == BF_PeakStatus.Knockout && !PeakedSys.ins().isSignUp) {
				state = BF_PeakStatus.SignUp;
				// UserTips.ins().showTips(`您未报名，请等决出16强后再来查看`);

			}

			switch (state) {
				case BF_PeakStatus.None:
				case BF_PeakStatus.SignUp:
					this.signGroup.visible = true;
					this.knockoutGroup.visible = false;

					if (PeakedSys.ins().isSignUp) {
						// this.signUpBtn.enabled = false;
						// this.signUpBtn.label = `已报名`;
						this.signed.visible = true;
						this.signUpBtn.visible = false;
					}
					else {
						// this.signUpBtn.enabled = true;
						this.signUpBtn.label = `报名`;
						this.signed.visible = false;
					}

					this.signUpRuleTxt.textFlow = TextFlowMaker.generateTextFlow(PeakedHelp.getTimerRuleStr());
					this.rewardList.dataProvider = new eui.ArrayCollection(GlobalConfig.PeakRaceBase.singleRewards);
					break;
				case BF_PeakStatus.Knockout:
					this.signGroup.visible = false;
					this.knockoutGroup.visible = true;

					//查询战报信息
					PeakedSys.ins().sendEliminateReport();
					break;
				case BF_PeakStatus.Prom16:
				case BF_PeakStatus.Prom8:
				case BF_PeakStatus.Prom4:
				case BF_PeakStatus.Finals:

					break;
			}
		}

	}



	/////////////////////////////////////报名//////////////////////////////////////////////
	/**更新报名状态 */
	private upSignUpState(state: number = -1): void {
		if (PeakedSys.ins().isSignUp) {
			// this.signUpBtn.enabled = false;
			// this.signUpBtn.label = `已报名`;
			this.signed.visible = true;
			this.signUpBtn.visible = false;
			if (state != -1)
				UserTips.ins().showTips(`成功报名巅峰赛季`);
		}
	}



	/////////////////////////////////////淘汰赛//////////////////////////////////////////////
	/**
	 * 更新淘汰赛报
	 */
	private curKonckRound: number = 0;
	private upEliminateReport(): void {
		let sysDt: PeakedSys = PeakedSys.ins();
		let reportList = sysDt.isKf() ? sysDt.kfKonckReportList : sysDt.bfKonckReportList;
		this.curKonckRound = sysDt.isKf() ? sysDt.kfKonckRound : sysDt.bfKonckRound;
		let surplusNum: number = sysDt.isKf() ? sysDt.kfKonckSurplusNum : sysDt.bfKonckSurplusNum;


		this._eliminateInfoDt.replaceAll(reportList);
		DisplayUtils.scrollerToBottom(this.eliminateListScroller);


		let record: string = `，我的战绩：`;
		let winNum: number = PeakedHelp.calcEliminateWinNum();
		if (reportList.length - winNum >= GlobalConfig.PeakRaceBase.signUpLose) {
			record = `|C:${ColorUtil.RED}&T:(您已经被淘汰)|`;

			this.nextStartCountdownLabel.visible = false;
			this.state2.visible = false;
		}
		else {
			//防止服务器出现异常，轮数和战报条数不一致，导致计算负数错误
			let loseNum: number = this.curKonckRound - winNum < 0 ? 0 : this.curKonckRound - winNum;
			record += `${winNum}胜${loseNum}负`;

			TimerManager.ins().remove(this.onTime, this);
			TimerManager.ins().doTimer(1000, 0, this.onTime, this);
			this.onTime(true);
			this.state2.visible = true;
		}

		this.eliminateInfoLabel.textFlow = TextFlowMaker.generateTextFlow1(`当前淘汰赛第${this.curKonckRound}轮，剩余${surplusNum}人 ${record}`);


	}
	private onTime(isInt: boolean = false): void {
		let kNextTimer: number = PeakedSys.ins().isKf() ? PeakedSys.ins().kfKonckNextTimer : PeakedSys.ins().bfKonckNextTimer;
		let nexttimer: number = Math.floor((DateUtils.formatMiniDateTime(kNextTimer) - GameServer.serverTime) / 1000);
		if (nexttimer > 0) {
			this.nextStartCountdownLabel.text = DateUtils.getFormatBySecond(nexttimer);
		}
		else {
			TimerManager.ins().remove(this.onTime, this);
			this.nextStartCountdownLabel.text = "";

			if (!isInt) {
				//到了时间，请求下一场的淘汰战报
				// if (PeakedSys.ins().isKf()) {
				// PeakedSys.ins().sendKFEliminateReport();
				// }
				// else PeakedSys.ins().sendEliminateReport();
			}
		}
	}

	private refRedPoint(): void {
		this.redPoint.visible = PeakedRedpoint.ins().redpoint1 > 0;

	}
}