/**
 * 神兽守护装备子项
 * @author MPeter
 */
class ShenshouEquipItem1 extends ShenshouEquipItem {
	private mc: MovieClip;
	public constructor() {
		super();
	}

	/**播放分解特效*/
	public playDepartMc(): void {
		// let mc: MovieClip = new MovieClip();

		if (!this.mc) this.mc = new MovieClip;
		this.mc.x = 43;
		this.mc.y = 44;
		this.mc.scaleX = 1.5;
		this.mc.scaleY = 1.5;
		this.addChild(this.mc);
		this.mc.playFile(RES_DIR_EFF + "litboom", 1);
	}

	protected dataChanged(): void {
		if (!isNaN(this.data) && this.data) {
			this.itemConfig = GlobalConfig.ItemConfig[this.data];
			this.nameTxt.text = ``;
			this.imgBg.source = 'quality' + ItemConfig.getQuality(this.itemConfig);
			this.imgIcon.source = this.itemConfig.icon + "_png";
			let lv = ShenshouModel.ins().getEquipLv(this.itemConfig.id) - 1;
			this.equipLv.text = lv > 0 ? `+${lv}` : "";
		}
	}



}