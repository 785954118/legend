class ActivityBtnRenderer extends FuliActBtnRenderer {
	public selectIcon: eui.Image;
	public iconDisplay: eui.Image;
	public redPoint: eui.Group;
	public mc: MovieClip;

	constructor() {
		super();
		this.skinName = "ActBtnSkin";
	}

	protected dataChanged(): void {
		let abc: ActivityBtnConfig | PActivityBtnConfig;
		let ins: Activity | PActivity;
		if (this.data instanceof ActivityBtnConfig) {
			abc = this.data as ActivityBtnConfig;
			ins = Activity.ins()
		}
		else if (this.data instanceof PActivityBtnConfig) {
			abc = this.data as PActivityBtnConfig;
			ins = PActivity.ins()
		}
		if (abc != null) {
			this.iconDisplay.source = abc.icon;
			this.redPoint.visible = ins.isShowRedPointByBtnInfo(abc);
			if (abc.light && !ins.getPalyEffListById(abc.id)) {
				if (!this.mc) {
					this.mc = new MovieClip();
					this.mc.x = 40;
					this.mc.y = 43;
				}
				this.mc.playFile(RES_DIR_EFF + "actIconCircle", -1);
				this.addChild(this.mc);
			} else {
				DisplayUtils.removeFromParent(this.mc);
			}
		}
		else {
			this.iconDisplay.source = "";
		}
	}
}