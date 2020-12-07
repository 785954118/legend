/**
 * Created by MPeter on 2017/12/21.
 * 跨服副本-巅峰赛季-我的战绩列表
 */
class PeakMyBattleRecordItemRender extends BaseItemRender {
	/**场次信息 */
	private roundInfo: eui.Label;
	/**对手 */
	private enemyLabel: eui.Label;
	/**结果 */
	private result: eui.Label;
	public constructor() {
		super();

	}
	protected dataChanged(): void {
		if (this.data.playerName) {
			let exRound: string = this.data.round ? `第${this.data.round}场` : "";
			if (PeakedSys.ins().isKf()) {
				this.roundInfo.text = `${PeakedData.SERV_CN[1]}${PeakedData.STATE_KF_TYPE_CN[this.data.stateType]} ${exRound}`;
			}
			else{
				this.roundInfo.text = `${PeakedData.SERV_CN[0]}${PeakedData.STATE_TYPE_CN[this.data.stateType]} ${exRound}`;
			}


			this.enemyLabel.text = this.data.playerName;
			this.result.text = this.data.result ? `胜利` : `失败`;
			this.result.textColor = this.data.result ? ColorUtil.GREEN : ColorUtil.RED;
		}

	}
}