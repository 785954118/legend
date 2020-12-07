
/**熔炼道具分解控件*/
class SmeltItemList extends ItemBase {

	constructor() {
		super();
		this.touchChildren = false;
	}

	protected dataChanged(): void {
		if( this.data instanceof RewardData ){
			this.itemConfig = GlobalConfig.ItemConfig[this.data.id];
			this.num = this.data.count;
			this.itemIcon.setData(this.itemConfig);
			this.setCount(this.num + "");
			// this.isShowName(false);
			this.nameTxt.text = this.itemConfig.name;
		}
	}
}