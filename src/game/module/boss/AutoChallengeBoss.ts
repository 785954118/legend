/**
 * 自动挑战boss管理器
 */
class AutoChallengeBoss extends BaseSystem {
	/**自动打野外boss标记 */
	autoYewaiBoss: boolean;
	/**自动打神域boss标记 */
	autoShenyuBoss: boolean;


	public constructor() {
		super();
		this.observe(UserBoss.ins().postWorldBoss, this.checkEnter);
		this.observe(UserBoss.ins().postBossData, this.delayCheckEnter);
		this.observe(GameLogic.ins().postEnterMap, () => {
			//进入野外
			if (GameMap.fubenID == 0) {
				this.checkEnter();
			}
		});
	}

	public static ins(): AutoChallengeBoss {
		return super.ins() as AutoChallengeBoss;
	}

	/**刷新可击杀boss次数倒计时侦听方法
	 * 有新增次数，也需要做检测
	 */
	private refType: number;

	public refBossTimeFun(): void {
		TimerManager.ins().remove(this.refTimes, this);

		this.refType = UserBoss.BOSS_SUBTYPE_QMBOSS;
		let time = UserBoss.ins().worldBossrestoreTime[this.refType];
		if (time > UserBoss.ins().worldBossrestoreTime[UserBoss.BOSS_SUBTYPE_SHENYU]) {
			this.refType = UserBoss.BOSS_SUBTYPE_SHENYU;
			time = UserBoss.ins().worldBossrestoreTime[this.refType];
		}

		let t = time - egret.getTimer();
		if (t > 0) TimerManager.ins().doTimer(t, 1, this.refTimes, this);
	}

	private refTimes(): void {
		UserBoss.ins().sendWorldBossInfo(this.refType);
	}


	/**延迟检查进入,因为这里会出现客户端和服务器的时间不同步问题,导致刷新了怪,还不能进 */
	private delayCheckEnter(params: Array<any>): void {
		if (params[0]) {
			TimerManager.ins().doTimer(1000, 2, this.checkEnter, this);
		}
	}

	/**检测进入 */
	checkEnter(): void {
		if (!UserBoss.ins().worldInfoList || GameMap.fubenID != 0) return;
		let lunhuiList: WorldBossItemData[] = [];
		let ywList: WorldBossItemData[] = [];

		//野外boss列表
		let ywBoss: WorldBossItemData[] = UserBoss.ins().worldInfoList[UserBoss.BOSS_SUBTYPE_QMBOSS];
		if (ywBoss && this.autoYewaiBoss && UserBoss.ins().worldBossLeftTime[UserBoss.BOSS_SUBTYPE_QMBOSS]) {
			//分类轮回boss和野外boss
			for (let item of ywBoss) {
				let bossDp: WorldBossConfig = GlobalConfig.WorldBossConfig[item.id];
				if (!UserBoss.isCanChallenge(bossDp)) continue;
				bossDp.samsaraLv ? lunhuiList.push(item) : ywList.push(item);
			}
		}

		//轮回boss列表
		lunhuiList = lunhuiList.sort(this.compareFn);
		for (let i: number = 0; i < lunhuiList.length; i++) {
			let item = lunhuiList[i];
			if (item.canChallenge && UserBoss.ins().getBossRemindByIndex(item.id)) {
				this.enterFb(item.id, UserBoss.BOSS_SUBTYPE_QMBOSS);
				return;
			}
		}

		//神域boss列表
		if (UserBoss.ins().worldInfoList[UserBoss.BOSS_SUBTYPE_SHENYU] &&
			this.autoShenyuBoss &&
			UserBoss.ins().worldBossLeftTime[UserBoss.BOSS_SUBTYPE_SHENYU]) {
			let syList: WorldBossItemData[] = UserBoss.ins().worldInfoList[UserBoss.BOSS_SUBTYPE_SHENYU].slice();
			syList = syList.sort(this.compareFn);
			for (let i: number = 0; i < syList.length; i++) {
				let item = syList[i];
				if (item.canChallenge && UserBoss.ins().getBossRemindByIndex(item.id)) {
					this.enterFb(item.id, UserBoss.BOSS_SUBTYPE_SHENYU);
					return;
				}
			}
		}

		//野外boss列表
		ywList = ywList.sort(this.compareFn);
		for (let i: number = 0; i < ywList.length; i++) {
			let item = ywList[i];

			if (item.canChallenge && UserBoss.ins().getBossRemindByIndex(item.id)) {
				this.enterFb(item.id, UserBoss.BOSS_SUBTYPE_QMBOSS);
				return;
			}
		}
	}

	/**
	 * 进入副本
	 * @param id 副本ID
	 * @param type 副本类型
	 */
	private enterFb(id: number, type: number): void {
		let cd = UserBoss.ins().worldBossCd[type] - egret.getTimer();
		if (cd > 0) {
			TimerManager.ins().doTimer(cd, 1, this.checkEnter, this);
		}
		else {
			UserBoss.ins().postBossData(false);//取消boss提示
			UserBoss.ins().sendChallengWorldBoss(id, type);
		}
	}

	//排序
	private compareFn(a: WorldBossItemData, b: WorldBossItemData): number {
		let configA: WorldBossConfig = GlobalConfig.WorldBossConfig[a.id];
		let configB: WorldBossConfig = GlobalConfig.WorldBossConfig[b.id];

		if (configA.zsLevel < configB.zsLevel) {
			return 1;
		} else if (configA.zsLevel > configB.zsLevel) {
			return -1;
		}

		if (configA.level < configB.level)
			return 1;
		else if (configA.level > configB.level)
			return -1;
		else
			return 0;
	}
}

namespace GameSystem {
	export let autoChallengeBoss = AutoChallengeBoss.ins.bind(AutoChallengeBoss);
}