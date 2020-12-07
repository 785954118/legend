/**
 * Created by wanghengshuai on 2018/3/15.
 *
 */
class FDtabBtnItemRender extends BaseItemRender {
	public tabName: eui.Label;
	public redpoint: eui.Image;

	public constructor() {
		super();
		this.touchChildren = true;
	}

	public dataChanged(): void {
		//{gName: conf.gName, showRed: false}
		this.tabName.text = this.data.gName;
		this.redpoint.visible = this.data.showRed;
	}

	public set selected(value: boolean) {
		this.currentState = value ? "select" : "unselect";
		if (this.data) {
			this.redpoint.visible = this.data.showRed;
		}
	}
}