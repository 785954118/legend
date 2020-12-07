/**
 * 限时任务
 */
class LimitTaskIconRule extends RuleIconBase {
	private alertText: eui.Label;
	constructor(id:number, t: egret.DisplayObjectContainer) {
		super(id, t);

		this.showMessage = [
			Actor.ins().postLevelChange,
			UserZs.ins().postZsData,
		];

		this.updateMessage = [
			UserTask.ins().postUpdteLimitTaskData,
		];
	}

	protected createTar() {
		let t = super.createTar();
		this.alertText = new eui.Label();
		// this.alertText.fontFamily = "黑体";
		this.alertText.size = 14;
		this.alertText.width = 120;
		this.alertText.textAlign = "center";
		this.alertText.textColor = 0x35e62d;
		this.alertText.horizontalCenter = 0;
		t.addChild(this.alertText);
		this.alertText.y = 70;

		if (UserTask.ins().limitTaskState == 0) {
			this.alertText.text = "点击开放";
		} else {
			this.runTime();
			TimerManager.ins().doTimer(1000, 0, this.runTime, this);
		}

		return t;
	}

	private runTime(): void {
		let time: number = UserTask.ins().limitTaskEndTime - Math.floor(GameServer.serverTime / 1000);
		if (time >= 0) {
			this.alertText.text = DateUtils.getFormatBySecond(time, DateUtils.TIME_FORMAT_12)
		} else {
			this.alertText.text = "活动结束";
			TimerManager.ins().remove(this.runTime, this);
			this.updateShow();
		}
	}

	checkShowIcon(): boolean {
		if (!OpenSystem.ins().checkSysOpen(SystemType.LIMITTASK)) {
			return false;
		}

		let config: LimitTimeConfig = GlobalConfig.LimitTimeConfig[UserTask.ins().currTaskListsId];
		if (!config) return false;

		if (UserTask.ins().limitTaskEndTime > 0) {
			if ( (UserTask.ins().limitTaskEndTime - Math.floor(GameServer.serverTime / 1000) < 0)) {
				if (!GlobalConfig.LimitTimeConfig[UserTask.ins().currTaskListsId+1]) {
					ViewManager.ins().close(LimitTaskView);
					return false;
				}
			} else if (!GlobalConfig.LimitTimeConfig[UserTask.ins().currTaskListsId+1] && UserTask.ins().limitTaskCount == 8) {
				//领取完最后一个奖励就关闭
				this.updateShow();
				TimerManager.ins().doTimer(1500,1,()=>{
					ViewManager.ins().close(LimitTaskView);
				},this);
				return false;
			}
		}

		if (UserTask.ins().limitTaskState != -1 && UserTask.ins().limitTaskEndTime > 0) return true;
		return true;
	}

	checkShowRedPoint(): number {
		return UserTask.ins().getLimitTaskRed();
	}

	tapExecute(): void {
		ViewManager.ins().open(LimitTaskView);
		// this.update();
	}

	getEffName(redPointNum: number): string {
		this.effX = 38;
		this.effY = 38;
		return "actIconCircle";
		// return undefined;
	}
}