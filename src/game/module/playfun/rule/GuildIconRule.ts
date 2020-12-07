class GuildIconRule extends RuleIconBase {

	public constructor(id:number, t: egret.DisplayObjectContainer) {
		super(id, t);

		this.showMessage = [
			Actor.ins().postLevelChange,
		];

		this.updateMessage = [
			GuildRedPoint.ins().postHanghui
		];
	}

	checkShowIcon(): boolean {
		return (Actor.level >= GlobalConfig.GuildConfig.openLevel);
	}

	checkShowRedPoint(): number {
		return GuildRedPoint.ins().hanghui;
	}

	tapExecute(): void {
		if (Actor.level >= GlobalConfig.GuildConfig.openLevel) {
			if (Guild.ins().guildID == undefined || Guild.ins().guildID == 0)
				ViewManager.ins().open(GuildApplyWin);
			else
				ViewManager.ins().open(GuildMap);
		} else {
			UserTips.ins().showTips(`${GlobalConfig.GuildConfig.openLevel}级开启`);
		}
	}
}