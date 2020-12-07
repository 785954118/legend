/**
 * 神兽守护红点
 * @author MPeter
 */
class ShenshouRedpoint extends BaseSystem {
	/**神兽装备穿戴红点 */
	redpointEquips1: number[][] = [];
	/**神兽装备强化红点*/
	redpointEquips2: number[][] = [];
	/**神兽红点*/
	redpoints: boolean[] = [];
	/**总红点 */
	redpoint: boolean = false;

	public constructor() {
		super();
		//总红点
		this.associated(this.postRedPoint,
			this.postRedPoint1,
			this.postRedPoint2,
			ShenshouSys.ins().postBattleState
		)

		this.associated(this.postRedPoint1,
			ShenshouSys.ins().postInfo,
			UserBag.ins().postItemAdd,
			UserBag.ins().postItemDel,
			UserBag.ins().postItemCountChange,
		)

		this.associated(this.postRedPoint2,
			ShenshouSys.ins().postInfo,
			ShenshouSys.ins().postUpdateExp,
			ShenshouSys.ins().postWearEquip, )
	}
	/**总红点 */
	postRedPoint(): number {
		if (!ShenshouModel.ins().checkOpen()) {
			this.redpoint = false;
			return 0;
		}
		this.redpoints = [];
		for (let id in GlobalConfig.ShenShouBase) {
			this.redpoints[id] =this.redpointEquips1[id] && this.redpointEquips1[id].indexOf(1) > -1
			if (!this.redpoints[id] && this.redpointEquips2[id])
				this.redpoints[id] = this.redpointEquips2[id].indexOf(1) > -1;
			//可出战红点
			if (!this.redpoints[id]) {
				let data = ShenshouModel.ins().getDataById(parseInt(id));
				this.redpoints[id] = data && data.state == ShenshouState.State_Can && ShenshouModel.ins().isCanBattle();
			}
		}

		this.redpoint = this.redpoints.indexOf(true) > -1;
		return this.redpoint ? 1 : 0;
	}
	/**装备穿戴红点 */
	public postRedPoint1(): void {
		if (!ShenshouModel.ins().checkOpen()) {
			this.redpointEquips1 = [];
			return;
		}
		for (let id in GlobalConfig.ShenShouBase) {
			let data = ShenshouSys.ins().dataList[id];

			this.redpointEquips1[id] = [];
			for (let i: number = 1; i <= GlobalConfig.ShenShouConfig.posCount; i++) {
				let list = ShenshouModel.ins().findCanWearEquips(+id, i);
				if (list.length > 0) {
					this.redpointEquips1[id][i] = 1;
					if (data && data.equipIDs[i] && ShenshouModel.ins().checkEquipScore(data.equipIDs[i], list[0].id)) {
						this.redpointEquips1[id][i] = 0;//比自己战力低的，不提示
					}
				}
				else {
					this.redpointEquips1[id][i] = 0;
				}
			}
		}
	}
	/**装备强化红点 */
	public postRedPoint2(): void {
		if (!ShenshouModel.ins().checkOpen()) {
			this.redpointEquips2 = [];
			return;
		}
		for (let id in ShenshouSys.ins().dataList) {
			let data = ShenshouSys.ins().dataList[id];
			this.redpointEquips2[id] = [];
			for (let pos: number = 1; pos <= 5; pos++) {
				//有可强化
				if (data.equipIDs[pos] && this.getForgeRedpoint(data.equipIDs[pos], ShenshouSys.ins().exp) && data.state != ShenshouState.State_No) {
					this.redpointEquips2[id][pos] = 1;
				}
				else {
					this.redpointEquips2[id][pos] = 0;
				}
			}
		}
	}


	private getForgeRedpoint(id: number, exp: number): boolean {
		return GlobalConfig.ShenShouEquip[id + 1] && exp >= GlobalConfig.ShenShouEquip[id].exp;
	}
}
namespace GameSystem {
	export let shenshouRedpoint = ShenshouRedpoint.ins.bind(ShenshouRedpoint);
}