/**
 * 移动模块控制中心
 * @author wangzhong
 */
class MoveCC extends BaseSystem {

	private findTarget: any;

	constructor() {
		super();

		this.observe(MapView.onGridClick, this.mapClick);

		this.observe(MapView.moveComplete, this.touchTarget);
	}

	private mapClick({ target, x, y }): void {
		if (BattleCC.ins().isBattle() && !BattleCC.ins().canMove())
			return;
		if ((GwBoss.ins().isGwBoss || GwBoss.ins().isGwTopBoss) && !GwBoss.ins().canMove())
			return;
		if (DarkMjBoss.ins().isDarkBoss)
			return;

		this.findTarget = target;

		let role: CharRole = EntityManager.ins().getNoDieRole();
		if (role == null || role.isHardStraight)
			return;

		if (CityCC.ins().isCity || GwBoss.ins().isGwBoss || GwBoss.ins().isGwTopBoss)
			CityCC.ins().sendStopAI();

		if (BattleCC.ins().isBattle() || PaoDianCC.ins().isPaoDian || KFBossSys.ins().isKFBossBattle || DevildomSys.ins().isDevildomBattle || KfArenaSys.ins().isKFArena)
			GameLogic.ins().stopAI();

		if (target && target.infoModel) {
			//点击npc 走到距离npc前一段距离
			if (target.infoModel.type == EntityType.Npc || target.infoModel.type == EntityType.Mine) {
				let pos = GameMap.getPosRangeRandom(target.x, target.y, DirUtil.get8DirBy2Point(target, role));
				x = pos[0] * GameMap.CELL_SIZE + Math.floor(MathUtils.limit(0.2, 1) * GameMap.CELL_SIZE);
				y = pos[1] * GameMap.CELL_SIZE + Math.floor(MathUtils.limit(0.2, 1) * GameMap.CELL_SIZE);
			}
		}
		if (!GameMap.sceneInMine() && !TargetListCC.ins().isShow) {
			// 自动走路停止自动操作
			RoleAI.ins().selfRoleStopActack()
			GameMap.myMoveTo(x, y, this.findComplete);
			return;
		}

		GameMap.moveTo(x, y);
	}
	public findComplete(): void {
		// ViewManager.ins().open(PaoDianNpcTalkWin);
	}
	private touchTarget(e: CharMonster) {

		if (e.team != Team.My)
			return;

		if (this.findTarget && this.findTarget.infoModel) {
			if (this.findTarget.infoModel.type == EntityType.Npc) {
				let role: CharRole = EntityManager.ins().getNoDieRole();
				if (role == null || role.isHardStraight)
					return;

				let size: number = GameMap.CELL_SIZE;
				let tx: number = SysSetting.ins().getValue("mapClickTx") * size;
				let ty: number = SysSetting.ins().getValue("mapClickTy") * size;
				if (Math.abs(role.x - tx) <= size && Math.abs(role.y - ty) <= size) {
					let config = GlobalConfig.NpcBaseConfig[this.findTarget.infoModel.configID];
					let control = config.controlTarget;
					if (control && control[0]) ViewManager.ins().open(control[0]);
				}
				else
					return;
			} else if (this.findTarget.infoModel.type == EntityType.Mine) {
				ViewManager.ins().open(MineRobWin, this.findTarget.infoModel);
			} else if (this.findTarget.infoModel.type == EntityType.Transfer) {
				if (GameMap.sceneInMine()) {
					Mine.ins().sendSceneChange(this.findTarget.infoModel.configID);
				}
			}
		}

		this.findTarget = null;
	}
}

namespace GameSystem {
	export let movecc = MoveCC.ins.bind(MoveCC);
}