/**
 * 首冲
 */
class Recharge1Win extends BaseEuiView {
	/** 关闭按钮 */
	public closeBtn: eui.Button;
	public kefuBtn: eui.Button;

	private chong0: eui.Button;
	private chong1: eui.Button;
	private chong2: eui.Button;
	private chong3: eui.Button;

	private _data: RechargeData;
	private _index: number;

	private btnArr: eui.Button[];
	private buyed: eui.Button;

	private weapImg: eui.Image;
	private roleImg: eui.Image;

	private unbuy: eui.Group;


	private eff: MovieClip;
	private buyGroup: eui.Group;
	constructor() {
		super();
		this.isTopLevel = true;
	}

	public initUI(): void {
		super.initUI();

		this.setSkinName();

		// this.list.itemRenderer = ItemBase;

		this.btnArr = [];
		for (let i: number = 0; i < 4; i++) {
			this.btnArr.push(this[`chong${i}`]);
		}

		this.eff = new MovieClip;
		this.eff.x = this.buyed.x + 77;
		this.eff.y = this.buyed.y + 32;
		this.eff.scaleX = 1.15;
		this.eff.scaleY = 1.5;
		this.eff.touchEnabled = false;
	}

	protected setSkinName(): void {
		this.skinName = "FirstChargeSkin";
	}
	public static openCheck(...param: any[]): boolean {
		if (!OpenSystem.ins().checkSysOpen(SystemType.FIRSTCHARGE)) {
			UserTips.ins().showTips(OpenSystem.ins().getNoOpenTips(SystemType.FIRSTCHARGE));
			return false;
		}
		let rch: RechargeData = Recharge.ins().getRechargeData(0);
		if (!param[0]) {
			if (rch.num == 2) {
				//每日冲是否领完
				let boo2 = Recharge.ins().getCurDailyRechargeIsAllGet()
				if (!boo2) {
					ViewManager.ins().open(Recharge2Win);
				} else {
					ViewManager.ins().open(ChargeFirstWin);
				}
				return false;
			}
			return true;
		}
		if (rch.num == 2) {
			ViewManager.ins().open(param[0][0]);
			return false;
		}
		return true;

	}
	public open(...param: any[]): void {
		this.addTouchEvent(this.closeBtn, this.closeCB);
		this.addTouchEvent(this.kefuBtn, this.onTouch);
		this.addTouchEvent(this.buyed, this.onTouch);

		for (let i: number = 0; i < this.btnArr.length; i++) {
			this.addTouchEvent(this.btnArr[i], this.onTouch);
		}

		this.observe(Recharge.ins().postUpdateRechargeEx, this.setWinData);

		let playPunView = ViewManager.ins().getView(PlayFunView) as PlayFunView;
		if (playPunView) {
			playPunView.preRecharge = playPunView.recharge.visible = false;
		}
		/**新数据 */

		/**首冲道具奖励表*/
		let job: number = SubRoles.ins().getSubRoleByIndex(0).job;
		let rrd: RechargeRewardData[] = this.getRechargeRewardDatas(job);
		if (rrd) {
			for (let j = 0; j < rrd.length; j++) {
				let d: RechargeRewardData = rrd[j];
				//egret.log("当前道具类型 = " + d.type);
				//egret.log("道具id = " + d.id);
				//egret.log("数量 = " + d.count);
				let da = { id: d.id, type: d.type, count: d.count };
				this["item" + (j + 1)].data = da;

				// let item = GlobalConfig.ItemConfig[d.id];
				// if( item ){
				// 	this["img"+j].source = item.icon.toString()+"_png";
				// 	this["label"+j].text = item.name;
				// }
			}
		}

		/**展示*/
		let frConfig = GlobalConfig.FirstRechargeClientConfig;
		for (let k in frConfig) {
			if (frConfig[k].job == job) {
				this.weapImg.source = frConfig[k].weaponshow + "_png";
				this.roleImg.source = frConfig[k].bodyshow + "_png";
				break;
			}
		}

		/**充值档次*/
		var colorMatrix = [
			0.3, 0.6, 0, 0, 0,
			0.3, 0.6, 0, 0, 0,
			0.3, 0.6, 0, 0, 0,
			0, 0, 0, 1, 0
		];
		var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
		let firstChargeInfo = window['getfirChargePriceInfo']()
		for (let i = 0; i < firstChargeInfo.length; i++) {

			this.btnArr[i]['status'] = firstChargeInfo[i].status;
			if (this.btnArr[i]['status'] != 1) {
				this.btnArr[i].filters =  [colorFlilter];
			}
			// this.btnArr[i].filters =  [colorFlilter];

			this.btnArr[i]['msg'] = firstChargeInfo[i].msg;
			if (firstChargeInfo[i].trueCost == 1) {
				this.btnArr[i]["zhekou"].visible = true
				this.btnArr[i]["rmb"].visible = false
				this.btnArr[i]['money'] = parseInt(firstChargeInfo[i].dazhe_num);
			} else {
				this.btnArr[i]["zhekou"].visible = false
				this.btnArr[i]["rmb"].visible = true
				this.btnArr[i]['money'] = parseInt(firstChargeInfo[i].money_num);
			}

			this.btnArr[i]["rmb"].text = parseInt(firstChargeInfo[i].money_num) + '元';
			this.btnArr[i]["rmb0"].text = parseInt(firstChargeInfo[i].money_num) + '元';
			this.btnArr[i]["rmb1"].text = parseInt(firstChargeInfo[i].dazhe_num) + '元';
			this.btnArr[i]["yuanbao"].text = firstChargeInfo[i].award;
			this.btnArr[i]['yuanbao'] = firstChargeInfo[i].award;
		}

		this.setWinData();

		/**以下旧逻辑*/
		// let bool: boolean;
		// this._data = Recharge.ins().getRechargeData(0);
		// for (let i: number = 0; i < 4; i++) {
		// 	bool = (this._data.num >= this.getConfig(0).pay && !this.getRemindByIndex(0));
		// 	if (bool) {
		// 		// this.tab.selectedIndex = this._index = i;
		// 		this._index = i;
		// 		this.setWinData();
		// 		return;
		// 	}
		// }

		// this.tab.selectedIndex = this._index = 1;
		// this._index = 1;
		// this.setWinData();
	}

	public close(...param: any[]): void {
		DisplayUtils.removeFromParent(this.eff);
		egret.Tween.removeTweens(this);
		this.cleanEff();
	}

	private closeCB(e: egret.TouchEvent): void {
		ViewManager.ins().close(this);
	}

	private onTouch(e: egret.TouchEvent): void {
		let num: number = 0;
		switch (e.currentTarget) {
			case this.closeBtn:
				ViewManager.ins().close(this);
				break;
			case this.kefuBtn:
				let url = window['getkefuUrl']()
				// window.open(url)
				// window['createIframe'](url)
				// egret.ExternalInterface.call("openURL", url);
				if (window['getNative']() == 'web') {
					window.open(url)
				} else {
					egret.ExternalInterface.call("openURL", url);
				}
				break;
			case this.buyed:
				//领取首充礼包
				// let job: number = SubRoles.ins().getSubRoleByIndex(0).job;
				// let rrd: RechargeRewardData[] = this.getRechargeRewardDatas(job);
				// if (!rrd) {
				// 	egret.log("表数据异常");
				// }
				// for (let j = 0; j < rrd.length; j++) {
				// 	let d: RechargeRewardData = rrd[j];
				// 	//egret.log("当前道具类型 = "+d.type);
				// 	//egret.log("道具id = "+d.id);
				// 	//egret.log("数量 = "+d.count);
				// 	if(d.type)num += d.count;
				// }
				// if (num > UserBag.ins().getSurplusCount()) {
				// 	UserTips.ins().showTips("|C:0xf3311e&T:背包已满，请清理背包|");
				// 	return;
				// }
				if (UserBag.ins().getSurplusCount() < UserBag.BAG_ENOUGH) {
					ViewManager.ins().open(BagFullTipsWin);
					return;
				}
				Recharge.ins().changeRecharge1Data();

				break;

			default:
				//首充4个档次
				for (let i = 0; i < 4; i++) {
					if (e.currentTarget == this.btnArr[i]) {

						if (this.btnArr[i]['status'] == 1) {
							Recharge.ins().showReCharge(this.btnArr[i]["money"], this.btnArr[i]['yuanbao'],0);
						} else {
							WarnWin.show(this.btnArr[i]['msg'], function () { }, this, function () { }, this, 'sure');
						}

						break;
						// frc.pay//充值额度
						// frc.payReturn//充值返利

						//egret.log("充值额度 = "+this.btnArr[i]["rmb"].text+"  充值返利 = "+this.btnArr[i]["yuanbao"].text);
					}
				}
				break;
		}

	}

	private onBtnTouch(e: egret.TouchEvent): void {
		let index: number = this.btnArr.indexOf(e.target);
		/**此处开始跳转充值*/
		//Recharge.ins().sendGetAwards(2,index);
		// if (index >= 0) {
		// 	this._index = index > 1 ? 1 : index;
		// 	this.setWinData();
		// }
	}

	/**
	 * 点击标签页按钮
	 */
	private onTabTouch(e: egret.TouchEvent): void {
		if (e.currentTarget.selectedIndex == this._index)
			return;
		this._index = e.currentTarget.selectedIndex;
		this.setWinData();
	}

	protected setEff(index: number): void {
		switch (index) {
			case 0:
				break;
			case 1:
				this.cleanEff();
				break;
			default:
				break;
		}


	}
	private cleanEff() {
		for (let i = 0; i < 6; i++) {
			egret.Tween.removeTweens(this["item" + (i + 1)]);
		}
	}

	public setWinData(parma?: { type: number }): void {
		let type = parma ? parma.type : Recharge.ins().recharge_type;
		this._data = Recharge.ins().getRechargeData(type);

		//4个档次
		// for( let i=0;i<4;i++ ){
		// 	this.btnArr[i].visible = this._data.num == 1?false:true;
		// }
		// this.unbuy.visible = this._data.num == 1?false:true;
		//五个道具
		// for( let i=0;i<5;i++ ){
		// 	this["item"+(i+1)].visible = this._data.num?false:true;
		// }

		//未领取
		if (!this._data.num) {
			this.buyed.visible = false;
			this.unbuy.visible = true;
			for (let i = 0; i < 6; i++) {
				this["item" + (i + 1)].visible = true;
			}
			DisplayUtils.removeFromParent(this.eff);
			this.setEff(0);
		}
		//可领取
		else if (this._data.num == 1) {
			this.buyed.visible = true;
			this.unbuy.visible = false;
			for (let i = 0; i < 6; i++) {
				this["item" + (i + 1)].visible = true;
			}
			if (!this.eff.parent) {
				this.buyGroup.addChild(this.eff);
				this.eff.x = this.buyed.width / 2;
				this.eff.y = this.buyed.height / 2;
				this.eff.touchEnabled = this.buyGroup.touchEnabled = false;
				// this.buyed.parent.addChildAt(this.eff, this.getChildIndex(this.buyed));
				this.eff.playFile(RES_DIR_EFF + "chongzhi", -1);
			}
			this.setEff(0);
		}
		//已领取
		else if (this._data.num == 2) {
			this.buyed.visible = false;
			this.unbuy.visible = false;
			DisplayUtils.removeFromParent(this.eff);
			this.cleanEff();
			//获取背包坐标
			let uiView2: UIView2 = ViewManager.ins().getView(UIView2) as UIView2;
			let bagBtn = uiView2.getBagBtn();
			// let p:egret.Point = bagBtn.localToGlobal();

			//获取动画
			for (let i = 0; i < 5; i++) {
				// this["item"+(i+1)].parent.globalToLocal(bagBtn.x,p.y,p);
				let t: egret.Tween = egret.Tween.get(this["item" + (i + 1)]);
				t.to({ x: bagBtn.x, y: bagBtn.y }, 1000).call(() => {
					this["item" + (i + 1)].visible = false;
				});
				//this["item"+(i+1)].visible = this._data.num == 2?false:true;
			}


			let tt: egret.Tween = egret.Tween.get(this);
			tt.wait(1000).call(() => {
				ViewManager.ins().close(Recharge1Win);
			});
		}
	}

	private getRechargeRewardDatas(index: number): RechargeRewardData[] {
		let frConfig = GlobalConfig.FirstRechargeClientConfig;
		for (let k in frConfig) {
			if (frConfig[k].job == index) {
				let gcz: RechargeRewardData[] = frConfig[k].RechargeRewardData;
				return gcz;
			}
		}

		return null;
	}

	private getRemindByIndex(index: number): boolean {
		return ((Recharge.ins().getRechargeData(0).isAwards >> index) & 1) == 1;
	}

}

ViewManager.ins().reg(Recharge1Win, LayerManager.UI_Main);
