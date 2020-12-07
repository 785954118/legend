/**
 * 神兽守护装备子项
 * @author MPeter
 */
class ShenshouEquipItem extends BaseItemRender {
	public nameTxt: eui.Label;
	public imgBg: eui.Image;
	public imgIcon: eui.Image;
	public tag: eui.Image;
	public redPoint: eui.Group;
	public equipLv: eui.Label;

	public itemConfig: ItemConfig;
	protected equipName: string[] = ["", `血瞳`, `魔躯`, `妖尾`, `圣角`, `鬼爪`];
	protected qualityName: string[] = ["白1星", "白1星", "紫1星", "紫1星", "紫1星", "橙1星", "橙1星", "橙1星", "红3星"];
	protected qualityObj: number[] = [0, 0, 2, 2, 2, 3, 3, 3, 4];

	public constructor() {
		super();
		this.touchChildren = false;
		this.touchChildren = false;


	}
	/**设置基础信息 */
	public setPosData(shoushenId?: number, pos?: number) {
		let quality = GlobalConfig.ShenShouBase[shoushenId].minLevel[pos - 1];
		this.imgBg.source = 'quality0';
		this.nameTxt.text = this.qualityName[quality] + this.equipName[pos];
		this.nameTxt.textColor = ItemBase.QUALITY_COLOR[0];
		this.imgIcon.source = `ss_equip${pos - 1}`;
		this.equipLv.text = ``;
		this.data = null;
	}

	protected dataChanged(): void {
		if (!isNaN(this.data) && this.data) {
			this.itemConfig = GlobalConfig.ItemConfig[this.data];
			this.nameTxt.text = this.itemConfig.name;
			this.nameTxt.textColor = ItemConfig.getQualityColor(this.itemConfig);
			this.imgBg.source = 'quality' + ItemConfig.getQuality(this.itemConfig);
			this.imgIcon.source = this.itemConfig.icon + "_png";
			let lv = ShenshouModel.ins().getEquipLv(this.itemConfig.id) - 1;
			this.equipLv.text = lv > 0 ? `+${lv}` : "";
		}
	}



}