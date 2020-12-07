/**
 * Created by wangzhong on 2016/7/20.
 */
class BossIconRule extends RuleIconBase {

	constructor(id:number, t: egret.DisplayObjectContainer) {
		super(id, t);

		this.showMessage = [
			UserFb.ins().postGuanKaIdChange,
			UserTask.ins().postUpdteTaskTrace,
			ZsBoss.ins().postBossOpen,
			GameLogic.ins().postEnterMap
		];

		this.updateMessage = [
			UserBoss.ins().postWorldBoss,
			UserBoss.ins().postWorldNotice,
			ZsBoss.ins().postBossList,
			UserBoss.ins().postBossData,
		];
	}

	public static OpenTaskIndex = 41;

	checkShowIcon(): boolean {

		return UserBoss.ins().checkBossIconShow();
	}

	checkShowRedPoint(): number {
		if (PlayFun.ins().newBossRelive
			||UserFb.isCanChallenge()
			|| UserBoss.ins().checkWorldBossRedPoint(UserBoss.BOSS_SUBTYPE_QMBOSS)
			|| UserBoss.ins().checkWorldBossRedPoint(UserBoss.BOSS_SUBTYPE_WORLDBOSS)
			|| UserBoss.ins().checkWorldBossRedPoint(UserBoss.BOSS_SUBTYPE_HOMEBOSS)
			|| UserBoss.ins().checkWorldBossRedPoint(UserBoss.BOSS_SUBTYPE_SHENYU)
			|| UserBoss.ins().checkWorldBossRedPoint(UserBoss.BOSS_SUBTYPE_DARKBOSS)
		)
			return 1;

		return 0;
	}


	tapExecute(): void {
		ViewManager.ins().open(BossWin);
		UserBoss.ins().postBossData(false);
	}
}