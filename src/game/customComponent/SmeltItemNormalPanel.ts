class SmeltItemNormalPanel extends BaseComponent {
	public itemList: eui.List;
	private smeltBtn: eui.Button;
	/** 可熔炼装备列表 */
	private smeltEquips: ItemData[];
	private dataInfo: eui.ArrayCollection;
	private getItemList:eui.List;
	private getItemCollection:eui.ArrayCollection;
	private backbtn:eui.Button;
	private itemDataList:ItemData[];
	private selectList:ItemData[];
	constructor() {
		super();
	}

	public childrenCreated(): void {
		this.init();

	}

	protected init(): void {
		// this.skinName = "hunguRongluMainSkin";
		this.itemDataList = [];
		this.selectList = [];
		this.smeltEquips = [];
		this.smeltEquips.length = 9;

		this.itemList.itemRenderer = SmeltEquipItem;
		this.getItemList.itemRenderer = SmeltItemList;
		this.dataInfo = new eui.ArrayCollection(this.smeltEquips);
		this.itemList.dataProvider = this.dataInfo;
		this.getItemCollection = new eui.ArrayCollection();
		this.getItemList.dataProvider = this.getItemCollection;
	}

	public open(...param: any[]): void {
		this.itemDataList = param[0];//需要熔炼的道具列表
		this.addTouchEvent(this.smeltBtn, this.onTap);
		this.addTouchEvent(this.itemList, this.onTap);
		this.addTouchEvent(this.backbtn, this.onTap);
		this.setItemData();
		this.observe(UserForge.ins().postMeltItem, this.smeltComplete);
	}

	public close(...param: any[]): void {

	}

	private smeltComplete(): void {
		//移除分解成功的数据
		for( let i = 0;i < this.selectList.length;i++ ){
			for( let j = 0; j < this.itemList.numElements;j++ ){
				let item = this.itemList.dataProvider.getItemAt(j) as ItemData;
				if( item.handle == this.selectList[i].handle ){
					let render = this.itemList.getVirtualElementAt(j) as SmeltEquipItem;
					this.itemList.removeChild(render);
					if( this.itemDataList[j] )
						this.itemDataList.splice(j,1);
					break;
				}
			}
		}
		this.selectList = [];
		SoundUtil.ins().playEffect(SoundUtil.SMELT);
		this.setItemData();
	}

	private setItemData(): void {
		this.smeltEquips = this.updateList();
		this.dataInfo.replaceAll(this.smeltEquips);
		this.updateFJlist();
	}
	private updateList():ItemData[]{
		let list = [];
		for( let i = 0; i < this.smeltEquips.length;i++ ){
			if( this.itemDataList[i] )
				list.push(this.itemDataList[i])
			else
				break;
		}
		return list;
	}
	private updateFJlist(){
		let list:RewardData[] = [];
		for( let i in this.selectList ){
			let cfg = GlobalConfig.RongLuExpConfig[this.selectList[i].configID];
			let ishave = false;
			LIST:
			for( let j in list ){
				for( let r in cfg.reward ){
					if( list[j].id == cfg.reward[r].id ){
						list[j].count += cfg.reward[r].count*this.selectList[i].count;//这里默认展示的是所有的熔炼数量
						ishave = true;
						break LIST;
					}
				}
			}
			if( !ishave ){
				let rewardData = new RewardData()
				rewardData.type = cfg.reward[i].type;
				rewardData.id = cfg.reward[i].id;
				rewardData.count = cfg.reward[i].count*this.selectList[i].count;
				list.push(rewardData);
			}
		}
		this.getItemCollection.replaceAll(list);
	}
	private onTap(e: egret.TouchEvent): void {
		switch (e.currentTarget) {
			case this.smeltBtn:
				if( this.selectList.length <= 0 ){
					UserTips.ins().showTips(`未选中需要分解的道具`);
					return;
				}
				UserForge.ins().sendMeltItem(this.selectList);
				break;
			case this.itemList:
				let item: SmeltEquipItem = e.target as SmeltEquipItem;
				if (item && item.data) {
					let idx = this.selectList.indexOf(item.data);
					if( idx == -1 ){
						item.selectFrame.visible = true;
						this.selectList.push(item.data);
					}else{
						item.selectFrame.visible = false;
						this.selectList.splice(idx,1);
					}
				}
				this.updateFJlist();
				break;
			case this.backbtn:
				ViewManager.ins().close(SmeltItemTotalWin);
				break;
		}
	}

}