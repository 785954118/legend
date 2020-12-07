/**
 * 新装备穿戴提示
 *
 */
class NewEquipWin extends BaseView {

	private equipName:eui.Label;//装备名字
	private powerLabel:eui.Label;//装备战斗力
	private powerCount:eui.Label;//装备战斗力数值

	private equip:ItemBase;
	private go:eui.Button;

	public tick:number;
	private time:number;
	constructor() {
		super();
		this.skinName = "newEquipSkin";
		this.time = 5;

	}

	public close(...param: any[]): void {
		this.removeTouchEvent(this.go, this.onEvent);
		this.removeObserve();
		TimerManager.ins().remove(this.updateTime,this);
		this.visible = false;
	}

	public open(...param: any[]): void {
		if(!NewEquip.ins().equipsList.length)return;
		// if( this.tick ) return;
		this.addTouchEvent(this.go, this.onEvent);
		this.observe(UserEquip.ins().postEquipChange, this.callBack);//装备穿戴返回
		if( NewEquip.ins().check() ){
			if( !TimerManager.ins().isExists(this.updateTime,this) ){
				this.tick = this.time;
				TimerManager.ins().doTimer(1000,0,this.updateTime,this);
			}
		}
	}
	private updateTime(){
		this.init();
		this.visible = true;
	}
	/**穿戴返回*/
	public callBack(){
		//头装备已传戴成功
		// NewEquip.ins().equipsList.shift();
		// if(NewEquip.ins().equipsList.length == 0)
		// 	this.close();
		// this.tick = this.time;
	}
	private itemdata:ItemData;
	public init(){
		if( this.tick <= 0 ){
			if(NewEquip.ins().equipsList.length == 0){
				this.close();
				return;
			}
			this.tick = this.time;
		};

		if( NewEquip.ins().equipsList.length > 0 ){
			this.go.label = `装备(${this.tick})`;
			this.itemdata = NewEquip.ins().equipsList[0];
			if( this.itemdata && this.itemdata.itemConfig ){
				this.equip.data = this.itemdata._configID;
				this.equip.isShowName(false);
				this.equipName.text = this.itemdata.itemConfig.name;
				this.equipName.textColor = ItemConfig.getQualityColor(this.itemdata.itemConfig);
				this.powerCount.text = this.itemdata.point + "";//UserBag.getAttrPower(this.itemdata.att) + "";
			}
		}
		this.tick--;
		if( this.tick <= 0 ){
			this.sendWear();
		}
	}
	public onEvent(e:egret.TouchEvent){
		switch (e.target){
			case this.go:
				this.sendWear();
				break;
		}
	}
	private sendWear(){
		if( this.itemdata ){
			let pos:number = ItemConfig.getSubType(this.itemdata.itemConfig);
			UserEquip.ins().sendWearEquipment(this.itemdata.handle, pos, 0);
			NewEquip.ins().equipsList.shift();
			if(NewEquip.ins().equipsList.length == 0)
				this.close();
			this.tick = this.time;
		}
	}

}