/**
 * Created by Peach.T on 2017/12/17.
 */
class SamsaraComposePanel extends BaseEuiView {

	public list: eui.List;
	public list0: eui.List;
	private materialId: number;
	private contentScroller: eui.Scroller;

	public zsLv: number;
	public type: number;

	private _tabListData: eui.ArrayCollection;
	private _listData: eui.ArrayCollection;
	protected childrenCreated() {
		this.initUI();
	}

	public initUI(): void {
		super.initUI();

		this.list.itemRenderer = SamsaraComposeMenuItem;
		this.list0.itemRenderer = SamsaraComposeItem;
		this._listData = new eui.ArrayCollection();
		this.list0.dataProvider = this._listData;

		this._tabListData = new eui.ArrayCollection();
		this.list.dataProvider = this._tabListData;
	}

	public open(): void {
		this.updateState();

		this.observe(UserBag.ins().postItemAdd, this.buffUpdata);//道具添加
		this.observe(UserBag.ins().postItemDel, this.buffUpdata);//道具
		this.observe(UserBag.ins().postItemCountChange, this.buffUpdata);//道具
		this.observe(SamsaraCC.ins().postCompose, this.buffUpdata);
	}
	/**缓冲数据更新，100毫秒内只处理一次！合成时，会更新很多次，导致掉帧严重 */
	private buffUpdata(): void {
		TimerManager.ins().remove(this.updateState, this);
		TimerManager.ins().doTimer(100, 1, this.updateState, this);
	}
	public updateState(): void {
		let data = SamsaraModel.ins().getComposeEquipList();
		let type: number;
		let zsLv: number;
		if (data && data.length > 0) {
			this.materialId = data[0];
			let targetId = SamsaraModel.ins().getComposeTarget(this.materialId);
			let itemCfg = GlobalConfig.ItemConfig[targetId];
			let cfg = GlobalConfig.ReincarnateEquipCompose[targetId];
			type = cfg.distinguishi;
			zsLv = itemCfg.zsLevel;
		}
		else {
			this.materialId = 0;
			type = 1;
			zsLv = GlobalConfig.ReincarnationBase.equipsList[0][0];
		}
		this.zsLv = zsLv;
		this.type = type;
		// this.list.dataProvider = new ArrayCollection(SamsaraModel.ins().getComposeMenu());
		// this._tabListData.replaceAll(SamsaraModel.ins().getComposeMenu());//不会滚动 有问题
		this._tabListData.source = SamsaraModel.ins().getComposeMenu();//会滚动
		this.updateView(type, zsLv, this.materialId);


	}

	/**
	 * 设置左边列表的选中状态
	 * @param index
	 */
	private selectList(composeItem: SamsaraComposeMenuItem, zsLv: number): void {
		let list = composeItem.list;
		let count = list.dataProvider.length;
		for (let i = 0; i < count; i++) {
			let item = list.getElementAt(i) as SamsaraComposeSecMenuItem;
			if (item) {
				if (zsLv == item.data["zsLv"]) {
					composeItem.selectList(i);
					return;
				}
			}
		}
	}

	public unSelectList(): void {
		let count = this.list.dataProvider.length;
		for (let i = 0; i < count; i++) {
			let item = this.list.getElementAt(i) as SamsaraComposeMenuItem;
			let tempList = item.list;
			for (let j = 0; j < tempList.dataProvider.length; j++) {
				let tempItem = tempList.getElementAt(j) as SamsaraComposeSecMenuItem;
				if (tempItem) tempItem.setSelect(false);
			}
		}
	}

	public updateView(type: number, zsLv: number, materialId: number = 0): void {
		let data: number[] = SamsaraModel.ins().composeEquipMap[type][zsLv];
		// this.list0.dataProvider = new ArrayCollection(data);
		// this._listData.replaceAll(data);
		this._listData.source = data;
		this.refushBarList(materialId);
	}

	private refushBarList(materialId: number): void {
		if (!materialId) {
			this.contentScroller.viewport.scrollV = 0;//默认顶部
			return;
		}
		let targetId = SamsaraModel.ins().getComposeTarget(this.materialId);
		let data = this.list0.dataProvider;
		for (let i = 0; i < data.length; i++) {
			if (targetId == data.getItemAt(i)) {
				this.contentScroller.viewport.validateNow();
				this.contentScroller.viewport.scrollV = i * 101;
				if (this.contentScroller.viewport.contentHeight - this.contentScroller.viewport.scrollV < this.contentScroller.viewport.height) {
					this.contentScroller.viewport.scrollV = this.contentScroller.viewport.contentHeight - this.contentScroller.height;
				}
				break;
			}
		}
	}

	public close(): void {
		this.removeObserve();
	}
}
