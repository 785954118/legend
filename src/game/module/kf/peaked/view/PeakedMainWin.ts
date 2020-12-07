/**
 * Created by MPeter on 2017/12/21.
 * 跨服副本-巅峰赛季-主窗口
 */
class PeakedMainWin extends BaseEuiView {
	private viewStack: eui.ViewStack;
	/**页面选项卡 */
	private tab: eui.TabBar;
	/**头部基本信息 */
	private roleSelect: RoleSelectPanel;
	/**帮助按钮 */
	private help: eui.Button;
	/**关闭按钮 */
	private closeBtn: eui.Button;
	/**红点 */
	private redPoint0: eui.Image;
	private redPoint1: eui.Image;
	private redPoint2: eui.Image;
	private redPoint3: eui.Image;
	private redPoint4: eui.Image;


	/**巅峰赛季 */
	private peakedPanel: PeakedPanel;
	/**赛季奖励 */
	private peakAwardPanel: PeakAwardPanel;
	/**巅峰商城 */
	private peakedMallPanel: PeakedMallPanel;
	/**筹码商城 */
	private peakChipMallPanel: PeakChipMallPanel;
	/**膜拜 */
	private worshipChampionPanel: WorshipChampionPanel;

	private oldIndex: number;
	public constructor() {
		super();
		this.isTopLevel = true;
		this.skinName = `PeakednessWinSkin`;
	}
	public open(...param): void {
		this.oldIndex = this.tab.selectedIndex = this.viewStack.selectedIndex = param[0] ? param[0] : 0;

		this.addChangeEvent(this.tab, this.onTabTouch);
		this.addChangingEvent(this.tab, this.onTabTouching);
		this.addTouchEvent(this.help, this.onTouch);
		this.addTouchEvent(this.closeBtn, this.onTouch);
		this.setOpenIndex(this.oldIndex);

		this.observe(UserReadPlayer.ins().postPlayerResult, this.openOtherPlayerView);
		this.observe(PeakedRedpoint.ins().postRedPoint, this.refRedpoint);
	}
	public close(...param): void {
		if (this.viewStack.getElementAt(this.oldIndex)) {
			this.viewStack.getElementAt(this.oldIndex)['close']();
		}

	}
	/**查看其他玩家 */
	private openOtherPlayerView(otherPlayerData: OtherPlayerData): void {
		if (this.oldIndex == 4) return;//打开膜拜界面，则不处理
		//策划需求，有人气排行时，查看其他角色，关闭人气排行，当关闭查看，再打开
		let hasTopRank = ViewManager.ins().isShow(PeakTopRankWin)
		if (hasTopRank) ViewManager.ins().close(PeakTopRankWin);


		let win = <RRoleWin>ViewManager.ins().open(RRoleWin, otherPlayerData);
		win.hideEx(1);
		win.closeFun = () => {
			if (hasTopRank)
				ViewManager.ins().open(PeakTopRankWin);
		}
		//查看其他角色，如果是其他服务器的数据，则添加服务器id
		// let nameStrs = otherPlayerData.name.split(`[S`);//因为合服后，可能会有同名的玩家，已经添加了区服名，这里要截掉
		// let playerDt = PeakedHelp.findPlayerDtById(otherPlayerData.id);
		// if (playerDt && playerDt.serverId)
		// 	win.nameTxt.text = `${nameStrs[0]}[S${playerDt.serverId}]`;
	}
	private onTabTouch(e: egret.TouchEvent): void {
		let index = this.tab.selectedIndex;
		this.setOpenIndex(index);
	}
	private onTabTouching(e: egret.TouchEvent) {
		if (!this.checkIsOpen(this.tab.selectedIndex)) {
			e.preventDefault();
		}
	}
	private checkIsOpen(index: number): boolean {
		return true;
	}
	private setOpenIndex(selectedIndex: number): void {
		switch (selectedIndex) {
			case 0:
				this.peakedPanel.open();
				break;
			case 1:
				this.peakAwardPanel.open();
				break;
			case 2:
				this.peakedMallPanel.open();
				break;
			case 3:
				this.peakChipMallPanel.open();
				break;
			case 4:
				this.worshipChampionPanel.open();
				break;
		}

		if (this.oldIndex != selectedIndex) {
			this.viewStack.getElementAt(this.oldIndex)['close']();
			this.oldIndex = selectedIndex;

		} else {
			this.tab.selectedIndex = this.viewStack.selectedIndex = selectedIndex;
		}
	}
	private onTouch(e: egret.TouchEvent): void {
		switch (e.target) {
			case this.help:
				let helpId = PeakedSys.ins().isKf() ? 32 : 31;
				ViewManager.ins().open(CommonHelpWin, GlobalConfig.HelpInfoConfig[helpId].text);
				break;
			case this.closeBtn:
				ViewManager.ins().close(this);
				break;
		}
	}
	private refRedpoint(): void {
		this.redPoint0.visible = PeakedRedpoint.ins().redpoint1 > 0;
		this.redPoint1.visible = false;
		this.redPoint2.visible = false;
		this.redPoint3.visible = false;
		this.redPoint4.visible = PeakedRedpoint.ins().redpoint3 > 0;
	}

	public static openCheck(...param: any[]): boolean {
		if (PeakedSys.ins().isOpen()) return true;
		else {
			UserTips.ins().showTips(`巅峰战绩未开启！`);
			return false;
		}
	}
}
ViewManager.ins().reg(PeakedMainWin, LayerManager.UI_Main);
