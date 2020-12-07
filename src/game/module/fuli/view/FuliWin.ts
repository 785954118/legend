class FuliWin extends BaseEuiView {

	public closeBtn: eui.Button;
	public closeBtn0: eui.Button;
	public listBar: eui.Scroller;
	public iconList: eui.List;
	public rightBtn: eui.Button;
	public leftBtn: eui.Button;
	public info: eui.Group;
	public leftGroup: eui.Group;
	public rightGroup: eui.Group;


	private _datas: any[];
	private curId: number;

	private arrList: eui.ArrayCollection;

	private panels: any[];
	private allPanels: any[];
	private cruPanel: any;
	private btnNum: number;
	//box0~3under 背静圈
	private index: number;
	private initFunc: Function;
	constructor() {
		super();
		this.skinName = "FuliMainSkin";
		this.isTopLevel = true;
		// this.setSkinPart("roleSelect", new RoleSelectPanel());
	}

	public initUI(): void {
		super.initUI();
		this.iconList.itemRenderer = FuliActBtnRenderer;
		// this.panels = [CdkeyPanle, MoneyTreePanel, GameNoticePanle, MonthCardWin, NextDayLoginWin,DailyCheckInPanel];
		this.allPanels = [DailyCheckInPanel, SevenDayLogWin, MonthCardWin, FranchiseWin, GameNoticePanle, CdkeyPanle, QHBPanle];
		this.panels = [];
		this.arrList = new eui.ArrayCollection();
	}
	private onTouchBtn(e: egret.TouchEvent): void {
		let num: number = 92 * 5;
		let scrollH: number = 0;
		switch (e.target) {
			case this.leftBtn:
				scrollH = this.iconList.scrollH - num;
				scrollH = Math.round(scrollH / 92) * 92;
				if (scrollH < 0) {
					scrollH = 0;
				}
				this.iconList.scrollH = scrollH;
				break;
			case this.rightBtn:
				scrollH = this.iconList.scrollH + num;
				scrollH = Math.round(scrollH / 92) * 92;
				if (scrollH > this.iconList.contentWidth - this.listBar.width) {
					scrollH = this.iconList.contentWidth - this.listBar.width;
				}
				this.iconList.scrollH = scrollH;
				break;
		}
		this.onChange();
	}
	public open(...param: any[]): void {
		this.addTouchEvent(this.closeBtn, this.onTap);
		this.addTouchEvent(this.closeBtn0, this.onTap);
		this.addChangeEvent(this.listBar, this.onChange);
		this.addChangeEvent(this.iconList, this.onClickMenu);
		this.addTouchEvent(this.leftBtn, this.onTouchBtn);
		this.addTouchEvent(this.rightBtn, this.onTouchBtn);


		this.observe(Notice.ins().postGameNotice, this.updateMenuList);
		this.observe(DailyCheckIn.ins().postCheckInData, this.updateMenuList);
		this.observe(Activity.ins().postSevendayAwardCallback, this.updateMenuList);
		this.observe(Recharge.ins().postFranchiseInfo, this.updateMenuList);
		this.observe(Activity.ins().postActivityIsGetAwards, this.updateMenuList);

		this.index = 0;
		if (param[0]) {
			this.index = param[0];
			this.initFunc = () => {
				if (this.allPanels[this.index] != this.panels[this.index]) {
					let dif = this.allPanels.length - this.panels.length;
					dif = dif > 0 ? dif : 0;
					this.index -= dif;
				}
			}
		}

		this.updateMenuList([true], param[1]);
	}


	public close(...param: any[]): void {
		this.cruPanel.close();
	}

	private updateMenuList(...param: any[]) {
		this._datas = [];
		this.panels = this.allPanels;
		let change: boolean = false;
		let baoji: number = 0
		let cfg: WelfareConfig;
		// let isFull: boolean = false;
		if (param && param[0]) {
			if (param[0][0]) change = param[0][0];
			if (param[0][1]) baoji = param[0][1];
		}
		for (let k in GlobalConfig.WelfareConfig) {
			cfg = GlobalConfig.WelfareConfig[k]
			this._datas.push(cfg);
		}
		let isSuccess: boolean = true;
		for (let i in GlobalConfig.LoginRewardsConfig) {
			let config: LoginRewardsConfig = GlobalConfig.LoginRewardsConfig[i];
			if ((Activity.ins().isAwards >> config.day & 1) == 0) {
				//还有未领取的
				isSuccess = false;
				break;
			}
		}
		// for (let i = 0; i < this._datas.length; i++) {
		// 	cfg = this._datas[i];
		// 	if (cfg.id == 6) {
		// 		if (GameServer.serverTime >= (DateUtils.formatMiniDateTime(cfg.startTime)) && GameServer.serverTime < (DateUtils.formatMiniDateTime(cfg.endTime))) {
					
		// 		} else {
		// 			this._datas.splice(i, 1);
		// 			break;
		// 		}
		// 	}
		// }
		//已经领取完 隐藏14天登陆奖励
		if (isSuccess) {
			this.panels = [];
			for (let i = 0, j = 0; i < this._datas.length; j++) {
				cfg = this._datas[i];
				//14天登陆奖励id
				if (cfg.id == 1) {
					this._datas.splice(i, 1);
				} else {
					this.panels.push(this.allPanels[j]);
					i++
				}
			}
		}
		// if (!isFull && this.iconList.selectedIndex != 0) {
		// 	--this.iconList.selectedIndex;
		// }

		this.arrList.replaceAll(this._datas);
		if (this.initFunc) {
			this.initFunc();
			this.initFunc = null;
		}
		this.iconList.selectedIndex = this.index;
		this.iconList.dataProvider = this.arrList;
		if (change) {
			this.curId = this.iconList.selectedIndex;//this._datas[this.iconList.selectedIndex].type;
			this.updateDetail(param[1]);
		}
		this.btnNum = this._datas.length;
		this.onChange();
	}

	private onClickMenu(e: egret.TouchEvent): void {
		SoundUtil.ins().playEffect(SoundUtil.WINDOW);
		this.curId = this.iconList.selectedIndex;//this._datas[this.iconList.selectedIndex].type;
		this.index = this.curId;
		// this.curId = this.iconList.selectedIndex;
		this.updateDetail();
	}

	private onTap(e: egret.TouchEvent): void {
		switch (e.currentTarget) {
			case this.closeBtn:
			case this.closeBtn0:
				ViewManager.ins().close(this);
				break;
		}
	}

	private onChange(): void {

		if (this.iconList.scrollH < 46) {
			this.leftGroup.visible = false;
			this.rightGroup.visible = true;
		} else if (this.iconList.scrollH >= this.iconList.contentWidth - this.iconList.width - 46) {
			this.leftGroup.visible = true;
			this.rightGroup.visible = false;
		} else {
			this.leftGroup.visible = true;
			this.rightGroup.visible = true;
		}
		if (this.btnNum <= 5) {
			this.leftGroup.visible = false;
			this.rightGroup.visible = false;
		}
	}



	private updateDetail(parma?: any): void {
		if (this.cruPanel) {
			DisplayUtils.removeFromParent(this.cruPanel);
			this.cruPanel.close();
		}
		// this.curId = 6;
		this.cruPanel = new this.panels[this.curId];
		if (!UserFuLi.ins().isOpen[this.curId]) {
			UserFuLi.ins().isOpen[this.curId] = true;
			this.updateMenuList();
		}
		if (this.cruPanel) {
			this.cruPanel.left = 0;
			this.cruPanel.right = 0;
			this.cruPanel.top = 0;
			this.cruPanel.bottom = 0;
			this.info.addChild(this.cruPanel);
			this.cruPanel.open(parma);
		}
	}

}
ViewManager.ins().reg(FuliWin, LayerManager.UI_Main);