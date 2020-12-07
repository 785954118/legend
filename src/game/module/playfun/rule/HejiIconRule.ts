/**
 * 合击
 */
class HejiIconRule extends RuleIconBase {
	private playPunView:PlayFunView;
	constructor(id:number, t: egret.DisplayObjectContainer) {
		super(id, t);

		this.showMessage = [
			UserTask.ins().postUpdteTaskTrace,
		];

		this.playPunView = ViewManager.ins().getView(PlayFunView) as PlayFunView;
		let role:Role = SubRoles.ins().getSubRoleByIndex(0);
		this.guangquan = t["guangquan"];
		this.questNumber = t["questNumber"];
		this.skillName = t["skillName"];
		this.Img = t["Img"];
		this.bgimg = t["bgimg"];
		this.imggroup = t["imggroup"];
		this.eff = t["eff"];
		this.skillName.source = `8000${role.job}_png`;
		this.questNumber.text = "0";

		this.Img.source = `7${role.job}000_png`;
		this.bgimg.source = `7${role.job}000b_png`;

		this.mc = new MovieClip();
		// this.mc.playFile(RES_DIR_EFF + "guidecircle",1);
		this.eff.addChild(this.mc);

		//icon进度
		this.prossY = 0;
		let p: egret.Point = this.Img.localToGlobal();
		this.imggroup.globalToLocal(p.x, p.y, p);
		this.masksp = new egret.Sprite();
		let square: egret.Shape = new egret.Shape();
		square.graphics.beginFill(0xffffff);
		square.graphics.drawRect(p.x, p.y, this.Img.width, this.Img.height);
		square.graphics.endFill();


		this.prossY = p.y + this.Img.height;
		this.masksp.y = this.prossY;
		this.masksp.addChild(square);
		this.imggroup.addChild(this.masksp);
		this.Img.mask = this.masksp;

		// //测试进度加载
		// let tween0: egret.Tween = egret.Tween.get(this.masksp);
		// tween0.to({ "y": p.y }, 10000).call(() => {
		// 	egret.Tween.removeTweens(this.masksp);
		// 	this.imggroup.removeChild(this.masksp);
		// });

		let dif = this.updatekStep();
		this.updatePross(dif);

	}
	private flyimg:eui.Image;
	private boommc:MovieClip;
	private jumpmc:MovieClip;//
	private prossY:number;
	private masksp:egret.Sprite;
	private mc:MovieClip;
	private eff:eui.Group;
	private imggroup:eui.Group;
	private bgimg:eui.Image;
	private Img:eui.Image;
	private guangquan:eui.Image;
	private questNumber:eui.Label;
	private skillName:eui.Image;
	checkShowIcon(): boolean {
		if( !UserTask.ins().taskTrace ){
			// UserTips.ins().showTips(`当前任务数据异常1`);
			return false;
		}
		if( UserFb.ins().pkGqboss )
			return false;

		if( UserTask.ins().taskTrace.id >= TargetWin.TASKID  ){
			if( this.mc.parent )
				DisplayUtils.removeFromParent(this.mc);
			// egret.log("完成合击引导");
			return false;
		}
		// let dif = this.updatekStep();
		// this.updatePross(dif);
		return true;
	}

	public updatekStep(success?:boolean){
		if( !UserTask.ins().taskTrace ){
			// UserTips.ins().showTips(`当前任务数据异常2`);
			return 0;
		}
		if( UserTask.ins().taskTrace.id >= TargetWin.TASKID )
			return 0 ;
		for( let i in GlobalConfig.AchievementTaskConfig ){
			if( UserTask.ins().taskTrace.id == GlobalConfig.AchievementTaskConfig[i].taskId ){
				let dif = GlobalConfig.AchievementTaskConfig[i].index;
				let difex = dif;
				if( success )
					difex = dif + 1
				this.questNumber.text = TargetWin.TASKID%100 - difex + 1 + "";
				let self = this;
				this.showEff(()=>{self.updatePross(dif)});
				if( success )
					return dif>0?dif:0;
				return dif <= 1?0:dif;
			}
		}
		return 0;
	}

	private showEff(func:any){
		let taskTraceName = this.playPunView.taskTraceName;
		let point:egret.Point = taskTraceName.localToGlobal();
		this.playPunView.globalToLocal(point.x,point.y,point);
		// if( !this.flyimg ){
		// 	this.flyimg = new eui.Image("bally2");
		// }
		// if( !this.flyimg.parent ){
		// 	this.playPunView.addChild(this.flyimg);
		// }

		if( !this.jumpmc ){
			this.jumpmc = new MovieClip();
			this.jumpmc.playFile(RES_DIR_EFF + "bally2",-1);
		}
		if( !this.jumpmc.parent )
			this.playPunView.addChild(this.jumpmc);

		// if( !this.boommc ){
		// 	this.boommc = new MovieClip();
		// }

		// this.jumpmc.rotation = 45;
		//起点
		this.jumpmc.x = point.x + this.playPunView.taskTraceBtn.width/2;
		this.jumpmc.y = point.y;
		// this.flyimg.x = point.x + this.playPunView.taskTraceBtn.width/2;;
		// this.flyimg.y = point.y;

		//终点
		point = this.playPunView.hejiguide.localToGlobal();
		this.playPunView.globalToLocal(point.x,point.y,point);

		// this.jumpmc.playFile(RES_DIR_EFF + "guidefly",1,()=>{
		// 	DisplayUtils.removeFromParent(this.jumpmc);
		// });
		let self = this;
		egret.Tween.get(this.jumpmc).to
		({x:point.x + self.playPunView.hejiguide.width/2,y:point.y + self.playPunView.hejiguide.height/2},600).call(()=>{
			//呼吸圈
			if( !self.mc.parent )
				self.eff.addChild(self.mc);
			self.mc.playFile(RES_DIR_EFF + "guidecircle",1,()=>{
				DisplayUtils.removeFromParent(self.mc);

			});

			// DisplayUtils.removeFromParent(self.flyimg);
			egret.Tween.removeTweens(self.jumpmc);
			DisplayUtils.removeFromParent(self.jumpmc);

			// if( !self.boommc.parent ){
			// 	self.imggroup.addChild(self.boommc);
			// 	self.boommc.x = self.imggroup.width - 43;
			// 	self.boommc.y = self.imggroup.height/2 - 9;
			// }

			// self.boommc.playFile(RES_DIR_EFF + "guideboom",1,()=>{
			// 	// DisplayUtils.removeFromParent(self.boommc);
			// 	egret.Tween.removeTweens(self.jumpmc);
			// });

			if( func && typeof(func) == "function"){
				func();
			}
		});

	}
	private updatePross(v:number){
		if( this.masksp ){
			let value:number = v;
			let total:number = TargetWin.TASKID%100;
			let persent:number = value / total;
			persent = persent>=1?1:persent;
			this.masksp.y = this.prossY - Math.abs(this.prossY)*(persent);
		}
	}

	checkShowRedPoint(): number {

		return 0;
	}

	tapExecute(): void {
		ViewManager.ins().open(TargetWin,TargetWin.HEJI);
		Artifact.ins().showGuide = -2000;
	}



	getEffName(redPointNum: number): string {

		return undefined;
	}
}