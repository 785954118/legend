/**装扮 */
class DressWin extends BaseEuiView {

	public viewStack: eui.ViewStack;
	public wingImg: eui.Image;
	public bodyImg: eui.Image;
	public weaponImg: eui.Image;
	public closeBtn: eui.Button;
	// public closeBtn0: eui.Button;
	public help: eui.Button;
	public roleSelect: RoleSelectPanel;
	public roleSelect0: RoleSelectPanel
	public list: eui.List;
	public titleList: eui.DataGroup;
	// public powerImg: eui.Image;
	public tab: eui.TabBar;
	public selectGroup: eui.Group;
	// public nameImage: eui.Image;
	public dressBtn: eui.Button;
	public dressBtn2: eui.Button;
	public background: eui.Image;
	public dressName: eui.Label;
	public attrLabel: eui.Label;
	public attrLv: eui.Label;
	public namelabel: eui.Label;
	public itemName: eui.Label;
	// public attrPower: eui.Label;
	public unSelectGroup: eui.Group;
	public redPoint0: eui.Image;
	public redPoint1: eui.Image;
	public redPoint2: eui.Image;
	private curRole: number;
	private selectIndex: number;
	private listInfo: DressItemInfo[];
	private arry: eui.ArrayCollection;
	private listId: number;

	// private totalPower: egret.DisplayObjectContainer;
	private _totalPower: number;
	private id: number;
	private num: number;

	private titleGroup: eui.Group;
	private dressGroup: eui.Group;
	// private powerGroup: eui.Group;
	private powerPanel: PowerPanel;


	constructor() {
		super();
		this.skinName = "DressSkin";
		this.isTopLevel = true;
		// this.setSkinPart("roleSelect", new RoleSelectPanel());
		// this.setSkinPart("roleSelect0", new RoleSelectPanel());
		// this.setSkinPart("powerPanel", new PowerPanel());
	}

	public childrenCreated(): void {
		this.init();
	}

	public init(): void {
		this.listInfo = [];

		this.arry = new eui.ArrayCollection(this.listInfo);
		this.list.itemRenderer = DressItemRenderer;
		this.list.dataProvider = this.arry;


		this.titleList.itemRenderer = TitleItem;

		let arr = [];
		// arr.push(GlobalConfig.ZhuangBanConfig.zhuangbanpos[0]);
		arr = CommonUtils.copyDataHandler(GlobalConfig.ZhuangBanConfig.zhuangbanpos);
		arr.push("称号");
		this.tab.dataProvider = new eui.ArrayCollection(arr);

		// this.totalPower = BitmapNumber.ins().createNumPic(1000000, "8", 0);
		// this.totalPower.x = 90;
		// this.totalPower.y = 5;
		// this.powerGroup.addChild(this.totalPower);
	}

	public open(...param: any[]): void {

		this.curRole = param[0] || 0;
		if (param[1] != undefined) { //用于打开界面选择角色计算战斗力，之前没有传这个参数，如计算战斗力功能不需要，可以删掉这三行代码Peach.T
			this.lastIndex = this.selectIndex = parseInt(param[1] + "");
			this.tab.selectedIndex = this.selectIndex;
		}
		this.listId = param[2] || -1;
		this.list.selectedIndex = -1;
		this.roleSelect.setCurRole(this.curRole);
		this.roleSelect0.setCurRole(this.curRole);
		MessageCenter.ins().addListener(Title.TITLE_WIN_REFLASH_PANEL, (obj, param) => {
			if (obj.itemIndex == Title.ins().list.length - 1) {
				let itemHeight: number = Title.EXPAND_HEIGHT - Title.SIMLPE_HEIGHT
				if (param == "expand") {
					this.titleList.scrollV = this.titleList.contentHeight - this.titleList.height + itemHeight;
				} else {
					this.titleList.scrollV = this.titleList.contentHeight - this.titleList.height - itemHeight;
				}
				this.titleList.validateNow();
			}
		}, this);
		this.observe(Dress.ins().postDressInfo, this.update);
		this.observe(Dress.ins().postJiHuo, this.onJihuo);
		this.observe(GameLogic.ins().postSubRoleChange, this.getDressInfo);
		this.addTouchEvent(this.closeBtn, this.onClick);
		// this.addTouchEvent(this.closeBtn0, this.onClick);
		this.addTouchEvent(this.help, this.onClick);
		this.addTouchEvent(this.itemName, this.onClick);
		this.addChangeEvent(this.list, this.onChange);
		this.addChangeEvent(this.tab, this.onTabTouch);
		this.addChangeEvent(this.roleSelect, this.onChange);
		this.addChangeEvent(this.roleSelect0, this.onChange);
		this.addTouchEvent(this.dressBtn, this.onClick);
		this.addTouchEvent(this.dressBtn2, this.onClick);

		this.observe(Title.ins().postListUpdate, this.updateList);
		this.observe(Title.ins().postTitleShow, this.updateShow);
		this.observe(Title.ins().postUseTitle, this.useTitle);
		this.list.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouch, this);
		this.list.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouch, this);
		this.list.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouch, this);
		this.titleList.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouch, this);
		this.titleList.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouch, this);
		this.titleList.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouch, this);
		this.titleGroup.visible = false;
		this.dressGroup.visible = true;
		this.changeRole();
		this.getDressInfo();
		if (this.lastIndex >= 0) {
			this.setSelectedIndex(this.lastIndex);
		}
	}

	public close(...param: any[]): void {
		this.list.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouch, this);
		this.list.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouch, this);
		this.list.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouch, this);
		this.titleList.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouch, this);
		this.titleList.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouch, this);
		this.titleList.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouch, this);
		this.lastWeapon = 0;
		this.lastBody = 0;

		WatcherUtil.removeFromArrayCollection(this.titleList.dataProvider as eui.ArrayCollection);

		this.titleList.dataProvider = null;
	}
	private listSelectIndex(id: number): number{
		if(id == -1) return -1;
		let index = 0;
		for (let key in this.listInfo) {
			if (this.listInfo.hasOwnProperty(key)) {
				let element = this.listInfo[key];
				if(element.zhuanban.id == id){
					break;
				}
			}
			index ++;
		}
		return index;
	}
	private onTouch(e: egret.TouchEvent) {
		if (e.type == egret.TouchEvent.TOUCH_BEGIN) {
			this.roleSelect.parent.touchEnabled = false;
			this.roleSelect0.parent.touchEnabled = false;
		} else {
			this.roleSelect.parent.touchEnabled = true;
			this.roleSelect0.parent.touchEnabled = true;
		}
	}

	private getDressInfo(): void {
		Dress.ins().sendDressInfoReq()
	}

	//不同的角色或者时装处理
	private lastRole: number = -1;

	private onChange(e: egret.Event): void {
		switch (e.target) {
			case this.roleSelect:
				if (this.lastRole == this.roleSelect.getCurRole()) return;
				this.changeRole();
				break;
			case this.roleSelect0:
				if (this.lastRole == this.roleSelect0.getCurRole()) return;
				Title.ins().curSelectRole = this.lastRole = this.roleSelect0.getCurRole();
				if (Title.ins().list == null)
					Title.ins().sendGetList();
				else
					this.updateList();
				break;
			case this.list:
				let item: DressItemRenderer = e.target as DressItemRenderer;
				this.onInfoUpdate(item.data);
				break;
		}
	}

	private changeRole() {
		this.curRole = this.roleSelect.getCurRole();
		// this.list.selectedIndex = -1;
		this.lastWeapon = 0;
		this.lastBody = 0;
		this.lastWing = 0;
		this.lastRole = this.curRole;
		this.update();
	}

	private careerRedPoint(): void {
		let redPoint: boolean[] = Dress.ins().posRedPoint();
		for (let i: number = 0; i < 3; i++) {
			this["redPoint" + i].visible = redPoint[i];
		}
	}

	//不同的类型时装
	private lastIndex: number = -1;

	private onTabTouch(e: egret.TouchEvent): void {
		let sro = this.list.parent as eui.Scroller;
		sro.stopAnimation();
		this.list.scrollH = 0;
		this.listId = -1;
		this.selectIndex = e.currentTarget.selectedIndex;
		this.setSelectedIndex(this.selectIndex);
	}

	private setSelectedIndex(index) {
		this.lastIndex = this.selectIndex;
		if (this.selectIndex < this.tab.dataProvider.length - 1) {
			this.dressGroup.visible = true;
			this.roleSelect.openRole();
			this.titleGroup.visible = false;
			this.update();
		} else {
			this.dressGroup.visible = false;
			this.titleGroup.visible = true;
			Title.ins().curSelectRole = 0;
			this.roleSelect.hideRole();
			if (Title.ins().list == null)
				Title.ins().sendGetList();
			else
				this.updateList();
		}
	}

	//时装数据
	private update(): void {
		if (this.curRole == null)
			this.curRole = 0;
		if (this.selectIndex == null)
			this.selectIndex = 0;
		let model: Dress = Dress.ins();
		this.listInfo = [];
		for (let k in GlobalConfig.ZhuangBanId) {
			if (SubRoles.ins().getSubRoleByIndex(this.curRole).job == GlobalConfig.ZhuangBanId[k].roletype && ((this.selectIndex + 1) == GlobalConfig.ZhuangBanId[k].pos)) {
				let info: DressItemInfo = new DressItemInfo();
				info.zhuanban = GlobalConfig.ZhuangBanId[k];
				info.lv = 0;
				let id = info.zhuanban.id;
				if (model.timeInfo[id]) {
					info.timer = model.timeInfo[id].invalidtime;
					info.lv = model.timeInfo[id].lv;
				}

				if (model.posInfo.length > this.curRole && id == model.posInfo[this.curRole].posAry[this.selectIndex])
					info.isDress = true;
				this.listInfo.push(info);
			}
		}
		this.listInfo.sort(this.sortList);
		this.arry.replaceAll(this.listInfo);
		this.list.dataProvider = this.arry;
		this.onInfoUpdate();
		this.redPoint();
		this.careerRedPoint();
		if(this.listId != -1){
			let index = this.listSelectIndex(this.listId);
			this.list.selectedIndex = index;
			this.list.scrollH = 110 * index;
		}
	}

	private sortList(a: DressItemInfo, b: DressItemInfo): number {
		if (a.zhuanban.sort < b.zhuanban.sort)
			return -1;
		if (a.zhuanban.sort > b.zhuanban.sort)
			return 1;
		return 0;
	}

	//角色红点
	private redPoint() {
		for (let i: number = 0; i < SubRoles.ins().subRolesLen; i++) {
			let isOpen = Dress.ins().canDress(SubRoles.ins().getSubRoleByIndex(i).job, this.tab.selectedIndex + 1);
			this.roleSelect.showRedPoint(i, isOpen);
		}
	}

	private dress: DressItemInfo

	//信息更新
	private onInfoUpdate(data: DressItemInfo = null): void {
		if (data == null) {
			if (this.list.selectedIndex == -1) this.list.selectedIndex = 0;
			this.dress = this.list.selectedItem;
			this.powerPanel.setPower(0);
		}
		else
			this.dress = data;
		this.attrLv.visible = true;
		this.attrLv.text = "";

		if (this.dress) {
			this.selectGroup.visible = true;
			this.unSelectGroup.visible = false;

			let attr: AttributeData[] = this.dress.zhuanban.attr;
			if (this.dress.lv > 1) {
				let config = GlobalConfig.ZhuangBanLevelUp[this.dress.zhuanban.id][this.dress.lv];
				attr = AttributeData.AttrAddition(attr, config.attr);
			}

			this.attrLabel.text = AttributeData.getAttStr(AttributeData.transformAttr(attr), 0, 1, ":");
			let desc = this.getSlotDesc(this.dress.zhuanban.id);
			this.attrLabel.text += desc ? `\n${desc}` : "";

			//翅膀时装百分比
			if (this.dress.zhuanban.wing_attr_per > 0) {
				this.attrLabel.text += `\n羽翼基础属性：${Math.floor(this.dress.zhuanban.wing_attr_per / 100)}%`;
				let lvAttrs: AttributeData[] = [];
				let wingData: WingsData = SubRoles.ins().getSubRoleByIndex(this.curRole).wingsData;
				let wingLv: number = wingData ? wingData.lv : 0;
				wingLv = wingLv >= 0 ? wingLv : 0;
				let tempConfig: AttributeData[] = GlobalConfig.WingLevelConfig[wingLv].attr;
				let len: number = tempConfig.length;
				for (let i: number = 0; i < len; i++)
					lvAttrs.push(new AttributeData(tempConfig[i].type, Math.floor(tempConfig[i].value * this.dress.zhuanban.wing_attr_per / 10000)));

				attr = AttributeData.AttrAddition(attr, lvAttrs);
			}

			if (this.isCanLevelUp(this.dress) && !this.isMaxLevel(this.dress)) {
				let nextLv = this.dress.lv + 1;
				let conf = GlobalConfig.ZhuangBanLevelUp[this.dress.zhuanban.id];
				let attr1 = conf[nextLv].attr;
				if (conf[this.dress.lv]) {
					attr1 = AttributeData.AttrDel(attr1, conf[this.dress.lv].attr);
				}
				let str = "";
				for (let i = 0; i < attr1.length; i++) {
					str += `升级+${attr1[i].value}\n`;
				}
				let index: number = str.lastIndexOf("\n");
				str = str.substring(0, index);
				this.attrLv.text = str;
			}

			let power: number = UserBag.getAttrPower(AttributeData.transformAttr(attr));
			power += this.dress.zhuanban.exPower ? this.dress.zhuanban.exPower : 0;
			this.powerPanel.setPower(power);

			// this.nameImage.source = "dress" + this.dress.zhuanban.id + "n_png";
			this.namelabel.visible = false;
			this.itemName.visible = false;
			this.dressName.text = "属性-" + this.dress.zhuanban.name;

			this.dressBtn.enabled = true;
			//已激活
			if (this.dress.lv) {
				if (!this.isCanLevelUp(this.dress)) {
					this.namelabel.visible = false;
					this.itemName.visible = false;
					this.dressBtn.visible = true;
					this.dressBtn2.visible = false;
					if (this.dress.isDress) {
						this.dressBtn.label = `脱 下`;
					} else {
						this.dressBtn.label = `幻 化`;
					}
				} else {
					this.dressBtn.visible = true;
					this.dressBtn2.visible = true;
					if (this.isMaxLevel(this.dress)) {
						this.namelabel.visible = false;
						this.itemName.visible = false;
						this.dressBtn.label = `已满级`;
						this.dressBtn.enabled = false;
					} else {
						this.namelabel.visible = true;
						this.itemName.visible = true;
						this.dressBtn.label = `升 级`;

						let nextLv = this.dress.lv + 1;
						let config = GlobalConfig.ZhuangBanLevelUp[this.dress.zhuanban.id][nextLv];
						this.id = config.cost["itemId"]
						this.num = config.cost["num"];
						let str: string;
						if (UserBag.ins().getBagGoodsCountById(0, this.id) >= this.num)
							str = "<font color = '#23C42A'><u>" + GlobalConfig.ItemConfig[this.id].name + "×" + this.num + "</u></font>";
						else {
							str = "<font color = '#f3311e'><u>" + GlobalConfig.ItemConfig[this.id].name + "×" + this.num + "</u></font>";
						}
						this.itemName.textFlow = new egret.HtmlTextParser().parser(str);
					}
					if (this.dress.isDress) {
						this.dressBtn2.label = `脱 下`;
					} else {
						this.dressBtn2.label = `幻 化`;
					}
				}
			}
			else { //未激活
				this.dressBtn.label = "激 活";
				this.namelabel.visible = true;
				this.itemName.visible = true;
				this.dressBtn.visible = true;
				this.dressBtn2.visible = false;
				this.id = this.dress.zhuanban.cost["itemId"]
				this.num = this.dress.zhuanban.cost["num"];
				let str: string;
				if (UserBag.ins().getBagGoodsCountById(0, this.id) >= this.num)
					str = "<font color = '#23C42A'><u>" + GlobalConfig.ItemConfig[this.id].name + "×" + this.num + "</u></font>";
				else {
					str = "<font color = '#f3311e'><u>" + GlobalConfig.ItemConfig[this.id].name + "×" + this.num + "</u></font>";
				}
				this.itemName.textFlow = new egret.HtmlTextParser().parser(str);
			}

			this.onupdateEquip(false);
		} else {
			this.selectGroup.visible = false;
			this.unSelectGroup.visible = true;
			this.onupdateEquip(true);
		}
		// this.updatePower();
	}

	private isCanLevelUp(info: DressItemInfo): boolean {
		let id = info.zhuanban.id;
		if (GlobalConfig.ZhuangBanLevelUp[id])
			return true;
		return false;
	}

	private isMaxLevel(info: DressItemInfo): boolean {
		let nextLv = info.lv + 1;
		let id = info.zhuanban.id;
		if (GlobalConfig.ZhuangBanLevelUp[id] && GlobalConfig.ZhuangBanLevelUp[id][nextLv])
			return false;
		return true;
	}

	// //计算战斗力
	// private updatePower(): void {
	// 	let info: DressTimeInfo[] = Dress.ins().timeInfo;
	// 	this._totalPower = 0;
	// 	for (let i: number = 0; i < info.length; i++) {
	// 		if (SubRoles.ins().getSubRoleByIndex(this.curRole).job == this.getZhuangbanById(info[i].dressId).roletype)
	// 			this._totalPower += UserBag.getAttrPower(AttributeData.transformAttr(this.getZhuangbanById(info[i].dressId).attr));
	// 	}
	// 	// BitmapNumber.ins().changeNum(this.totalPower, this._totalPower, "8", 0);
	// 	this.powerPanel.setPower(this._totalPower);
	// }

	private lastBody: number;
	private lastWeapon: number;
	private lastWing: number;

	//角色装扮显示更新
	private onupdateEquip(isshowjichu: boolean = false): void {
		let model: Role = SubRoles.ins().getSubRoleByIndex(this.curRole);
		let info: DressPosInfo = Dress.ins().getModelPosId(this.curRole);
		if (!info || !info.posAry || info.posAry.length <= 0) {
			debug.log(this.listInfo);
			let tempInfo: DressItemInfo = this.listInfo[0];
			if (tempInfo.zhuanban.pos == 1) {
				this.setEquip(model, tempInfo.zhuanban.id, this.lastWeapon)
				this.lastBody = tempInfo.zhuanban.id;
			} else if (tempInfo.zhuanban.pos == 2) {
				this.setEquip(model, this.lastBody, tempInfo.zhuanban.id)
				this.lastWeapon = tempInfo.zhuanban.id;
			} else {
				this.setWing(tempInfo.zhuanban.id);
				this.lastWing = tempInfo.zhuanban.id;
			}
			// this.setEquip(model, this.dress.zhuanban.id, this.dress.zhuanban.id)
			debug.log("没有时装数据。。。。。。。。。。。。。。。。")
			return
		}
		if (isshowjichu) {//显示当前角色装扮
			this.setWing(info.posAry[2]);
			this.setEquip(model, info.posAry[0], info.posAry[1])
		} else {
			if (this.dress.zhuanban.pos == 3) {
				this.setWing(this.dress.zhuanban.id);
				this.setEquip(model, this.lastBody || info.posAry[0], this.lastWeapon || info.posAry[1])
				this.lastWing = this.dress.zhuanban.id;
			} else if (this.dress.zhuanban.pos == 1) {
				this.setEquip(model, this.dress.zhuanban.id, this.lastWeapon || info.posAry[1])
				this.lastBody = this.dress.zhuanban.id;
			}
			else {
				this.setEquip(model, this.lastBody || info.posAry[0], this.dress.zhuanban.id);
				this.lastWeapon = this.dress.zhuanban.id;
			}
		}
	}

	//设置翅膀
	protected setWing(wingId: number): void {
		let wingdata: WingsData = SubRoles.ins().getSubRoleByIndex(this.curRole).wingsData;
		if (wingId > 0)
			this.wingImg.source = this.getZhuangbanById(wingId).res + "_png";
		else if (wingdata.openStatus) {
			this.wingImg.source = GlobalConfig.WingLevelConfig[wingdata.lv].appearance + "_png";
		} else {
			this.wingImg.source = "";
		}
		// debug.log("wwwwwwwwwww:::"+this.getZhuangbanById(wingId).res)
	}

	/** 设置装备 */
	protected setEquip(role: Role, bodyId: number, weaponId: number): void {
		if (!role)
			return;
		let equipData: EquipsData[] = role.equipsData;
		let isHaveBody: boolean;
		this.weaponImg.source = "";
		for (let i = 0; i < equipData.length; i++) {
			let element: EquipsData = equipData[i];

			if (i == 0 || i == 2) {
				let id: number = equipData[i].item.configID;
				if (id > 0) {
					let fileName: string = GlobalConfig.EquipConfig[id].appearance;
					if (fileName && fileName.indexOf("[job]") > -1)
						fileName = fileName.replace("[job]", role.job + "");
					if (i == 0) {
						this.weaponImg.source = fileName + "_" + role.sex + "_c_png";
					}
					else {
						this.bodyImg.source = fileName + "_" + role.sex + "_c_png";
						isHaveBody = true;
					}
				}
			}
		}
		if (!isHaveBody)
			this.bodyImg.source = `body000_${role.sex}_c_png`;
		if (weaponId > 0)
			this.weaponImg.source = this.getZhuangbanById(weaponId).res + "_" + role.sex + "_c_png";
		if (bodyId > 0)
			this.bodyImg.source = this.getZhuangbanById(bodyId).res + "_" + role.sex + "_c_png";
	}

	private getZhuangbanById(id: number): ZhuangBanId {
		for (let k in GlobalConfig.ZhuangBanId) {
			if (GlobalConfig.ZhuangBanId[k].id == id)
				return GlobalConfig.ZhuangBanId[k];
		}
		return null;
	}

	//激活并幻化
	private onJihuo(): void {
		Dress.ins().sendDressUserReq(this.curRole, this.dress.zhuanban.id);
	}

	private onClick(e: egret.TouchEvent): void {
		switch (e.target) {
			case this.closeBtn:
			// case this.closeBtn0:
				ViewManager.ins().close(DressWin);
				break;
			case this.help:
				ViewManager.ins().open(ZsBossRuleSpeak, 9);
				break;
			case this.itemName:
				let itemconfig: ItemConfig = GlobalConfig.ItemConfig[this.id];
				let type = ItemConfig.getType(itemconfig);
				if (itemconfig != undefined && itemconfig && type != undefined) {
					if (type == 0 || type == 4) {
						ViewManager.ins().open(EquipDetailedWin, 1, undefined, itemconfig.id);
					} else {
						ViewManager.ins().open(ItemDetailedWin, 0, itemconfig.id);
					}
				}
				break;
			case this.dressBtn2:
				if (this.dressBtn2.label == "幻 化") {
					Dress.ins().sendDressUserReq(this.curRole, this.dress.zhuanban.id);
				} else {
					Dress.ins().sendUnDressUserReq(this.curRole, this.dress.zhuanban.id);
				}
				break;
			case this.dressBtn:
				if (!this.dress || !this.dress.zhuanban) {
					debug.log(DressWin, "DressWin　　" + this.dress + " ++++++ ");
					return;
				}
				if (this.dressBtn.label == "激 活") {
					if (UserBag.ins().getBagGoodsCountById(0, this.id) < this.num) {
						UserTips.ins().showTips("|C:0xf3311e&T:激活道具不足|");
						return;
					}
					if (this.dress.zhuanban.pos == 3 && Actor.level < 16) {
						UserTips.ins().showTips("16级开启羽翼后可激活");
						return;
					}
					let jobNumberToName = {
						0: "通用",
						1: "战士",
						2: "法师",
						3: "道士",
					};
					let posAry: string[] = GlobalConfig.ZhuangBanConfig.zhuangbanpos;
					WarnWin.show(`确定要激活<font color='#35e62d'>${jobNumberToName[this.dress.zhuanban.roletype] + posAry[this.dress.zhuanban.pos - 1]}</font>装扮${this.dress.zhuanban.name}吗?`, () => {
						Dress.ins().sendDressActivationReq(this.dress.zhuanban.id)
					}, this);
				} else if (this.dressBtn.label == "幻 化") {
					Dress.ins().sendDressUserReq(this.curRole, this.dress.zhuanban.id);
				} else if (this.dressBtn.label == `升 级`) {
					if (UserBag.ins().getBagGoodsCountById(0, this.id) < this.num) {
						UserTips.ins().showTips("|C:0xf3311e&T:升级道具不足|");
						return;
					}
					Dress.ins().sendLevelUp(this.dress.zhuanban.id);
				} else if (this.dressBtn.label == `脱 下`) {
					Dress.ins().sendUnDressUserReq(this.curRole, this.dress.zhuanban.id);
				}
				break;
		}
	}

	/**
	 * 请求带上或卸下称号
	 */
	private useTitle(info: TitleInfo): void {
		//带上
		if (info.config.Id != Title.ins().showTitleDic[Title.ins().curSelectRole]) {
			//检查职业
			if (!info.config.job || info.config.job == SubRoles.ins().getSubRoleByIndex(this.roleSelect.getCurRole()).job)
				Title.ins().setTitle(this.roleSelect0.getCurRole(), info.config.Id);
			else
				UserTips.ins().showTips('职业不符');
		}
		//卸下
		else {
			Title.ins().setTitle(Title.ins().curSelectRole, 0);
		}
	}

	/**
	 * 更新列表
	 */
	private updateList(): void {
		this.titleList.dataProvider = Title.ins().list;
		Title.ins().list.refresh();
	}

	/**
	 * 更新设置的称号
	 */
	private updateShow(param: Array<any>): void {
		let roleIndex: number, titleID: number, lastID: number;
		roleIndex = param[0];
		titleID = param[1];
		lastID = param[2];
		// if (roleIndex != Title.ins().useRole)
		// 	return;
		//更换，只刷新两个项
		if (titleID > 0 == lastID > 0) {
			this.updateItemByID(lastID);
			this.updateItemByID(titleID);
		}
		//带上、卸下，刷新所有已得到的称号
		else {
			for (let id in Title.ins().timeDict) {
				this.updateItemByID(Number(id));
			}
		}
	}

	/**
	 * 更新指定称号的列表项
	 */
	private updateItemByID(titleID: number): void {
		if (!(titleID in Title.ins().infoDict))
			return;
		let info: TitleInfo = Title.ins().infoDict[titleID];
		Title.ins().list.itemUpdated(info);
	}

	/**
	 * 部位百分比属性加成显示
	 * @param 装扮id
	 * */
	private getSlotDesc(id: number): string {
		let zbconfig: ZhuangBanId = GlobalConfig.ZhuangBanId[id];
		if (!zbconfig || !zbconfig.attr_precent) return "";
		let str = "";
		for (let i = 0; i < zbconfig.attr_precent.length; i++) {
			switch (zbconfig.attr_precent[i].pos) {
				case EquipPos.WEAPON:
					str = `武器`;
					break;
				case EquipPos.HEAD:
					str = `头盔`;
					break;
				case EquipPos.CLOTHES:
					str = `衣服`;
					break;
				case EquipPos.NECKLACE:
					str = `项链`;
					break;
				case EquipPos.Wrist:
					str = `手镯`;
					break;
				case EquipPos.BRACELET:
					str = `腰带`;
					break;
				case EquipPos.RING:
					str = `戒指`;
					break;
				case EquipPos.SHOE:
					str = `鞋子`;
					break;
			}
			str += `基础属性+${Math.floor(zbconfig.attr_precent[i].pre / 100)}%\n`;
		}
		if (str) {
			let index: number = str.lastIndexOf("\n");
			str = str.substring(0, index);
		}
		return str;

	}
}

ViewManager.ins().reg(DressWin, LayerManager.UI_Main);