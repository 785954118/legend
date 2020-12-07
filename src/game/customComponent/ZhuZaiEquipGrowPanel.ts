/**
 * Created by Administrator on 2016/7/28.
 */
class ZhuZaiEquipGrowPanel extends BaseComponent {
	public upgradeBtn0: eui.Button;

	public roleSelectPanel: RoleSelectPanel;

	public tab: eui.ToggleButton[];
	public selectIndex: number;

	/** 当前属性 */
	public curAtt: eui.Label;
	/** 下级属性 */
	public nextAtt: eui.Label;
	/** 等级需求 */
	public useTxt: eui.Label;
	/** 消耗材料 */
	public useTxt0: eui.Label;
	/** 消耗材料标题 */
	public countTxt0: eui.Label;
	/** 成功几率 */
	public useTxt1: eui.Label;
	/** 获得材料 */
	public link: eui.Label;
	/** 战斗力 */
	protected totalPower: egret.DisplayObjectContainer;

	private star: StarList;

	private inited: boolean;

	constructor() {
		super();
	}

	public childrenCreated(): void {
	}

	public initUI(): void {

		this.tab = [];
		for (let i: number = 0; i < 4; i++)
			this.tab.push(this['tab' + i]);

		this.link.textFlow = new egret.HtmlTextParser().parser(`<u>获得材料</u>`);

		this.totalPower = BitmapNumber.ins().createNumPic(0, "1");
		this.totalPower.x = 185;
		this.totalPower.y = 128;
		this.addChild(this.totalPower);


		this.tab[0].selected = true;
		this.selectIndex = 0;

		this.star = new StarList(5, 0);
		this.star.x = 150;
		this.star.y = 290;
		this.addChild(this.star);

		this.inited = true;
	}


	public open(...param: any[]): void {
		if (!this.inited)
			this.initUI();

		this.roleSelectPanel.getCurRole = param && param.length ? param[0] : 0;
		this.setEquipPoint();
		this.setSelect(param && param.length ? param[1] : 0);
		//this.setData();

		this.addTouchEvent(this.link, this.onClick);
		this.addTouchEvent(this.upgradeBtn0, this.onClick);
		this.addChangeEvent(this.roleSelectPanel, this.onChange);
		for (let i: number = 0; i < this.tab.length; i++) {
			this.addTouchEvent(this.tab[i], this.onClick);
		}

		this.observe(ZhuzaiEquip.ins().postZhuZaiData, this.update);
	}

	public close(...param: any[]): void {
		this.removeTouchEvent(this.link, this.onClick);
		this.removeTouchEvent(this.upgradeBtn0, this.onClick);
		this.roleSelectPanel.removeEventListener(egret.Event.CHANGE, this.onChange, this);
		for (let i: number = 0; this.tab && i < this.tab.length; i++) {
			this.removeTouchEvent(this.tab[i], this.onClick);
		}
		this.removeObserve();
	}

	private update(): void {

		this.setEquipPoint();
		this.setData();
	}

	private onChange(e: egret.Event): void {
		//this.setRoleId(this.roleSelect.curRole);
		(<ZhuZaiEquipWin>this.parent.parent).selectRole = this.roleSelectPanel.getCurRole();
		this.update();
	}

	private setData(): void {

		let index: number = this.selectIndex + 1;
		let roleIndex: number = this.roleSelectPanel.getCurRole();
		let role: Role = SubRoles.ins().getSubRoleByIndex(roleIndex);
		let data: ZhuZaiData = role.getZhuZaiDataByIndex(this.selectIndex);
		let lv: number = data.lv;

		let config: EquipPointGrowUpConfig = GlobalConfig.EquipPointGrowUpConfig[index][lv];
		let nextConfig: EquipPointGrowUpConfig = GlobalConfig.EquipPointGrowUpConfig[index][lv + 1];

		let needLv: number = config.needLevel;
		this.useTxt.text = (needLv / 1000 >> 0) + "转";
		let l: number = UserZs.ins().lv * 1000 + Actor.level;
		this.useTxt.textColor = l < needLv ? 0xf3311e : 0x2ECA22;

		this.currentState = data.isMaxLevel() ? "max" : "normal";

		this.curAtt.text = AttributeData.getAttStr(config.attrs, 1);
		if (nextConfig)
			this.nextAtt.text = AttributeData.getAttStr(nextConfig.attrs, 1);

		let itemID: number = config.growUpItem.id;
		let count: number = UserBag.ins().getBagGoodsCountById(0, itemID);
		this.useTxt0.text = count + " / " + config.growUpItem.count;
		this.useTxt0.textColor = count < config.growUpItem.count ? 0xf3311e : 0x2ECA22;
		this.countTxt0.text = "消耗" + GlobalConfig.ItemConfig[itemID].name + "：";

		this.useTxt1.text = (config.growUpProbability / 100) + "%";

		this.star.setStarNum(config.star);

		this.upgradeBtn0.label = config.growUpItem.count ? (lv ? "升 星" : "激 活") : "免费升级";

		BitmapNumber.ins().changeNum(this.totalPower, UserBag.getAttrPower(config.attrs), "1");
	}

	private setEquipPoint(): void {
		let config: EquipPointBasicConfig[] = GlobalConfig.EquipPointBasicConfig;
		let i: number = 0;
		for (i = 0; i < this.tab.length; i++) {
			let role: Role = SubRoles.ins().getSubRoleByIndex(this.roleSelectPanel.getCurRole());
			let zhuzaiData: ZhuZaiData = role.getZhuZaiDataByIndex(i);
			this.tab[i].icon = "zzequip_" + (i + 1) + GlobalConfig.EquipPointGrowUpConfig[i + 1][zhuzaiData.lv].rank;
			if (zhuzaiData.growupID) {
				this.tab[i].label = config[i + 1].name;
				this.tab[i]['lvTxt'].text = "+" + zhuzaiData.growupID;
			}
			else {
				this.tab[i].label = (config[i + 1].activationLevel / 1000 >> 0) + "转激活";
				this.tab[i]['lvTxt'].text = "";
			}
			this.tab[i]['redPoint'].visible = zhuzaiData.canLevelup();
		}
		let len: number = SubRoles.ins().subRolesLen;
		for (i = 0; i < len; i++) {
			this.roleSelectPanel.showRedPoint(i, ZhuzaiEquip.ins().canLevelup(i));
		}
	}

	private setSelect(v: number): void {
		for (let i: number = 0; i < this.tab.length; i++) {
			if (i != v)
				this.tab[i].selected = false;
		}
		this.tab[v].selected = true;
		this.selectIndex = v;
		(<ZhuZaiEquipWin>this.parent.parent).select = v;
		this.setData();
	}

	private onClick(e: egret.TouchEvent): void {
		let index: number = this.tab.indexOf(e.currentTarget);
		if (index >= 0) {
			this.setSelect(index);
			return;
		}
		let role: Role = SubRoles.ins().getSubRoleByIndex(this.roleSelectPanel.getCurRole());
		let zhuzaiData: ZhuZaiData = role.getZhuZaiDataByIndex(this.selectIndex);
		let lv: number = zhuzaiData.lv;
		let config: EquipPointGrowUpConfig = GlobalConfig.EquipPointGrowUpConfig[this.selectIndex + 1][lv];
		let itemID: number = config.growUpItem.id;

		switch (e.currentTarget) {

			case this.link:
				UserWarn.ins().setBuyGoodsWarn(itemID, config.growUpItem.count);
				break;

			case this.upgradeBtn0:
				let needZs: number = config.needLevel / 1000 >> 0;
				let needLv: number = config.needLevel % 1000;
				if ((needZs && UserZs.ins().lv < needZs) || (Actor.level < needLv)) {
					UserTips.ins().showTips("转生等级不足");
					return;
				}

				if (UserBag.ins().getBagGoodsCountById(0, itemID) < config.growUpItem.count) {
					UserTips.ins().showTips("道具不足");
					return;
				}
				ZhuzaiEquip.ins().sendGrow(this.roleSelectPanel.getCurRole(), this.selectIndex + 1);
				break;
		}
	}
}