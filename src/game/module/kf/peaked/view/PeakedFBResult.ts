/**
 * Created by MPeter on 2017/12/21.
 * 跨服副本-巅峰赛季-战斗结算
 */
class PeakedFBResult extends BaseEuiView {
	/**退出按钮 */
	private quitBtn: eui.Button;
	/**结算背景 */
	private bg: eui.Image;
	/**结果标题资源 */
	private result: eui.Image;
	/**结果图标 */
	private resultImg: eui.Image;
	/**胜利组 */
	private win: eui.Group;
	private winPlayer: eui.Label;
	/**失败组 */
	private lose: eui.Group;
	private losePlayer: eui.Label;


	private AUTO_QUIT_TIME: number = 5;
	private _curTime: number = 0;
	public constructor() {
		super();
		this.skinName = `PeakedNessResultSkin`;
	}
	public open(...param): void {
		this.addTouchEvent(this.quitBtn, this.onQuit);


		let player: string = param[1];
		let str: string = ``;
		if (param[0]) {
			this.bg.source = `win_png`;
			this.result.source = `win_02`;
			this.resultImg.source = `peakness_win`;
			this.win.visible = true;
			this.lose.visible = false;
			this.winPlayer.text = player;
		}
		else {
			this.bg.source = `lost_png`;
			this.result.source = `lost_02`;
			this.resultImg.source = `peakness_lose`;
			this.win.visible = false;
			this.lose.visible = true;
			this.losePlayer.text = player;
		}

		TimerManager.ins().doTimer(1000, this.AUTO_QUIT_TIME, this.onTick, this);

		this._curTime = this.AUTO_QUIT_TIME;
		this.onTick();
	}
	public close(...param): void {
		TimerManager.ins().remove(this.onTick, this);
	}

	private onTick(): void {
		this.quitBtn.label = `退出(${--this._curTime})`;
		if (this._curTime < 0) {
			this.onQuit();
		}
	}
	/**退出 */
	private onQuit(): void {
		UserFb.ins().sendExitFb();
		ViewManager.ins().close(PeakedFBResult);
		if (PeakedSys.ins().isKf()) {//跨服中
			PeakedSys.ins().crossScene = 1;
		}
		else {
			TimerManager.ins().doTimer(300, 1, () => { ViewManager.ins().open(PeakedMainWin); }, this);
		}


	}
}
ViewManager.ins().reg(PeakedFBResult, LayerManager.UI_Popup);