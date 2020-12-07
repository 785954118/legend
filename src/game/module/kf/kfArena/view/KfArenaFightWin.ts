/**
 * Created by MPeter on 2018/3/14.
 *  跨服竞技场战斗界面
 */
class KfArenaFightWin extends BaseEuiView {
	//////////////////////////组件部分///////////////////////////
	/*倒计时组*/
	public bigTimeGroup: eui.Group;
	/*倒计时*/
	public countDown: eui.BitmapLabel;
	/*问号按钮 */
	public seeRule: eui.Button;
	/*蓝方积分*/
	public blueScore: eui.BitmapLabel;
	/*红方积分*/
	public redScore: eui.BitmapLabel;
	/*我的积分*/
	public score: eui.Label;
	/*我的排名*/
	public rank: eui.Label;
	/*当前剩余时间标签*/
	public leftTime: eui.BitmapLabel;
	/*未开始前文本图文*/
	public txtPrepare: eui.Image;
	/*信息按钮*/
	public infoBtn: eui.Button;

	//////////////////////////私有变量///////////////////////////
	private startTime: number;
	private modeSys: KfArenaSys;

	public constructor() {
		super();
		this.skinName = "KfArenaFightSkin";
	}

	protected childrenCreated(): void {
		this.bigTimeGroup.visible = true;
	}

	public open(...param): void {
		this.modeSys = KfArenaSys.ins();


		this.addTouchEvent(this.seeRule, this.onTouch);
		this.addTouchEvent(this.infoBtn, this.onTouch);
		this.observe(this.modeSys.postChangeScore, this.upScore);


		this.startTime = param[0];

		this.startCountDown(this.startTime);
		this.upScore();
	}

	public close(...param): void {

}

	private upScore(): void {
		this.blueScore.text = this.modeSys.scoreA + "";
		this.redScore.text = this.modeSys.scoreB + "";
	}

	private onTouch(e: egret.TouchEvent): void {
		switch (e.target) {
			case this.seeRule:
				ViewManager.ins().open(CommonHelpWin, GlobalConfig.HelpInfoConfig[34].text);
				break;
			case this.infoBtn:
				KfArenaSys.ins().sendDataInfo();
				break;

		}
	}

	private startCountDown(t: number): void {
		this.timeGo();
		if (t > 0) {
			this.bigTimeGroup.visible = true;
			TimerManager.ins().doTimer(1000, t + 1, this.timeGo, this);
		}

	}

	private timeGo(): void {
		if (this.startTime > 0) {
			this.countDown.text = this.startTime + "";
			this.startTime--;
		}
		else {
			this.bigTimeGroup.visible = false;

		}

	}
}
ViewManager.ins().reg(KfArenaFightWin, LayerManager.UI_Popup);
