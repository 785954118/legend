/**
 *
 * @author hepeiye
 *
 */
class EquipDetailedWin extends BaseEuiView {
	private group: eui.Group;
	private forgeGroup: eui.Group;
	private background: eui.Image;
	private nameLabel: eui.Label;
	private type: eui.Label;
	private lv: eui.Label;
	private levelKey: eui.Label;
	private career: eui.Label;
	private score: eui.Label;

	private attr1: eui.Label;
	private attr2: eui.Label;
	private attr3: eui.Label;
	private attr4: eui.Label;
	private jobGroup: eui.Group;
	// private baseAttr: eui.Label;
	// private randAttr: eui.Label;
	// private nameAttr: eui.Label;

	private itemIcon: ItemIcon;
	// private totalPower: egret.DisplayObjectContainer;

	private roleModel: Role;
	private _bottomY: number = 0;	//最后一个组件的Y坐标值

	private _equipPower: number = 0;
	private _totalPower: number = 0;

	private changeBtn: eui.Button;

	private curRole: number = 0;
	private index: number = 0;
	// private powerGroup:eui.Group;
	private powerPanel: PowerPanel;
	private quali: eui.Image;
	private bgClose: eui.Image;
	private _score:number;
	private bgGroup:eui.Group;
	constructor() {
		super();
		this.skinName = "EquipTipsSkin";
		// this.setSkinPart("powerPanel", new PowerPanel());
		this.powerPanel.setBgVis(false);
	}


	public initUI(): void {
		super.initUI();
		// this.totalPower = BitmapNumber.ins().createNumPic(0, "8");
		// this.totalPower.x = 70;
		// this.totalPower.y = 10;
		// this.powerGroup.addChild(this.totalPower);
		this.itemIcon.imgJob.visible = false;
	}

	public open(...param: any[]): void {
		let type: number = param[0];

		let handle: number = param[1];
		let configID: number = param[2];
		let data = param[3];

		this.roleModel = param[4];
		if (param[5] >= 0) {
			this.curRole = param[5];
			this.index = param[6];
			this.changeBtn.visible = true;
		} else {
			this.changeBtn.visible = false;
		}
		// this.addTouchEndEvent(this, this.otherClose);
		this.addTouchEndEvent(this.bgClose, this.otherClose)
		this.addTouchEndEvent(this.changeBtn, this.onEquipChange)
		this.setData(type, handle, configID, data);
	}

	public close(...param: any[]): void {
		this.removeEventListener(egret.TouchEvent.TOUCH_END, this.otherClose, this.bgClose);
	}

	private otherClose(evt: egret.TouchEvent) {
		ViewManager.ins().close(EquipDetailedWin);
	}

	private onEquipChange(e: egret.Event): void {
		ViewManager.ins().open(RoleChooseEquipWin, this.curRole, this.index);
		ViewManager.ins().close(EquipDetailedWin);
	}

	/**获得至尊装备名字*/
	private getExtremeName():string
	{
		if (!this.changeBtn.visible)
			return "";

		let lv:number = ExtremeEquipModel.ins().getZhiZunLvByRoleID(this.roleModel, this.index);
		if (!lv)
			return "";

		return GlobalConfig.ZhiZunEquipLevel[this.index][lv].headTxt;
	}


	private setData(type: number, handle: number, configID: number, _data?: any): void {
		let data = _data instanceof ItemData ? _data : undefined;
		let itemConfig: ItemConfig;
		this._totalPower = 0;
		if (handle != undefined && data == undefined) {
			data = UserBag.ins().getBagGoodsByHandle(type, handle);
			if (!data) {  //检查是否在身上
				let len: number = SubRoles.ins().subRolesLen;
				for (let i: number = 0; i < len; i++) {
					let role: Role = SubRoles.ins().getSubRoleByIndex(i);
					let equipLen: number = role.getEquipLen();
					for (let kk: number = 0; kk < equipLen; kk++) {
						if (role.getEquipByIndex(kk).item.handle == (handle)) {
							data = role.getEquipByIndex(kk).item;
							break;
						}
					}
				}

			}

			if (!data) {//检查是否在商店
				let shopData: ShopData = Shop.ins().shopData;
				let len: number = shopData.getShopEquipDataLength();
				let sed: ShopEquipData = null;
				for (let i: number = 0; i < len; i++) {
					sed = shopData.getShopEquipDataByIndex(i);
					if (sed != null) {
						if (handle == sed.item.handle) {
							data = sed.item;
							break;
						}
					}
				}
			}

			if (!data) {
				new Error("请检查handle是否传错！");
			}

			itemConfig = data.itemConfig;
			configID = data.configID;
		} else
			itemConfig = GlobalConfig.ItemConfig[configID];


		this.nameLabel.text = this.getExtremeName() + itemConfig.name;
		this.nameLabel.textColor = ItemConfig.getQualityColor(itemConfig);
		let q = ItemConfig.getQuality(itemConfig);
		let subType = ItemConfig.getSubType(itemConfig);
		let job = ItemConfig.getJob(itemConfig);
		this.quali.source = q > 0 ? `quali${q}` : "";
		this.itemIcon.setData(itemConfig);
		let exPower:number = 0;
		if (data instanceof ItemData || itemConfig != null) {
			if (data && ItemConfig.getType((<ItemData>data).itemConfig) == 4) {
				this.levelKey.text = "需求：";
				this.type.text = Role.getWingEquipNameByType(subType);
				this.lv.text = itemConfig.level + 1 + "阶羽翼可穿戴";
				this.lv.textColor = 0xf3311e;
				let len: number = SubRoles.ins().subRolesLen;
				for (let i: number = 0; i < len; i++) {
					if (SubRoles.ins().getSubRoleByIndex(i).wingsData.lv >= itemConfig.level) {
						this.lv.textColor = 0x35e62d;
						break;
					}
				}
				this.career.text = Role.getJobNameByJob(job);
				this.jobGroup.visible = true;
			} else if (data && ItemConfig.getType((<ItemData>data).itemConfig) == 5) {
				this.levelKey.text = itemConfig.zsLevel > 0 ? "转生：" : "等级：";
				this.type.text = Role.getHejiEquipNameByType(subType);
				this.lv.text = isNaN(itemConfig.zsLevel) ? ((itemConfig.level || 1) + "级") : (itemConfig.zsLevel + "转");
				if (itemConfig.zsLevel > 0) {
					this.lv.textColor = UserZs.ins().lv < itemConfig.zsLevel ? 0xf3311e : 0x35e62d;
				}
				else {
					this.lv.textColor = Actor.level < itemConfig.level ? 0xf3311e : 0x35e62d;
				}
				this.jobGroup.visible = false;
				if( UserBag.fitleEquip.indexOf(itemConfig.id) != -1 ){
					this.lv.text = "无级别";
				}
			}
			else {
				if (subType == EquipPos.DZI) {
					this.levelKey.text = "等阶：";
					this.type.text = Role.getEquipNameByType(subType);
					this.lv.text = UserBag.ins().getGuanyinLevel(itemConfig);
				} else {
					this.levelKey.text = itemConfig.zsLevel > 0 ? "转生：" : "等级：";
					this.type.text = Role.getEquipNameByType(subType);
					this.lv.text = isNaN(itemConfig.zsLevel) ? ((itemConfig.level || 1) + "级") : (itemConfig.zsLevel + "转");
					if( UserBag.fitleEquip.indexOf(itemConfig.id) != -1 ){
						this.lv.text = "无级别";
					}
				}
				if (itemConfig.zsLevel > 0) {
					this.lv.textColor = UserZs.ins().lv < itemConfig.zsLevel ? 0xf3311e : 0x35e62d;
				}
				else {
					this.lv.textColor = Actor.level < itemConfig.level ? 0xf3311e : 0x35e62d;
				}
				this.career.text = Role.getJobNameByJob(job);
				this.jobGroup.visible = true;
			}

		}

		// let nameList: string[] = [];
		// let baseAttrList: string[] = [];
		// let randAttrList: string[] = [];

		let ii = 1;
		this.attr1.visible = false;
		this.attr2.visible = false;
		this.attr3.visible = false;
		this.attr4.visible = false;
		let config = GlobalConfig.EquipConfig[configID];
		let totalAttr: AttributeData[] = [];
		let info: HeirloomInfo;

		let transfrom = [
			'',
			'',
			'hp',  //2
			'',
			'atk',  //4
			'def',  //5
			'res',  //6
		];

		if (this.roleModel)
			info = this.roleModel.heirloom.getInfoBySolt(this.index);
		for (let k in Role.translate) {
			if (isNaN(config[k]) || !config[k])
				continue;

			let attrStr = "";
			// baseAttrList.push(config[k] + "");
			// nameList.push(AttributeData.getAttrStrByType(this.translate[k]));
			attrStr += AttributeData.getAttrStrByType(Role.getAttrTypeByName(k)) + "  ";
			attrStr += config[k];
			let attrs: AttributeData = new AttributeData;
			if (data != undefined) {
				if (data.att) {
					let attr = data.att;
					for (let index = 0; index < attr.length; index++) {
						if (attr[index].type == Role.getAttrTypeByName(k)) {
							// randAttrList.push('+' + attr[index].value);
							attrStr += ' +' + attr[index].value;
							if (info && info.attr_add) {
								attrStr += "+" + Math.floor((config[k] + attr[index].value) * (info.attr_add / 100));
							}
							attrs.type = attr[index].type;
							attrs.value = config[k] + attr[index].value;
							totalAttr.push(attrs);
							break;
						}
					}
				} else {
					for (let k in config) {
						if (!transfrom[k]) continue;
						let value = config[transfrom[k]];
						if (value == undefined || value == 0) continue;
						let type = Role.getAttrTypeByName(transfrom[k]);
						attrStr += AttributeData.getAttrStrByType(type) + "  ";
						attrStr += config[k];

						attrs.type = type;
						attrs.value = config[k];
						// let additionRange = equipConfig.additionRange?equipConfig.additionRange:15;
						// allPower += (value + Math.floor(value * ItemBase.additionRange / 100)) * powerConfig[k].power;
						totalAttr.push(attrs);
					}
				}
			} else {
				attrs.type = Role.getAttrTypeByName(k);
				attrs.value = config[k];
				totalAttr.push(attrs);
			}

			this['attr' + ii].text = attrStr;
			this['attr' + ii].visible = true;

			ii++;
		}
		if (data) {
			this._equipPower = data.point;//在point里面已经计算 expower
		} else {
			this._equipPower = Math.floor(UserBag.getAttrPower(totalAttr));
			if(config && config.exPower)
			{
				exPower = config.exPower;
			}
		}

		this._totalPower += this._equipPower + exPower;
		this._score = this._totalPower;
		this.score.text = "评分：" + this._totalPower;
		this._bottomY = this['attr' + (ii - 1)].y + this['attr' + (ii - 1)].height;

		while (this.forgeGroup.numElements) {
			this.forgeGroup.removeChildAt(0);
		}
		if (this.roleModel) {
			//身上装备
			let len: number = this.roleModel.getEquipLen();
			// let equipsData: EquipsData[] = this.roleModel.equipsData;
			for (let i: number = 0; i < len; i++) {
				let equipsData: EquipsData = this.roleModel.getEquipByIndex(i);
				if (equipsData.item.handle == (handle)) {
					this.setForge(equipsData, i);
					break;
				}
			}

			if (config) {
				if (config.baseAttr1) {
					this._equipPower += ItemConfig.relatePower(config.baseAttr1, this.roleModel);
				}

				if (config.baseAttr2) {
					this._equipPower += ItemConfig.relatePower(config.baseAttr2, this.roleModel);
				}
			}

		}
		if (subType == EquipPos.DZI) this.addTips(null, 4, 0);
		if (itemConfig.desc) {
			//分割线
			// let lineImg: eui.Image = new eui.Image;
			// lineImg.source = "zyz_01";
			// lineImg.width = 291;
			// lineImg.x = 97;
			// lineImg.y = this._bottomY += 10;
			// this.forgeGroup.addChild(lineImg);
			//描述
			let desc: eui.Label = new eui.Label;
			// desc.fontFamily = "黑体";
			desc.size = 18;
			desc.width = 250;
			desc.textColor = 0xD1C28F;
			desc.x = this.attr1.x;
			desc.y = this._bottomY += 10;
			desc.textFlow = TextFlowMaker.generateTextFlow(itemConfig.desc);
			this.forgeGroup.addChild(desc);
			this._bottomY += desc.textHeight;
		}
		let scrollMaxHeight = 630;
		if( this._bottomY > scrollMaxHeight )
			this._bottomY = scrollMaxHeight;
		this.background.height = this.powerPanel.y + this.powerPanel.height + this._bottomY + 12;
		this.bgGroup.y = this.background.y + this.background.height;
		// this.anigroup.height = this.background.height + this.bgGroup.height + 60;
		// this.anigroup.y = this.anigroup.height / 2 - this.background.height / 2;

		// BitmapNumber.ins().changeNum(this.totalPower, this._totalPower, "8");
		this.powerPanel.setPower(this._totalPower);
		// this.totalPower.y = this.anigroup.y + 45;

		// this.baseAttr.text = ItemData.getStringByList(baseAttrList);
		// this.randAttr.text = ItemData.getStringByList(randAttrList);
		// this.nameAttr.text =
		let scrollerGroup = <eui.Scroller>this.attr1.parent.parent;
		scrollerGroup.height = this._bottomY;
		scrollerGroup.scrollPolicyV = this._bottomY >= scrollMaxHeight?"on":"off";

		this.anigroup.height = this.powerPanel.y + this.powerPanel.height + this.bgGroup.height + scrollerGroup.height + 60;
		this.anigroup.height = this.anigroup.height>930?930:this.anigroup.height;
		this.anigroup.y = this.anigroup.height / 2 - this.background.height / 2;
	}

	private setForge(equipsData: EquipsData, pos: number): void {
		let lv: number = 0;
		for (let i: number = 0; i < 4; i++) {
			switch (i) {
				case ForgeWin.Page_Select_Boost:
					lv = equipsData.strengthen;
					break;
				case ForgeWin.Page_Select_ZhuLing:
					lv = equipsData.zhuling;
					break;
				case ForgeWin.Page_Select_Gem:
					lv = equipsData.gem;
					break;
				case ForgeWin.Page_Select_Weapon:
					lv = equipsData.tupo;
					break;
			}
			if (lv > 0) {
				let config: EnhanceAttrConfig
					| StoneLevelConfig
					| ZhulingAttrConfig
					| TupoAttrConfig = UserForge.ins().getForgeConfigByPos(pos, lv, i);
				this.addTips(config.attr, i, lv);
				let power: number = 0;
				if (i == 3)
					power = Math.floor(this._equipPower * (Number(config.attr) / 100));
				else
					power = Math.floor(UserBag.getAttrPower(config.attr));
				this._totalPower += power;
			}
		}

		//至尊装备
		if( pos >= EquipPos.WEAPON && pos <= EquipPos.SHOE ){
			lv = ExtremeEquipModel.ins().getZhiZunLvByRoleID(this.roleModel, pos);
			this.itemIcon.extreme.visible = lv?true:false;
			if (lv)
			{
				let config:ZhiZunEquipLevel = GlobalConfig.ZhiZunEquipLevel[pos][lv];
				if (config.ex_attrs)
					this._totalPower += Math.floor(UserBag.getAttrPower(config.ex_attrs));

				this._totalPower += config.ex_power;

				let des:string = "";
				let lv2:number = ExtremeEquipModel.ins().getZhiZunLinkLv(this.curRole + 1, pos, lv);
				let isTrue:boolean = lv2 > 0;

				let linkCfg:ZhiZunLinkLevel;
				let stop:boolean = false;
				for (let key in GlobalConfig.ZhiZunLinkLevel[pos])
				{
					for (let key2 in GlobalConfig.ZhiZunLinkLevel[pos][key])
					{
						linkCfg = GlobalConfig.ZhiZunLinkLevel[pos][key][key2];
						if (linkCfg.level == 1)
							des = linkCfg.chainDesc;

						if (linkCfg.level == lv2 && isTrue)
						{
							stop = true;
							if (linkCfg.attrs)
								this._totalPower += Math.floor(UserBag.getAttrPower(linkCfg.attrs));

							if (linkCfg.exAttrs)
								this._totalPower += Math.floor(UserBag.getAttrPower(linkCfg.exAttrs));

							this._totalPower += linkCfg.ex_power;
							des = linkCfg.chainDesc;
							break;
						}
					}

					if (stop)
						break;
				}

				this._totalPower += Math.floor(UserBag.getAttrPower(config.attrs));
				this.addTips(config.attrs, 5, lv, lv2, config.skillId, des);
			}
		}

	}

	private addTips(attr: AttributeData[], type: number, lv: number = 0, lv2:number = 0, skillId:number = 0, des:string = ""): void {
		// let lineImg: eui.Image = new eui.Image;
		// lineImg.source = "zyz_01";
		// lineImg.width = 291;
		// lineImg.x = 97;
		// lineImg.y = this._bottomY + 10;
		// this.forgeGroup.addChild(lineImg);
		let titleAttrTxt: eui.Label = new eui.Label;
		titleAttrTxt.fontFamily = "Arial";
		titleAttrTxt.size = 20;
		titleAttrTxt.textColor = 0x7e6437;
		titleAttrTxt.bold = true;
		titleAttrTxt.x = 24;
		titleAttrTxt.y = this._bottomY + 10 + 14;
		titleAttrTxt.touchEnabled = false;
		this.forgeGroup.addChild(titleAttrTxt);
		let attrTxt: eui.Label = new eui.Label;
		attrTxt.fontFamily = "Arial";
		attrTxt.size = 18;
		attrTxt.lineSpacing = 8;
		// attrTxt.textColor = 0x9f946d;
		attrTxt.x = 46;
		attrTxt.y = titleAttrTxt.y + 24;
		attrTxt.touchEnabled = false;
		this.forgeGroup.addChild(attrTxt);
		let attrs: AttributeData[];
		switch (type) {
			case ForgeWin.Page_Select_Boost:
				titleAttrTxt.text = "强化属性";
				attrs = AttributeData.getAttrStrAdd(attr, 11);
				attrTxt.textColor = 0x5186fd;
				break;
			case ForgeWin.Page_Select_Gem:
				titleAttrTxt.text = "精炼属性";
				attrs = AttributeData.getAttrStrAdd(attr, 12);
				attrTxt.textColor = 0xd242fb;
				break;
			case ForgeWin.Page_Select_ZhuLing:
				titleAttrTxt.text = "铸造属性";
				attrTxt.textColor = 0xe5b613;
				// let str: string = "";
				// for (let i: number = 1; i < 5; i++) {
				// let gem: eui.Image = new eui.Image;
				// gem.x = attrTxt.x;
				// gem.y = (attrTxt.y - 2) + (i - 1) * 23;
				// this.forgeGroup.addChild(gem);
				// let attrName: string = AttributeData.getAttrStrByType(attr[0].type);
				// if (attr.length > i) {
				// str += "|C:0x2ECA22&T:Lv10|\n";
				// lv -= 10;
				// gem.source = "bs_" + attr[0].type + "10";
				// } else if (attr.length == i) {
				// str += "Lv" + lv;
				// gem.source = "bs_" + attr[0].type + lv;
				// } else {
				// if (i < 5)
				// 	str += "\n|C:0x909090&T:";
				// str += attrName + "宝石 未激活|";
				// gem.source = "bs_00";
				// 	}
				// }
				// let lvTxt: eui.Label = new eui.Label;
				// lvTxt.fontFamily = "黑体";
				// lvTxt.size = 18;
				// lvTxt.fontFamily = "Arial";
				// lvTxt.textColor = 0x9f946d;
				// lvTxt.lineSpacing = 8;
				// lvTxt.x = attrTxt.x + 26;
				// lvTxt.y = attrTxt.y;
				// lvTxt.textFlow = TextFlowMaker.generateTextFlow(str);
				// this.forgeGroup.addChild(lvTxt);
				// attrTxt.x = lvTxt.x + 38;
				// attrTxt.height = lvTxt.height;
				attrs = AttributeData.getAttrStrAdd(attr, 15);
				break;

			case ForgeWin.Page_Select_Weapon:
				titleAttrTxt.text = "突破属性";
				break;
			case 4:
				titleAttrTxt.text = "特殊属性";
				this._bottomY = titleAttrTxt.y + titleAttrTxt.height;
				break;
			case 5:
				titleAttrTxt.text = "至尊属性";
				titleAttrTxt.textColor = 0xFCF537;
				attrs = attr;
				attrTxt.textColor = 0xFCF537;
				break;
		}
		let info: HeirloomInfo;
		if (type != ForgeWin.Page_Select_ZhuLing && type != 5 && this.roleModel)
			info = this.roleModel.heirloom.getInfoBySolt(this.index);

		let off:number = 0;
		if (attrs) {
			if (type != ForgeWin.Page_Select_Weapon)
			{
				attrTxt.textFlow = TextFlowMaker.generateTextFlow1(AttributeData.getAttStr(attrs, 1, 1, "  ", false, true, info));
				
				if (type == 5)
				{
					let z1: eui.Label = new eui.Label;
					z1.fontFamily = "Arial";
					z1.size = 20;
					z1.textColor = 0xFCF537;
					z1.x = 24;
					z1.y = attrTxt.y + attrTxt.height + 10;
					z1.touchEnabled = false;
					z1.width = 280;
					this.forgeGroup.addChild(z1);
					z1.textFlow = TextFlowMaker.generateTextFlow("<font color = '" + (lv2 ? "#FCF537" : "#666666") + "'>" + "<b>【灵魂锁链Lv" + (lv2 ? lv2 : 1) + "】</b></font>");
					off +=  z1.textHeight + 10;

					let z2: eui.Label = new eui.Label;
					z2.fontFamily = "Arial";
					z2.size = 18;
					z2.lineSpacing = 8;
					z2.textColor = 0xFCF537;
					z2.x = 46;
					z2.y = z1.y + z1.textHeight + 10;
					z2.touchEnabled = false;
					z2.multiline = true;
					z2.wordWrap = true;
					this.forgeGroup.addChild(z2);
					z2.textFlow = TextFlowMaker.generateTextFlow("<font color = '" + (lv2 ? "#FCF537" : "#666666") + "'>" + des + "</font>");
					off +=  z2.textHeight + 10;

					if (skillId)
					{
						let skillCfg:SkillsConfig = GlobalConfig.SkillsConfig[skillId];
						let skillDes:SkillsDescConfig = GlobalConfig.SkillsDescConfig[skillCfg.desc];

						let z3: eui.Label = new eui.Label;
						z3.fontFamily = "Arial";
						z3.size = 20;
						z3.textColor = 0xFCF537;
						z3.x = 24;
						z3.y = z2.y + z2.height + 10;
						z3.touchEnabled = false;
						z3.width = 280;
						z3.wordWrap = true;
						z3.multiline = true;
						this.forgeGroup.addChild(z3);
						z3.textFlow = TextFlowMaker.generateTextFlow("<b>【" + skillDes.name + "Lv" + lv + "】</b>");
						off +=  z3.textHeight + 10;

						let z4: eui.Label = new eui.Label;
						z4.fontFamily = "Arial";
						z4.size = 18;
						z4.lineSpacing = 8;
						z4.textColor = 0xFCF537;
						z4.x = 46;
						z4.y = z3.y + z3.textHeight + 10;
						z4.touchEnabled = false;
						z4.width = 280;
						z4.wordWrap = true;
						z4.multiline = true;
						this.forgeGroup.addChild(z4);
						z4.textFlow = TextFlowMaker.generateTextFlow((skillDes.desc.replace("%s%", skillCfg.desc_ex[0] + "")));
						off +=  z4.textHeight + 10;
					}
				}
			}
			else
				attrTxt.textFlow = TextFlowMaker.generateTextFlow1("基础属性 +" + attr + "%");
		}
		this._bottomY = attrTxt.y + attrTxt.height + off;
	}

	/**
	 * 统计装备的积分
	 * @returns {number}
	 */
	public getScore(): number
	{
		return this._score;
	}

	/**
	 * 统计装备的战斗力
	 * @returns {number}
	 */
	public getPower():number
	{
		return this.powerPanel.power;
	}

	/**
	 * 获取装扮类型
	 * @returns {string}
	 */
	public getType(): string
	{
		return this.type.text;
	}

}
ViewManager.ins().reg(EquipDetailedWin, LayerManager.UI_Popup);