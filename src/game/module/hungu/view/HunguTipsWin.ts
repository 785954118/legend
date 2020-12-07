/**
 * 魂骨tips界面
 */
class HunguTipsWin extends BaseEuiView {
	private nameTxt:eui.Label;
	private equipIcon:ItemIcon;
	private quali:eui.Image;
	private toubuhungu:eui.Label;
	private fanpin:eui.Label;
	private tongyong:eui.Label;
	private powerPanel:PowerPanel;
	//attr1~attr3
	//forgeAttr1~forgeAttr3
	private starAttr:eui.Group;
	//starAttr1~starAttr3

	private bgClose:eui.Button;
	private takeoffBtn:eui.Button;
	private changeBtn:eui.Button;
	private changeRedPoint:eui.Image;
	private hunyuBtn:eui.Button;
	private forgeRedPoint:eui.Image;
	private itemId:number;
	private roleId:number;
	private wear:boolean;
	public constructor() {
		super();
		this.skinName = "hunguTipsSkin";
	}
	protected childrenCreated() {


	}
	public close(...param: any[]): void {

	}
	public open(...param: any[]): void {
		this.currentState = param[0]?"shenshang":"putong";
		this.validateNow();
		this.addTouchEvent(this.bgClose, this.onTap);
		if( this.currentState == "shenshang" ){
			this.addTouchEvent(this.takeoffBtn, this.onTap);
			this.addTouchEvent(this.changeBtn, this.onTap);
			this.addTouchEvent(this.hunyuBtn, this.onTap);
			this.wear = true;
		}
		this.observe(Hungu.ins().postHunguItems,this.HunguItemsCallback);
		this.observe(Hungu.ins().postHunguItemUpgrade,this.HunguItemUpgradeCallback);
		this.roleId = param[1];
		this.itemId = param[2];
		this.updateUI();
	}
	private HunguItemsCallback(){
		ViewManager.ins().close(this);
	}
	private HunguItemUpgradeCallback(){
		let pos = ItemConfig.getSubType(GlobalConfig.ItemConfig[this.itemId]);
		this.itemId = Hungu.ins().hunguData[this.roleId].items[pos].itemId;
		this.updateUI();
	}
	private updateUI(){
		let config = GlobalConfig.ItemConfig[this.itemId];
		this.equipIcon.setData(config);
		let color = ItemConfig.getQualityColor(config);
		this.nameTxt.textFlow = TextFlowMaker.generateTextFlow1(`|C:${color}&T:${config.name}`);
		let q = ItemConfig.getQuality(config);
		this.quali.source = q > 0 ? `quali${q}` : "";
		this.toubuhungu.textFlow = TextFlowMaker.generateTextFlow1(`${Hungu.ins().getHunguPosName(ItemConfig.getSubType(config))}`);
		this.fanpin.textFlow = TextFlowMaker.generateTextFlow1(`${Hungu.ins().getHunguItemQualityName(config.id)}`);
		this.tongyong.textFlow = TextFlowMaker.generateTextFlow1(`${Role.getJobNameByJob(ItemConfig.getJob(config))}`);
		let power = 0;
		let suit = Hungu.ins().getSuitData(this.roleId);
		if(this.wear){
			power += Hungu.ins().getHunguPosPower(this.roleId,ItemConfig.getSubType(config),suit,true);
		}else{
			power += Hungu.ins().getHunguItemPower(config.id);
		}
		this.powerPanel.setPower(power);

		//基础属性
		let jcattrs:AttributeData[] = [];
		let exjcattrs:AttributeData[] = [];
		let hyattrs:AttributeData[] = [];//魂玉属性
		let hgequip: HunGuEquip = GlobalConfig.HunGuEquip[this.itemId];
		for (let j = 0; j < hgequip.attrs.length; j++) {
			let ishave = false;
			for (let z = 0; z < jcattrs.length; z++) {
				if (jcattrs[z].type == hgequip.attrs[j].type) {
					jcattrs[z].value += hgequip.attrs[j].value;
					ishave = true;
					break;
				}
			}
			if (!ishave) {
				jcattrs.push(new AttributeData(hgequip.attrs[j].type, hgequip.attrs[j].value));
			}
		}
		//共鸣提升万分比
		if( this.wear && Hungu.ins().hunguData[this.roleId] ){
			let percent = [];
			for( let i in suit ) {
				for (let j in suit[i]) {
					if( suit[i][j].count.length >= (+j) ){
						let stage = suit[i][j].stage;
						let hgsuit:HunGuSuit = GlobalConfig.HunGuSuit[i][j][stage];
						if( hgsuit && hgsuit.specialAttrs ){
							percent.push(hgsuit.specialAttrs/10000);
						}
					}
				}
			}

			if( percent.length ){
				//计算加成值
				for( let i = 0;i < percent.length;i++ ){
					for( let j = 0;j < jcattrs.length;j++ ){
						exjcattrs.push(new AttributeData(jcattrs[j].type, Math.floor(jcattrs[j].value*percent[i])));
					}
				}
			}
			this.updateRedPoint();//只有通过身上穿戴的入口进入tips才有红点判定
			//魂玉属性
			for(let i = 0;i < Hungu.ins().hunguData[this.roleId].items[ItemConfig.getSubType(config)].hunyu.length;i++ ){
				let lv = Hungu.ins().hunguData[this.roleId].items[ItemConfig.getSubType(config)].hunyu[i];
				let hyType = GlobalConfig.HunGuConf.hunyuType[ItemConfig.getSubType(config)][i];
				let hyequip:HunYuEquip = GlobalConfig.HunYuEquip[hyType][lv];
				if( hyequip ){
					for (let j = 0; j < hyequip.attrs.length; j++) {
						let ishave = false;
						for (let z = 0; z < hyattrs.length; z++) {
							if (hyattrs[z].type == hyequip.attrs[j].type) {
								hyattrs[z].value += hyequip.attrs[j].value;
								ishave = true;
								break;
							}
						}
						if (!ishave) {
							hyattrs.push(new AttributeData(hyequip.attrs[j].type, hyequip.attrs[j].value))
						}
					}
				}
			}
		}

		//计算总值
		let proShowList = [2,4,5,6];
		let idx = 0;
		let hidex = 0;
		for( let i = 0;i < proShowList.length;i++ ){
			if( this[`attr${i}`] && this[`forgeAttr${i}`] ){
				this[`attr${i}`].visible = this[`forgeAttr${i}`].visible = false;
			}
			if( this[`starAttr${i}`] ){
				this[`starAttr${i}`].visible = false;
			}
			if( this[`attr${idx}`] && this[`forgeAttr${idx}`] ){
				this[`attr${idx}`].visible = this[`forgeAttr${idx}`].visible = false;
				for( let j = 0; j < jcattrs.length;j++ ){
					if( jcattrs[j].type == proShowList[i] ){
						this[`attr${idx}`].visible = true;
						this[`attr${idx}`].text = AttributeData.getAttStr(jcattrs[j], 0,1,":");
						if( this.currentState == "shenshang" &&  exjcattrs[j] ){
							this[`forgeAttr${idx}`].visible = true;
							this[`forgeAttr${idx}`].text = `+${exjcattrs[j].value}`;
						}
						break;
					}
				}
				if( this[`attr${idx}`].visible )
					idx++;
				// if( !this[`forgeAttr${i}`].visible ){
				// 	DisplayUtils.removeFromParent(this[`forgeAttr${i}`]);
				// }
				// if( !this[`attr${idx}`].visible ){
				// 	DisplayUtils.removeFromParent(this[`attr${idx}`].parent);
				// }
			}
			if( this[`starAttr${hidex}`] ){
				this[`starAttr${hidex}`].visible = false;
				for( let j = 0; j < hyattrs.length;j++ ){
					if( hyattrs[j].type == proShowList[i] ){
						this[`starAttr${hidex}`].visible = true;
						this[`starAttr${hidex}`].text = AttributeData.getAttStr(hyattrs[j], 0,1,":");
						break;
					}
				}
				if( this[`starAttr${hidex}`].visible )
					hidex++;
				// if( !this[`starAttr${hidex}`].visible ){
				// 	DisplayUtils.removeFromParent(this[`starAttr${hidex}`]);
				// }
			}
		}
		//移除隐藏控件
		for( let i = 0;i <= 3;i++ ){
			if( this[`attr${i}`] && !this[`attr${i}`].visible ){
				DisplayUtils.removeFromParent(this[`attr${i}`].parent);
			}
			if( this[`starAttr${i}`] && !this[`starAttr${i}`].visible ){
				DisplayUtils.removeFromParent(this[`starAttr${i}`]);
			}
		}
		if( this.starAttr.numElements <= 1 ){
			DisplayUtils.removeFromParent(this.starAttr);
		}
	}
	private updateRedPoint(){
		let config = GlobalConfig.ItemConfig[this.itemId];
		let pos = ItemConfig.getSubType(config);
		//更换红点
		this.changeRedPoint.visible = Hungu.ins().getUpgradeRedPoint(config.id);
		// let items:ItemData[] = Hungu.ins().getHunguItemsList(pos);
		// if( items.length && Hungu.ins().hunguData[this.roleId] && Hungu.ins().hunguData[this.roleId].items[pos].itemId ){
		// 	let curStage = GlobalConfig.HunGuEquip[Hungu.ins().hunguData[this.roleId].items[pos].itemId].stage;//身穿的阶级
		// 	//检查是否有更好的替换
		// 	if( GlobalConfig.HunGuEquip[items[0].configID].stage > curStage ){
		// 		this.changeRedPoint.visible = true;
		// 	}
		// }
		//魂玉红点
		this.forgeRedPoint.visible = Hungu.ins().getHunyuRedPoint(this.roleId,pos);
	}

	private onTap(e: egret.TouchEvent): void {
		let config = GlobalConfig.ItemConfig[this.itemId];
		let pos = ItemConfig.getSubType(config);
		switch (e.currentTarget){
			case this.takeoffBtn://卸载
				if( this.currentState != "shenshang" ){
					UserTips.ins().showTips(`不在身上卸载异常`);
					return;
				}
				if( Hungu.ins().hunguData[this.roleId] && Hungu.ins().hunguData[this.roleId].items[pos] ){
					Hungu.ins().sendHunguItems(this.roleId,pos,0);
					return;
				}else{
					UserTips.ins().showTips(`没有可卸载的装备`);
				}
				break;
			case this.changeBtn://更换 升级
				// if( this.currentState != "shenshang" ){
				// 	UserTips.ins().showTips(`不在身上更换异常`);
				// 	return;
				// }
				// ViewManager.ins().open(HunguChooseEquipWin,this.roleId,pos);

				//升级
				if( Hungu.ins().getNextHunguId(this.roleId,pos) )
					ViewManager.ins().open(HunguStageWin,this.roleId,pos);
				else
					UserTips.ins().showTips(`已满级`);
				break;
			case this.hunyuBtn://魂玉
				if( this.currentState != "shenshang" ){
					UserTips.ins().showTips(`不在身上魂玉异常`);
					return;
				}
				ViewManager.ins().open(HunyuWin,this.roleId,this.itemId);
				break;
			case this.bgClose:
				ViewManager.ins().close(this);
				break;
		}
	}

}
ViewManager.ins().reg(HunguTipsWin, LayerManager.UI_Popup);