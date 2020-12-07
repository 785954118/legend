/**
 * Created by MPeter on 2017/12/21.
 * 跨服副本-巅峰赛季-查看战报界面
 */
class PeakViewBattleReportWin extends BaseEuiView {
	public bgClose: eui.Rect;
	public score: eui.BitmapLabel;
	public AnameTxt: eui.Label;
	public BnameTxt: eui.Label;
	public list: eui.List;
	public constructor() {
		super();
	}
	public initUI(): void {
		this.skinName = `WarReportSkin`;
		this.list.itemRenderer = PeakViewBattleReportItemRender;
	}
	public open(...param): void {
		this.addTouchEvent(this.bgClose, this.onClose);
		let group1: number = param[0];
		let group2: number = param[1];

		let isSixteen: boolean = PeakedSys.ins().isKFSixteen();
		let playData = PeakedSys.ins().isKf() ? PeakedHelp.getKFPlayerData(group1, group2, param[2], isSixteen) : PeakedHelp.getPlayerData(group1, group2);
		let listDt: { winer: string, round: number }[] = [];
		let aScore: number = 0;//我获取分数          
		let bScore: number = 0;//对手获取分数
		let promWin: number = GlobalConfig.PeakRaceBase.promWin;
		if (!promWin) promWin = 3;
		if (playData) {
			if (playData.playerList.length == 0) {
				this.AnameTxt.text = `无选手`;
				this.BnameTxt.text = `无选手`;
			} else {
				if (playData.playerList[0])
					this.AnameTxt.text = playData.playerList[0].playerName;
				if (playData.playerList[1])
					this.BnameTxt.text = playData.playerList[1].playerName;
				else this.BnameTxt.text = `轮空`;

				//判断是否已结束
				let isOver: boolean = PeakedHelp.statusIsOverByGroup(group1);

				for (let i: number = 0; i < 5; i++) {
					let data: any;
					if (playData.reportList[i]) {
						data = {};
						data.winer = PeakedHelp.findPlayerDtById(playData.reportList[i]).playerName;
						data.round = i + 1;
						if (playData.reportList[i] == playData.playerList[0].roleId) {
							aScore++;
						}
						else bScore++;
					}
					else if (isOver) continue;
					listDt[i] = data;
					//大于3场，则跳出
					if (aScore >= promWin || bScore >= promWin) break;
				}

			}

		}
		else {
			this.AnameTxt.text = `无选手`;
			this.BnameTxt.text = `无选手`;
		}
		//轮空
		if (playData && playData.reportList.length == 0 && !playData.playerList[1]) aScore = promWin;

		this.score.text = `${aScore}.${bScore}`;

		this.list.dataProvider = new eui.ArrayCollection(listDt);
	}
	public close(...param): void {
		this.removeTouchEvent(this.bgClose, this.onClose);
	}
	private onClose(e: egret.TouchEvent): void {
		ViewManager.ins().close(this);
	}
	// public static openCheck(...param: any[]): boolean {
	// 	let group1: number = param[0];
	// 	let group2: number = param[1];
	//	let isSixteen: boolean = PeakedSys.ins().isKFSixteen();
	//	let playData = PeakedSys.ins().isKf() ? PeakedHelp.getKFPlayerData(group1, group2, param[2], isSixteen) : PeakedHelp.getPlayerData(group1, group2);
	// 	if (playData && playData.playerList.length) {
	// 		return true;
	// 	}
	// 	else {
	// 		UserTips.ins().showTips(`当前无选手`);
	// 		return false;
	// 	}

	// }
}
ViewManager.ins().reg(PeakViewBattleReportWin, LayerManager.UI_Popup);