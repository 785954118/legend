/**
 * 跨服竞技场段位
 */
class KfArenaDuanPanel extends BaseEuiView {
	private list: eui.List;
	private listArray: eui.ArrayCollection;
	private dw: eui.Label;
	private rewardList: eui.List;
	private redPoint: eui.Image;
	private get: eui.Label;

	constructor() {
		super();
		this.name = `段位`;
	}

	protected childrenCreated() {
		this.initUI();
	}

	public initUI(): void {
		super.initUI();
		this.listArray = new eui.ArrayCollection();
		this.list.itemRenderer = KfArenaDuanItemRender;
		this.list.dataProvider = this.listArray;
		this.rewardList.itemRenderer = ItemBase;
	}

	public open(): void {
		this.addTouchEvent(this.rewardList, this.onTouch);
		this.observe(KfArenaSys.ins().postJoinRewards, this.update);
		this.update();
	}

	private update(): void {
		this.listArray.source = GlobalConfig.CrossArenaBase.finalAward;
		this.rewardList.dataProvider = new eui.ArrayCollection(KfArenaSys.ins().getDuanAwards());
		this.dw.text = KfArenaSys.ins().getDuanName();
		this.redPoint.visible = KfArenaSys.ins().dailyState == 0;
		this.get.visible = KfArenaSys.ins().dailyState == 1;
	}

	protected onTouch(e: egret.Event): void {
		KfArenaSys.ins().sendDailyRewards();
	}
}
