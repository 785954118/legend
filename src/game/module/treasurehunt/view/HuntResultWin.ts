/**
 *
 * @author hepeiye
 *
 */
const c_launchX = 180;
const c_launchY = 500;
const c_firstX = 0;
const c_firstY = 0;
const c_distantX = 77;
const c_distantY = 93;
const c_depotX = 320;
const c_depotY = 620;
const waitTime = 50;

class HuntResultWin extends BaseEuiView {
	public dinghong: eui.Group;
	public title: eui.Label;
	public buyBtn: eui.Button;
	public zwHunt: eui.Group;
	public zw: eui.Label;
	public icon: eui.Image;
	public zwNum1: eui.Label;
	public zwNum2: eui.Label;
	public listCon: eui.Group;

	private huntType: number;
	private arr = [];
	private items: ItemBase[] = [];
	private canClicck: boolean;
	private type: number = 0;
	private activityID: number;
	private yb: number;

	constructor() {
		super();
	}

	public initUI(): void {
		super.initUI();

		this.skinName = "HuntResult";
		this.isTopLevel = true;
	}

	public open(...param: any[]): void {
		this.addTouchEvent(this.buyBtn, this.buy);
		this.observe(Hunt.ins().postHuntResult, this.updateView);
		this.observe(Heirloom.ins().postHuntResult, this.updateView);
		this.observe(Activity.ins().postHuntResult, this.updateView);
		// this.observe(Rune.ins().postHuntRuneInfo, this.updateRuneDesc);

		//寻宝的类型   寻到的数据    寻宝/探宝
		this.updateView([param[0], param[1], param[2], param[3]]);
	}

	public close(...param: any[]): void {
		this.removeTouchEvent(this.buyBtn, this.buy);
		this.removeObserve();
	}

	private updateView(param: any[]): void {
		//寻宝的类型   寻到的数据    寻宝/探宝
		this.canClicck = true;
		this.huntType = param[0];
		this.arr = param[1];
		this.type = param[2];
		this.activityID = param[3];
		if (this.type == 3) {
			this.currentState = "noItem";
		} else {
			this.currentState = "normal";
		}
		this.validateNow();

		if (this.huntType == 0) { // 1
			// this.buyBtn.icon = 'xb_25';
			let num: number = 0;
			if (this.type == 0)
				num = GlobalConfig.TreasureHuntConfig.huntOnce;
			else if (this.type == 1)
				num = GlobalConfig.FuwenTreasureConfig.huntOnce;
			else if (this.type == 2)
				num = GlobalConfig.HeirloomTreasureConfig.huntOnce;
			else if (this.type == 3)
				num = GlobalConfig.ActivityType18Config[this.activityID][1].yb;

			// this.num.text = num + "";
			this.yb = num;
			this.buyBtn.labelDisplay.text = `购买1次`;
		} else { // 10
			// this.buyBtn.icon = 'xb_26';
			let num: number = 0;
			if (this.type == 0)
				num = GlobalConfig.TreasureHuntConfig.huntTenth;
			else if (this.type == 1)
				num = GlobalConfig.FuwenTreasureConfig.huntTenth;
			else if (this.type == 2)
				num = GlobalConfig.HeirloomTreasureConfig.huntTenth;
			else if (this.type == 3)
				num = GlobalConfig.ActivityType18Config[this.activityID][2].yb;
			// this.num.text = num + "";
			this.yb = num;
			this.buyBtn.labelDisplay.text = `购买10次`;
		}

		this.zwHunt.visible = true;
		let itemId: number;
		if (this.type == 0)
			itemId = GlobalConfig.TreasureHuntConfig.huntItem;
		else if (this.type == 1)
			itemId = GlobalConfig.FuwenTreasureConfig.huntItem;
		else if (this.type == 2)
			itemId = GlobalConfig.HeirloomTreasureConfig.huntItem;
		else if (this.type == 3)
			itemId = GlobalConfig.ActivityType18Config[this.activityID][1].item;

		this.zw.text = this.yb + "";
		let item: ItemData = UserBag.ins().getBagGoodsByTypeAndId(UserBag.BAG_TYPE_OTHTER, itemId);
		let times: number = this.huntType ? 10 : 1;
		let sum: number = item ? item.count : 0;
		this.zwNum1.textFlow = TextFlowMaker.generateTextFlow(`<font color=${sum >= times ? ColorUtil.GREEN_COLOR : ColorUtil.RED_COLOR}>${sum}</font> `);
		this.icon.source = GlobalConfig.ItemConfig[itemId].icon + `_png`;

		this.zwNum2.text = this.huntType == 0 ? `/1）` : `/10）`;
		this.playResult();
	}

	private playResult(fun?) {
		this.releaseAllItem();
		let count = this.arr.length;
		for (let i = 0; i < count; i++) {
			this.items[i] = this.createItem(this.arr[i]);
			let t: egret.Tween = egret.Tween.get(this.items[i]);
			this.items[i].x = (i % 5) * c_distantX + c_firstX;
			this.items[i].y = Math.floor(i / 5) * c_distantY + c_firstY;
			this.items[i].alpha = 0;
			// this.items[i].showEquipEffect();
			t.wait(i * waitTime).to({alpha: 1}, 200).call(
				() => {
					count--;
					if (count == 0) {
						if (fun != undefined) {
							fun();
						}
						this.canClicck = true;
					}
				});
		}
	}

	private playGet(fun?) {
		let count = this.arr.length;
		for (let i = 0; i < count; i++) {
			if (!this.items[i])
				continue;
			let t: egret.Tween = egret.Tween.get(this.items[i]);
			t.to({
				"y": c_depotY,
				"x": c_depotX,
				"scaleX": 0,
				"scaleY": 0
			}, 300 - Math.floor(i / 5) * 50).call(
				() => {
					count--;
					if (count == 0) {
						if (fun != undefined) {
							fun();
						}
						this.releaseAllItem();
					}
				}
			);
		}
	}

	private createItem(data): ItemBase {
		let item = new ItemBase();
		this.listCon.addChild(item);
		let cfg: ItemConfig = GlobalConfig.ItemConfig[data[0]];
		if (cfg) {
			item.num = data[1];
			item.data = data[0];
		} else {
			item.data = {type: 0, count: data[1], id: data[0]};
		}
		item.x = c_launchX;
		item.y = c_launchY;

		// if (item.getItemType() == 17)
		// 	item.showSpeicalDetail = false;

		return item;
	}

	private releaseAllItem() {
		for (let k in this.items) {
			this.items[k].destruct();
			this.listCon.removeChild(this.items[k]);
		}
		this.items = [];
	}

	private closeCB(e: egret.TouchEvent) {
		if (!this.canClicck) {
			return;
		}
		this.canClicck = false;

		let func = () => {
			ViewManager.ins().close(this);
		};
		this.playGet(func);
	}

	private buy(e: egret.TouchEvent) {
		if (this.type == 3) {//活动寻宝
			if (UserBag.ins().getSurplusCount() < UserBag.BAG_ENOUGH) {
				ViewManager.ins().open(BagFullTipsWin);
				return;
			}
		}
		if (!this.canClicck) {
			return;
		}

		if (this.type == 2 && this.huntType == 0 && Heirloom.ins().huntFreeTimes > 0) {
			Heirloom.ins().sendHunt(this.huntType);
			return;
		}

		let itemId = 0;
		if (this.type == 3)
			itemId = GlobalConfig.ActivityType18Config[this.activityID][1].item;
		else if (this.type == 2)
			itemId = GlobalConfig.HeirloomTreasureConfig.huntItem;
		else if (this.type == 1)
			itemId = GlobalConfig.FuwenTreasureConfig.huntItem;
		else
			itemId = GlobalConfig.TreasureHuntConfig.huntItem;

		let item: ItemData = UserBag.ins().getBagGoodsByTypeAndId(UserBag.BAG_TYPE_OTHTER, itemId);
		if (item && item.count) {
			let func = () => {
				if (this.type == 0)
					Hunt.ins().sendHunt(this.huntType);
				else if (this.type == 1)
					Rune.ins().sendHuntRune(this.huntType);
				else if (this.type == 2)
					Heirloom.ins().sendHunt(this.huntType);
				else if (this.type == 3)
					Activity.ins().sendReward(this.activityID, this.huntType == 0 ? 1 : 2);
			};
			this.playGet(func);
			this.canClicck = false;
		}
		else {
			let times: number = this.huntType ? 10 : 1;
			HuntWarnBuyWin.showBuyWarn(this.getPanelNameByType(this.type) + "-HuntResultWin" + this.huntType, this.huntWarnFun.bind(this), `是否消耗${this.yb}元宝购买${GlobalConfig.ItemConfig[itemId].name}*${times}`)
		}
	}

	private getPanelNameByType(type: number): string {

		if (this.type == 3)
			return "OSATarget18Panel1";
		else if (this.type == 2)
			return "TreasureChuanshiPanel";
		else if (this.type == 1)
			return "TreasureRunePanel";
		else
			return "TreasureHuntPanel";
	}

	private huntWarnFun(): void {
		if (Actor.yb >= this.yb) {
			let func = () => {
				if (this.type == 0)
					Hunt.ins().sendHunt(this.huntType);
				else if (this.type == 1)
					Rune.ins().sendHuntRune(this.huntType);
				else if (this.type == 2)
					Heirloom.ins().sendHunt(this.huntType);
				else if (this.type == 3)
					Activity.ins().sendReward(this.activityID, this.huntType == 0 ? 1 : 2);
			};

			this.playGet(func);
			this.canClicck = false;
		} else {
			UserTips.ins().showTips("|C:0xf3311e&T:元宝不足|");
		}
	}

}

ViewManager.ins().reg(HuntResultWin, LayerManager.UI_Main);
