class FbWin extends BaseEuiView {

	private closeBtn: eui.Button;
	// private closeBtn0: eui.Button;
	private tab: eui.TabBar;
	private fbList: eui.List;
	private fbChallengePanel: FBChallengePanel;
	private fbExpPanel: FbExpPanel;
	private playWayPanel:PlayWayPanel;
	private guardWeaponPanel: GuardWeaponPanel;
	private viewStack: eui.ViewStack;
	public help:eui.Button;

	public redPoint0: eui.Image;
	public redPoint1: eui.Image;
	public redPoint2: eui.Image;
	public redPoint3: eui.Image;
	public redPoint4:eui.Image;

	private fbDataList: number[] = [];
	private lastSelectIndex: number = -1;

	constructor() {
		super();
		this.skinName = "DailyFbSkin";
		this.isTopLevel = true;
		// this.setSkinPart("fbChallengePanel", new FBChallengePanel());
		// this.setSkinPart("fbExpPanel", new FbExpPanel());
		// this.setSkinPart("roleSelect", new RoleSelectPanel());

		this.fbList.itemRenderer = FbItem;
		this.fbDataList = UserFb.ins().fbDataList.slice();
		this.fbList.dataProvider = new eui.ArrayCollection(this.fbDataList);
	}
	public static isClose:boolean;
	public static openCheck(...param: any[]): boolean {
		let index = param[0] == undefined ? 0 : param[0];
		switch (index) {
			case 4:
				return GuardWeaponModel.ins().isOpen();
			case 2:
				let info: FbChallengeConfig = GlobalConfig.FbChallengeConfig[1];
				if (Actor.level < info.levelLimit) {
					UserTips.ins().showTips(`${info.levelLimit}级可挑战`);
					return false;
				}
				break;
			case 1:
				if (Actor.level < GlobalConfig.ExpFubenBaseConfig.openLv) {
					UserTips.ins().showTips(`${GlobalConfig.ExpFubenBaseConfig.openLv}级开启`);
					return false;
				}
				break;
			case 0:
				if (Actor.level < 10) {
					UserTips.ins().showTips("10级开启");
					return false;
				}
				break;
		}
		if( !FbWin.isClose )
			ViewManager.ins().close(LiLianWin);
		FbWin.isClose = false;
		return true;
	}
	public close(...param: any[]):void{

	}

	public open(...param: any[]): void {
		this.addTouchEvent(this.closeBtn, this.onTap);
		// this.addTouchEvent(this.closeBtn0, this.onTap);
		this.addTouchEvent(this.fbList, this.onTap);
		this.addTouchEvent(this.help, this.onTap);
		this.observe(UserFb.ins().postFbInfoInit, this.updateFbList);
		this.observe(UserFb.ins().postUpDataInfo, this.updateFbList);
		this.observe(FbRedPoint.ins().postTabs, this.updateRedPoint);
		this.observe(UserFb.ins().postUpDataInfo, this.updateRedPoint);
		this.addChangeEvent(this.tab, this.onTabTouch);
		this.addChangingEvent(this.tab, this.checkIsOpen);

		this.updateFbList();

		let index: number = param[0] == undefined ? 0 : param[0];
		this.viewStack.selectedIndex = index;
		this.tab.selectedIndex = index;

		this.setOpenIndex(index);
		this.updateRedPoint();
	}

	private updateRedPoint(): void {
		this.redPoint0.visible = FbRedPoint.ins().getRedPoint(0);
		this.redPoint1.visible = FbRedPoint.ins().getRedPoint(1);
		this.redPoint2.visible = FbRedPoint.ins().getRedPoint(2);
		this.redPoint3.visible = FbRedPoint.ins().getRedPoint(3);
		this.redPoint4.visible = FbRedPoint.ins().getRedPoint(4);
	}

	private updateFbList(): void {
		(this.fbList.dataProvider as eui.ArrayCollection).replaceAll(this.fbDataList);
	}

	private onTap(e: egret.Event): void {
		switch (e.currentTarget) {
			case this.help:
				ViewManager.ins().open(ZsBossRuleSpeak, 28);
				break;
			case this.closeBtn:
			// case this.closeBtn0:
				ViewManager.ins().close(this);
				break;

			default:
				if (e.target instanceof eui.Button) {
					let fbID: number = (e.target.parent as FbItem).data;
					let fbConfig: DailyFubenConfig = GlobalConfig.DailyFubenConfig[fbID];
					if (e.target.name == 'add') {
						this.Sweep(fbID);
					} else if (e.target.name == 'double') {
						this.DoubleSweep(fbID);
					}
					else {
						let fbInfos: FbModel = UserFb.ins().getFbDataById(fbID);
						if (fbInfos.getCount() <= 0) {
							UserTips.ins().showTips("|C:0xf3311e&T:剩余挑战次数不足|");
						}
						else if (fbConfig.levelLimit > Actor.level) {
							UserTips.ins().showTips("|C:0xf3311e&T:转生或等级不足|");
						}
						else {
							//判定玩家特权身份
							// let isPass = Recharge.ins().getCurMaterialFb(fbID);//当前副本是否已通关
							let isPass = UserFb.ins().fbModel[fbID].isPass;//当前副本是否已通关
							if( Recharge.ins().franchise && isPass ){
								UserFb.ins().sendChallenge(fbID);
								// let win = WarnWin.show(`您当前是尊贵的至尊特权月卡，是否一键扫荡已通关材料副本`,()=>{
								// 		if (UserBag.ins().getSurplusCount() < UserBag.BAG_ENOUGH100) {
								// 			ViewManager.ins().open(BagFullTipsWin,UserBag.BAG_ENOUGH100);
								// 		}else{
								// 			//算出所需扫荡的fbID集合
								// 			let sweeps:number[] = Recharge.ins().getSweepMaterialFbIds();
								// 			DieGuide.ins().setMaxFb(sweeps);//刷新死亡引导标识位 根据已通关的来算
								// 			for( let i = 0;i < sweeps.length;i++ ){
								// 				this.Sweep(sweeps[i]);
								// 			}
								// 		}
								// 	},this,
								// 	()=>{
								// 		if (UserFb.ins().checkInFB()) return;
								// 		UserFb.ins().sendChallenge(fbConfig.id);
								// 		ViewManager.ins().closeTopLevel();
								// 	});
								// win.setBtnLabel(`扫荡`, `挑战`);
							}else{
								if (UserFb.ins().checkInFB()) return;
								UserFb.ins().sendChallenge(fbConfig.id);
								if(!(UserZs.ins().lv >= fbConfig.sweepLevel && fbInfos.isPass))
									ViewManager.ins().closeTopLevel();
							}
						}
					}
					ViewManager.ins().close(LimitTaskView);
				}
		}
	}
	private Sweep(fbID:number){
		let fbConfig: DailyFubenConfig = GlobalConfig.DailyFubenConfig[fbID];
		let discount: number = GlobalConfig.MonthCardConfig.sweepPrecent / 100;
		let addValue: number = Recharge.ins().monthDay > 0 ? 1 - discount : 1;
		let buyPrice: number = fbConfig.buyPrice[UserFb.ins().getFbDataById(fbID).vipBuyCount] * addValue;
		if (!(Actor.yb >= buyPrice)) {
			UserTips.ins().showTips("元宝不足");
			return;
		}

		DieGuide.ins().setClick(fbID);
		let index: number = this.fbDataList.lastIndexOf(fbID);
		(<FbItem>this.fbList.getChildAt(index)).starSaoDang(0);
		// WarnWin.show(`是否消耗<font color='#FFB82A'>${buyPrice}元宝</font>扫荡1次【${fbConfig.name}】？<font color='#007BFF'>扫荡将直接获得副本奖励</font>`, () => {
		// 	DieGuide.ins().setClick(fbID);
		// 	let index: number = this.fbDataList.lastIndexOf(fbID);
		// 	(<FbItem>this.fbList.getChildAt(index)).starSaoDang(0);
		// }, this);
	}
	private DoubleSweep(fbID:number){
		let fbConfig: DailyFubenConfig = GlobalConfig.DailyFubenConfig[fbID];
		let discount: number = GlobalConfig.MonthCardConfig.sweepPrecent / 100;
		let addValue: number = Recharge.ins().monthDay > 0 ? 1 - discount : 1;
		let buyPrice: number = fbConfig.buyDoublePrice[UserFb.ins().getFbDataById(fbID).vipBuyCount] * addValue;
		if (!(Actor.yb >= buyPrice)) {
			UserTips.ins().showTips("元宝不足");
			return;
		}
		DieGuide.ins().setClick(fbID);
		let index: number = this.fbDataList.lastIndexOf(fbID);
		(<FbItem>this.fbList.getChildAt(index)).starSaoDang(1);
		// WarnWin.show(`是否消耗<font color='#FFB82A'>${buyPrice}元宝</font>扫荡1次【${fbConfig.name}】？<font color='#007BFF'>扫荡将直接获得双倍副本奖励</font>`, () => {
		// 	DieGuide.ins().setClick(fbID);
		// 	let index: number = this.fbDataList.lastIndexOf(fbID);
		// 	(<FbItem>this.fbList.getChildAt(index)).starSaoDang(1);
		// }, this);
	}

	private setOpenIndex(selectedIndex: number): void {

		if (!this.checkIndexOpen(selectedIndex)) {
			this.setOpenIndex(this.lastSelectIndex);
			this.tab.selectedIndex = this.lastSelectIndex;
			return;
		}

		if (this.lastSelectIndex > -1) {
			switch (this.lastSelectIndex) {
				case 1:
					this.fbExpPanel.close();
					break;
				case 2:
					break;
			}
		}
		this.lastSelectIndex = selectedIndex;
		this.help.visible = false;
		switch (selectedIndex) {
			case 4:
				this.guardWeaponPanel.open();
				this.help.visible = true;
				break;
			case 3:
				this.playWayPanel.open();
				break;
			case 2:
				this.fbChallengePanel.open();
				break;
			case 1:
				this.fbExpPanel.open();
				break;
			case 0:
				this.updateFbList();
				break;
		}
	}

	private onTabTouch(e: egret.TouchEvent): void {
		// if(this.checkIndexOpen(this.tab.selectedIndex))
		this.setOpenIndex(e.currentTarget.selectedIndex);
	}

	private checkIsOpen(e: egret.Event) {
		let tab = e.target;
		if (!this.checkIndexOpen(tab.selectedIndex)) {
			e.preventDefault();
			return;
		}

		ViewManager.ins().close(LiLianWin);
		ViewManager.ins().close(LimitTaskView);
	}

	private checkIndexOpen(index: number) {
		if (index == 2) {
			let info: FbChallengeConfig = GlobalConfig.FbChallengeConfig[1];
			if (Actor.level < info.levelLimit) {
				UserTips.ins().showTips(`${info.levelLimit}级可挑战`);
				return false;
			}
		} else if (index == 1) {
			if (Actor.level < GlobalConfig.ExpFubenBaseConfig.openLv) {
				UserTips.ins().showTips(`${GlobalConfig.ExpFubenBaseConfig.openLv}级开启`);
				return false;
			}
		}
		else if (index == 4) {
			if (!GuardWeaponModel.ins().isOpen()) {
				UserTips.ins().showTips(GuardWeaponModel.ins().getDesc());
				return false;
			}
		}
		return true;
	}

}
ViewManager.ins().reg(FbWin, LayerManager.UI_Main);