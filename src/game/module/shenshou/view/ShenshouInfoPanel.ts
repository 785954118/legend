/**
 * 兽神展示信息面板
 * @author MPeter
 */
class ShenshouInfoPanel extends BaseView {
	/**神兽图 */
	private shenshouImg: eui.Image;
	/**装备项 */
	private item0: ShenshouEquipItem;
	private item1: ShenshouEquipItem;
	private item2: ShenshouEquipItem;
	private item3: ShenshouEquipItem;
	private item4: ShenshouEquipItem;

	private curId: number;
	private imgCopy: eui.Image;
	public constructor() {
		super();
	}
	/**设置当前神兽ID */
	public setID(value: number): void {
		this.curId = value;
		this.currentState = `${value}`;
	}
	public close(): void {
		this.stopBeatAnimat();
	}
	/**刷新装备数据 */
	public refEquipData(): void {
		for (let i: number = 0; i < GlobalConfig.ShenShouConfig.posCount; i++) {
			let pos = i + 1;
			this[`item${i}`].name = pos;

			let data = ShenshouModel.ins().getDataById(this.curId);
			if (data && data.equipIDs[pos]) {
				this[`item${i}`].data = data.equipIDs[pos];
			}
			else {
				this[`item${i}`].setPosData(this.curId, pos);
			}
		}
	}
	/**刷新状态 */
	public refState(state: ShenshouState): void {
		let bodySource: string = "";
		this.stopBeatAnimat();
		this.shenshouImg.source = bodySource;
		switch (state) {
			case ShenshouState.State_No://未激活
				bodySource = `ss_${this.curId}b_png`;
				break;
			case ShenshouState.State_Can://可出战
				bodySource = `ss_${this.curId}b_png`;
				break;
			case ShenshouState.State_Has://已出战
				this.startBeatAnimat();
				bodySource = `ss_${this.curId}a_png`;
				break;
		}
		egret.callLater(() => {
			this.shenshouImg.source = bodySource;
		}, this);
	}

	/**开始呼吸动画 */
	private startBeatAnimat(): void {
		if (!this.imgCopy) this.imgCopy = new eui.Image();
		this.imgCopy.touchEnabled = false;
		// this.imgCopy.addEventListener(egret.Event.COMPLETE,this.runTween,this);
		this.imgCopy.source = `ss_${this.curId}a_png`;
		this.imgCopy.visible = false;
		this.addChild(this.imgCopy);

		TimerManager.ins().doTimer(4000, 0, this.runTween, this);
		//起始延迟500毫秒播放
		TimerManager.ins().doTimer(500, 1, this.runTween, this);
	}
	// @callLater
	private runTween(): void {
		this.imgCopy.visible = true;
		this.imgCopy.alpha = 0;
		this.imgCopy.scaleX = this.imgCopy.scaleY = 1;
		this.imgCopy.x = this.shenshouImg.x + (this.shenshouImg.width >> 1);
		this.imgCopy.y = this.shenshouImg.y + (this.shenshouImg.height >> 1);
		this.imgCopy.anchorOffsetX = this.shenshouImg.width >> 1;
		this.imgCopy.anchorOffsetY = this.shenshouImg.height >> 1;
		this.imgCopy.top = this.shenshouImg.top;
		this.imgCopy.horizontalCenter = this.shenshouImg.horizontalCenter;


		// this.shenshouItem[`shenshouImg`].visible = false;
		// Tween.get(this.imgCopy)
		// 	.to({ 'scaleX': .95, 'scaleY': .95,'alpha': 0.3 }, 100)
		// 	.to({ 'scaleX': 1, 'scaleY': 1 ,'alpha': 1}, 30)
		// 	.call(() => { this.shenshouItem[`shenshouImg`].visible = true; })
		// 	.to({ 'alpha': 0, 'scaleX': 1.20, 'scaleY': 1.20 }, 2000, egret.Ease.cubicInOut);

		Tween.get(this.imgCopy)
			.to({ 'alpha': 1 }, 250)
			.to({ 'alpha': 0, 'scaleX': 1.20, 'scaleY': 1.20 }, 2000, egret.Ease.cubicInOut);

	}
	/**停止呼吸动画 */
	private stopBeatAnimat(): void {
		TimerManager.ins().remove(this.runTween, this);
		if (this.imgCopy) {
			Tween.removeTweens(this.imgCopy);
			this.imgCopy.visible = false;
		}
	}
}