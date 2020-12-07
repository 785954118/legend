/**
 * 角色
 * @author
 */
class CharRole extends CharMonster {
	protected _lilianTitle: eui.Image;

	/** 内功条 */
	protected neigongBar: eui.ProgressBar;

	protected ringMc: RingTurnDisplayer[] = [];

	public constructor() {
		super();

		this.touchEnabled = false;
		this.touchChildren = false;

		this.AI_STATE = AI_State.Stand;

		this.neigongBar = new eui.ProgressBar();
		this.neigongBar.skinName = "bloodyelskin";
		this.neigongBar.anchorOffsetY = -5;
		this.neigongBar.labelDisplay.visible = false;
		this.neigongBar.labelFunction = () => '';
		this.titleCantainer.addChild(this.neigongBar);
		this.neigongBar.anchorOffsetX = Math.floor(this.neigongBar.width >> 1);

		this._nameTxt.textColor = 0xffffff;
		this._nameGroup.visible = true;

		this._lilianTitle = new eui.Image();
		this._lilianTitle.scaleX = 0.5;
		this._lilianTitle.scaleY = 0.5;
		this._lilianTitle.bottom = -1;
		this._nameGroup.addChild(this._lilianTitle);
		//this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.roleCliek, this);
	}

	protected createTweenObj() {
		let self = this;
		this.dieTweenObj = {
			set alpha(al) {
				self.alpha = al;
			},
			get alpha() {
				return self.alpha;
			}
		};

		this.moveTweenObj = {
			set x(x) {
				self.x = x >> 0;
				self.moveCamera();
			},
			set y(y) {
				self.y = y >> 0;
				self.moveCamera();
			},
			get x() {
				return self.x;
			},
			get y() {
				return self.y;
			}
		};
	}

	public setWeaponFileName(name: string): void {
		this.addMc(CharMcOrder.WEAPON, RES_DIR_WEAPON + name);
	}

	public setWingFileName(name: string): void {
		this.addMc(CharMcOrder.WING, RES_DIR_WING + name);
	}

	public setHeirloomFileName(name: string): void {
		this.addMc(CharMcOrder.HEIR, RES_DIR_EFF + name);
	}

	public setSoulFileName(name: string): void {
		this.addMc(CharMcOrder.SOUL, RES_DIR_WEAPON + name);
	}

	//加载其他模型 如武器翅膀
	protected loadOther(mcType: CharMcOrder): void {
		if (this.action == EntityAction.DIE) {
			if (mcType != CharMcOrder.BODY && mcType != CharMcOrder.WEAPON) {
				let mc = this.getMc(mcType);
				if (mc) mc.visible = false;
				return;
			}
		} else {
			let mc = this.getMc(mcType);
			if (mc) mc.visible = true;
		}
		if (mcType == CharMcOrder.ZHANLING && (this.zhanLingAttack || this._state == EntityAction.ATTACK))
			return;
		super.loadOther(mcType);
	}

	protected playBody(e: egret.Event): void {
		super.playBody(e);

		if (this.ringMc && this.ringMc.length > 0) {
			this.updateRingMC();
		}
	}

	public getResDir(mcType: CharMcOrder): number {
		//战灵只显示一个方向 右下
		if (mcType == CharMcOrder.ZHANLING)
			return 3;

		let td: number = 2 * (this._dir - 4);
		if (td < 0) td = 0;

		//开服7天以下，显示5方向 开服7天以上，只显示2方向
		if (GameServer.serverOpenDay < 7) {
			return this._dir - td;
		} else {
			let dir = this._dir - td;
			if (dir < 2) {
				return 1;
			} else {
				return 3;
			}
		}
	}

	/**
	 * 更新数据显示
	 */
	public updateBlood(force: boolean = false): void {
		super.updateBlood(force);
		//若血量小于等于0，启动死亡表现
		if (this._hpBar.value <= 0) {
			this.onDead(() => {
				this.deadDelay();
			});
		}
	}

	public updateModel(): void {
		super.updateModel();
	}

	protected parseModel() {
		(<eui.Image>this._hpBar.thumb).source = this.isMy ? "boolGreen_png" : "boolRed_png";

		let model: Role = <Role>this.infoModel;

		this.setCharName(model.guildAndName);
		this.setLilian(model.lilianUrl);

		this.updateBlood(true);
		this.updateNeiGong();

		//武器
		let id: number = model.getEquipByIndex(0).item.configID;
		let hideWeapons: boolean = model.hideWeapons();  //是否隐藏兵魂特效

		if (model.zhuangbei[1] > 0) {
			let fileName: string = GlobalConfig.ZhuangBanId[model.zhuangbei[1]].res;
			this.setWeaponFileName(fileName + "_" + model.sex);
		}
		else if (id > 0) {
			if (GlobalConfig.EquipConfig[id]) {
				let fileName: string = GlobalConfig.EquipConfig[id].appearance;
				this.setWeaponFileName(fileName + "_" + model.sex);
			}
		}

		// 翅膀
		if (model.zhuangbei[2] > 0) {
			let fileName: string = GlobalConfig.ZhuangBanId[model.zhuangbei[2]].res;
			this.setWingFileName(fileName);
		}
		else if (model.wingsData.openStatus) {
			if (GlobalConfig.WingLevelConfig[model.wingsData.lv])
				this.setWingFileName(GlobalConfig.WingLevelConfig[model.wingsData.lv].appearance);
		}
		//传世齐鸣特效
		if (model.heirloom) {
			let suitConfig: HeirloomEquipSetConfig = model.heirloom.getSuitConfig(model);
			if (suitConfig && suitConfig.weff) {
				this.setHeirloomFileName(suitConfig.weff);
			}
		}
		//兵魂
		if (!hideWeapons && model.weapons && model.weapons.weaponsId > 0) {
			let fileName: string = GlobalConfig.WeaponSoulConfig[model.weapons.weaponsId].outside[model.job - 1];
			this.setSoulFileName(fileName);
		}
		//身体
		id = model.equipsData[2].item.configID;
		if (model.zhuangbei[0] > 0) {
			let fileName: string = GlobalConfig.ZhuangBanId[model.zhuangbei[0]].res;
			this.initBody(RES_DIR_BODY + fileName + "_" + model.sex);
		}
		else if (id > 0) {
			if (GlobalConfig.EquipConfig[id]) {
				let fileName: string = GlobalConfig.EquipConfig[id].appearance;
				this.initBody(RES_DIR_BODY + fileName + "_" + model.sex);
			}
		}
		else
			this.initBody(RES_DIR_BODY + `body000_${model.sex}`);
		//称号
		this.updateTitle();

		this.updateNameColor();
	}

	public updateNameColor(): void {
		let model: Role = <Role>this.infoModel;
		if (model == undefined) {
			Log.trace("角色更新数据异常，moidel为空");
			return;
		}

		if (model.camp > 0 && BattleCC.ins().isBattle()) //不同阵营名字改为红色
			this.setNameTxtColor(model.camp != BattleCC.ins().camp ? 0xFF0000 : 0x00FF00);
		else if (this.team == Team.WillEntity)
			this.setNameTxtColor(0xFFFF00);
		else
			this.setNameTxtColor(0xFFFFFF);
	}

	public setHeirloomSuitEff() {
		let model: Role = <Role>this.infoModel;
		if (model == undefined) {
			return;
		}
		if (model.heirloom) {
			let suitConfig: HeirloomEquipSetConfig = model.heirloom.getSuitConfig(model);
			if (suitConfig && suitConfig.weff) {
				this.setHeirloomFileName(suitConfig.weff);
			}
		}
	}

	public addBuff(buff: EntityBuff): void {
		super.addBuff(buff);
		let config: EffectsConfig = buff.effConfig;

		if (GameMap.fubenID == 0) {
			switch (config.type) {
				//召唤
				case SkillEffType.Summon:

					let m: EntityModel;
					if (this.team == Team.My) {
						let tempData: ImbaSkillReviseConfig = Artifact.ins().getReviseBySkill(35001);
						let gwSkills = GodWeaponCC.ins().getReviseBySkill(35001);
						let gwSkill: GWSkillReviseConfig;
						if (gwSkills) gwSkill = gwSkills[0];

						let monsterId = config.args.a;
						if (tempData && tempData.args && tempData.args[0]) {
							monsterId += tempData.args[0].vals[2];
						}
						if (gwSkill && gwSkill.args && gwSkill.args[0]) {
							monsterId += gwSkill.args[0].vals[2];
						}

						m = UserFb.createModel(GlobalConfig.MonstersConfig[monsterId]);
						m.x = this.x;
						m.y = this.y;
						m.masterHandle = this.infoModel.handle;
						m.setAtt(AttributeType.atMoveSpeed, this.infoModel.getAtt(AttributeType.atMoveSpeed));

						let attValue = 0;
						let baseValue = m.getAtt(AttributeType.atAttack);

						if (tempData && tempData.args && tempData.args[0]) {
							let times: number = tempData.args[0].vals[3] ? tempData.args[0].vals[3] : 1;
							attValue += this.infoModel.getAtt(AttributeType.atAttack) * times;
						}

						if (gwSkill && gwSkill.args && gwSkill.args[0]) {
							let times: number = gwSkill.args[0].vals[3] ? gwSkill.args[0].vals[3] : 1;
							attValue += this.infoModel.getAtt(AttributeType.atAttack) * times;
						}
						m.setAtt(AttributeType.atAttack, (attValue >> 0) + baseValue);

					} else {
						m = UserFb.createModel(GlobalConfig.MonstersConfig[config.args.a]);
						m.x = this.x;
						m.y = this.y;
						m.masterHandle = this.infoModel.handle;
						m.setAtt(AttributeType.atMoveSpeed, this.infoModel.getAtt(AttributeType.atMoveSpeed));
					}

					m.isMy = m.checkHandleIsMy(m.masterHandle);
					GameLogic.ins().createEntityByModel(m, this.team);
					break;
			}
		}
	}

	/**
	 * 更新内功显示
	 */
	public updateNeiGong(): void {
		if (!this.infoModel)
			return;
		let maxValue: number = this.infoModel.getAtt(AttributeType.maxNeiGong);

		this.neigongBar.visible = this.checkNeigongVisible();
		this.neigongBar.maximum = maxValue;
		this.neigongBar.value = this.infoModel.getAtt(AttributeType.cruNeiGong);
		//解决只显示内功条bug
		if (this.neigongBar.visible) {
			this.showName(this.neigongBar.visible);
			this.showBlood(this.neigongBar.visible);
		}
	}

	public checkNeigongVisible(): boolean {
		let maxValue: number = this.infoModel.getAtt(AttributeType.maxNeiGong);
		return maxValue != 0 && this._state != EntityAction.DIE;
	}

	/**
	 * 更新称号
	 */
	public updateTitle(): void {
		let model: Role = <Role>this.infoModel;
		let title: number = model.title;
		this.removeTitle();
		if (this.getIsShowBody() && title > 0) {
			let config = GlobalConfig.TitleConf[title];
			if (config) {
				if (config.img) {
					if (this._title == null) {
						this._title = new eui.Image;
						this._title.anchorOffsetX = 230 >> 1;
						this._title.anchorOffsetY = 100;
						this.titleCantainer.addChild(this._title);
					}
					this._title.source = config.img;
				} else if (config.eff) {
					if (this._titleMc == null) {
						this._titleMc = ObjectPool.pop("MovieClip");
						this._titleMc.anchorOffsetX = 0;
						this._titleMc.anchorOffsetY = 80;
						this.titleCantainer.addChild(this._titleMc);
					}
					let eff = RES_DIR_EFF + config.eff;
					this.playFile(this._titleMc, eff);
				}
			}
		}
	}

	private updateRingMC(): void {
		for (let i in this.ringMc) {
			if (this.ringMc[i]) {
				//临时处理角色死亡后，不显示戒指的问题
				if (this.ringMc[i].parent == null) {
					this.addChild(this.ringMc[i]);
				}
				this.ringMc[i].setEffectXY(this.dir);
			}
		}
	}

	public setCharName(str: string): void {
		super.setCharName(str);
		this._lilianTitle.x = (this._nameGroup.width >> 1) + (this._nameTxt.width >> 1) - 6;
		this._nameGroup.visible = true;
	}

	public setLilian(url: string) {
		this._lilianTitle.source = url;
	}

	public set infoModel(model: EntityModel) {
		if (model) {
			this._infoModel = model;

			// if (GameMap.fubenID == 0 && model.getAtt(AttributeType.atRegeneration)) {
			// 	TimerManager.ins().doTimer(1000, 1, this.autoAddBlood, this);
			// } else {
			// 	TimerManager.ins().remove(this.autoAddBlood, this);
			// }
		} else {
			Log.trace("设置infoModel异常,对象为空");
		}
	}

	public get infoModel(): EntityModel {
		return this._infoModel as EntityModel;
	}

	private autoAddBlood(): void {
		if (this.action == EntityAction.DIE) {
			egret.clearTimeout(this.timeID);
			return;
		}

		if (this.getRealHp() < this.infoModel.getAtt(AttributeType.atMaxHp)) {
			let value: number = -this.infoModel.getAtt(AttributeType.atRegeneration);
			//显示对象血条扣血
			this.hram(value);
			let curHp = this.infoModel.getAtt(AttributeType.atHp) - value;
			let maxHp = this.infoModel.getAtt(AttributeType.atMaxHp);
			this.infoModel.setAtt(AttributeType.atHp, curHp > maxHp ? maxHp : curHp);
			//飘血
			GameLogic.ins().postEntityHpChange(this, null, DamageTypes.HIT, value);
		}

		TimerManager.ins().doTimer(1000, 1, this.autoAddBlood, this);
	}

	public showNeigong(b: boolean) {
		this.neigongBar.visible = b && this.checkNeigongVisible();
	}

	//显示战灵
	public showZhanling(id: number, lv: number) {
		let config = GlobalConfig.ZhanLingLevel[0][lv];
		if (!config.talentLevel) return;

		config = GlobalConfig.ZhanLingLevel[id][lv];
		if (Assert(config, `战灵天赋等级配置为空：id(${id}),lv(${lv})`)) return;

		let fileName = config.appearance;
		this.addMc(CharMcOrder.ZHANLING, RES_DIR_MONSTER + fileName);

		let mc = this.getMc(CharMcOrder.ZHANLING);
		let anchorOffset = GlobalConfig.ZhanLingConfig.anchorOffset || [];
		mc.anchorOffsetX = anchorOffset[0] || 0;
		mc.anchorOffsetY = anchorOffset[1] || 0;

		TimerManager.ins().remove(this.playZhanLingAttack, this);
		TimerManager.ins().doTimer(200, 1, this.playZhanLingAttack, this);

		TimerManager.ins().remove(this.hideZhanling, this);
		TimerManager.ins().doTimer(3000, 1, this.hideZhanling, this);
	}

	private zhanLingAttack: boolean = false;

	private playZhanLingAttack() {
		let mcType = CharMcOrder.ZHANLING;
		let mc: MovieClip = this.getMc(mcType) as MovieClip;
		if (mc) {
			mc.scaleX = this._dir > 4 ? -1 : 1;

			let s: string = this.getFileName(mcType) + "_" + this.getResDir(mcType) + EntityAction.ATTACK;

			this.zhanLingAttack = true;

			mc.playFile(s, 1, () => {
				this.zhanLingAttack = false;

				let src: string = this.getFileName(mcType) + "_" + this.getResDir(mcType) + EntityAction.STAND;
				mc.playFile(src, -1, null, false);

			}, false);
		}
	}

	//隐藏战灵
	private hideZhanling() {
		let mc = this.getMc(CharMcOrder.ZHANLING);
		if (mc) {
			egret.Tween.get(mc).to({alpha: 0}, GlobalConfig.ZhanLingConfig.disappearTime || 1500).call(() => {
				this.removeMc(CharMcOrder.ZHANLING);
			});
		}
	}

	public reset() {
		super.reset();
		this.zhanLingAttack = false;
		this.AI_STATE = AI_State.Stand;
	}

	private timeID: number;

	private moveEff: MovieClip;

	public destruct(): void {
		super.destruct();
		this.AI_STATE = AI_State.Stand;
		this._hpBar.visible = this._nameGroup.visible = true;
		this._nameTxt.textColor = 0xffffff;

		for (let i in this.ringMc) {
			if (this.ringMc[i]) {
				this.ringMc[i].reset();
				this.ringMc[i] = null;
				delete this.ringMc[i];
			}
		}
		//this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.roleCliek, this);
	}

	/**private roleCliek(e: egret.TouchEvent): void {
		//点自己的子角色跳过
		if (this.infoModel && this.infoModel.handle && this.isMy) {
			return;
		}
		if (UserFb.ins().guanqiaID < GlobalConfig.SkirmishBaseConfig.openLevel) {
			UserTips.ins().showTips(`新手保护期，20关开启PK爆装玩法`);
		}
		if ((CityCC.ins().isCity || BattleCC.ins().isBattle()) && this.infoModel) {
			GameLogic.ins().postChangeAttrPoint(this.infoModel.masterHandle);
			e.stopImmediatePropagation();
		}
	}**/

	public deadDelay(): void {
		this._hpBar.slideDuration = 0;
		this._hpBar.value = 0;
		this.neigongBar.slideDuration = 0;
		this.neigongBar.value = this.neigongBar.maximum;
		//屏蔽原因：当死亡资源没有加载时候，会出现死亡时候玩家死亡特效未播放完就stop，然后因为body移除了事件，导致武器播放的不是死亡特效，屏蔽后并不会造成内存泄漏等问题
		this.stopMove();
		this.removeHardStraight();
		this.removeAllBuff();
		this.hideZhanling();
		this.neigongBar.visible = false;
		if (this._title) this._title.source = '';
		this._hpBar.visible = this._nameGroup.visible = false;
		this.atking = false;
		TimerManager.ins().removeAll(this);
	}

	public get nameVisible(): boolean {
		return this._nameGroup.visible;
	}

	public showNameAndHp(): void {
		this._hpBar.visible = this._nameGroup.visible = true;
	}

	public showBodyContainer() {
		if (this.isShowBody) return;
		super.showBodyContainer();
		this.neigongBar.alpha = 1;
	}

	public hideBodyContainer() {
		if (!this.isShowBody) return;
		super.hideBodyContainer();
		this.neigongBar.alpha = 0;
	}


	@callLater
	private moveCamera() {
		if (this == EntityManager.ins().getNoDieRole()) {
			GameLogic.ins().postMoveCamera();
			let sefety = `sefety`;
			let xy = {x: GameMap.point2Grip(this.x), y: GameMap.point2Grip(this.y)};
			if (!this[sefety] && GameMap.checkSafety(xy)) {
				UserTips.ins().showCenterTips(`|C:0x00ff00&T:进入安全区|`);
				this[sefety] = true;
			}
			else if (this[sefety] && !GameMap.checkSafety(xy)) {
				UserTips.ins().showCenterTips(`|C:0xff0000&T:离开安全区|`);
				this[sefety] = false;
			}
		}
	}

	/**是否在安全区域 */
	public isSafety() {
		let xy = {x: GameMap.point2Grip(this.x), y: GameMap.point2Grip(this.y)};
		return GameMap.checkSafety(xy)
	}

	/**
	 * 死亡处理（表现方面）
	 * @returns void
	 */
	public onDead(callBack?: () => void): void {
		this.stopMove();
		this.playAction(EntityAction.DIE, callBack);
	}

	public stopMove() {
		super.stopMove();
		if (this == EntityManager.ins().getNoDieRole()) {
			SoundUtil.ins().stopRun();
			GameLogic.ins().postAdjustMapPos();
		}
	}
}
