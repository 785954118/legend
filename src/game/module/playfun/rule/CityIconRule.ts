/**
 * 主城入口
 */
class CityIconRule extends RuleIconBase {
	public constructor(id:number, t: egret.DisplayObjectContainer) {
		super(id, t);

		this.showMessage = [
			GameLogic.ins().postEnterMap,
			Actor.ins().postLevelChange
		];

	}

	checkShowIcon(): boolean {
		return GameMap.sceneInMain() && OpenSystem.ins().checkSysOpen(SystemType.CITYMONSTER);
	}

	checkShowRedPoint(): number {
		return 0;
	}

	tapExecute(): void {
		if( !GameServer.serverOpenDay ){
			UserTips.ins().showTips(`|C:0xff0000&T:暂未开放，开服第二天开启`);
			return;
		}
		if(!OpenSystem.ins().checkSysOpen(SystemType.CITY))
			return;
		if (!GameMap.sceneInMain()) return;
		if (Encounter.ins().isEncounter()) {
			UserTips.ins().showTips("|C:0xf3311e&T:正在挑战附近的人|");
			return;
		}

		if (CityCC.ins().enterCD < 1) {
			CityCC.ins().sendEnter();
		}
		else
			UserTips.ins().showTips(`冷却中，${CityCC.ins().enterCD}秒后可进入主城`);
	}

	getEffName(redPointNum: number): string {
		return undefined;
	}
}