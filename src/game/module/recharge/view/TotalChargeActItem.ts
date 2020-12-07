/**
 * 
 */
class TotalChargeActItem extends BaseItemRender {

	public list: eui.List;
	public price: PriceIcon;
	public rewardBtn: eui.Button;
	public rewardedTip: eui.Image;

	private _index: number;
	public constructor() {
		super();
		this.skinName = 'TotalChargeActItemSkin';
		this.list.itemRenderer = ItemBase;
		
	}

	protected dataChanged(): void {
		this.price.setType(MoneyConst.yuanbao);
		let config: ChongZhi2Config = this.data as ChongZhi2Config;
		let num: number = Recharge.ins().getRechargeData(1).num;
		this._index = config.index;
		this.price.setPrice(config.pay);
		this.list.dataProvider = new eui.ArrayCollection(config.awardList);
		let bool: boolean = this.getRemindByIndex(this._index);
		if (num >= config.pay) {
			if (bool) {
				this.rewardBtn.visible = false
				this.rewardedTip.visible = true;
			} else {
				this.rewardBtn.visible = true
				this.rewardedTip.visible = false;
				this.rewardBtn.addEventListener(egret.TouchEvent.TOUCH_END, this.onClick, this);
			}
		} else {
			this.rewardBtn.visible = this.rewardedTip.visible = false;
		}

	}

	private getRemindByIndex(index: number): boolean {
		return ((Recharge.ins().getRechargeData(1).isAwards >> index) & 1) == 1;
	}


	private onClick() {
		Recharge.ins().sendGetAwards(1, this._index);
		this.rewardBtn.removeEventListener(egret.TouchEvent.TOUCH_END, this.onClick, this);
	}
}
