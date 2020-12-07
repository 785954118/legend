/**
 * 魂玉界面
 */
class HunyuWin extends BaseEuiView {
	private roleId:number;
	private itemId:number;
	private kong:number;

	// private equip:eui.Component;
	//equip0~equip4
	private powerPanel0:PowerPanel;

	private name0:eui.Label;
	private att0:eui.Label;
	private name1:eui.Label;//max名
	private att1:eui.Label;//max属性
	private icon0:eui.Image;//激活材料icon
	private executeBtn0:eui.Button;//激活
	private countLabel0:eui.Label;//激活消耗描述
	private icon1:eui.Image;//激活材料icon
	private executeBtn:eui.Button;//升级
	private countLabel1:eui.Label;//升级消耗描述
	private getItemTxt0:eui.Label;//获取道具

	private curname:eui.Label;
	private nextname:eui.Label;
	private curAtt0:eui.Label;
	private nextAtt0:eui.Label;
	private bgClose:eui.Rect;
	private actRMB:boolean;
	public constructor() {
		super();
		this.skinName = "hunguJewelSkin";
		this.isTopLevel = true;
	}
	protected childrenCreated() {


	}
	public close(...param: any[]): void {

	}
	public open(...param: any[]): void {
		ViewManager.ins().close(HunguTipsWin);
		this.addTouchEvent(this.executeBtn0, this.onTap);
		this.addTouchEvent(this.executeBtn, this.onTap);
		this.addTouchEvent(this.getItemTxt0, this.onTap);
		this.addTouchEvent(this.bgClose, this.onTap);
		this.observe(Hungu.ins().postHunyu,this.updateShow);
		this.observe(Hungu.ins().postHunyu,this.playEff);
		for( let i = 0; i < GlobalConfig.HunGuConf.hunyuCount;i++ ){
			this.addTouchEvent(this[`equip${i}`], this.onSelect);
		}
		this.roleId = param[0];
		this.itemId = param[1];
		this.kong = param[2]||0;
		this["equip" + this.kong].select.visible = true;
		this.updateShow();
	}
	private onSelect(e: egret.TouchEvent): void {
		for (let i = 0; i < GlobalConfig.HunGuConf.hunyuCount; i++) {
			let equipItem = this["equip" + i];
			equipItem.select.visible = false;
			if( equipItem && e.currentTarget == equipItem){
				let config:ItemConfig = GlobalConfig.ItemConfig[this.itemId];
				let pos = ItemConfig.getSubType(config);
				if( i+1 > GlobalConfig.HunGuEquip[Hungu.ins().hunguData[this.roleId].items[pos].itemId].hunyuNum ){
					let qualityName = Hungu.ins().getHunguItemQualityName(0,i+1);
					if( qualityName )
						UserTips.ins().showTips(`融合${qualityName}魂骨后开启`);
					this["equip" + this.kong].select.visible = true;//选中复位
				}
				else if( this.kong != i ){
					equipItem.select.visible = true;
					this.kong = i;
					this.updateShow();
				}else{
					equipItem.select.visible = true;
				}
			}
		}
	}
	private updateShow(){
		this.updateAct();
		this.updateUI();
		this.getItemTxt0.textFlow = TextFlowMaker.generateTextFlow1(`|U:&T:${this.getItemTxt0.text}`);
	}
	/**魂玉升级播放特效*/
	private playEff(){
		let hyequipItem = this[`equip${this.kong}`];
		if( hyequipItem ){
			let mc = new MovieClip();
			mc.playFile(RES_DIR_EFF + "forgeSuccess",1);
			hyequipItem.eff.addChild(mc);
		}
	}
	private updateUI(){
		this.hide();
		this.updateItems();
	}
	private updateItems(){
		//魂骨装备
		let equipItem = this[`equip`];//EquipItem
		let itemIcon = equipItem.itemIcon;
		let config:ItemConfig = GlobalConfig.ItemConfig[this.itemId];
		itemIcon.setData(config);
		let pos = ItemConfig.getSubType(config);
		let ins = Hungu.ins();
		//魂玉
		for( let i = 0;i < GlobalConfig.HunGuConf.hunyuCount;i++ ){
			let hyequipItem = this[`equip${i}`];//hunyuItem
			let openText = hyequipItem.openText;
			if( !hyequipItem )continue;
			let b = ins.getHunyuKongRedPoint(this.roleId,pos,i);
			hyequipItem.redPoint.visible = b;
			let hyitemIcon = hyequipItem.itemIcon;//HunguItemIcon
			// hyitemIcon.iconBg.source = "hunyuHole";//圆底框
			hyitemIcon.icon.visible = false;
			hyequipItem.kejihuo.visible = false;
			hyitemIcon.lock.visible = false;
			openText.visible = false;
			hyequipItem.level.visible = false;
			hyequipItem.lvBg.visible = true;
			let hunyuNum = GlobalConfig.HunGuEquip[ins.hunguData[this.roleId].items[pos].itemId].hunyuNum;
			if( i+1 > hunyuNum ){
				hyitemIcon.lock.visible = true;//锁
				if( i == hunyuNum ){
					openText.visible = true;
					let qualityName = Hungu.ins().getHunguItemQualityName(0,i+1);
					if( qualityName )
						openText.text = `${qualityName}开启`;
				}else{
					hyequipItem.lvBg.visible = false;
				}
			}
			else{
				hyequipItem.level.visible = true;
				hyitemIcon.icon.visible = true;
				let hylv = ins.hunguData[this.roleId].items[pos].hunyu[i];
				if( hylv ){
					//已激活
					let hyt = GlobalConfig.HunGuConf.hunyuType[pos][i];
					hyitemIcon.icon.source = GlobalConfig.HunYuEquip[hyt][hylv].icon;
					hyequipItem.level.text = `${hylv}级`;
				}else{
					hyequipItem.level.text = `${0}级`;
					//未激活
					if( b ){
						//显示可激活
						hyequipItem.kejihuo.visible = true;
						hyitemIcon.icon.visible = false;
						hyequipItem.lvBg.visible = false;
						hyequipItem.level.visible = false;
					}
				}
			}
		}

		//魂玉战力计算
		let power = 0;
		if( ins.hunguData[this.roleId] && ins.hunguData[this.roleId].items[pos].hunyu ){
			let hyT = GlobalConfig.HunGuConf.hunyuType[pos][this.kong];
			for( let i = 0;i < ins.hunguData[this.roleId].items[pos].hunyu.length;i++ ){
				let lv = ins.hunguData[this.roleId].items[pos].hunyu[i];
				let hyequip:HunYuEquip = GlobalConfig.HunYuEquip[hyT][lv];
				if( hyequip ){
					power += UserBag.getAttrPower(hyequip.attrs,SubRoles.ins().getSubRoleByIndex(this.roleId));
					let expower = hyequip.expower?hyequip.expower:0;
					power += expower;
				}
			}
		}
		this.powerPanel0.setPower(power);

		//消耗
		let hyType = GlobalConfig.HunGuConf.hunyuType[pos][this.kong];
		if( this.currentState == "activation" ){//未激活
			let config = GlobalConfig.HunYuEquip[hyType][1];
			let costYb = GlobalConfig.HunGuConf.unlockCost[this.kong+1];
			let color = ColorUtil.RED_COLOR_N;
			if( !this.kong && config.cost ){
				this.actRMB = false;
				costYb = config.cost.count;
				let itemData = UserBag.ins().getBagItemById(config.cost.id);
				let myCount = itemData?itemData.count:0;
				if( myCount >= costYb )
					color = ColorUtil.GREEN_COLOR_N;
				this.icon0.source = GlobalConfig.ItemConfig[config.cost.id].icon + "_png";
				this.countLabel0.textFlow = TextFlowMaker.generateTextFlow1(`|C:${color}&T:${myCount}|/${costYb}`);
			}else{
				this.actRMB = true;
				this.icon0.source = "szyuanbao";
				if( Actor.yb >= costYb )
					color = ColorUtil.GREEN_COLOR_N;
				this.countLabel0.textFlow = TextFlowMaker.generateTextFlow1(`|C:${color}&T:${Actor.yb}|/${costYb}`);
			}

			this.name0.textFlow = TextFlowMaker.generateTextFlow1(GlobalConfig.HunYuEquip[hyType][1].name);
			this.att0.text = AttributeData.getAttStr(GlobalConfig.HunYuEquip[hyType][1].attrs,1);
		}else if( this.currentState == "max" ){//满级
			let lv = ins.hunguData[this.roleId].items[pos].hunyu[this.kong];
			this.name1.textFlow = TextFlowMaker.generateTextFlow1(GlobalConfig.HunYuEquip[hyType][lv].name);
			this.att1.text = AttributeData.getAttStr(GlobalConfig.HunYuEquip[hyType][lv].attrs,1);
		}else{//升级
			let lv = ins.hunguData[this.roleId].items[pos].hunyu[this.kong];
			this.curname.textFlow = TextFlowMaker.generateTextFlow1(GlobalConfig.HunYuEquip[hyType][lv].name);
			this.curAtt0.text = AttributeData.getAttStr(GlobalConfig.HunYuEquip[hyType][lv].attrs,1);
			this.nextname.textFlow = TextFlowMaker.generateTextFlow1(GlobalConfig.HunYuEquip[hyType][lv+1].name);
			this.nextAtt0.text = AttributeData.getAttStr(GlobalConfig.HunYuEquip[hyType][lv+1].attrs,1);
			let hycfg = Hungu.ins().getNextHunyuLvConfig(this.roleId,pos,this.kong);
			if(hycfg){
				let color = ColorUtil.RED_COLOR_N;
				let total = hycfg.cost.count;
				let itemData = UserBag.ins().getBagItemById(hycfg.cost.id);
				let curCount = itemData?itemData.count:0;
				if( curCount >= total )
					color = ColorUtil.GREEN_COLOR_N;
				this.countLabel1.textFlow = TextFlowMaker.generateTextFlow1(`|C:${color}&T:${curCount}|/${total}`);
				this.icon1.source = `${GlobalConfig.ItemConfig[hycfg.cost.id].icon}_png`;
			}

		}


	}
	//隐藏不必要的组件
	private hide(){
		let equipItem = this[`equip`];
		let itemIcon: ItemIcon = equipItem.itemIcon;
		// itemIcon.imgJob.visible = false;
		equipItem.level.visible = false;
		for( let i = 0;i < GlobalConfig.HunGuConf.hunyuCount;i++ ){
			let hyequipItem = this[`equip${i}`];
			itemIcon = hyequipItem.itemIcon;//HunguItemIcon
			hyequipItem.level.visible = false;
		}
	}

	private updateAct(){
		let ins = Hungu.ins();
		let config:ItemConfig = GlobalConfig.ItemConfig[this.itemId];
		let pos = ItemConfig.getSubType(config);
		if( !ins.hunguData[this.roleId] || !ins.hunguData[this.roleId].items[pos].hunyu[this.kong] ){
			this.currentState = "activation";
		}else{
			let hyType = GlobalConfig.HunGuConf.hunyuType[pos][this.kong];
			let lv = ins.hunguData[this.roleId].items[pos].hunyu[this.kong];
			if( lv >= CommonUtils.getObjectLength(GlobalConfig.HunYuEquip[hyType]) ){
				this.currentState = "max";
			}else{
				this.currentState = "upgrade";
			}
		}
		this.validateNow();
	}
	private onTap(e: egret.TouchEvent): void {
		switch (e.currentTarget){
			case this.executeBtn0://激活
				if( this.currentState == "activation" ){
					if( this.actRMB ){
						let needYb = GlobalConfig.HunGuConf.unlockCost[this.kong+1];
						if( Actor.yb >= needYb ){
							let config:ItemConfig = GlobalConfig.ItemConfig[this.itemId];
							let pos = ItemConfig.getSubType(config);
							Hungu.ins().sendHunyu(this.roleId,pos,this.kong+1);
						}else{
							UserTips.ins().showTips(`元宝不足`);
						}
					}else{
						let cfg:ItemConfig = GlobalConfig.ItemConfig[this.itemId];
						let ps = ItemConfig.getSubType(cfg);
						let hyt = GlobalConfig.HunGuConf.hunyuType[ps][this.kong];
						let hyeq = GlobalConfig.HunYuEquip[hyt][1];
						let itemData = UserBag.ins().getBagItemById(hyeq.cost.id);
						let myCount = itemData?itemData.count:0;
						if( myCount >= hyeq.cost.count ){
							Hungu.ins().sendHunyu(this.roleId,ps,this.kong+1);
						}else{
							UserTips.ins().showTips(`材料不足`);
						}
					}
				}else{
					UserTips.ins().showTips(`非可激活状态`);
				}
				break;
			case this.executeBtn://升级
				if( this.currentState == "upgrade" ){
					let config:ItemConfig = GlobalConfig.ItemConfig[this.itemId];
					let pos = ItemConfig.getSubType(config);
					// let hyType = GlobalConfig.HunGuConf.hunyuType[pos][this.kong];
					// let lv = Hungu.ins().hunguData[this.roleId].items[pos].hunyu[this.kong];
					let hyequip:HunYuEquip = Hungu.ins().getNextHunyuLvConfig(this.roleId,pos,this.kong);//GlobalConfig.HunYuEquip[hyType][lv];
					if( hyequip && hyequip.cost ){
						let itemData: ItemData = UserBag.ins().getBagItemById(hyequip.cost.id);
						let mycount = itemData?itemData.count:0;
						if( mycount >= hyequip.cost.count ){
							Hungu.ins().sendHunyu(this.roleId,pos,this.kong+1);
						}else{
							UserTips.ins().showTips(`材料不足`);
						}
					}else{
						UserTips.ins().showTips(`魂玉消耗数据异常`);
					}
				}else{
					UserTips.ins().showTips(`非可升级状态`);
				}
				break;
			case this.getItemTxt0://获取道具
				if( this.currentState == "upgrade" ){
					let config:ItemConfig = GlobalConfig.ItemConfig[this.itemId];
					let pos = ItemConfig.getSubType(config);
					let hyType = GlobalConfig.HunGuConf.hunyuType[pos][this.kong];
					let lv = Hungu.ins().hunguData[this.roleId].items[pos].hunyu[this.kong];
					let hyequip:HunYuEquip = GlobalConfig.HunYuEquip[hyType][lv+1];
					if( hyequip && hyequip.cost ){
						UserWarn.ins().setBuyGoodsWarn(hyequip.cost.id);
					}
				}else{
					UserTips.ins().showTips(`非获取道具状态`);
				}
				break;
			case this.bgClose:
				ViewManager.ins().close(this);
				break;
		}
	}


}
ViewManager.ins().reg(HunyuWin, LayerManager.UI_Main);