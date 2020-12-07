/**
 *
 * @author hepeiye
 *
 */
class RankingWin extends BaseEuiView {

	public praiseGroup: eui.Group;
	public praiseGroup2: eui.Group;
	public praiseGroup3: eui.Group;
	public wingImg: eui.Image;
	public bodyImg: eui.Image;
	public weaponImg: eui.Image;
	public titleImg: eui.Image;
	public titleMc: MovieClip;
	public praiseBtn: eui.Button;
	public exp: eui.Label;
	public money: eui.Label;
	public list: eui.List;
	// public closeBtn0: eui.Button;
	public closeBtn: eui.Button;
	public selfPos: eui.Label;
	public tab: eui.TabBar;
	public mobai: eui.Group;
	public mobaiEff: MovieClip;
	public weiwang: eui.Image;

	public firstLevelTxt: eui.Label;
	public firstNameTxt: eui.Label;
	public vip: eui.Image;
	private _type: number;
	private firstGroup: eui.Group;
	private firstId: number = 0;
	private help: eui.Button;
	/** 打开他人信息面板 */
	private _openOtherWin: boolean;

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

	private _bodyEff0: MovieClip;
	private _bodyEff1: MovieClip;
	private _bodyEff2: MovieClip;
	private _weaponEff0: MovieClip;
	private _weaponEff1: MovieClip;
	private _weaponEff2: MovieClip;

	constructor() {
		super();
		this.skinName = "RankSkin";
		this.isTopLevel = true;
		// this.setSkinPart("roleSelect", new RoleSelectPanel());
	}

	public initUI(): void {
		super.initUI();
		this.praiseBtn.touchEnabled = true;
		this.praiseBtn.icon = "xphb_json.phb_2";
		this.list.itemRenderer = RankItemRenderer;
		for (var i: number = 0; i < 3; i++) {
			var group: eui.Group = new eui.Group();
			group.name = "Group" + i;
			var btn: eui.Button = new eui.Button();
			btn.label = "Button" + i;
			group.addChild(btn);
		}

		let rankTypeDate = [
			{ type: 0, skin: 'RankItemPowerSkin', name:'战力排行榜'},
			// { type: 1, name:'竞技场排行榜'},
			{ type: 2, skin: 'RankItemSkirmishSkin',name:'遭遇排行榜' },
			{ type: 3, skin: 'RankItemPowerSkin', name:'关卡排行榜'},
			{ type: 4, skin: 'RankItemPowerSkin', name:'副本排行版'},
			{ type: 5, skin: 'RankItemLevelSkin', name:'等级排行榜'},
			{ type: 16, skin: 'RankItemPowerSkin', name:'翅膀排行榜'},
			// { type: 7, skin: 'RankItemPowerSkin', name:'职业排行榜（战士）'},
			// { type: 8, skin: 'RankItemPowerSkin', name:'职业排行榜（法师）'},
			// { type: 9, skin: 'RankItemPowerSkin', name:'职业排行榜（道士）'},
			{ type: 10, skin: 'RankItemLilianSkin', name:'神功排行榜'},
			{ type: 11, skin: 'RankItemLadderSkin', name:'王者排行榜'},
			{ type: 12, skin: 'RankItemPowerSkin', name:'铸造总等级榜'},
			// { type: 13, skin: 'RankItemPowerSkin', name:'战灵排行榜'},
			{ type: 14, skin: 'RankItemPowerSkin', name:'龙魂总等级榜'},
			// { type: 15, skin: 'RankItemLadderSkin', name:'勋章排行榜'},
			// { type: -1, name:'消费排行榜'},
			{ type: 17, name:'图鉴总战力榜'},
			{ type: 18, name:'转生榜'},
			{ type: 19, name:'装备总评分榜'},
			// { type: 21, name:'合服消费排行榜'},
			{ type: 22, name:'威望排行榜'},
			// { type: 23, skin: 'RankItemXiayiSkin', name:'侠义排行榜'},
		]



		this.tab.dataProvider = new eui.ArrayCollection(rankTypeDate);


		this.tab.itemRenderer = RankTabItemRenderer;

		this.mobaiEff = new MovieClip();
		this.mobaiEff.x = 35;
		this.mobaiEff.y = -35;
		this.mobaiEff.scaleX = this.mobaiEff.scaleY = 0.65;
	}

	public open(...param: any[]): void {
		this.addTouchEvent(this.closeBtn, this.onClick);
		// this.addTouchEvent(this.closeBtn0, this.onClick);
		this.addTouchEvent(this.praiseBtn, this.onClick);
		this.addTouchEvent(this.list, this.onClick);
		this.addChangeEvent(this.tab, this.onClick);
		this.addTouchEvent(this.firstGroup, this.onClick);
		this.addTouchEvent(this.praiseGroup, this.onClick);
		this.addTouchEvent(this.praiseGroup2, this.onClick);
		this.addTouchEvent(this.praiseGroup3, this.onClick);
		this.addTouchEvent(this.help, this.onClick);
		this.setOpenType(param[0] == undefined ? 0 : param[0]);

		this.observe(Rank.ins().postRankingData, this.updateList);
		this.observe(UserReadPlayer.ins().postPlayerResult, this.openOtherPlayerView);
		this.observe(Rank.ins().postPraiseResult, this.refushMoBaiStatu);
		this.observe(Rank.ins().postPraiseData, this.updatePraise);
		this.observe(Rank.ins().postAllPraiseData, this.updateTab);

		Rank.ins().sendGetAllPraiseData();
	}

	public close(...param: any[]): void {

		if (this._weaponEff0)
			DisplayUtils.removeFromParent(this._weaponEff0);

		if (this._weaponEff1)
			DisplayUtils.removeFromParent(this._weaponEff1);

		if (this._weaponEff2)
			DisplayUtils.removeFromParent(this._weaponEff2);

		if (this._bodyEff0)
			DisplayUtils.removeFromParent(this._bodyEff0);

		if (this._bodyEff1)
			DisplayUtils.removeFromParent(this._bodyEff1);

		if (this._bodyEff2)
			DisplayUtils.removeFromParent(this._bodyEff2);

		WatcherUtil.removeFromArrayCollection(this.tab.dataProvider as eui.ArrayCollection);

	}
	private state: eui.Label;//无人上榜
	private updateList(rankModel: RankModel): void {
		if (rankModel.type != this._type)
			return;

		this.selfPos.text = 0 < rankModel.selfPos && rankModel.selfPos <= 1000 ? rankModel.selfPos + '' : `未上榜`;
		let arr = rankModel.getDataList();
		if(rankModel.type == 0){
			//战力排行版加上战力
			// for(let i = 0; i <arr.length;i++){
			// 	arr[i].player = arr[i].player + '  战力:'+arr[i].power;
			// }
		}
		this.list.dataProvider = new eui.ArrayCollection(arr.slice(1));

		this.refushMoBaiStatu();
		this.refushFirstInfo(rankModel.getDataList(0));
		//没人上榜处理对应控件
		if (arr && !arr.length) {
			this.state.visible = true;
		} else {
			this.state.visible = false;
		}
		this.titleMcGroup.visible = this.titleImg.visible = this.firstGroup.visible = !this.state.visible;


		if (!this.state.visible) {
			//称号
			let selectedData: any = this.tab.selectedItem;
			let config
			if (selectedData) {
				config = GlobalConfig.TitleConf[selectedData.title] || {} as any;
			} else {
				config = {} as any;
			}

			this.titleImg.source = config.img;
			if (config.eff) {
				if (!this.titleMc) {
					this.titleMc = ObjectPool.pop("MovieClip");
					this.titleMc.x = 0;
					this.titleMc.y = 0;
					this.titleMc.scaleX = 1.5;
					this.titleMc.scaleY = 1.5;
					this.titleMcGroup.addChild(this.titleMc);
				}
				this.titleMc.playFile(RES_DIR_EFF + config.eff, -1);
			} else {
				if (this.titleMc) {
					this.titleMc.destroy();
					this.titleMc = null;
				}
			}
		}


	}


	private refushFirstInfo(firstInfo: any): void {
		if (firstInfo) {
			this.firstId = firstInfo.id;
			this.firstNameTxt.text = firstInfo.player;
			this.vip.visible = firstInfo.vip > 0
			let str: string = ""
			if (Rank.ins().curType == RankDataType.TYPE_XUNZHANG) {
				//勋章
				let cfg: KnighthoodConfig = GlobalConfig.KnighthoodConfig[firstInfo.count];
				str = cfg.type;
			} else if (Rank.ins().curType == RankDataType.TYPE_LILIAN) {
				//爵位
				let cfg: TrainLevelConfig = GlobalConfig.TrainLevelConfig[firstInfo.count];
				str = `${cfg.trainlevel}等${cfg.trainName}`;
			} else if (Rank.ins().curType == RankDataType.TYPE_SKIRMISH) {
				//遭遇
				str = `杀意：${firstInfo.count}`;
			}
			else if (Rank.ins().curType == RankDataType.TYPE_XIAYI) {
				//遭遇
				str = `魅力值：${firstInfo.count}`;
			}
			else {
				// str = (firstInfo[RankDataType.DATA_ZHUAN] ? firstInfo[RankDataType.DATA_ZHUAN] + `转` : "") + firstInfo[RankDataType.DATA_LEVEL] + `级`;
				if(firstInfo[RankDataType.DATA_LEVEL]!=undefined){
					str = `${firstInfo[RankDataType.DATA_LEVEL]}级`;
				}else{
					this.firstLevelTxt.visible = false;
				}
				
			}

			if (Rank.ins().curType == RankDataType.TYPE_WEIWANG) {
				this.weiwang.visible = true;
				this.weiwang.source = WeiWangCC.ins().getWeiWangCfg((firstInfo as RankDataWeiWang).weiWang).res;
				this.firstLevelTxt.visible = false;
			}
			else {
				this.firstLevelTxt.visible = true;
				this.weiwang.visible = false;
			}

			if(firstInfo[RankDataType.DATA_LEVEL]==undefined){
				this.firstLevelTxt.visible = false;
			}

			this.firstLevelTxt.text = str;
		} else {
			this.firstId = 0;
			this.weiwang.visible = false;
		}
	}

	/**
	 * 更新数据
	 */
	protected updateValue(infoData: any, key: string, value: any): void {
		switch (key) {
			case RankDataType.DATA_VIP:
				return;
			case RankDataType.DATA_MONTH:

				return;

			case RankDataType.DATA_LEVEL:
				value = (infoData[RankDataType.DATA_ZHUAN] ? infoData[RankDataType.DATA_ZHUAN] + `转` : "") + value + `级`;
				break;

			case RankDataType.DATA_COUNT:

				break;
		}
		this.firstLevelTxt.text = value;
	}

	private refushMoBaiStatu(): void {
		if (Rank.ins().canPraiseByType(this._type)) {
			this.praiseBtn.icon = "xphb_json.phb_2";
			this.mobaiEff.playFile(RES_DIR_EFF + "huoban", -1);
			this.mobai.addChild(this.mobaiEff);
		} else {
			this.praiseBtn.icon = "xphb_json.phb_23";
			DisplayUtils.removeFromParent(this.mobaiEff);
		}
		this.updateTab();
	}

	private setOpenType(_type: number) {
		let datas = this.tab.dataProvider;
		let index = 0;
		if (datas) {
			for (let i = 0; i < datas.length; i++) {
				let data = datas.getItemAt(i);
				if (data.type == _type) {
					index = i;
					break;
				}
			}
		}

		this.setOpenIndex(index);
	}

	/**
	 * 打开指定的排行榜
	 */
	private titleMcGroup: eui.Group;
	private setOpenIndex(selectedIndex: number): void {
		this.tab.selectedIndex = selectedIndex;
		let selectedData: any = this.tab.selectedItem;
		if (selectedData) {
			this._type = <number>selectedData.type;
		} else {
			this._type = RankDataType.TYPE_POWER;
		}

		// console.log('选中类型 ： ' + this._type)
		Rank.ins().curType = this._type;
		RankItemRenderer.dataFormat = selectedData;

		//清空界面
		// this.praiseGroup.visible = false;
		this.selfPos.text = null;
		this.list.dataProvider = null;
		if (selectedData) {
			this.list.itemRendererSkinName = selectedData.skin || "RankItemPowerSkin";
		} else {
			this.list.itemRendererSkinName = "RankItemPowerSkin";
		}

		// //称号
		// let config = GlobalConfig.TitleConf[selectedData.title] || {} as any;
		// this.titleImg.source = config.img;
		// if (config.eff) {
		// 	if(!this.titleMc){
		// 		this.titleMc = ObjectPool.pop("MovieClip");
		// 		this.titleMc.x = 0;
		// 		this.titleMc.y = 0;
		// 		this.titleMc.scaleX = 1.5;
		// 		this.titleMc.scaleY = 1.5;
		// 		this.titleMcGroup.addChild(this.titleMc);
		// 	}
		// 	this.titleMc.playFile(RES_DIR_EFF+config.eff,-1);
		// } else {
		// 	if(this.titleMc){
		// 		this.titleMc.destroy();
		// 		this.titleMc = null;
		// 	}
		// }

		//天梯排行榜使用独立的协议
		if (this._type == RankDataType.TYPE_LADDER) {
			Ladder.ins().sendGetRankInfo();
		}
		else {
			this.firstGroup.visible = false
			Rank.ins().sendGetRankingData(this._type);
		}

		//请求膜拜数据
		Rank.ins().sendGetPraiseData(this._type);
	}

	private onClick(e: egret.TouchEvent): void {
		switch (e.currentTarget) {
			//关闭
			case this.closeBtn:
				// case this.closeBtn0:
				ViewManager.ins().close(this);
				break;
			//膜拜
			case this.praiseBtn:
				if (Rank.ins().rankModel[this._type].praise.praiseTime < 1) {
					Rank.ins().sendPraise(this._type);
				}
				else {
					UserTips.ins().showTips(`|C:0xf3311e&T:已膜拜|`);
				}
				break;
			case this.list:
				if (this.list.selectedItem) {
					this._openOtherWin = true;
					UserReadPlayer.ins().sendFindPlayer(this.list.selectedItem[RankDataType.DATA_ID]);
				}
				break;
			//切换排行榜
			case this.tab:
				this.setOpenIndex(this.tab.selectedIndex);
				break;
			case this.firstGroup:
			case this.praiseGroup:
			case this.praiseGroup2:
			case this.praiseGroup3:
				if (this.firstId) {
					this._openOtherWin = true;
					UserReadPlayer.ins().sendFindPlayer(this.firstId);
				}
				break;
			case this.help:
				ViewManager.ins().open(CommonHelpWin, GlobalConfig.HelpInfoConfig[21].text);
				break;
		}
	}

	/**
	 * 查看角色界面
	 */
	private openOtherPlayerView(otherPlayerData) {
		if (this._openOtherWin) {
			this._openOtherWin = false;
			ViewManager.ins().open(RRoleWin, otherPlayerData);
		}
	}

	/**
	 * 更新膜拜信息
	 */
	private updatePraise(type: number): void {
		// if (type != this._type)
		// 	return;
		let role: SubRole;
		if (Rank.ins().rankModel[type].praise.id > 0) {
			for (let i: number = 0; i < 3; i++) {
				role = Rank.ins().rankModel[type].praise.subRole[i];
				if (role) {
					let clothCfg = GlobalConfig.EquipConfig[role.clothID];
					if (clothCfg) {
						let fileName: string = clothCfg.appearance;
						if (fileName && fileName.indexOf("[job]") > -1)
							fileName = fileName.replace("[job]", role.job + "");
						this[`bodyImg${i}`].source = (role.clothID > 0 ? fileName + "_" : `body${role.job}00_`) + role.sex + "_c_png";

					} else {
						this[`bodyImg${i}`].source = `body000_${role.sex}_c_png`;
					}

					let weaponCfg = GlobalConfig.EquipConfig[role.swordID];
					if (weaponCfg) {
						let fileName: string = GlobalConfig.EquipConfig[role.swordID].appearance;
						if (fileName && fileName.indexOf("[job]") > -1)
							fileName = fileName.replace("[job]", role.job + "");

						this[`weaponImg${i}`].source = !this.hideWeapon(role.swordID, role.sex) ? (role.swordID > 0 ? `${fileName}_${role.sex}_c_png` : '') : "";

					} else {
						this[`weaponImg${i}`].source = "";
					}

					let wingCfg = GlobalConfig.WingLevelConfig[role.wingLevel];
					if (wingCfg) {
						this[`wingImg${i}`].source = role.wingLevel >= 0 ? wingCfg.appearance + "_png" : '';
					} else {
						this[`wingImg${i}`].source = "";
					}


					//奖励
					// let rewards: RewardData[] = GlobalConfig.MorshipConfig[UserZs.ins().lv > 0 ? UserZs.ins().lv * 1000 : Actor.level].rewards;
					// this.money.text = CommonUtils.overLength(rewards[0].count);
					// this.exp.text = CommonUtils.overLength(rewards[1].count);

					//时装
					if (role.pos1 > 0) {//pos1:衣服 pos2:武器 pos3:翅膀
						this[`bodyImg${i}`].source = this.getZhuangbanById(role.pos1).res + "_" + role.sex + "_c_png";
						DisplayUtils.removeFromParent(this["_bodyEff" + i]);
					}
					else {
						if (!this["_bodyEff" + i])
							this["_bodyEff" + i] = new MovieClip();

						this.setWeaponEffect(role.clothID, `bPos${i}_`, role.sex, this[`bodyEffect${i}`], this["_bodyEff" + i]);
					}

					if (role.pos2 > 0) {//pos1:衣服 pos2:武器 pos3:翅膀
						this[`weaponImg${i}`].source = this.getZhuangbanById(role.pos2).res + "_" + role.sex + "_c_png";
						DisplayUtils.removeFromParent(this["_weaponEff" + i]);
					}
					else {
						if (!this["_weaponEff" + i])
							this["_weaponEff" + i] = new MovieClip();

						this.setWeaponEffect(role.swordID, `wPos${i}_`, role.sex, this[`weaponEffect${i}`], this["_weaponEff" + i]);
					}

					if (role.pos3 > 0) {//pos1:衣服 pos2:武器 pos3:翅膀
						this[`wingImg${i}`].source = this.getZhuangbanById(role.pos3).res + "_png";// + role.sex + "_c_png";
					}

				} else {
					this[`bodyImg${i}`].source = "body00_png";
					this[`weaponImg${i}`].source = "";
					this[`wingImg${i}`].source = "";
					if (this["_weaponEff" + i])
						DisplayUtils.removeFromParent(this["_weaponEff" + i]);

					if (this["_bodyEff" + i])
						DisplayUtils.removeFromParent(this["_bodyEff" + i]);
				}
			}

			//膜拜按钮	
			this.refushMoBaiStatu();
		}
		else {
			for (let i: number = 0; i < 3; i++) {
				this[`bodyImg${i}`].source = "body00_png";
				this[`weaponImg${i}`].source = "";
				this[`wingImg${i}`].source = "";
				DisplayUtils.removeFromParent(this["_weaponEff" + i]);
				DisplayUtils.removeFromParent(this["_bodyEff" + i]);
			}
		}
		// this.praiseGroup.visible = role != null;

		//更新标签栏
		this.updateTab();
	}

	/**
	 * 更新标签栏
	 * @returns void
	 */
	private updateTab(): void {
		let i: number = this.tab.selectedIndex;
		if (this.tab.dataProvider as eui.ArrayCollection) {
			(this.tab.dataProvider as eui.ArrayCollection).refresh();
		}

		this.tab.selectedIndex = i;
	}

	public static openCheck(...param: any[]): boolean {
		let lv: number = Actor.level;
		if (lv < 60) {
			UserTips.ins().showTips(`60级开启排行榜`);
			return false;
		}
		return true;
	}

	private getZhuangbanById(id: number): ZhuangBanId {
		for (let k in GlobalConfig.ZhuangBanId) {
			if (GlobalConfig.ZhuangBanId[k].id == id)
				return GlobalConfig.ZhuangBanId[k];
		}
		return null;
	}

	private hideWeapon(id: number, sex: number): boolean {
		return GlobalConfig.EquipWithEffConfig[id + "_" + sex] ? true : false;
	}

	/** 设置武器模型和衣服模型*/
	private setWeaponEffect(id: number, imgStr: string, sex: number, soulEffGroup: eui.Group, suitEff: MovieClip): void {
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

}

ViewManager.ins().reg(RankingWin, LayerManager.UI_Main);