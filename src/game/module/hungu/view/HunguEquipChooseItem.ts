class HunguEquipChooseItem extends eui.ItemRenderer {
	private changeBtn: eui.Button;
	private itemIcon: ItemIcon;
	private quality:eui.Label;
	private power:eui.Label;
	private now:eui.Group;
	//betterArrow0~betterArrow2
	//forgeAttr0~forgeAttr2
	public constructor() {
		super();
		this.skinName = 'hunguChooseItem';
		this.init();
	}
	/**触摸事件 */
	protected init(): void {
		this.changeBtn.addEventListener(egret.TouchEvent.TOUCH_END, this.onClick, this);
	}
	protected dataChanged(): void {
		if (!this.data || !this.data.id || isNaN(this.data.roleId))
			return;
		let pow = UserBag.getAttrPower(GlobalConfig.HunGuEquip[this.data.id].attrs);
		let expow = GlobalConfig.HunGuEquip[this.data.id].expower;
		expow = expow?expow:0;
		pow += expow;
		this.now.visible = false;
		this.power.text = `评分：${pow}`;
		let config = GlobalConfig.ItemConfig[this.data.id];
		let color = ItemConfig.getQualityColor(config);
		this.quality.textFlow = TextFlowMaker.generateTextFlow1(`|C:${color}&T:${Hungu.ins().getHunguItemQualityName(config.id)}`);
		this.itemIcon.setData(config);
		for( let i = 0;i < 3;i++ ){
			if( this[`group${i}`] && this[`attr${i}`] ){
				if( GlobalConfig.HunGuEquip[this.data.id].attrs[i] ){
					if( !this[`group${i}`].parent )
						this.addChild(this[`group${i}`]);
					this[`attr${i}`].text = AttributeData.getAttrNameByAttrbute(GlobalConfig.HunGuEquip[this.data.id].attrs[i], true);
					//提升属性标识判定
					if( this[`betterArrow${i}`] && this[`forgeAttr${i}`] ){
						this[`betterArrow${i}`].visible = this[`forgeAttr${i}`].visible = false;
						let j = ItemConfig.getSubType(config);
						if( !Hungu.ins().hunguData[this.data.roleId] || !Hungu.ins().hunguData[this.data.roleId].items[j].itemId ){
							this[`betterArrow${i}`].visible = this[`forgeAttr${i}`].visible = true;
							this[`forgeAttr${i}`].text = `+${GlobalConfig.HunGuEquip[this.data.id].attrs[i].value}`;
						}else{
							let itemId = Hungu.ins().hunguData[this.data.roleId].items[j].itemId;
							for( let z = 0; z < GlobalConfig.HunGuEquip[itemId].attrs.length;z++ ){
								if( GlobalConfig.HunGuEquip[itemId].attrs[z].type == GlobalConfig.HunGuEquip[this.data.id].attrs[i].type ){
									if( GlobalConfig.HunGuEquip[itemId].attrs[z].value > GlobalConfig.HunGuEquip[this.data.id].attrs[i].value )
										this[`betterArrow${i}`].visible = this[`forgeAttr${i}`].visible = true;
									break;
								}
							}
						}
					}
				}else{
					DisplayUtils.removeFromParent(this[`group${i}`])
				}
			}
		}
	}
	public setWearVisible(v:boolean = false){
		this.now.visible = v;
		this.changeBtn.visible = !this.now.visible;
	}
	public onClick() {
		let config = GlobalConfig.ItemConfig[this.data.id];
		let pos = ItemConfig.getSubType(config);
		Hungu.ins().sendHunguItems(this.data.roleId,pos,this.data.id);
	}


}

