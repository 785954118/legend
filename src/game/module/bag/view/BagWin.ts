/**
 * 背包窗口
 */
class BagWin extends BaseEuiView {
	/**关闭按钮 */
	public closeBtn: eui.Button;
	public viewStack: eui.ViewStack;
	/**熔炼按钮*/
	public smeltBtn: eui.Button;
	public redPoint: eui.Button;
	public addBtn: eui.Button;
	public itemCount: eui.Label;
	public tab: eui.TabBar;
	public itemList: eui.List;
	public itemListGoods: eui.List;
	public itemScroller: eui.VScrollBar;
	public itemGoodsScroller: eui.VScrollBar;
	public redPoint0: eui.Image;
	public redPoint1: eui.Image;
	public redPoint2: eui.Image;
	public redPoint3: eui.Image;
	public itemListRune: eui.List;
	public reinComposePanel: ComposePanel;  //轮回装备合成
	public redPointGroup: eui.Group;

	private oldIndex: number = 0;

	constructor() {
		super();
		this.skinName = `BagSkin`;
		this.isTopLevel = true;//设为1级UI
		// this.setSkinPart("roleSelect", new RoleSelectPanel());
	}

	public initUI(): void {
		super.initUI();
		this.tab.dataProvider = this.viewStack;
		this.itemList.itemRenderer = ItemBase;
		this.itemListGoods.itemRenderer = ItemBase;
		this.itemListRune.itemRenderer = ItemBase;
		this.itemScroller.viewport = this.itemList;
		this.itemGoodsScroller.viewport = this.itemListGoods;
	}

	public open(...param: any[]): void {

		this.addTouchEvent(this.closeBtn, this.onClick);
		this.addTouchEvent(this.smeltBtn, this.onClick);
		this.addTouchEvent(this.addBtn, this.onClick);
		this.addChangeEvent(this.tab, this.onClick);
		this.observe(UserBag.ins().postBagWillFull, this.setBagTips);//背包是否即将满
		// this.observe(UserBag.ins().postUseItemSuccess, this.updateBag);
		this.observe(UserBag.ins().postBagVolAdd, this.setCount);
		this.observe(UserBag.ins().postHasItemCanUse, this.setIsExitUsedItem);//背包是否有可用道具提示
		this.observe(UserBag.ins().postItemCountChange, this.showBagBtnRedPoint);//道具数量变更
		this.observe(UserBag.ins().postItemChange, this.updateBag);
		this.observe(UserBag.ins().postItemAdd, this.updateBag);//道具添加
		this.observe(UserBag.ins().postItemDel, this.updateBag);//道具添加
		let index = 0;
		if (param[0] != undefined){
			index = param[0];
			if(index == 3){//合成
				this.reinComposePanel.open(param[1],param[2],param[3]);
			}
		}
		this.viewStack.selectedIndex = this.tab.selectedIndex = index;
		this.setBagData(index);
		this.setIsExitUsedItem();
		UserBag.ins().postBagVolChange();
		this.showBagBtnRedPoint(UserBag.ins().isChange);
		if (MergeCC.ins().isOpen()) {
			this.openMerge();

		} else {
			this.inactiveSamsara();
		}
	}

	public close(...param: any[]): void {
		let uiview2: UIView2 = ViewManager.ins().getView(UIView2) as UIView2;
		if (uiview2) uiview2.closeNav(UIView2.NAV_BAG);
	}

	private openMerge(): void {
		let index = this.viewStack.getChildIndex(this.reinComposePanel);
		if (index < 0) {
			this.viewStack.addChild(this.reinComposePanel);
		}
		this.tab.dataProvider = this.viewStack;
		this.redPointGroup.horizontalCenter = 37;
		this.redPoint3.visible = MergeCC.ins().redPoint();
	}

	private inactiveSamsara(): void {
		let index = this.viewStack.getChildIndex(this.reinComposePanel);
		if (index >= 0) {
			this.viewStack.removeChildAt(index);
		}
		this.tab.dataProvider = this.viewStack;
		this.redPointGroup.horizontalCenter = 98;
		this.redPoint3.visible = false;
	}

	/**点击 */
	private onClick(e: egret.TouchEvent): void {
		switch (e.currentTarget) {
			case this.closeBtn:
				ViewManager.ins().close(BagWin);
				break;
			case this.smeltBtn://熔炼按钮
				ViewManager.ins().close(BagWin);
				ViewManager.ins().open(SmeltEquipTotalWin);
				break;
			case this.addBtn:
				let config = GlobalConfig.BagBaseConfig;
				let row: number = (UserBag.ins().bagNum - config.baseSize) / config.rowSize;
				if (row == CommonUtils.getObjectLength(GlobalConfig.BagExpandConfig)) {
					UserTips.ins().showTips(StringUtils.addColor("格子不能继续扩张", 0xf3311e));

				}
				else
					ViewManager.ins().open(BagAddItemWarn);
				break;
			case this.tab:
				if(this.tab.selectedIndex == 3){
					this.reinComposePanel.open();
				}
				else if (this.tab.selectedIndex == 2) {
					this.setBagData(this.tab.selectedIndex);
				} else {
					this.setBagData(this.tab.selectedIndex);
				}
				break;
		}

	}

	private setCount(): void {
		this.itemCount.text = UserBag.ins().getBagItemNum() + "/" + UserBag.ins().getMaxBagRoom();
	}

	@callDelay(100)
	private updateBag() {
		this.setBagData(this.oldIndex);
	}

	private setBagData(tabIndex: number = 1): void {
		switch (tabIndex) {
			case 0:
				//装备物品排序
				let equipItemData: ItemData[] = UserBag.ins().getBagSortQualityEquips(5, 0, 1);
				equipItemData.sort(UserBag.ins().sort3);
				let dataPro = this.itemList.dataProvider as eui.ArrayCollection;
				if (dataPro) {
					dataPro.replaceAll(equipItemData);
				} else {
					this.itemList.dataProvider = new eui.ArrayCollection(equipItemData);
				}
				break;
			case 1:
				let goodsList: ItemData[] = UserBag.ins().getBagGoodsBySort(0);
				let goodsList2: ItemData[] = UserBag.ins().getBagGoodsBySort(2);

				let goodsList3 = goodsList2.concat(goodsList);
				let goodDataPro = this.itemListGoods.dataProvider as eui.ArrayCollection;
				if (goodDataPro) {
					goodDataPro.replaceAll(goodsList3);
				} else {
					this.itemListGoods.dataProvider = new eui.ArrayCollection(goodsList3);
				}
				break;
			case 2:
				let listRune = UserBag.ins().getBagGoodsBySort(1);
				let runeDataPro = this.itemListRune.dataProvider as eui.ArrayCollection;
				if (runeDataPro) {
					runeDataPro.replaceAll(listRune);
				} else {
					this.itemListRune.dataProvider = new eui.ArrayCollection(listRune);
				}
				break;
		}
		if (this.oldIndex != tabIndex) {
			this.oldIndex = tabIndex;
		} else {
			this.tab.selectedIndex = tabIndex;
		}
		this.setCount();
	}

	/** 背包道具使用红点 */
	private setIsExitUsedItem(): void {
		this.redPoint1.visible = UserBag.ins().getIsExitUsedItem() || UserBag.ins().getBagGoodsCountByType(8);
		this.redPoint2.visible = UserBag.ins().getRuneBagGoodsCountByType(8);
		this.redPoint3.visible = MergeCC.ins().isOpen() &&  MergeCC.ins().redPoint();
	}

	/** 背包装备是否满 */
	private setBagTips(result: number): void {
		this.redPoint0.visible = result > 0 || UserBag.ins().isChange > 0;
	}

	private showBagBtnRedPoint(b: number): void {
		this.redPoint.visible = b > 0;
	}

}

ViewManager.ins().reg(BagWin, LayerManager.UI_Main);
