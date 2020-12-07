/**
 * 兽神提升丹使用界面
 * @author MPeter
 */
class ShenshouDanUseWin extends BaseEuiView {
	public bgClose: eui.Rect;
	public anigroup: eui.Group;
	public BG: eui.Image;
	public useBtn: eui.Button;
	public cancelBtn: eui.Button;
	public itemIcon: ItemBase;
	public ownCount: eui.Label;

	public constructor() {
		super();
		this.skinName = `SsItemUseTips`;
	}
	public open(...args): void {
		this.addTouchEvent(this.useBtn, this.onTouch);
		this.addTouchEvent(this.cancelBtn, this.onTouch);
		this.addTouchEvent(this.bgClose, this.onTouch);

		let itemConfig = args[0];
		this.itemIcon.data = itemConfig.id;
		this.ownCount.text = `(当前拥有${UserBag.ins().getBagGoodsCountById(UserBag.BAG_TYPE_OTHTER, GlobalConfig.ShenShouConfig.battleCountItem)}个）`;
		this.itemIcon.hideName();
	}
	private onTouch(e: egret.TouchEvent): void {
		switch (e.target) {
			case this.bgClose:
			case this.cancelBtn:
				ViewManager.ins().close(this);
				break;
			case this.useBtn:
				ShenshouSys.ins().sendUpLimitMax();
				break;
		}
	}
}
ViewManager.ins().reg(ShenshouDanUseWin, LayerManager.UI_Popup);