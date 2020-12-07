/**
 * Created by wanghengshuai on 2018/3/15.
 *
 */
class OSATarget22Panel2 extends BaseView {
	public refreshShopBtn: eui.Button;
	public priceTxt: eui.Label;
	public icon: eui.Image;
	public point: eui.Label;
	public refreshTime: eui.Label;
	public listView: eui.List;
	public title: eui.Image;
	public itemShow0: FDstoreShowItemRender;
	public itemShow1: FDstoreShowItemRender;
	public itemShow2: FDstoreShowItemRender;
	public itemShow3: FDstoreShowItemRender;
	public itemShow4: FDstoreShowItemRender;
	public noGoods: eui.Label;
	public redPoint: eui.Image;
	public moneyIcon: eui.Image;
	public price: eui.Label;
	public refresh: eui.Label;
	public refreshFree: eui.Label;
	public refreshTip: eui.Label;

	public activityID: number;

	private _collect: ArrayCollection;

	private objList: any[];

	public constructor(id: number) {
		super();
		this.activityID = id;
		this.setCurSkin();
	}

	private setCurSkin(): void {
		let aCon: ActivityConfig = GlobalConfig.ActivityConfig[this.activityID];
		if (aCon.pageSkin)
			this.skinName = aCon.pageSkin;
		else
			this.skinName = "FDStoreSkin";
	}

	public childrenCreated(): void {
		super.childrenCreated();
		this.listView.itemRenderer = FDstoreItemRender;
	}

	public open(...param: any[]): void {

		this.setCurSkin();

		this.observe(Activity.ins().postActivityIsGetAwards, this.updateData);
		this.observe(UserBag.ins().postItemAdd, this.updateMaterial);
		this.observe(UserBag.ins().postItemChange, this.updateMaterial);
		this.observe(UserBag.ins().postItemDel, this.updateMaterial);

		TimerManager.ins().doTimer(1000, 0, this.setTime, this);
		this.addTouchEvent(this, this.onTouch);

		this.updateData();
		this.updateMaterial();
		this.setTime();
	}

	public close(...param: any[]): void {
		this.removeTouchEvent(this, this.onTouch);
		this.removeObserve();
		TimerManager.ins().removeAll(this);

		if (this.objList) {
			let obj: eui.BitmapLabel;
			for (let i: number = 0; i < this.objList.length; i++) {
				obj = this.objList.shift();
				egret.Tween.removeTweens(obj);
				DisplayUtils.removeFromParent(obj);
			}

			this.objList = null;
		}
	}

	public updateData(): void {
		if (!this._collect) {
			this._collect = new ArrayCollection();
			this.listView.dataProvider = this._collect;
		}

		let data: ActivityType22Data = Activity.ins().activityData[this.activityID] as ActivityType22Data;
		let datas: any[] = [];
		let items: SpringBeginShopVo[] = data.shopItems;
		let len: number = items ? items.length : 0;
		for (let i: number = 0; i < len; i++)
			datas.push({data: items[i], activityID: this.activityID});

		this.noGoods.visible = !datas || !datas.length;
		this._collect.source = datas;
		this.redPoint.visible = data.refreshFree;
		this.refresh.visible = this.priceTxt.visible = this.moneyIcon.visible = !data.refreshFree;
		let cfg1: ActivityType22_1Config = GlobalConfig.ActivityType22_1Config[this.activityID][1];
		this.priceTxt.text = cfg1.freshPrice + "";
		this.refreshFree.visible = data.refreshFree;

		this.icon.source = GlobalConfig.ItemConfig[cfg1.costItem].icon + "_png";
		//限制物品
		items = data.limitItems;
		len = items ? items.length : 0;
		let vo: SpringBeginShopVo;
		let limitItem: FDstoreShowItemRender;
		for (let i: number = 0; i < 5; i++) {
			limitItem = this["itemShow" + i];
			if (i <= len - 1) {
				vo = items[i];
				limitItem.visible = true;
				limitItem.update({itemID: vo.itemID, max: vo.buyMax, buy: vo.buyCount});
			}
			else
				limitItem.visible = false;
		}
	}

	private updateMaterial(): void {
		let itemData: ItemData = UserBag.ins().getBagItemById(GlobalConfig.ActivityType22_1Config[this.activityID][1].costItem);
		let count: number = itemData ? itemData.count : 0;
		this.point.text = "X" + count;
		this.point.textColor = count ? 0x00FF00 : 0xFF0000;
	}

	private onTouch(e: egret.TouchEvent): void {
		switch (e.target) {
			case this.refreshShopBtn:
				let data: ActivityType22Data = Activity.ins().activityData[this.activityID] as ActivityType22Data;
				if (data.refreshFree)
					Activity.ins().sendReward(this.activityID, 0, 5, 0);
				else {
					let price: number = GlobalConfig.ActivityType22_1Config[this.activityID][1].freshPrice;
					if (Actor.yb < price)
						UserTips.ins().showTips(`|C:0xf3311e&T:元宝不足|`);
					else {
						Activity.ins().sendReward(this.activityID, 0, 5, 0);
						this.flyRMB(price);
					}
				}
				break;
		}
	}

	private flyRMB(rmb: number) {
		if (!this.objList)
			this.objList = [];

		let obj: eui.BitmapLabel = new eui.BitmapLabel();
		obj.font = <any>'num_2_fnt';
		obj.y = -10;
		obj.x = 460;
		obj.scaleX = obj.scaleY = 1.5;
		obj.text = `-${rmb}`;
		this.addChild(obj);
		this.objList.push(obj);
		egret.Tween.get(obj).to({y: obj.y + 50}, 1000).call(() => {
			DisplayUtils.removeFromParent(obj);
			this.objList.shift();
		});
	}

	private setTime() {
		let data: ActivityType22Data = Activity.ins().activityData[this.activityID] as ActivityType22Data;
		let time: number = data.getRefreshTime();
		this.refreshTime.text = DateUtils.getFormatBySecond(time > 0 ? time : 0, DateUtils.TIME_FORMAT_1, 5);
		this.refreshTime.visible = this.refreshTip.visible = time > 0;
	}
}