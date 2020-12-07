/**
 *
 * @author hepeiye
 *
 */
class BreakDownListview extends BaseEuiView {

	public closeBtn: eui.Button;
	public closeBtn0: eui.Button;
	public equipList: eui.List;
	public contrain: eui.Group;
	public contrain1: eui.Group;
	public border: eui.Image;
	public bg2: eui.Image;

	private equipScroller:eui.Scroller;

	// public go1: eui.Component;
	// public go2: eui.Component;

	private quality: number;

	private itemList: any[];

	private goList: eui.ArrayCollection;

	private listData: eui.ArrayCollection;

	private gainList:eui.List;

	private bgClose: eui.Rect;
	constructor() {
		super();
	}

	public initUI(): void {
		super.initUI();

		this.skinName = "BreakDownSkin";
		this.isTopLevel = true;
		this.equipList.itemRenderer = BreakDownItemRenderer;
		this.listData = new eui.ArrayCollection();

		this.equipList.dataProvider = this.listData;

		this.gainList.itemRenderer = GainGoodsItem;
		this.goList = new eui.ArrayCollection();
		this.gainList.dataProvider = this.goList;
	}

	public open(...param: any[]): void {
		this.addTouchEvent(this.closeBtn, this.onTap);
		this.addTouchEvent(this.closeBtn0, this.onTap);
		this.addTouchEvent(this.bgClose, this.onTap);
		this.observe(UserBag.ins().postItemDel, this.updateData);//道具删除
		this.addTouchEvent(this, this.onTap);
		this.gainList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onGo, this);

		this.quality = param[0];
		this.updateData();
	}

	public close(...param: any[]): void {
		this.removeTouchEvent(this.closeBtn, this.onTap);
		this.removeTouchEvent(this.closeBtn0, this.onTap);
		this.removeTouchEvent(this.bgClose, this.onTap);
		this.removeTouchEvent(this, this.onTap);
		this.gainList.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onGo, this);

		this.removeObserve();
	}

	private updateData(): void {
		let itemData = UserBag.ins().getBagEquipsByQuality(this.quality);
		itemData.sort((n1, n2) => {
			let config1 = GlobalConfig.ItemConfig[n1.configID];
			let config2 = GlobalConfig.ItemConfig[n2.configID];
			if (config1.zsLevel > config2.zsLevel) {
				return 1;
			}

			if (config1.zsLevel < config2.zsLevel) {
				return -1;
			}

			if (config1.level > config2.level) {
				return 1;
			}

			if (config1.level < config2.level) {
				return -1;
			}

			return 0;
		});

		this.listData.source = itemData;

		let dataList: any[] = this.itemList[this.quality];
		let dataNum: number = dataList.length;
		this.goList.removeAll();
		for (let i =0 ;i < dataList.length; i++) {
			this.goList.addItem(dataList[i]);
		}

		this.refushPos(dataNum);
	}

	private refushPos(len: number): void {
		this.contrain.height = 60*len;
		this.equipScroller.height = 310 + 60 * (3-len);
	}

	private onTap(e: egret.TouchEvent): void {
		switch (e.currentTarget) {
			case this.closeBtn0:
			case this.closeBtn:
			case this.bgClose:
				ViewManager.ins().close(this);
				break;

			default:
				if (e.target instanceof eui.Button) {
					switch (e.target.name) {
						case "breakDown":
							// ControllerManager.ins().applyFunc(
							// 	ControllerConst.RoleWin,
							// 	RoleWinFunc.SMELT_EQUIT,
							// 	1,
							// 	[e.target.parent["data"]]
							// );
							UserEquip.ins().sendSmeltEquip(1, [e.target.parent["data"]]);
							break;
					}
				}
		}
	}

	private onGo(e: eui.ItemTapEvent): void {
		let item: Array<any> = e.item;
		if (e.item == null) {
			return;
		}
		let openSuccess: boolean = ViewManager.ins().viewOpenCheck(item[1], item[2]);
		if (openSuccess) {
			GameGuider.guidance(item[1], item[2]);
			ViewManager.ins().close(this);
		}
	}

}

ViewManager.ins().reg(BreakDownListview, LayerManager.UI_Popup);
