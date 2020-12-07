/**
 * Created by hrz on 2017/9/5.
 */

class VipGiftBtnRender extends BaseItemRender {
	public selectIcon: eui.Image;
	public iconDisplay: eui.Image;
	public item: eui.Image;
	public redPoint: eui.Group;
	public mc: MovieClip;
	private viptxt: eui.BitmapLabel;

	constructor() {
		super();
		this.skinName = "VipGiftBtnSkin";
	}

	protected dataChanged(): void {
		let data: VipGiftConfig = this.data as VipGiftConfig;
		this.item.source = data.img;
		this.viptxt.text = `v${data.vipLv}`;
		let isShowEff: boolean = UserVip.ins().getVipGiftRedPoint(data.id);

		if (isShowEff) {
			if (!this.mc) {
				this.mc = new MovieClip();
				this.mc.x = 40;
				this.mc.y = 42;
			}
			this.mc.playFile(RES_DIR_EFF + "actIconCircle", -1);
			this.addChild(this.mc);
		} else {
			DisplayUtils.removeFromParent(this.mc);
			this.mc = null;
		}
		this.redPoint.visible = isShowEff;
	}
}