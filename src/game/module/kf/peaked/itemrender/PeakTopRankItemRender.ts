/**
 * Created by MPeter on 2017/12/21.
 * 跨服副本-巅峰赛季-人气排行列表
 */
class PeakTopRankItemRender extends BaseItemRender {
	public nameLabel: eui.Label;
	public score: eui.Label;
	public rank: eui.BitmapLabel;
	public supportBtn: eui.Button;
	public rankImg: eui.Image;

	public constructor() {
		super();

	}
	protected dataChanged(): void {
		if (this.data instanceof PeakTopRankData) {
			this.nameLabel.text = this.data.playerName;
			this.score.text = this.data.likeNum * GlobalConfig.PeakRaceBase.likeScore + "";

			this.supportBtn.visible = PeakedHelp.canSupport();
			if (PeakedSys.ins().kideNum >= GlobalConfig.PeakRaceBase.likeCount) {
				this.supportBtn.enabled = false;
			}
			if (this.data.rank <= 3) {
				this.rankImg.source = `paihang${this.data.rank}`;
				this.rank.text = ``;
			}
			else {
				this.rank.text = this.data.rank + "";
				this.rankImg.source = ``;
			}
		}

	}
}