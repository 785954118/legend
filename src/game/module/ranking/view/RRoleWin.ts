/**
 * RoleWin
 */
class RRoleWin extends BaseEuiView {
	/** tabPanel */
	public viewStack: eui.ViewStack;

	public nameTxt: eui.Label;
	public guildNameText: eui.Label;
	public levelText: eui.Label;
	public headIcon: eui.Image;
	public jueweiIcon: eui.Image;

	public otherPlayerData: OtherPlayerData;
	public roleSelect: RRoleSelectPanel;
	public roleInfoPanel: RRoleInfoPanel;
	public bgClose: eui.Rect;
	public likeBtn: eui.Button;

	public closeFun: Function;
	constructor() {
		super();
		this.skinName = "RRoleWinSkin";
		this.isTopLevel = true;
	}

	public initUI(): void {
		super.initUI();

		// this.setSkinPart("roleSelect", new RRoleSelectPanel());
		// this.setSkinPart("roleInfoPanel", new RRoleInfoPanel());

		this.viewStack.selectedIndex = 0;
	}


	public open(...param: any[]): void {
		this.otherPlayerData = param[0];
		this.roleSelect.otherPlayerData = this.otherPlayerData;
		this.nameTxt.text = this.otherPlayerData.name;
		this.roleSelect.open();
		this.addTouchEvent(this, this.onClick);
		this.addChangeEvent(this.roleSelect, this.onChange);
		this.observe(PeakedSys.ins().postSignUp, this.upLikeDt);
		this.roleSelect.setCurRole(0);
		this.setRoleInfo();
		this.upLikeDt();
		this.roleInfoPanel.showZhanling(this.otherPlayerData);
	}

	public close(...param: any[]): void {
		this.removeTouchEvent(this, this.onClick);
		this.roleInfoPanel.clear();
		if (this.closeFun) this.closeFun();
	}

	public destoryView(): void {
		super.destoryView();

		this.roleSelect.close();
		this.roleInfoPanel.close();
	}

	private upLikeDt(): void {
		if (this.likeBtn) {//是否可点赞判断
			this.likeBtn.enabled = PeakedSys.ins().kideNum < GlobalConfig.PeakRaceBase.likeCount && PeakedRedpoint.ins().redpoint2 > 0;
		}
	}

	private setRoleInfo(): void {
		let tempData = this.otherPlayerData.roleData[0];
		let serverName = window['getServerName'](this.otherPlayerData.serverId)
		let server: string = `[${serverName}]`;
		if (!this.otherPlayerData.serverId || this.otherPlayerData.serverId == LocationProperty.srvid) server = "";
		this.nameTxt.text = this.otherPlayerData.name + server;
		egret.callLater(() => {
			this.guildNameText.x = this.nameTxt.x + this.nameTxt.textWidth + 10;
		}, this)
		this.guildNameText.text = this.otherPlayerData.guildName ? `公会：${this.otherPlayerData.guildName}` : "";
		let strLv: string = this.otherPlayerData.zhuan ? `${this.otherPlayerData.zhuan}转` : "";
		this.levelText.text = `${strLv}${this.otherPlayerData.level}级`;

		this.headIcon.source = `head_${tempData.job}${tempData.sex}`;

		let lv: number = this.otherPlayerData.lilianLv;
		let config: TrainLevelConfig = GlobalConfig.TrainLevelConfig[lv];

		this.jueweiIcon.source = `juewei_1_${config.type}_png`;
	}

	private onChange(e: egret.Event): void {
		this.setView(this.roleSelect.getCurRole());
	}

	private setView(id: number = 0): void {
		this.roleInfoPanel.curRole = this.roleSelect.getCurRole();
		this.roleInfoPanel.open(this.otherPlayerData);
	}

	private onClick(e: egret.TouchEvent): void {
		switch (e.target) {
			case this.bgClose:
				ViewManager.ins().close(this);
				let uiview2: UIView2 = ViewManager.ins().getView(UIView2) as UIView2;
				if (uiview2)
					uiview2.closeNav(UIView2.NAV_ROLE);
				break;
			case this.likeBtn://点赞
				if (PeakedSys.ins().isKf()) {
					PeakedSys.ins().sendKFToLikes(this.otherPlayerData.id);
				}
				else {
					PeakedSys.ins().sendToLikes(this.otherPlayerData.id);
				}
				break;
		}
	}

	/**屏蔽部分入口
	 * type = 1 1v1玩家界面查看
	 * type = 2 跨服消费榜用到
	*/
	public hideEx(type: number = 1): void {
		switch (type) {
			case 1:
				this.roleInfoPanel.juesexiangxi.visible = false;
				this.roleInfoPanel.powerPanel.visible = false;
				if (this.likeBtn) this.likeBtn.visible = true;
				break;
			case 2:
				this.roleInfoPanel.juesexiangxi.visible = false;
				this.roleInfoPanel.powerPanel.visible = false;
				if (this.likeBtn) this.likeBtn.visible = false;
				break;
		}
	}

}

ViewManager.ins().reg(RRoleWin, LayerManager.UI_Main);