class MijiLearnItemRenderer extends BaseItemRender {
	public item: ItemBaseNoTap;
	public label: eui.Label;

	public constructor() {
		super();
		this.skinName = "MijiLearnItemSkin";
	}

	protected dataChanged(): void {
		let obj: Object = this.data;
		this.item.data = obj["item"];
		if(obj["isLock"]){
			this.label.visible = true;
			this.label.text = "已锁";
		}
		else if (obj["islearn"]) {
			this.label.visible = true;
			this.label.text = "已学";
			// this.item.setItemImg(`hui${obj["item"].itemConfig.icon}`); //没有灰色资源
		}
		else
			this.label.visible = false;
	}

}