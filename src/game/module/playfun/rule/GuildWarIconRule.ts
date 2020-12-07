class GuildWarIconRule extends RuleIconBase {
	constructor(id:number, t: egret.DisplayObjectContainer) {
		super(id, t);

		this.showMessage = [
			GuildWar.ins().postGuildWarStarInfo
		];
	}

	checkShowIcon(): boolean {
		return (GuildWar.ins().getModel().getIsShowGuildWarBtn() == 1);
	}

	getEffName(redPointNum: number): string {
		// this.effX = 35;
		// this.effY = 35;
		// return "iconGlitter";
		return undefined;
	}

	tapExecute(): void {
		if (Guild.ins().guildID == undefined || Guild.ins().guildID == 0) {
			UserTips.ins().showTips("|C:0xf3311e&T:加入公会后才能参与龙城争霸活动|");
			return;
		}

		GuildWar.ins().requestWinGuildInfo();
		ViewManager.ins().close(GuildMap);
		ViewManager.ins().open(GuildWarMainWin);
	}
}