/**
 * Created by MPeter on 2017/12/21.
 * 跨服副本-巅峰赛季-我的下注列表
 */
class PeakMyBetItemRender extends BaseItemRender {
	public round: eui.Label;
	public infoLabel: eui.Label;

	public constructor() {
		super();

	}
	protected dataChanged(): void {
		if (this.data instanceof PeakBetData) {
			if (PeakedSys.ins().isKf()) {
				this.round.text = PeakedData.SERV_CN[1] + PeakedData.STATE_KF_TYPE_CN[this.data.status];
			}
			else {
				this.round.text = PeakedData.SERV_CN[0] + PeakedData.STATE_TYPE_CN[this.data.status];
			}

			let playDt = PeakedHelp.findPlayerDtById(this.data.playerId);

			let ext: string = "";
			if (PeakedHelp.statusIsOver(this.data.status, PeakedSys.ins().isKf())) {
				//判断是否胜利
				if (PeakedHelp.checkIsWinById(this.data.playerId, this.data.status)) {
					ext = `|C:${ColorUtil.GREEN}&T:获利${this.data.batNum}筹码|`;
				}
				else {
					ext = `|C:${ColorUtil.RED}&T:损失${this.data.batNum}筹码|`;
				}
			}
			//如果胜利，则直接结束
			else if (PeakedHelp.checkIsWinById(this.data.playerId, this.data.status)) {
				ext = `|C:${ColorUtil.GREEN}&T:获利${this.data.batNum}筹码|`;
			}
			else {
				ext = `等待结果中...`
			}


			this.infoLabel.textFlow = TextFlowMaker.generateTextFlow1(`下注【${playDt.playerName}】 ${this.data.batNum}筹码，${ext}`);
		}


	}
}