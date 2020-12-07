/**
 * 神兽守护-装备穿戴面板
 * @author MPeter
 */
class ShenshouWearEquipWin extends BaseEuiView {
	//ui組件部分-----------------------------
	private bgClose: eui.Rect;
	private scroll: eui.Scroller;
	private list: eui.List;
	private tipLabel2: eui.Label;

	//数据部分-----------------------------
	private listDt: eui.ArrayCollection;
	private shenshouId: number;
	private pos: number;
	public constructor() {
		super();
		this.skinName = `SsEquipChooseSkin`;
	}
	public open(...args): void {
		this.addTouchEvent(this.bgClose, this.onTouch);
		this.addTouchEvent(this.list, this.onTouch);

		this.list.itemRenderer = ShenshouWearEquipItem;
		this.listDt = new eui.ArrayCollection();
		this.list.dataProvider = this.listDt;

		this.shenshouId = args[0];
		this.pos = args[1];

		let items = ShenshouModel.ins().findCanWearEquips(this.shenshouId, this.pos)

		if (items.length > 0) {
			if (args[2]) {
				let myEquip = new ShenshouEquipData();
				myEquip.pos = this.pos;
				myEquip.shenshuId = this.shenshouId;
				myEquip.sortIndex = Number.MAX_VALUE;//自己的
				myEquip.id = args[2];

				items.splice(0, 0, myEquip);
			}

			this.listDt.replaceAll(items);
			this.tipLabel2.visible = false;
		}
		else {
			this.tipLabel2.visible = true;
		}
	}
	public close(...args): void {

	}
	private onTouch(e: egret.TouchEvent): void {
		switch (e.target) {
			case this.bgClose:
				ViewManager.ins().close(this);
				break;
			default:
				if (e.target instanceof eui.Button && e.target.parent instanceof ShenshouWearEquipItem) {
					let data: ShenshouEquipData = e.target.parent.data;
					ShenshouSys.ins().sendWearEquip(this.shenshouId, this.pos, data.id);
				}

		}
	}
}
ViewManager.ins().reg(ShenshouWearEquipWin, LayerManager.UI_Popup);