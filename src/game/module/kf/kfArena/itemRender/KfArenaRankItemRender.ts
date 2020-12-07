/**
 * Created by MPeter on 2018/3/15.
 *  排行单元格
 */
class KfArenaRankItemRender extends BaseItemRender {
	/*背景图*/
	public bg: eui.Image;
	/*文本排名*/
	public rankTxt: eui.Label;
	/*玩家名字*/
	public player: eui.Label;
	/*积分*/
	public score: eui.Label;
	/*排位*/
	public seasonTitle: eui.Label;
	/*区服ID*/
	public serverId: eui.Label;
	/*位图排名（前三名）*/
	public rankImg: eui.Image;
	/*vip图标*/
	public vip: eui.Image;
	/*排行奖励*/
	public reward: ItemBase;

	public constructor() {
		super();
	}

	protected  dataChanged(): void {
		if (this.data instanceof KfArenaRankData) {
			//前三名排名特殊处理
			if (this.data.rank <= 3) {
				this.rankImg.source = `paihang${this.data.rank}`;
				this.rankTxt.visible = false;
				this.rankImg.visible = true;
			}
			else {
				this.rankTxt.text = this.data.rank + "";
				this.rankTxt.visible = true;
				this.rankImg.visible = false;

			}


			this.player.text = this.data.playerName;
			this.score.text = this.data.score + "";
			this.seasonTitle.text = KfArenaSys.ins().duanName[this.data.dan];
			let serverName = window['getServerName'](this.data.servId)
			this.serverId.text = `[${serverName}]`;
			this.vip.visible = this.data.vip > 0;

			if (GlobalConfig.CrossArenaBase.rankAward[this.data.rank]) {
				this.reward.data = GlobalConfig.CrossArenaBase.rankAward[this.data.rank].mail.tAwardList[0];
				this.reward.visible = true;
			}
			else {
				this.reward.visible = false;
			}

		}

	}

}
