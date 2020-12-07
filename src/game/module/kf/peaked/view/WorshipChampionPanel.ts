/**
 * Created by MPeter on 2018/2/26.
 * 跨服副本-巅峰赛季-膜拜冠军
 */
class WorshipChampionPanel extends BaseView {
	/**剩余次数 */
	private countLabel: eui.Label;
	/**筹码数量标签 */
	private chipLabel: eui.Label;
	/**膜拜按钮 */
	private shipBtn: eui.Button;

	/////////////////三个角色////////////////
	private praiseGroup0: eui.Group;
	private wingImg0: eui.Image;
	private weaponImg0: eui.Image;
	private bodyImg0: eui.Image;
	private name0: eui.Label;
	private titleGroup: eui.Group;
	private titleMcGroup: eui.Group;

	private praiseGroup1: eui.Group;
	private wingImg1: eui.Image;
	private weaponImg1: eui.Image;
	private bodyImg1: eui.Image;
	private name1: eui.Label;

	private praiseGroup2: eui.Group;
	private wingImg2: eui.Image;
	private weaponImg2: eui.Image;
	private bodyImg2: eui.Image;
	private name2: eui.Label;

	private titleMc: MovieClip;

	public weaponEffect2: eui.Group;
	public bodyEffect2: eui.Group;
	public weaponEffect1: eui.Group;
	public bodyEffect1: eui.Group;
	public weaponEffect0: eui.Group;
	public bodyEffect0: eui.Group;

	public wPos2_0: eui.Image;
	public wPos2_1: eui.Image;
	public bPos2_0: eui.Image;
	public bPos2_1: eui.Image;

	public wPos1_0: eui.Image;
	public wPos1_1: eui.Image;
	public bPos1_0: eui.Image;
	public bPos1_1: eui.Image;

	public wPos0_0: eui.Image;
	public wPos0_1: eui.Image;
	public bPos0_0: eui.Image;
	public bPos0_1: eui.Image;

	private bodyEff0: MovieClip;
	private bodyEff1: MovieClip;
	private bodyEff2: MovieClip;
	private weaponEff0: MovieClip;
	private weaponEff1: MovieClip;
	private weaponEff2: MovieClip;

	/**战灵 */
	private warfileName: string;
	private warMc: MovieClip;

	/**烟花 */
	private yanHuaMc: MovieClip;
	private isEff: boolean;

	private _openOtherWin: boolean;
	private otherPlayerData: OtherPlayerData;

	public constructor() {
		super();
	}

	protected childrenCreated(): void {
		this.praiseGroup0.touchChildren = false;
		this.praiseGroup1.touchChildren = false;
		this.praiseGroup2.touchChildren = false;
	}

	public open(...param): void {
		this.observe(Actor.ins().postChip, this.upData);
		this.observe(PeakedSys.ins().postWorship, this.upData);
		this.observe(UserReadPlayer.ins().postPlayerResult, this.openOtherPlayerView);
		this.addTouchEvent(this.shipBtn, this.onTouch);
		this.addTouchEvent(this.praiseGroup0, this.onTouch);
		this.addTouchEvent(this.praiseGroup1, this.onTouch);
		this.addTouchEvent(this.praiseGroup2, this.onTouch);

		this.isEff = false;
		this.initData();
		this.upData();

	}

	public close(...param): void {
		this._openOtherWin = false;
		if (this.titleMc) {
			this.titleMc.destroy();
			this.titleMc = null;
		}
		this.$onClose();

		TimerManager.ins().removeAll(this)

		DisplayUtils.removeFromParent(this.weaponEff0);
		DisplayUtils.removeFromParent(this.weaponEff1);
		DisplayUtils.removeFromParent(this.weaponEff2);
		DisplayUtils.removeFromParent(this.bodyEff0);
		DisplayUtils.removeFromParent(this.bodyEff1);
		DisplayUtils.removeFromParent(this.bodyEff2);
		if(this.yanHuaMc){
			this.yanHuaMc.destroy();
			this.yanHuaMc = null;
		}
	}

	private initData(): void {
		// UserReadPlayer.ins().sendFindPlayer(9043978);
		if (PeakedSys.ins().kfPlayer2Data &&
			PeakedSys.ins().kfPlayer2Data.winId &&
			PeakedSys.ins().kfStatus >= KF_PeakStatus.Knockout &&
			PeakedSys.ins().kfStatusIsEnd) {
			let info: PeakPlayerInfo = PeakedHelp.findPlayerDtById(PeakedSys.ins().kfPlayer2Data.winId);
			if (info) UserReadPlayer.ins().sendFindPlayer(info.roleId, info.serverId);
			this.shipBtn.enabled = true;
			this.chipLabel.visible = true;
			this.countLabel.visible = true;
		}
		else {
			this.shipBtn.enabled = false;
			this.chipLabel.visible = false;
			this.countLabel.visible = false;
		}

		for (let i: number = 0; i < 3; i++) {
			this["praiseGroup" + i].visible = false;
		}
		this.name0.text = `暂无`;

		this.chipLabel.text = `筹码：+${GlobalConfig.PeakRaceBase.mobaiChips}`;

		if (!this.titleMc) {
			this.titleMc = ObjectPool.pop("MovieClip");
			this.titleMc.x = this.titleMcGroup.x;
			this.titleMc.y = this.titleMcGroup.y;
		}
		this.titleGroup.addChild(this.titleMc);
		let eff = RES_DIR_EFF + `chenghao1qiang`;
		this.titleMc.playFile(eff, -1);
	}

	/**更新数据 */
	private upData(): void {
		let peakBaseDp: PeakRaceBase = GlobalConfig.PeakRaceBase;
		if (!peakBaseDp.mobaiNum) peakBaseDp.mobaiNum = 10;

		let color: number = PeakedSys.ins().worshipNum < peakBaseDp.mobaiNum ? ColorUtil.GREEN_COLOR_N : ColorUtil.RED;
		let str: string = `膜拜：|C:${color}&T:${PeakedSys.ins().worshipNum}/${peakBaseDp.mobaiNum}`;
		this.countLabel.textFlow = TextFlowMaker.generateTextFlow1(str);
		if(this.isEff)this.playYHEff();
	}
	/**烟花特效 */
	private playYHEff(): void{
		if(this.yanHuaMc){
			this.yanHuaMc.destroy();
			this.yanHuaMc = null;
		}
		this.yanHuaMc = new MovieClip();
		this.yanHuaMc.x = 270;
		this.yanHuaMc.y = 335;
		this.addChildAt(this.yanHuaMc, this.numChildren + 1);
		this.yanHuaMc.playFile(RES_DIR_EFF + "yanhuaeff", 2);
		this.isEff = false;
	}

	/**膜拜 */
	private onTouch(e: egret.TouchEvent): void {
		switch (e.target) {
			case this.shipBtn:
				if (PeakedSys.ins().worshipNum >= GlobalConfig.PeakRaceBase.mobaiNum) {
					UserTips.ins().showTips(`今日膜拜次数已用完！`);
					return;
				}
				if (!PeakedSys.ins().kfPlayer2Data.winId) {
					UserTips.ins().showTips(`当前没有可膜拜的冠军！`);
					return;
				}
				this.isEff = true;
				PeakedSys.ins().sendWorship();
				break;
			case this.praiseGroup0:
			case this.praiseGroup1:
			case this.praiseGroup2:
				let info: PeakPlayerInfo = PeakedHelp.findPlayerDtById(PeakedSys.ins().kfPlayer2Data.winId);
				if (info) UserReadPlayer.ins().sendFindPlayer(info.roleId, info.serverId);
				break;
		}

	}

	/**
	 * 查看角色界面
	 */
	private openOtherPlayerView(otherPlayerData: OtherPlayerData) {
		this.otherPlayerData = otherPlayerData;
		if (this._openOtherWin) {
			let win = <RRoleWin>ViewManager.ins().open(RRoleWin, otherPlayerData);
			win.hideEx(1);
			this._openOtherWin = false;
		}
		else {
			this.startShowZhanling();
			this._openOtherWin = true;
			for (let index: number = 0; index < otherPlayerData.roleData.length; index++) {
				this["praiseGroup" + index].visible = true;

				let role: Role = otherPlayerData.roleData[index];
				let zb: number[] = role.zhuangbei;
				let isHaveBody: boolean;
				let bodyId: number = zb[0];
				let weaponId: number = zb[1];
				let weaponConf: EquipsData = role.getEquipByIndex(0);
				let weaponConfId: number = weaponConf.item.configID;
				let bodyConf: EquipsData = role.getEquipByIndex(2);
				let bodyConfId: number = bodyConf.item.configID;
				this["weaponImg" + index].source = null;
				this["bodyImg" + index].source = null;
				this["name" + index].text = "S." + otherPlayerData.serverId + otherPlayerData.name;
				if (weaponConfId > 0) {
					let fileName: string = GlobalConfig.EquipConfig[weaponConfId].appearance;
					if (fileName && fileName.indexOf("[job]") > -1)
						fileName = fileName.replace("[job]", role.job + "");
					this["weaponImg" + index].source = fileName + "_" + role.sex + "_c_png";
				}
				if (bodyConfId > 0) {
					let fileName: string = GlobalConfig.EquipConfig[bodyConfId].appearance;
					if (fileName && fileName.indexOf("[job]") > -1)
						fileName = fileName.replace("[job]", role.job + "");
					this["bodyImg" + index].source = fileName + "_" + role.sex + "_c_png";
					isHaveBody = true;
				}

				if (!isHaveBody)
					this["bodyImg" + index].source = `body000_${role.sex}_c_png`;
				if (weaponId > 0)
					this["weaponImg" + index].source = this.getZhuangbanById(weaponId).res + "_" + role.sex + "_c_png";
				if (bodyId > 0)
					this["bodyImg" + index].source = this.getZhuangbanById(bodyId).res + "_" + role.sex + "_c_png";


				this["wingImg" + index].source = null;
				let wingdata: WingsData = role.wingsData;
				let id: number = zb[2];
				if (id > 0)
					this["wingImg" + index].source = GlobalConfig.ZhuangBanId[id].res + "_png";
				else if (wingdata.openStatus) {
					this["wingImg" + index].source = GlobalConfig.WingLevelConfig[wingdata.lv].appearance + "_png";
				}

				this.setEffect(role.getEquipByIndex(2).item.configID, `bPos${index}_`, role.sex, this[`bodyEffect${index}`], this["bodyEff" + index]);
				this.setEffect(role.getEquipByIndex(0).item.configID, `wPos${index}_`, role.sex, this[`weaponEffect${index}`], this["weaponEff" + index]);
			}
		}

	}

	private getZhuangbanById(id: number): ZhuangBanId {
		for (let k in GlobalConfig.ZhuangBanId) {
			if (GlobalConfig.ZhuangBanId[k].id == id)
				return GlobalConfig.ZhuangBanId[k];
		}
		return null;
	}


	/** 设置武器模型和衣服模型*/
	private setEffect(id: number, imgStr: string, sex: number, soulEffGroup: eui.Group, suitEff: MovieClip): void {
		if (!suitEff) suitEff = new MovieClip();
		let cfg: EquipWithEffConfig = GlobalConfig.EquipWithEffConfig[id + "_" + sex];
		if (cfg) {
			suitEff.scaleX = suitEff.scaleY = cfg.scaling;
			if (!suitEff.parent)
				soulEffGroup.addChild(suitEff);

			suitEff.x = this[imgStr + sex].x + cfg.offX;
			suitEff.y = this[imgStr + sex].y + cfg.offY;
			suitEff.playFile(RES_DIR_EFF + cfg.inShowEff, -1);
		}
		else if (suitEff.parent)
			suitEff.parent.removeChild(suitEff);
	}

	//显示战灵
	public showZhanling(otherPlayerData: OtherPlayerData) {
		let zhanlingID: number = otherPlayerData.zhanlingID;
		let zhanlingLevel: number = otherPlayerData.zhanlingLevel;
		if (zhanlingLevel < 0)//未开启战灵
			return;
		let config = GlobalConfig.ZhanLingLevel[zhanlingID][zhanlingLevel];
		this.warfileName = config.appearance;
		if (!this.warMc) {
			this.warMc = new MovieClip;
			this.warMc.x = 450;
			this.warMc.y = 220;
			this.praiseGroup0.addChildAt(this.warMc, 0);
			this.warMc.playFile(RES_DIR_MONSTER + this.warfileName + "_4s", -1);
			this.warMc.touchEnabled = false;
		}
		let anchorOffset = GlobalConfig.ZhanLingConfig.anchorOffset || [];
		this.warMc.anchorOffsetX = anchorOffset[0] || 0;
		this.warMc.anchorOffsetY = anchorOffset[1] || 0;
		TimerManager.ins().remove(this.startShowZhanling, this);
		TimerManager.ins().doTimer(200, 1, this.playZhanLingAttack, this);

	}

	/** 战灵播放攻击*/
	private playZhanLingAttack() {
		if (this.warMc) {
			let s: string = RES_DIR_MONSTER + this.warfileName + "_4" + EntityAction.ATTACK;
			this.warMc.playFile(s, 1, () => {
				let src: string = RES_DIR_MONSTER + this.warfileName + "_4" + EntityAction.STAND;
				this.warMc.playFile(src, -1, null, false);
				TimerManager.ins().remove(this.playZhanLingAttack, this);
				TimerManager.ins().doTimer(2800, 1, this.hideZhanling, this);
			}, false);
		}
	}

	//隐藏战灵
	private hideZhanling() {
		if (this.warMc) {
			egret.Tween.get(this.warMc).to({alpha: 0}, GlobalConfig.ZhanLingConfig.disappearTime || 1500).call(() => {
				DisplayUtils.removeFromParent(this.warMc)
				this.warMc.destroy();
				this.warMc = null;
				TimerManager.ins().remove(this.hideZhanling, this);
				TimerManager.ins().doTimer(7000, 1, this.startShowZhanling, this);
			});
		}
	}

	/** 间隔显示战灵*/
	private startShowZhanling(): void {
		this.showZhanling(this.otherPlayerData);
	}
}