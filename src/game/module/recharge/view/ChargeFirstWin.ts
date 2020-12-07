class ChargeFirstWin extends BaseEuiView {

	public closeBtn: eui.Button;
	public kefuBtn: eui.Button;
	public list: eui.List;
	public closeBtn0: eui.Button;
	public scrollBar: eui.Scroller;
	private topGroup: eui.Group;
	private barbc = new ProgressBarEff();
	private tipsText: eui.Label;
	// private vipImage: eui.Image;
	private vipBtn: eui.Button;
	private vipGroup: eui.Group;
	private vipValue: egret.DisplayObjectContainer;
	constructor() {
		super();
		this.skinName = "ChargeSkin";
		this.isTopLevel = true;
	}

	public initUI(): void {
		super.initUI();
		// this.setSkinPart("roleSelect", new RoleSelectPanel());

		this.list.itemRenderer = ChargeItemRenderer;
		this.scrollBar.viewport = this.list;

		// let dataList: RechargeItemsConfig[] = GlobalConfig.RechargeItemsConfig;
		// console.log(dataList)
		// let dataArr: any[] = [];
		// for (let str in dataList) {
		// 	dataArr.push(dataList[str]);
		// }
		let dataArr = window["getsecChargePriceInfo"]();
		this.list.dataProvider = new eui.ArrayCollection(dataArr);

		this.barbc.setWidth(340);
		this.barbc.x = 80;
		this.barbc.y = 12;
		this.topGroup.addChild(this.barbc);

		this.vipValue = BitmapNumber.ins().createNumPic(0, "vip_v", 5);
		this.vipValue.x = 36;
		this.vipValue.y = 39;
		this.vipGroup.addChild(this.vipValue);
	}

	public open(...param: any[]): void {
		this.addTouchEvent(this.closeBtn, this.onTap);
		this.addTouchEvent(this.kefuBtn, this.onTap);
		this.addTouchEvent(this.closeBtn0, this.onTap);
		this.addTouchEvent(this.vipBtn, this.onTap);
		this.observe(Recharge.ins().postUpDataItem, this.refushInfo);
		this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onListTap, this);
		this.barbc.reset();
		this.setView();
		// WarnWin.show('充值300以上，可以找客服拿月卡特权', function () { }, this,function(){},this,'sure');
	}

	public close(...param: any[]): void {
		this.removeTouchEvent(this.closeBtn, this.onTap);
		this.removeTouchEvent(this.kefuBtn, this.onTap);
		this.removeTouchEvent(this.closeBtn0, this.onTap);
		this.removeTouchEvent(this.vipBtn, this.onTap);
		this.list.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onListTap, this);
		this.removeObserve();
	}

	private onListTap(e: eui.ItemTapEvent) {
		let data = e.item;
		let yuanbao = 0
		let money = 0
		if (Recharge.ins().getOrderByIndex(data.moneyid)) {
			yuanbao = data.yuanbao_num
		} else {
			yuanbao = data.award
		}
		if (data.trueCost == 1) {
			money = parseInt(data.dazhe_num);
		} else {
			money = parseInt(data.money_num);
		}

		if(data.status ==1){
			Recharge.ins().showReCharge(money, yuanbao,0);
		}else{
			WarnWin.show(data.msg, function () { }, this,function(){},this,'sure');
		}

		
	}

	private onTap(e: egret.TouchEvent): void {
		switch (e.currentTarget) {
			case this.closeBtn:
			case this.closeBtn0:
				ViewManager.ins().close(ChargeFirstWin);
				break;
			case this.kefuBtn:
				let url = window['getkefuUrl']()
				if (window['getNative']() == 'web') {
					window.open(url)
				} else {
					egret.ExternalInterface.call("openURL", url);
				}
				break;
			case this.vipBtn:
				ViewManager.ins().open(VipWin);
				break;
		}
	}

	private refushInfo() {
		let dataPro = this.list.dataProvider as eui.ArrayCollection;
		for (let i = 0; i < dataPro.length; i++) {
			let data = dataPro.getItemAt(i);
			dataPro.itemUpdated(data);
		}
		this.setView();
	}

	private setView(): void {
		let curLv = UserVip.ins().lv
		let nextConfig: VipConfig = GlobalConfig.VipConfig[curLv + 1];
		let nextNeedYb: number = 0;
		let ybValue: number = 0;
		let str: string = "";
		let curNeedYb: number = UserVip.ins().exp;
		if (nextConfig) {
			nextNeedYb = nextConfig.needYb - curNeedYb;
			let needYb: number = nextNeedYb - ybValue;
			str = `再充值|C:0xFFAA24&T:${nextNeedYb}元宝|成为|C:0xFFAA24&T:VIP${(curLv + 1)}|`;
			this.barbc.setData(curNeedYb, nextConfig.needYb);
		} else {
			str = "VIP等级已满";
			this.barbc.max();
		}
		// this.vipImage.source = `vip_v${curLv}_png`;
		BitmapNumber.ins().changeNum(this.vipValue, curLv, "vip_v", 3);
		if (curLv < 10) {
			this.vipValue.x = 36;
			this.vipValue.y = 39;
		} else {
			this.vipValue.x = 26;
			this.vipValue.y = 39;
		}
		this.tipsText.textFlow = TextFlowMaker.generateTextFlow(str);
	}
}

ViewManager.ins().reg(ChargeFirstWin, LayerManager.UI_Popup);