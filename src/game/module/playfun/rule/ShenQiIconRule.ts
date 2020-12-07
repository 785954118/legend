/**
 * 神器
 */
class ShenQiIconRule extends RuleIconBase {

	constructor(id:number, t: egret.DisplayObjectContainer) {
		super(id, t);

		this.showMessage = [
			UserFb.ins().postGuanqiaInfo,
			UserFb.ins().postGuanKaIdChange,
			UserTask.ins().postUpdteTaskTrace,
			Artifact.ins().postNewArtifactInit,
			Artifact.ins().postNewArtifactUpdate,
			Artifact.ins().postGuide,
		];
	}

	private labelInfo:eui.Label;
	private imgInfo: eui.Image;
	private imgName: eui.Image;
	private imgItem: eui.Image;
	private labelChapter: eui.Label;
	private mc: MovieClip;
	private groupEff: eui.Group;
	private pretips:number;

	checkShowIcon(): boolean {
		this.updateInfo();
		let b = OpenSystem.ins().checkSysOpen(SystemType.SHENQIGUIDE) && !UserFb.ins().pkGqboss && UserFb.ins().guanqiaID < 340;
		return b;
	}

	private updateInfo() {
		let rewardData:RewardData;
		let reward = UserFb.ins().getCurrentReward();
		let nextReward = UserFb.ins().getNextReward();
		if (reward){
			rewardData = reward[0];
			UserFb.ins().getMapReward();
			if( !this.pretips || this.pretips != rewardData.id ){//防止重复提示
				this.pretips = rewardData.id;
				UserTips.ins().showItemTips(rewardData.id);
			}
		}
		else if (nextReward) {
			rewardData = nextReward[0];
			if (this.labelChapter) {
				let str = `再战|C:0x40df38&T:${UserFb.ins().getNextNeedChapter()}|关`;
				this.labelChapter.textFlow = TextFlowMaker.generateTextFlow1(str);
			}
		}
		if (rewardData && this.tar)
			this.setReward(rewardData);
	}

	protected createTar() {
		let t = super.createTar();

		this.labelInfo = t["labelInfo"];
		this.imgInfo = t["imgInfo"];
		this.imgName = t["imgName"];
		this.imgItem = t["imgItem"];
		this.labelChapter = t["labelChapter"];
		this.groupEff = t["groupEff"];

		this.updateInfo();

		return t;
	}

	checkShowRedPoint(): number {
		//碎片进度
		// let maxIndex = Artifact.ins().getMaxIndex();
		// let index:number = 1;
		// for (let i = 1; i <= maxIndex; i++) {
		// 	let data = Artifact.ins().getNewArtifactBy(i);
		// 	index = i;
		// 	if (!data.open) {
		// 		for (let i = 0; i < 8; i++) {
		// 			let state = (data.record >> i) & 1;
		// 			let state2 = ((data.exitRecord >> i) & 1) && (state == 0);
		// 			if( state2 )
		// 				return 1;
		// 		}
		// 		break;
		// 	}
		// }

		// return UserFb.ins().getCurrentReward() ? 1 : 0;

		// return UserFb.ins().currentEnergy >= UserFb.ins().energy?1:0;
		return 0;
	}

	tapExecute(): void {
		// if (UserFb.ins().getCurrentReward()) {
		// 	UserFb.ins().getMapReward();
		// }
		// ViewManager.ins().open(LiLianWin, 0);
		ViewManager.ins().open(TargetWin,TargetWin.SEHNQI);
		Artifact.ins().showGuide = -2000;
	}

	setReward(rewardData: RewardData) {
		let conf = Artifact.ins().getConfByChipId(rewardData.id);
		if (!conf)
			return;
		this.imgName.source = conf.imgName;
		this.imgItem.source = conf.img;
		this.imgInfo.source = conf.simpleDesc;
		this.labelInfo.text = conf.buttonDesc;
	}


	getEffName(redPointNum: number): string {
		// if (egret.getTimer() - Artifact.ins().showGuide < 3000) {
		// 	this.effX = this.groupEff.x;
		// 	this.effY = this.groupEff.y;
		// 	return "guideff";
		// }
		return undefined;
	}
}