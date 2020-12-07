class PunchEquipItem extends BaseComponent {

	public addBtn: eui.Image;
	public img: eui.Image;
	// public quality: eui.Image;
	public redPoint: eui.Image;

	public wearData: ItemData = null;

	public constructor() {
		super();
		this.skinName = 'PunchEquipItemSkin';
	}

	protected dataChanged(): void {
		this.img.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.addBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		let data: ItemData = UserSkill.ins().equipListData[this.data];
		this.wearData = UserSkill.ins().getWearEquipsData(this.data);
		this.img.source = "";
		this.addBtn.visible = true;
		if (data && data.itemConfig) {
			let subType = ItemConfig.getSubType(data.itemConfig);
			let nameStrig1 = 'new_juese_heji_pintu'; // +'01_01'
			let nameStrig = 'new_juese_heji_pingtu'; // +'01_01'
			let numebr = subType + 1
			switch (data.itemConfig.zsLevel) {
				case 1:
					nameStrig += '03_0' + numebr
					break;
				case 3:
					nameStrig += '04_0' + numebr
					break;
				case 4:
					nameStrig += '05_0' + numebr
					break;
				case 5:
					nameStrig += '06_0' + numebr
					break;
				case 6:
					nameStrig += '07_0' + numebr
					break;
				case 7:
					nameStrig += '08_0' + numebr
					break;
				default:

					switch (data.itemConfig.level) {
						case 60:

							nameStrig1 += '01_0' + numebr
							nameStrig = nameStrig1
							break;
						case 70:
							nameStrig += '02_0' + numebr
							break
					}
					break
			}

			this.img.source = nameStrig
			// this.img.source = `${data.itemConfig.zsLevel || 0}${data.itemConfig.level || 1}_${subType + 1}_png`;
			this.redPoint.visible = UserSkill.ins().checkIsHaveBestEquip(subType);
			// this.addBtn.visible = false;
		} else {
			this.img.source = "";
			// this.redPoint.visible = this.addBtn.visible = UserSkill.ins().checkIsHaveBestEquip(this.data);
			this.redPoint.visible = UserSkill.ins().checkIsHaveBestEquip(this.data);
		}
	}

	public destruct(): void {
		this.img.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.addBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
	}

	private onTap(): void {
		if (this.wearData && this.wearData.configID != 0)
			ViewManager.ins().open(HejiEquipTipsWin, this.wearData, true);
		else
			ViewManager.ins().open(HejiEquipTipsWin, this.data, true);
		// ViewManager.ins().open(PunchEquipChooseWin, this.data, 0);
	}
}