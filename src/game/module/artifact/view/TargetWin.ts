/**
 * 神器引导和合击引导页
 */
class TargetWin extends BaseEuiView {
    public static SEHNQI = 1;
    public static HEJI   = 2;

    private bgClose:eui.Rect;
    private taskTip:eui.Group;
    private taskTipText0:eui.Label;
    /** 神器 **/
    private guanqia:eui.Group;
    private artifactImg:eui.Image;//神器表ImbaConf -> img
	private itemImg:eui.Image;
    private bar1:eui.ProgressBar;
    private guanqiaDes2:eui.Label;

	private des1a1:eui.Label;//神器表ImbaConf -> funcDesc
	private number1:eui.Label;//神器表ImbaConf -> jigsawId 碎片总数
	private artifactname:eui.Label;//神器表ImbaConf ->name
	private artifactName1:eui.Label;//神器名

	private button:eui.Group;
	private btn1:eui.Button;//灰btn2_2
	private btnbar:eui.Image;//红btn2

    /** 合击 **/
    public static TASKID = 100026;
    private quest:eui.Group;
	private skillName:eui.Image;//80001_png 80002_png 80003_png
	private des1b:eui.Label;
	private des2b:eui.Label;
	private roleimg:eui.Image;
	private enenyimg:eui.Image;
	private HejiSkillMc1: MovieClip;
	private HejiSkillMc2: MovieClip;
	private mcSkillID: string;
	private targetSkillID: string;


	private bar2:eui.ProgressBar;
	private questNumber:eui.Label;//再完成X个任务
	private questDes2:eui.Label;
	private btn2:eui.Button;




    private index:number;
    private masksp:egret.Sprite;
    private prossX:number;
	constructor() {
		super();
		this.skinName = "targetSkin";

	}

	public initUI(): void {
		super.initUI();
		this.taskTip.visible = false;
	}


	public destoryView(): void {
		super.destoryView();
		// this.artifactWin.destructor();
	}
	public close(...param: any[]): void {
		this.removeObserve();
		this.removeTouchEvent(this, this.onTouch);
		this.removeTouchEvent(this.bgClose, this.onTouch);
		this.removeTouchEvent(this.button, this.onTouch);
		this.removeTouchEvent(this.btn2, this.onTouch);
		TimerManager.ins().removeAll(this);
	}
	public open(...param: any[]): void {
		this.addTouchEvent(this, this.onTouch);
		this.addTouchEvent(this.bgClose, this.onTouch);
		this.addTouchEvent(this.button, this.onTouch);
		this.addTouchEvent(this.btn2, this.onTouch);

		this.observe(UserFb.ins().postAddEnergy, this.upDataGuanqia);
		if( param[0] == TargetWin.SEHNQI ){
			this.guanqia.visible = true;
			this.quest.visible = false;
			this.index = this.getShenQiId();
		}else{
			this.guanqia.visible = false;
			this.quest.visible = true;

			this.HejiSkillMc1 = new MovieClip;
			this.HejiSkillMc1.x = this.roleimg.x + this.roleimg.width/2 + 73;
			this.HejiSkillMc1.y = this.roleimg.y + this.roleimg.height/2 + 70 + 73;
			this.quest.addChild(this.HejiSkillMc1);

			this.HejiSkillMc2 = new MovieClip;
			this.HejiSkillMc2.x = this.enenyimg.x + this.enenyimg.width/2 + 80;
			this.HejiSkillMc2.y = this.enenyimg.y + this.enenyimg.height/2 + 167;
			this.quest.addChild(this.HejiSkillMc2);
		}



		this["show"+param[0]]();
	}
	//合击引导
	private show2(){
		let role:Role = SubRoles.ins().getSubRoleByIndex(0);
		let cur:number = this.getTaskSum();//当前正在做的任务
		let totovalue = TargetWin.TASKID%100;
		this.skillName.source = `8000${role.job}_png`;
		this.questNumber.text = (TargetWin.TASKID%100 - cur + 1) + "";
		this.mcSkillID = `skill40${role.job}`;
		this.targetSkillID = `skill${403+role.job}`;

		//进度
		let bvalue:number = 0;
		cur = cur>0?cur:0;
		let calc:number = (cur-1)/totovalue;
		calc = calc<=0?0:calc;
		calc = calc>=1?1:calc;
		bvalue = Math.floor(calc*100);
		this.bar2.value   = cur-1;
		this.bar2.maximum = totovalue;
		this.bar2.labelFunction = function () {
			// return `${bvalue}/100`;
			return `${bvalue}%`;
		}



		TimerManager.ins().remove(this.playSkillAnmi, this);
		TimerManager.ins().doTimer(3000, 0, this.playSkillAnmi, this);
		this.playSkillAnmi();
	}
	private getTaskSum(){
		if( UserTask.ins().taskTrace.id >= TargetWin.TASKID  )
			return 0;
		for( let i in GlobalConfig.AchievementTaskConfig ){
			if( UserTask.ins().taskTrace.id == GlobalConfig.AchievementTaskConfig[i].taskId ){
				let idx = GlobalConfig.AchievementTaskConfig[i].index;
				return idx>0?idx:0;
			}
		}
		return 0;
	}

	//神器引导
	private show1(){
		let config:ImbaConf = GlobalConfig.ImbaConf[this.index];
		if( !config )
			return;
		let rd:RewardData[] = UserFb.ins().getNextReward();
		if( !rd )
			return;
		let wrconfig:WorldRewardConfig = UserFb.ins().getNewChapter();
		if( !wrconfig )
			return;

		let chip:number = this.getChipNum(config);//再收集碎片数量
		let MaxGK:number = UserFb.ins().getDiffChapter();
		let newPassGK:number = wrconfig.needLevel;
		let itemconfig:ItemConfig =  GlobalConfig.ItemConfig[rd[0].id];

		this.artifactImg.source = config.img;
		this.itemImg.source 	= itemconfig.icon + "_png";
		this.artifactname.text  = config.name;//神器名
		this.number1.text 		= chip + "";
		this.des1a1.text 		= config.funcDesc;

		this.guanqiaDes2.text	= UserFb.ins().getNextNeedChapter() + "";


		this.artifactName1.text  = itemconfig.name;//碎片名

		//进度
		let bvalue:number = 0;
		let cur:number = UserFb.ins().guanqiaID - newPassGK - 1;
		cur = cur>0?cur:0;
		let calc:number = cur/MaxGK;
		calc = calc>=1?1:calc;
		bvalue = Math.floor(calc*100);
		this.bar1.value   = cur;
		this.bar1.maximum = MaxGK;
		this.bar1.labelFunction = function () {
			// return `${bvalue}/100`;
			return `${bvalue}%`;
		}

		//按钮进度
		this.prossX = 0;
		let p: egret.Point = this.btnbar.localToGlobal();
		this.btnbar.parent.globalToLocal(p.x, p.y, p);
		this.masksp = new egret.Sprite();
		let square: egret.Shape = new egret.Shape();
		square.graphics.beginFill(0xffffff);
		square.graphics.drawRect(p.x, p.y, this.btnbar.width, this.btnbar.height);
		square.graphics.endFill();


		this.prossX = p.x - this.btnbar.width;
		this.masksp.y = p.y;
		this.masksp.addChild(square);
		this.btnbar.parent.addChild(this.masksp);
		this.btnbar.mask = this.masksp;

		this.upDataGuanqia();

		//测试按钮进度加载
		// let tween0: egret.Tween = egret.Tween.get(masksp);
		// tween0.to({ "x": p.x }, 10000).call(() => {
		// 	egret.Tween.removeTweens(masksp);
		// 	this.btnbar.parent.removeChild(masksp);
		// });

	}
	private upDataGuanqia(){
		if( this.masksp ){
			let value:number = UserFb.ins().currentEnergy;
			let total:number = UserFb.ins().energy;
			let persent:number = (value-1) / total;
			persent = persent>=1?1:persent;
			this.masksp.x = this.prossX + Math.abs(this.prossX)*(persent);
		}

	}

	private getChipNum(config:ImbaConf):number{
		let chip:number = 0;

		for( let i = 0;i < config.jigsawId.length;i++ ){
			for( let k in GlobalConfig.WorldRewardConfig ){
				let wrconfig:WorldRewardConfig = GlobalConfig.WorldRewardConfig[k];
				if ( wrconfig.rewards[0].id == config.jigsawId[i] ) {
					if( wrconfig.needLevel >= UserFb.ins().guanqiaID )
						chip++;
					break;
				}
			}
			// if ( !UserBag.ins().getBagGoodsByTypeAndId(UserBag.BAG_TYPE_OTHTER,config.jigsawId[i]) )
			// 	chip++;
		}

		return chip;
	}
	//获取引导页所需展示的神器id
	private getShenQiId():number{
		let maxIndex = Artifact.ins().getMaxIndex();
		let index = 1;
		for (let i = 1; i <= maxIndex; i++) {
			let data = Artifact.ins().getNewArtifactBy(i);
			for( let j in GlobalConfig.ImbaConf ){
				if( GlobalConfig.ImbaConf[j].id == data.id ){
					let chipId:number = UserFb.ins().getChipByGuanQia();
					if( GlobalConfig.ImbaConf[j].jigsawId.indexOf(chipId) != -1 ){
						index = GlobalConfig.ImbaConf[j].index;
						return index;
					}
				}
			}
			// index = i;
			// if (!data.open) {
			// 	break;
			// }
		}
		return index;
		// let config:WorldRewardConfig = UserFb.ins().getNewChapter();
		// if( !config )
		// 	return;
		// config.
	}





	private onTouch(e: egret.TouchEvent): void {
		switch (e.currentTarget) {
			case this.bgClose:
			case this.btn2:
				ViewManager.ins().close(this);
				break;
			case this.button:
				if( UserFb.ins().currentEnergy >= UserFb.ins().energy ){
					let self = this;
					// PlayFun.ins().updateAutoPk(function(){
					// 	ViewManager.ins().close(self);
					// });
					GameGuider.challengeBoss(function(){
							ViewManager.ins().close(self);
						});
				}
				else{
					this.showTaskTips(`能量未满无法挑战，请继续清怪。`);
				}


				break;
		}
	}

	public showTaskTips(text) {
		let tips = this.taskTip;
		this.taskTipText0.textFlow = TextFlowMaker.generateTextFlow1(text);
		egret.Tween.removeTweens(tips);
		tips.bottom = 70;
		tips.visible = true;
		egret.Tween.get(tips).to({ bottom: 100 }, 500).wait(2000).call(() => {
			tips.visible = false;
		});
	}

	private playSkillAnmi(): void {
		egret.Tween.removeTweens(this.roleimg);
		let t: egret.Tween = egret.Tween.get(this.roleimg);
		if (!this.HejiSkillMc1.parent) this.quest.addChild(this.HejiSkillMc1);
		this.HejiSkillMc1.playFile(`${RES_DIR_SKILLEFF}${this.mcSkillID}`, 1, null, true);
		t.wait(1500).call(() => {
			if (!this.HejiSkillMc2.parent) this.quest.addChild(this.HejiSkillMc2);
			this.HejiSkillMc2.playFile(`${RES_DIR_SKILLEFF}${this.targetSkillID}`, 1, null, true);
		}, this);
	}


}
ViewManager.ins().reg(TargetWin, LayerManager.UI_Popup);
