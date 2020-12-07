/**
 * 跨服竞技场3v3战场图标规则
 */
class KFArenaRule extends RuleIconBase {
	private _timeTxt: eui.Label;

	private _time: number = 0;

	public constructor(id: number, t: egret.DisplayObjectContainer) {
		super(id, t);

		this.showMessage = [
			UserZs.ins().postZsData,
			KfArenaSys.ins().postMacthState,
			KfArenaSys.ins().postOpenKfArena,
		];

		this.updateMessage = [
			KfArenaRedPoint.ins().postRedPoint,
		];
	}

	protected createTar() {
		let t = super.createTar();
		this._timeTxt = new eui.Label();
		this._timeTxt.x = 0;
		this._timeTxt.y = 70;
		this._timeTxt.width = 70;
		this._timeTxt.textAlign = "center";
		this._timeTxt.text = "";
		this._timeTxt.size = 14;
		this._timeTxt.textColor = 0x00FF00;
		t.addChild(this._timeTxt);
		this.setState();
		return t;
	}

	private setRepeat(): void {
		this._time--;
		if (this._time > 0)
			this._timeTxt.text = DateUtils.getFormatBySecond(this._time, DateUtils.TIME_FORMAT_5, 4);
		else {
			KfArenaSys.ins().isStartIng = 1;
			if (KfArenaSys.ins().macthState == 1) {
				this._timeTxt.text = "匹配中";
			}
			else {
				this._timeTxt.text = "进行中";
			}
			TimerManager.ins().removeAll(this);
		}
	}

	checkShowIcon(): boolean {
		//跨服竞技场3v3
		let boo: boolean = KfArenaSys.ins().isOpen();
		this.setState();
		return boo;
	}

	public setState():void{
		let boo: boolean = KfArenaSys.ins().isOpen();
		if (boo && this.tar) {
			if (KfArenaSys.ins().macthState == 1) {
				this._timeTxt.text = "匹配中";
			}
			else if (KfArenaSys.ins().isStartIng == 1) {
				this._timeTxt.text = "进行中";
			} else {
				let leftTime: number = KfArenaSys.ins().getOpenLeftTime();
				if (leftTime > 0) {
					this._time = leftTime;
					this._timeTxt.text = DateUtils.getFormatBySecond(this._time, DateUtils.TIME_FORMAT_5, 4);
					if (!TimerManager.ins().isExists(this.setRepeat, this)) TimerManager.ins().doTimer(1000, 0, this.setRepeat, this);
				}
			}
		}
	}

	checkShowRedPoint(): number {
		return KfArenaRedPoint.ins().redpoint;
	}

	getEffName(redPointNum: number): string {
		this.effX = 38;
		this.effY = 38;
		return "actIconCircle";
	}

	tapExecute(): void {
		ViewManager.ins().open(KfArenaWin, 1);
	}
}