/**
 * 跨服竞技场参与
 */
class KfArenaJoinPanel extends BaseEuiView {
	private myRecord: eui.Label;
	private list: eui.List;
	private listArray: eui.ArrayCollection;
	private rewardList: eui.List;
	constructor() {
		super();
		this.name = `参与`;
	}

	protected childrenCreated() {
		this.initUI();
	}

	public initUI(): void {
		super.initUI();
		this.listArray = new eui.ArrayCollection();
		this.list.itemRenderer = KfArenaJoinItemRender;
		this.list.dataProvider = this.listArray;
	}

	public open(): void {
		this.observe(KfArenaSys.ins().postJoinRewards, this.update);
		this.update();
	}

	private update(): void {
		let peakAwards: KfArenaPeakAwards[] = GlobalConfig.CrossArenaBase.peakAwards;
		let tem: KfArenaPeakAwards[] = [];
		let index: number = 1;
		for (let i in peakAwards) {
			peakAwards[i].id = index;
			tem.push(peakAwards[i]);
			index++;
		}
		this.listArray.source = tem;
		this.myRecord.text = KfArenaSys.ins().dflCount;
	}

	public close(): void {
	}


}
