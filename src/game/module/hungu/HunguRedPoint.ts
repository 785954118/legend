/**
 * 魂骨红点
 */
class HunguRedPoint extends BaseSystem {
	/**魂骨装备红点*/
	itemPoints: number[][] = [];
	/**人物头像红点*/
	roleTabs: boolean[] = [];
	/**总红点 */
	redPoint: boolean = false;

	public constructor() {
		super();
		//总红点
		this.associated(this.postRedPoint,
			this.postRoleRedPoint
		)
		//人物头像红点
		this.associated(this.postRoleRedPoint,
			Hungu.ins().postHunguInfo,
			Hungu.ins().postHunguItems,
			Hungu.ins().postHunyu,
			Hungu.ins().postHunguItemUpgrade,
			UserBag.ins().postItemCountChange,
			UserZs.ins().postZsLv,
			GameLogic.ins().postSubRoleChange
		)

	}
	/**总红点 */
	postRedPoint() {
		let old = this.redPoint;
		this.redPoint = false;
		for( let i = 0; i < this.roleTabs.length;i++ ){
			if( this.roleTabs[i] ){
				this.redPoint = true;
			}
		}
		return old != this.redPoint;
	}
	/**人物头像红点*/
	postRoleRedPoint(){
		let ins = Hungu.ins();
		for( let r = 0; r < 3;r++ ){
			let role:Role = SubRoles.ins().getSubRoleByIndex(r);
			if( !role ){
				this.roleTabs[r] = false;
				continue;
			}
			//具体魂骨装备红点逻辑
			for( let i = 0; i < GlobalConfig.HunGuConf.equipCount;i++ ){
				this.roleTabs[r] = this.HunguItemRedPoint(role.index,i);
				if( this.roleTabs[r] )
					break;
			}
		}
		return 	true;
	}
	/**魂骨装备红点*/
	public HunguItemRedPoint(roleId:number,pos:number){
		let ins = Hungu.ins();
		let redPoint = false;
		//更换红点
		let items:ItemData[] = ins.getHunguItemsList(pos);
		if( items.length ){
			if( ins.hunguData[roleId] && ins.hunguData[roleId].items[pos].itemId ){
				// let curStage = GlobalConfig.HunGuEquip[ins.hunguData[role.index].items[i].itemId].stage;//身穿的阶级
				// //检查是否有更好的替换
				// if( GlobalConfig.HunGuEquip[items[0].configID].stage > curStage ){
				// 	this.roleTabs[r] = true;
				// 	break;
				// }
			}else{
				//身上没穿
				redPoint = true;
				return redPoint;
			}
		}
		//魂玉红点
		redPoint = ins.getHunyuRedPoint(roleId,pos);
		if( redPoint )
			return true;

		//魂骨装备升阶红点
		if( ins.hunguData[roleId] && ins.hunguData[roleId].items[pos].itemId ){
			redPoint = ins.getUpgradeRedPoint(ins.hunguData[roleId].items[pos].itemId);
			if( redPoint )
				return redPoint;
		}

		return redPoint;
	}
}
namespace GameSystem {
	export let hunguRedPoint = HunguRedPoint.ins.bind(HunguRedPoint);
}