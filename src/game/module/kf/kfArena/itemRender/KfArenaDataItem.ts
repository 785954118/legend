/**
 * Created by MPeter on 2018/3/14.
 * 跨服3v3竞技场数据单元项
 */
class KfArenaDataItem extends BaseItemRender {
	public rankTxt: eui.Label;
	public nameTxt: eui.Label;
	public kaTxt: eui.Label;
	public collectionTxt: eui.Label;
	public scoreTxt: eui.Label;
	public mvp: eui.Image;
	public arenaPointTxt: eui.Label;
	public arenaScoreTxt: eui.Label;
	public tags: eui.Image;

	public constructor() {
		super();
	}

	protected dataChanged(): void {
		if (this.data instanceof KfArenaData) {
			this.rankTxt.text = this.data.rank + "";
			this.nameTxt.text = this.data.playerName + "";
			this.kaTxt.text = `${this.data.killNum}/${10}`;
			this.collectionTxt.text = this.data.collectNum + "";
			this.scoreTxt.text = this.data.curScore + "";
			this.arenaPointTxt.text = this.data.curGetScore + "";
			this.arenaScoreTxt.text = this.data.totalScore + "";
			this.mvp.visible = this.data.isMvp;

			if (this.data.isOnWin) {
				this.tags.visible = true;
				// this.tags.source = ``;
			}
			else if (this.data.isDeserter) {
				this.tags.visible = true;
				// this.tags.source = ``;
			}
			else {
				this.tags.visible = false;
			}
		}
	}
}
