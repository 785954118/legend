/**
 * 寻宝
 */
class TreasureIconRule extends RuleIconBase {

	constructor(id:number, t: egret.DisplayObjectContainer = null) {
		super(id, t);

		this.showMessage = [
			UserZs.ins().postZsLv,
			Actor.ins().postLevelChange,
			UserFb.ins().postGuanqiaInfo,
			UserFb.ins().postGuanKaIdChange,
			GameServer.ins().postServerOpenDay,
		]

		this.updateMessage = [
			UserBag.ins().postItemAdd,
			UserBag.ins().postHuntStore,
			Heirloom.ins().postHuntBoxInfo,
		];
	}

	checkShowIcon(): boolean {
		return OpenSystem.ins().checkSysOpen(SystemType.TREASURE);
	}

	checkShowRedPoint(): number {
		//每天首次红点
		if(Setting.ins().getValue(ClientSet.firstClickTreasure) != new Date(GameServer.serverTime).getDate()){
			return 1;
		}
		if (Boolean(UserBag.ins().getHuntGoods(0).length) || Boolean(UserBag.ins().getHuntGoods(1).length) || Rune.ins().getIsGetBox() || 
		( Heirloom.ins().isHeirloomHuntOpen() && (Boolean(UserBag.ins().getHuntGoods(2).length) || Heirloom.ins().getIsGetBox())) ||
		RuneRedPointMgr.ins().checkCanExchange())
			return 1;
		return 0;
	}

	tapExecute(): void {
		ViewManager.ins().open(TreasureHuntWin);

		let date = new Date(GameServer.serverTime).getDate();
		if (Setting.ins().getValue(ClientSet.firstClickTreasure)  != date) {
			Setting.ins().setValue(ClientSet.firstClickTreasure, date);
			this.update();
		}
	}
}