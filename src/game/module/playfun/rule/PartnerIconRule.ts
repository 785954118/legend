/**
 * Created by Administrator on 2016/7/21.
 */
class PartnerIconRule extends RuleIconBase {

	constructor(id:number, t: egret.DisplayObjectContainer) {
		super(id, t);

		this.updateMessage = [
			Actor.ins().postLevelChange,
			GameLogic.ins().postSubRoleChange
		];
	}

	checkShowIcon(): boolean {
		return SubRoles.ins().subRolesLen < 3;
	}

	checkShowRedPoint(): number {
		let count: number = SubRoles.ins().subRolesLen;
		let config: NewRoleConfig = GlobalConfig.NewRoleConfig[count];
		if(!config)
			return 0;
		let lv: number = config.zsLevel ? UserZs.ins().lv : Actor.level;
		let configLv: number = config.zsLevel ? config.zsLevel : config.level;
		if (lv >= configLv || UserVip.ins().lv >= config.vip)
			return 1;
		return 0;
	}


	tapExecute(): void {
		ViewManager.ins().open(NewRoleWin);
	}
}