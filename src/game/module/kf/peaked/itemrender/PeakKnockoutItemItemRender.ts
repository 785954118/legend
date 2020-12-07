/**
 * Created by MPeter on 2017/12/21.
 * 跨服副本-巅峰赛季-淘汰赛列表对象
 */
class PeakKnockoutItemItemRender extends BaseItemRender {
	public infoLabel: eui.Label;
	public playerName: eui.Label;
	public result: eui.Label;

	public constructor() {
		super();

	}
	protected dataChanged(): void {
		if (this.data) {
			this.infoLabel.text = `${this.data.servId?`跨服`:`单服`}淘汰赛第${this.data.round}场`;
			this.playerName.text = this.data.player ? this.data.player : `轮空`;
			this.playerName.name = this.data.id;
			if (this.data.result) {
				this.result.textColor = ColorUtil.GREEN;
				this.result.text = `胜利`;
			}
			else {
				this.result.textColor = ColorUtil.RED;
				this.result.text = `失败`;
			}

		}
	}
}