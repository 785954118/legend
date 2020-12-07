/**
 * Created by MPeter on 2017/12/21.
 * 跨服副本-巅峰赛季-筹码商城
 */
class PeakChipMallPanel extends BaseView {
	public listView: eui.List;
	public background: eui.Image;
	public myLabel: eui.Label;
	/**获取途径 */
	public getWay: eui.Label;

	private dataArr: eui.ArrayCollection;
	public constructor() {
		super();
	}
	protected childrenCreated(): void {
		this.listView.itemRenderer = HonorMarketItemRenderer;
		this.dataArr = new eui.ArrayCollection;
		this.listView.dataProvider = this.dataArr;
	}
	public open(...param): void {
		this.addTouchEvent(this.getWay, this.onGetway);

		this.observe(Shop.ins().postRefresMedalMessage, this.updateData);
		this.observe(Actor.ins().postChip, this.callback);
		this.observe(Shop.ins().postUpdateBuyMedal, this.callback);

		Shop.ins().sendMedalMessage();
	}
	public close(...param: any[]): void {
		this.$onClose();
		this.removeTouchEvent(this.getWay, this.onGetway);

	}
	public callback() {
		Shop.ins().sendMedalMessage();
	}
	private onGetway(): void {
		// UserWarn.ins().setBuyGoodsWarn(7);
	}

	private updateData() {
		let arr = [];
		let dataProvider = GlobalConfig.FeatsStore;
		for (let k in dataProvider) {
			if (dataProvider[k].shopType == 2) continue;
			let isPush: boolean = true;
			//判断永久购是否购完
			if (dataProvider[k].buyType == FEATS_TYPE.forever && Shop.ins().medalData) {
				for (let i in Shop.ins().medalData.exchangeCount) {
					if (dataProvider[k].index == Number(i) && dataProvider[k].daycount) {
						if (Shop.ins().medalData.exchangeCount[i] >= dataProvider[k].daycount) {
							isPush = false;//永购已经完成
						}
						break;
					}
				}
			}
			if (isPush)
				arr.push(dataProvider[k]);
		}

		this.dataArr.replaceAll(arr);
		this.myLabel.text = Actor.chip + "";

		let text = this.getWay.text;
		this.getWay.textFlow = TextFlowMaker.generateTextFlow1(`|U:&T:${text}`);
	}
}