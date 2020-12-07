/**
 * Created by wanghengshuai on 2018/3/6.
 *    拍卖行记录界面
 */
class AuctionRecordWin extends BaseEuiView {

	public bgClose: eui.Rect;
	public anigroup: eui.Group;
	public dinghong: eui.Group;
	public list: eui.List;
	public title: eui.Group;
	public itemName: eui.Label;
	public playerName: eui.Label;
	public curAuction: eui.Label;
	public null: eui.Label;

	private collect: ArrayCollection;

	/** 0 公会 1 全服 */
	private type: number = 0;

	public constructor() {
		super();
		this.skinName = "auctionRecordSkin";
	}

	protected childrenCreated(): void {
		super.childrenCreated();

		this.list.itemRenderer = AuctionRecordItemRender;
	}

	public open(...param: any[]): void {
		this.type = param[0];

		this.observe(Auction.ins().postRecord, this.update);
		this.curAuction.textFlow = TextFlowMaker.generateTextFlow(`拍卖纪录(${this.type ? `全服` : `公会`})`);

		this.null.visible = true;
		Auction.ins().sendRecord(this.type);
		this.addTouchEndEvent(this, this.onTouch);
	}

	private onTouch(e: egret.TouchEvent): void {
		if (e.target == this.bgClose)
			ViewManager.ins().close(this);
	}

	private update(param: { type: number, list: AuctionRecordVo[] }): void {
		if (!this.collect) {
			this.collect = new ArrayCollection();
			this.list.dataProvider = this.collect;
		}

		if (param.type != this.type)
			return;

		this.collect.source = param.list;
		this.null.visible = !this.collect.source || this.collect.source.length <= 0;
	}
}

ViewManager.ins().reg(AuctionRecordWin, LayerManager.UI_Popup)