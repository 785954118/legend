/**
 * Created by MPeter on 2017/12/22.
 * 跨服副本-巅峰赛季-查看战报列表
 */
class PeakViewBattleReportItemRender extends BaseItemRender {
	public noOpen: eui.Label;
	public infoGroup: eui.Group;
	public roundTxt: eui.Label;
	public player: eui.Label;

	public constructor() {
		super();

	}
	public dataChanged(): void {
		if (this.data) {
			this.roundTxt.text = `第${this.data.round}局`;
			this.player.text = this.data.winer;
			this.noOpen.visible = false;
			this.infoGroup.visible = true;

		}
		else {
			this.noOpen.visible = true;
			this.infoGroup.visible = false;
		}
	}
}