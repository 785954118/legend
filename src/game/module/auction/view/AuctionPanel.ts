/**
 * Created by wanghengshuai on 2018/3/6.
 *    拍卖信息面板
 */
import auction = GameSystem.auction;

class AuctionPanel extends BaseEuiView {

	public list: eui.List;
	public title: eui.Group;
	public itemName: eui.Label;
	public state: eui.Label;
	public btn: eui.Button;
	public add: eui.Group;
	public maxBtn: eui.Button;
	public minBtn: eui.Button;
	public pageTxt: eui.Label;
	public null: eui.Label;

	private collect: ArrayCollection;

	private curPage: number = 1;

	private maxPage: number = 1;

	/** 0 公会 1 全服 */
	private type: number = 0;

	private itemCount: number = 10;

	public constructor() {
		super();
	}

	protected childrenCreated(): void {
		super.childrenCreated();
		this.list.itemRenderer = AuctionItemRender;
	}

	public open(...param: any[]): void {
		this.type = param[0];
		this.itemCount = GlobalConfig.AuctionConfig.eachPageNumber;

		this.addTouchEndEvent(this, this.onTouch);
		this.observe(Auction.ins().postListData, this.update);
		this.observe(Auction.ins().postAuctionResult, this.update);
		this.observe(Auction.ins().postBuyResult, this.update);
		this.observe(Auction.ins().postUpdate, this.update);
		this.curPage = 1;
		this.update();
		TimerManager.ins().removeAll(this);
		TimerManager.ins().doTimer(10000, 0, this.onSend, this)
	}

	public close(): void {
		TimerManager.ins().removeAll(this);
	}

	private onSend(): void {
		Auction.ins().sendGetList(this.type);
	}

	private update(): void {
		if (!this.collect) {
			this.collect = new ArrayCollection();
			this.list.dataProvider = this.collect;
		}


		this.maxPage = Auction.ins().getMaxPageByType(this.type, this.itemCount);
		if (this.curPage > this.maxPage)
			this.curPage = this.maxPage;

		this.updateCurPage();
		this.add.visible = this.maxPage > 1;
	}

	private onTouch(e: egret.TouchEvent): void {
		switch (e.target) {
			case this.btn:
				ViewManager.ins().open(AuctionRecordWin, this.type);
				break;
			case this.minBtn:
				if (this.curPage > 1) {
					this.curPage--;
					this.updateCurPage();
				}
				break;
			case this.maxBtn:
				if (this.curPage < this.maxPage) {
					this.curPage++;
					this.updateCurPage();
				}
				break;
		}
	}

	private updateCurPage(): void {
		let source: AuctionVo[] = Auction.ins().getDataByPage(this.type, this.curPage, this.itemCount);
		let oldSource: AuctionVo[] = this.collect.source;
		if (oldSource && oldSource.length == (source ? source.length : 0)) {
			let len: number = oldSource.length;
			for (let i: number = 0; i < len; i++) {
				oldSource[i] = source[i];
				let render: AuctionItemRender = this.list.getElementAt(i) as AuctionItemRender;
				if (render)
					this.list.updateRenderer(render, i, source[i]);
			}
		}
		else
			this.collect.source = source;

		//this.collect.source = Auction.ins().getDataByPage(this.type, this.curPage, this.itemCount);
		this.null.visible = !this.collect.source || this.collect.source.length <= 0;
		this.pageTxt.text = this.curPage + "/" + this.maxPage;

	}
}