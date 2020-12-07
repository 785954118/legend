class MedalShopPanel extends BaseView {
    constructor() {
        super();
        this.name = "功勋商店";
        this.skinName = "FeatsShopSkin";
        this.labelGetCoin.textFlow = (new egret.HtmlTextParser).parser(`<a href="event:"><u>${this.labelGetCoin.text}</u></a>`);
        this.list.itemRenderer = MedalShopItemRenderer;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF; 
    }

    private coin: number = 0;
    private labelGetCoin: eui.Label;
    private list: eui.List;
    private labelCoin: eui.Label;
    private scroller: eui.Scroller;

    public open(...param: any[]): void {
		Shop.ins().sendMedalMessage();
        // App.ControllerManager.applyFunc(ControllerConst.Shop, ShopWinFunc.REFRESH_MEDAL_SHOP);
        this.observe(Shop.ins().postRefresMedalMessage, this.updataData);
        this.observe(Shop.ins().postUpdateBuyMedal, this.buyResult);
        this.addTouchEvent(this.list, this.onBuy);
        this.addTouchEvent(this.labelGetCoin, this.onGetCoin);
    }

    public close(...param: any[]): void {
        this.removeTouchEvent(this.list, this.onBuy);
        this.removeTouchEvent(this.labelGetCoin, this.onGetCoin);
		this.removeObserve();
    }

    private updataData(): void {
        let _data: FeatsStore[] = GlobalConfig.FeatsStore;
        let data:FeatsStoreData = Shop.ins().medalData;
        for (let k in _data) {
            let exchangeCount = data.exchangeCount[_data[k].index]
            if (!isNaN(exchangeCount)) {
				_data[k].exchangeCount = exchangeCount;
            } else {
                _data[k].exchangeCount = 0;
            }
        }
        this.setListData(_data);
    }

    private onBuy(e: egret.TouchEvent): void {
        if (e.target.name == "buy") {
            let feats = Actor.feats;
            let tag: MedalShopItemRenderer = e.target.parent;
            let _data: FeatsStore = <FeatsStore>tag.data;
            if (_data.exchangeCount >= _data.daycount && _data.daycount != 0) {
                let str: string = "今日可兑换次数用完，请明日再试";
				UserTips.ins().showTips(str);
            } else if (_data.costMoney.count > feats) {
                let str: string = "功勋值不足，无法兑换物品";
				UserTips.ins().showTips(str);
            } else {
				Shop.ins().sendBuyMedal(_data.index,1);
            }
        }
    }

    private buyResult(exchangeData:number[]){
		let str: string = "成功兑换，消耗";
		let price: number = 0;
		let _data: FeatsStore[] = GlobalConfig.FeatsStore;
		for (let k in _data) {
			if (_data[k].index == exchangeData[0]) {
				_data[k].exchangeCount = exchangeData[1];
				price = _data[k].costMoney.count;
			}
		}
		str = str + price + "功勋";
		UserTips.ins().showTips(str);
		this.setListData(_data);
    }

    private setListData(_data: FeatsStore[]): void {
		// let scH: number = this.scroller.viewport.scrollH;
		let arr: eui.ArrayCollection = new eui.ArrayCollection();
		for (let k in _data) {
			arr.addItem(_data[k]);
		}
		this.list.dataProvider = arr;

		let feats = Actor.feats;
		this.labelCoin.text = Actor.feats.toString();
		// this.scroller.viewport.scrollH = scH;
    }

    private onGetCoin(e: egret.TouchEvent) {
		(<ShopGoodsWarn>ViewManager.ins().open(ShopGoodsWarn)).setData(7, 1);
    }
}