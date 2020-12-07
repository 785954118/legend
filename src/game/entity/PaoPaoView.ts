/**
 * 宠物说话
 */
class PaoPaoView extends BaseView {
	/** 名字显示 */
	public nameTxt: eui.Label;
	/**初始Y */
	public initY: number;

	private jobText: number[] = [0xf66006, 0xf66006, 0x2cc2f8, 0xe24ef9];

	public constructor() {
		super();
		this.skinName = "paopaoSkin";
	}

	public open(...param: any[]): void {
		this.x = -this.width / 2;
		this.visible = false;
	}

	/**
	 * 设置说话
	 * @param  {string} str
	 * @returns void
	 */
	public setSpeak(id: number, job: number = 1): void {
		TimerManager.ins().removeAll(this);
		this.start();
		this.nameTxt.textColor = this.jobText[job];
		let bubble = BubbleFactory.ins().playBubbleEffect(id);
		if (!bubble)return;
		this.nameTxt.text = bubble;
		this.nameTxt.x = -this.nameTxt.textWidth >> 1;
		this.visible = true;

		// TimerManager.ins().doTimer(50, 1, () => {
		// 	this.y = this.initY + -this.height;
		// }, this);
	}

	/**
	 * 启动
	 * @returns void
	 */
	private start(): void {
		TimerManager.ins().doTimer(1000, 1, this.destruct, this);
	}

	/**
	 * 清除
	 * @returns void
	 */
	private destruct(): void {
		if (this.parent) {
			this.visible = false;
		}
	}

}