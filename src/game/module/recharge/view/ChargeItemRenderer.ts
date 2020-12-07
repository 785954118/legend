class ChargeItemRenderer extends BaseItemRender {
	public gain0: eui.Label;
	public gain1: eui.Label;
	public pay: eui.Label;
	public pay0: eui.Label;
	public pay1: eui.Label;
	public payPrice: eui.Group;
	public moneyGroup: eui.Group;
	public allImg: eui.Group;
	public yuanbaoImg: eui.Image;
	// private blackRect: eui.Rect;
	private totalPower: egret.DisplayObjectContainer;
	public constructor() {
		super();
		this.skinName = "ChargeItemSkin";

		this.totalPower = BitmapNumber.ins().createNumPic(0, "vip_v", 5);
		this.totalPower.x = 0;
		this.totalPower.y = 0;
		this.moneyGroup.addChild(this.totalPower);
	}

	protected dataChanged(): void {
		//元宝图片
		this.refushInfo();
	}

	private refushInfo(): void {
		this.yuanbaoImg.source = this.data.icon;

		//颜色矩阵数组
		var colorMatrix = [
			0.3, 0.6, 0, 0, 0,
			0.3, 0.6, 0, 0, 0,
			0.3, 0.6, 0, 0, 0,
			0, 0, 0, 1, 0
		];
		var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);

		if(this.data.status != 1) {
			this.allImg.filters =  [colorFlilter];
		} 

		let cost: number = parseInt(this.data.money_num);
		this.pay.text = `原价:${cost}元`;
		let trueCost: number = parseInt(this.data.dazhe_num);
		if (this.data.trueCost == 1) {
			this.payPrice.visible = true
			this.pay1.visible = false
		} else {
			this.payPrice.visible = false
			this.pay1.visible = true
		}
		this.pay1.text = `${cost}元`
		this.pay0.text = `${trueCost}元`;

		this.pay.strokeColor = 0x000000;
		this.pay.stroke = 2;
		this.pay1.strokeColor = 0x000000;
		this.pay1.stroke = 2;
		this.pay0.strokeColor = 0x000000;
		this.pay0.stroke = 2;
		if (Recharge.ins().getOrderByIndex(this.data.moneyid)) {
			BitmapNumber.ins().changeNum(this.totalPower, this.data.yuanbao_num, "vip_v", 3);
		} else {
			BitmapNumber.ins().changeNum(this.totalPower, this.data.award, "vip_v", 3);
		}
		this.moneyGroup.width = this.totalPower.width;
		this.invalidateState();
	}

	protected getCurrentState(): string {
		let state = "up";
		if (Recharge.ins().getOrderByIndex(this.data.moneyid)) {
			if (this.selected) {
				state = "down";
			}
		} else {
			state = "firstUp"
			if (this.selected) {
				state = "fistDown";
			}
		}

		return state;
	}
}