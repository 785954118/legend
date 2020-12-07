class HunguChooseEquipWin extends BaseEuiView {
	public list: eui.List;
	public scroll: eui.Scroller;

	private wearItem: HunguEquipChooseItem;
	private itemList: ItemData[] = [];

	private pos: number = 0;
	public roleSelect: number = 0;
	private itemGroup: eui.Group;
	private bgClose: eui.Image;

	public initUI(): void {
		super.initUI();
		this.isTopLevel = true;
		this.skinName = "hunguChooseSkin";
		this.list.itemRenderer = HunguEquipChooseItem;
	}


	public open(...param: any[]): void {
		this.addTouchEvent(this.bgClose, this.onTap);
		this.observe(Hungu.ins().postHunguItems,this.HunguItemsCallback);
		this.roleSelect = param[0];
		this.pos = param[1];
		let itemId = 0;
		this.itemGroup.visible = false;
		if( Hungu.ins().hunguData[this.roleSelect] ){
			this.itemGroup.visible = true;
			itemId = Hungu.ins().hunguData[this.roleSelect].items[this.pos].itemId;//身上的装备
			if( itemId ){
				this.scroll.y = 160;
				this.scroll.height = 410;
				this.wearItem = new HunguEquipChooseItem();
				this.itemGroup.addChild(this.wearItem);
				this.wearItem.data = {id:itemId,roleId:this.roleSelect};
				this.wearItem.setWearVisible(true);
			}
		}

		this.itemList = this.getHunguItemList(this.roleSelect, this.pos);
		this.list.dataProvider = new eui.ArrayCollection(this.itemList);
		this.list.validateNow();
	}
	private HunguItemsCallback(){
		ViewManager.ins().close(this);
	}
	private getHunguItemList(roleId:number,pos:number){
		let itemData: ItemData[] = UserBag.ins().getBagGoodsByType(ItemType.TYPE_24);
		let list = [];
		for( let i = 0; i < itemData.length;i++ ){
			let slot = Hungu.ins().getHunguItemsPos(itemData[i].itemConfig.id);
			if( slot == pos )
				list.push({id:itemData[i].configID,roleId:this.roleSelect});
		}
		list.sort((a:{id:number,roleId:number},b:{id:number,roleId:number})=>{
			let aequip = GlobalConfig.HunGuEquip[a.id];
			let bequip = GlobalConfig.HunGuEquip[b.id];
			if( aequip.stage > bequip.stage )
				return -1;
			else
				return 1;
		});
		return list;
	}


	private onTap(e: egret.TouchEvent): void {
		ViewManager.ins().close(this);

	}

}

ViewManager.ins().reg(HunguChooseEquipWin, LayerManager.UI_Popup);

