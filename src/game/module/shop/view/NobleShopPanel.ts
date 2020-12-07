class NobleShopPanel extends BaseView {

	private listView: eui.List;
	private tipImg: eui.Image;
	public constructor() {
		super();
		this.name = "贵族商城";
		// this.skinName = "NobleshopSkin";
	}

	public childrenCreated(): void {
		this.init();
	}

	public init(): void {

		this.listView.itemRenderer = NobleShopItemRender;
	}


	public open(...param: any[]): void {
		if(param[0])
		{
			this.listView.addEventListener(egret.Event.ENTER_FRAME, this.scrollBottom, this);
		}
		this.addTouchEvent(this, this.onTap);
		this.addTouchEvent(this.tipImg, this.onTap);
		this.updateData();
	}

	public close(...param: any[]): void {
		this.removeTouchEvent(this, this.onTap);
		this.removeTouchEvent(this.tipImg, this.onTap);
		this.listView.removeEventListener(egret.Event.ENTER_FRAME, this.scrollBottom, this);
	}

	private updateData() {
		let arr = [];
		let dataProvider = GlobalConfig.IntegralStore;
		for (let k in dataProvider) {
			arr.push(dataProvider[k]);
		}
		this.listView.dataProvider = new eui.ArrayCollection(arr);
	}

	private onTap(e: egret.TouchEvent) {
		if (e.target.name == "buy") {
			let goodsID = e.target.parent['goodsID'];
			let shopType = e.target.parent['shopType'];
			if (!Recharge.ins().getIsForeve())
				UserTips.ins().showTips(`没有激活贵族特权无法购买`);
			else
				ViewManager.ins().open(BuyWin, goodsID, shopType);
			// let arr = [goodsID, 1];
		} else if (e.currentTarget == this.tipImg) {
			ViewManager.ins().open(FuliWin, 2);
		}
	}

	private scrollBottom():void
	{
		this.listView.removeEventListener(egret.Event.ENTER_FRAME, this.scrollBottom, this);
		this.listView.scrollV = this.listView.contentHeight - this.listView.height;
	}
}