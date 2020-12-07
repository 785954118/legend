/**
 * Created by Peach.T on 2017/12/6.
 */
class DoubleTwelveRechargeItem extends ItemRenderer{
	public item:ItemBase;
	public nameTxt:eui.Label;

	protected dataChanged(): void {

		this.item.isShowName(false);
		this.item.data = this.data;

		if (this.data.type == 0) {
			let type: number = 1;
			switch (this.data.id) {
				case MoneyConst.yuanbao:
					type = 5;
					break;
				case MoneyConst.gold:
					type = 0;
					break;
				case MoneyConst.soul:
					type = 2;
					break;
				case MoneyConst.piece:
					type = 2;
					break;
				case MoneyConst.godweaponExp:
					type = 2;
					break;
				default:
					break;
			}
			this.nameTxt.text = RewardData.getCurrencyName((<RewardData>this.data).id);
			this.nameTxt.textColor = ItemBase.QUALITY_COLOR[type];
		} else {
			let item = GlobalConfig.ItemConfig[this.data.id];
			this.nameTxt.text = item.name;
			this.nameTxt.textColor = ItemConfig.getQualityColor(item);
		}
	}
}
