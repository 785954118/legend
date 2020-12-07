class KfArenaJoinItemRender extends BaseItemRender {
	public target: eui.Label;
	private rewardList: eui.List;
	private redPoint: eui.Group;
	private get: eui.Label;

	public constructor() {
		super();
		this.skinName = "KfArenaJoinItemSkin";
	}

	public childrenCreated(): void {
		super.childrenCreated();
		this.rewardList.itemRenderer = ItemBase;
		this.rewardList.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
	}

	public dataChanged(): void {
		if (!this.data) return;
		this.redPoint.visible = false;
		this.get.visible = false;
		this.target.text = `${this.data.count}`;
		let state: number = KfArenaSys.ins().dflState;
		if (((state >> this.data.id) & 1) == 1) {
			//已领
			this.get.visible = true;
		} else {
			if (KfArenaSys.ins().dflCount >= this.data.count) {
				//可领
				this.redPoint.visible = true;
			}
		}
		this.rewardList.dataProvider = new eui.ArrayCollection(this.data.award);
	}

	private onTap(e: egret.TouchEvent) {
		if (this.redPoint.visible)
			KfArenaSys.ins().sendJoinRewards(this.data.id);
	}

	public destruct(): void {
		this.rewardList.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
	}
}