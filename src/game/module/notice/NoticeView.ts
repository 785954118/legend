/**
 *
 * @author
 *
 */
class NoticeView extends BaseEuiView {
	private frame: eui.Image;
	private list: eui.Label[] = [];
	private startX: number = 0;
	private endX: number = 0;

	public constructor() {
		super();
	}

	public initUI(): void {
		super.initUI();

		this.frame = new eui.Image;
		this.frame.source = "zjmgonggaobg";
		this.frame.width = 480;
		this.frame.height = 28;
		this.frame.y = 240;
		// this.frame.horizontalCenter = 0;
		this.frame.x = (StageUtils.ins().getWidth() / 2) - this.frame.width / 2;
		this.addChild(this.frame);
		this.frame.visible = false;

		this.touchChildren = false;
		this.touchEnabled = false;
		this.startX = this.frame.x + this.frame.width;
		this.endX = this.frame.x;
	}

	/**
	 * 显示公告
	 * @param str
	 */
	public showNotice(str: string): void {
		this.frame.visible = true;
		let lab: eui.Label = new eui.Label;
		lab.size = 20;
		lab.textColor = 0xfee900;
		lab.stroke = 1;
		lab.strokeColor = 0x000000;
		// lab.fontFamily = "黑体";
		lab.x = this.startX;
		lab.y = this.frame.y + 4;
		lab.textFlow = TextFlowMaker.generateTextFlow(str);
		this.addChild(lab);
		this.list.push(lab);
		lab.visible = false;
		if (this.list.length == 1)
			this.tweenLab();
	}

	private tweenLab(): void {
		let lab: eui.Label = this.list[0];
		let tweenX: number = this.endX - lab.width;
		let t: egret.Tween = egret.Tween.get(lab);
		lab.visible = true;
		t.to({"x": tweenX}, lab.width * 20).call(() => {
			this.removeChild(lab);
			this.list.shift();
			if (this.list.length < 1)
				this.frame.visible = false;
			else
				this.tweenLab();
		}, this);
	}
}

ViewManager.ins().reg(NoticeView, LayerManager.UI_Tips);
