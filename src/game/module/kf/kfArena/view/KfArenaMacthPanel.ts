/**
 * 跨服竞技场匹配
 */
class KfArenaMacthPanel extends BaseEuiView {
	public roleGroup: eui.Group;
	public member1: KfArenaRoleItemRender;
	public member2: KfArenaRoleItemRender;
	public leader: KfArenaRoleItemRender;
	public memberArr: KfArenaRoleItemRender[];
	public duanLabel: eui.Label;
	public scoreLabel: eui.Label;
	public curMonthLabel: eui.Label;
	public historyLabel: eui.Label;
	public countLabel: eui.Label;
	public dailyTime: eui.Label;
	public maxTime: eui.Label;
	public disBtn: eui.Button;
	public macthBtn: eui.Button;
	public macthingLabel: eui.Label;

	constructor() {
		super();
		this.name = `匹配`;
	}

	protected childrenCreated() {
		this.initUI();
	}

	public initUI(): void {
		super.initUI();
		this.memberArr = [this.leader, this.member1, this.member2];
		this.dailyTime.text = `${GlobalConfig.CrossArenaBase.joinCount}`;
		this.maxTime.text = `${GlobalConfig.CrossArenaBase.maxJoinCount}`;
	}

	public open(): void {
		this.addTouchEvent(this.disBtn, this.onTouch);
		this.addTouchEvent(this.macthBtn, this.onTouch);
		this.observe(KfArenaSys.ins().postPlayerInfo, this.updateInfo);
		this.observe(KfArenaSys.ins().postTeamInfo, this.update);
		this.observe(KfArenaSys.ins().postMacthState, this.update);
		this.update();
	}


	private update(): void {
		this.updateMember();
		this.updateInfo();
		this.updateBtnState();
	}

	/** 更新成员信息*/
	private updateMember(): void {
		this.roleGroup.visible = KfArenaSys.ins().getIsJoinTeam();
		for (let member of this.memberArr) {
			member.data = null;
		}

		let tfMembers = KfArenaSys.ins().tfMembers;
		let index: number = 1;
		if (tfMembers && tfMembers.length) {
			for (let i = 0; i < tfMembers.length; i++) {
				let data: KfArenaRoleVo = tfMembers[i];
				let isLeader = data.isLeader();
				if (isLeader) {
					this.leader.data = data;
				}
				else {
					this.memberArr[index].data = data;
					index++;
				}
			}
		}
	}

	/** 更新竞技场信息*/
	private updateInfo(): void {
		let ins: KfArenaSys = KfArenaSys.ins();
		this.duanLabel.text = `当前段位：${ins.getDuanName()}`;
		this.scoreLabel.text = `当前积分：${ins.duanLevel}`;
		this.curMonthLabel.text = `当前战绩：${ins.curMouth.win}胜${ins.curMouth.ping}平${ins.curMouth.fail}败`;
		this.historyLabel.text = `历史战绩：${ins.history.win}胜${ins.history.ping}平${ins.history.fail}败`;
		this.countLabel.text = `${ins.times}`;
		this.macthingLabel.visible = ins.macthState == 1;
	}

	/**更新按钮的状态 */
	private updateBtnState(): void {
		if (!KfArenaSys.ins().getIsJoinTeam()) {
			this.disBtn.label = `创建战队`;
			this.macthBtn.label = `单人匹配`;
		}
		else {
			if (KfArenaSys.ins().isTFCaptain)
				this.disBtn.label = `解散战队`;
			else
				this.disBtn.label = `离开战队`;
			if (KfArenaSys.ins().macthState == 1)
				this.macthBtn.label = `取消匹配`;
			else
				this.macthBtn.label = `开始匹配`;
		}
	}

	protected onTouch(e: egret.Event): void {
		if (KfArenaSys.ins().isStartIng == 0) {
			UserTips.ins().showCenterTips(`每日12:00-12:30、22:00-22:30`);
			return;
		}
		switch (e.target) {
			case this.disBtn:
				//创建队伍
				if (!KfArenaSys.ins().getIsJoinTeam()) {
					KfArenaSys.ins().sendCreateTeam();
					return;
				}
				//解散队伍
				KfArenaSys.ins().sendLeaveTeam();
				break;
			case this.macthBtn:
				//取消匹配
				if (KfArenaSys.ins().macthState == 1) {
					if (!KfArenaSys.ins().isTFCaptain) {
						UserTips.ins().showCenterTips(`只有队长才可以取消匹配`);
						return;
					}
					KfArenaSys.ins().sendCancelMacth();
					return;
				}
				//单人匹配
				if (!KfArenaSys.ins().getIsJoinTeam()) {
					KfArenaSys.ins().sendPersonalMatch();
					return;
				}
				//开始匹配
				if (!KfArenaSys.ins().isTFCaptain) {
					UserTips.ins().showCenterTips(`只有队长才可以开始匹配`);
					return;
				}
				KfArenaSys.ins().sendStartMacth();
				break;
		}
	}
}
