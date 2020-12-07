class ZsBossRankRenderer extends BaseItemRender {
	private bg: eui.Image;

	private txt0: eui.Label;
	private txt1: eui.Label;
	private txt2: eui.Label;

	constructor() {
		super();
	}

	public dataChanged(): void {
		this.bg.visible = this.itemIndex % 2 == 0;

		this.txt0.text = this.data.rank+"";
		this.txt1.text = this.data.names;
		this.txt2.text = this.data.shanghai;
	}
}