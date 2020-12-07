/**
 * Created by wanghengshuai on 2018/3/15.
 *
 */
class FDProjectItemRender extends BaseItemRender {
	public pName: eui.Label;
	public list: eui.List;
	public actBtn: eui.Button;
	public scedule: eui.Label;
	public redpoint: eui.Image;
	public score: eui.Label;

	private _listCollect: ArrayCollection;

	public constructor() {
		super();
	}

	public childrenCreated(): void {
		super.childrenCreated();

		this.list.itemRenderer = ItemBase;
		this._listCollect = new ArrayCollection();
		this.list.dataProvider = this._listCollect;
	}

	public dataChanged(): void {
		//{activityID:this._activityID, conf:conf, state:state, times:achieve.times};
		this._listCollect.source = this.data.conf.reward;
		this.pName.textFlow = TextFlowMaker.generateTextFlow1(this.data.conf.name);

		this.scedule.textFlow = TextFlowMaker.generateTextFlow1(`|C:${0x00ff00}&T:${Math.floor(this.data.times / this.data.conf.rate)}|/${Math.floor(this.data.conf.dayLimit / this.data.conf.rate)}`);
		this.currentState = this.data.state == 2 ? "done" : "normal";
		this.redpoint.visible = this.data.state == 1;
		this.score.text = this.data.conf.score;

		if (this.data.state == 0 && this.data.conf.turn) {
			this.actBtn.enabled = true;
			this.actBtn.label = "前  往";
		}
		else {
			this.actBtn.label = "领  取";
			this.actBtn.enabled = this.data.state == 1;
		}

		if (!this.hasEventListener(egret.TouchEvent.REMOVED_FROM_STAGE))
			this.addEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.onRmove, this);

		if (!this.hasEventListener(egret.TouchEvent.TOUCH_TAP))
			this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
	}

	private onTouch(e: egret.TouchEvent): void {
		if (e.target != this.actBtn)
			return;

		if (this.data.state == 0 && this.data.conf.turn)
			ViewManager.ins().open(this.data.conf.turn[0], this.data.conf.turn[1]);
		else
			Activity.ins().sendReward(this.data.activityID, this.data.conf.index, 2);
	}

	private onRmove(e: egret.TouchEvent): void {
		this.removeEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.onRmove, this);
		this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
	}

}