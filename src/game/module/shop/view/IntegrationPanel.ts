class IntegrationPanel extends BaseView {

	public list: eui.List;
	public label1: eui.Label;

	public constructor() {
		super();
		this.name = "积分商店";
		this.skinName = "ShopPointSkin";
		this.list.itemRenderer = IntegrationItemRenderer;
	}


	public open(...param: any[]): void {
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.observe(Shop.ins().postRefreshIntegrationSucc, this.buyResultCB);
		this.updateData();
	}

	public close(...param: any[]): void {
		this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.removeObserve();
	}

	private buyResultCB(result, num) {
		if (result[0] == 1) {
			UserTips.ins().showTips( "购买成功");
		} else {
			UserTips.ins().showTips( "|C:0xf3311e&T:购买失败|");
		}
		this.label1.text = `我的积分：${CommonUtils.overLength(result[1])}（在神秘商店购买商品或刷新获得）`;
	}

	private updateData() {
		let arr = [];
		let dataProvider = GlobalConfig.IntegralStore;
		for (let k in dataProvider) {
			arr.push(dataProvider[k]);
		}
		this.list.dataProvider = new eui.ArrayCollection(arr);
		this.label1.text = `我的积分：${CommonUtils.overLength(Shop.ins().shopData.point)}（在神秘商店购买商品或刷新获得）`;
	}

	private onTap(e: egret.TouchEvent) {
		if (e.target.name == "buy") {
			let goodsID = e.target.parent['goodsID'];
			let dataProvider = GlobalConfig.IntegralStore;
			let integ: IntegralStore;
			for (let k in dataProvider) {
				let element: IntegralStore = dataProvider[k];
				if (element.index == goodsID) {
					integ = element;
				}
			}
			if (integ.type != 1) {
				if (UserBag.ins().getSurplusCount() <= 0) {
					let strTips: string = "背包已满，无法购买";
					UserTips.ins().showTips( strTips);
					return;
				}
			}
			if (Actor.yb < integ.price) {
				UserTips.ins().showTips( "|C:0xf3311e&T:元宝不足|");
				return;
			}
			if (Shop.ins().shopData.point < integ.integral) {
				UserTips.ins().showTips( "|C:0xf3311e&T:积分不足！|");
				return;
			}
			Shop.ins().sendIntegrationShop(goodsID);
		}
	}

}