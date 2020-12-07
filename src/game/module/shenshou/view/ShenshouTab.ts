/**
 * 神兽守护-选项卡
 * @author MPeter
 */
class ShenshouTab extends BaseItemRender {
	/**选中状态 */
	private select: eui.Image;
	/**头像 */
	private btnName: eui.Image;
	/**出战状态 */
	private activityImg: eui.Image;
	/**红点 */
	private redPoint: eui.Image;

	public constructor() {
		super();
	}

	protected dataChanged(): void {
		if (this.data.id) {
			let shendshouData = ShenshouModel.ins().getDataById(this.data.id);
			this.redPoint.visible = ShenshouRedpoint.ins().redpoints[this.data.id];
			this.activityImg.visible = shendshouData && shendshouData.state == ShenshouState.State_Has;

			if (shendshouData && shendshouData.state != ShenshouState.State_No) {
				this.btnName.source = GlobalConfig.ShenShouBase[this.data.id].activeImg;
			}
			else {
				this.btnName.source = GlobalConfig.ShenShouBase[this.data.id].iconImg;
			}

		}
	}
	public set selected(value: boolean) {
		this.select.visible = value;
	}

}