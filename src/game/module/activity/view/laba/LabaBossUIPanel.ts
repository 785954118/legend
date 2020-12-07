class LabaBossUIPanel extends BaseEuiView {

	public myTxt: eui.Label;
	/** boss名字 */
	public nameTxt: eui.Label;
	/** boss头像 */
	public head: eui.Image;
	/** 进度血量 */
	public bloodBar: eui.ProgressBar;
	/** boss等级 */
	public lvTxt: eui.Label;

	/**护盾 */
	public hudun: eui.Group;
	public hudunbloodBar: eui.ProgressBar;

	/**复活group */
	public timeLable: eui.Label;
	public autoClear: eui.CheckBox;

	public dropDown: DropDown;

	private grayImg: eui.Image;
	private grayImgMask: egret.Rectangle;
	private static GRAYIMG_WIDTH: number = 0;

	private _curMonsterID:number = 0;

	/**奖励*/
	private rankReward:eui.Button;
	private redPoint:eui.Image;
	private otherRank:eui.List;
	private meRank:eui.List;
	private rankArrayCollection:eui.ArrayCollection;
	private myrankArrayCollection:eui.ArrayCollection;

	private activity:ActivityType20Data;//腊八活动类型
	private timer:number;
	private readyTimer:number;
	private already:boolean;//是否开始
	private bossBloodGroup:eui.Group;//boss组
	private refreshHints:eui.Label;
	private refreshTime:eui.Label;
	private bossHurt:boolean;
	private refreshBg:eui.Image;
	constructor() {
		super();
		this.skinName = "LaBaBossBattleUiSkin";
	}
	public initUI(): void {
		super.initUI();
		this.bloodBar.slideDuration = 0;
		// this.grayImg.source = "bosshp2";
		// // this.grayImg.alpha = 0.5;
		// this.grayImgMask = new egret.Rectangle(0, 0, this.grayImg.width, this.grayImg.height);
		// this.grayImg.mask = this.grayImgMask;
		// LabaBossUIPanel.GRAYIMG_WIDTH = this.grayImg.width;
		this.grayImg.visible = false;
		this.already = false;
		this.bossHurt = false;
	}
	protected childrenCreated(): void {
		super.childrenCreated();
		this.otherRank.itemRenderer = LaBaBossPlayerItemRender;
		this.rankArrayCollection = new eui.ArrayCollection()
		this.otherRank.dataProvider = this.rankArrayCollection;
		this.meRank.itemRenderer = LaBaBossPlayerItemRender;
		this.myrankArrayCollection = new eui.ArrayCollection()
		this.meRank.dataProvider = this.myrankArrayCollection;

	}
	public close(...param: any[]): void {
		// if( GameMap.fbType != UserFb.FB_TYPE_LABA )return;
		TimerManager.ins().remove(this.calcTime,this);
		TimerManager.ins().remove(this.updateLogic,this);
		this.removeObserve();
		this._curMonsterID = 0;
		// if (this.grayImgMask) egret.Tween.removeTweens(this.grayImgMask);
		ViewManager.ins().close(this);
		// UserFb.ins().sendExitFb();
	}
	public open(...param: any[]): void {
		// this.observe(GameLogic.ins().postEnterMap,this.close);
		// this.observe(UserBoss.ins().postRemainTime, this.updateReliveTime);
		this.observe(UserBoss.ins().postHpChange, this.updateInfo);
		// this.observe(Activity.ins().postChangePage,this.updateData);
		this.addTouchEvent(this.rankReward, this.onTap);
		this.updateData();
		if( !this.activity || !this.activity.go2BossFb() ){
			ViewManager.ins().close(this);
			UserFb.ins().sendExitFb();
			return;
		}
		this.init();
	}
	private init(){
		this.timer = this.activity.getResidueTimer();
		this.readyTimer = this.activity.getResidueStartTimer();
		this.already = this.activity.checkRedPoint();
		this.TimerChange();//倒计时启动

	}
	private updateData(){
		this.activity = Activity.ins().checkLabaBossData();
	}
	/**逻辑入口*/
	private updateLogic(){
		if( this.already )
			this.updateFb();
		else
			this.updateReady();
		this.refreshBg.visible = this.refreshHints.visible = this.refreshTime.visible = !this.already;
		this.bossBloodGroup.visible = this.already;
	}
	/**准备阶段*/
	private updateReady(){
		if( this.readyTimer ){
			this.refreshTime.text = this.readyTimer + "秒";
		}else{
			this.refreshTime.text = "刷新中";
		}
		if( !this.bossHurt ){
			this.already = false;
		}
		else{
			//boss刷新了
			this.timer = this.activity.getResidueTimer();//重新获取boss剩余时间
			this.already = true;
		}
	}
	/**战斗阶段*/
	private updateFb(){
		// let charm: CharMonster = <CharMonster>EntityManager.ins().getEntityByHandle(UserBoss.ins().bossHandler);
		this.updateBaseInfo();
		let config:ActivityType20Config = GlobalConfig.ActivityType20Config[this.activity.id][this.activity.index];
		let percent = this.timer/config.duration;
		percent = percent>=1?1:percent;
		this.bloodBar.value = percent*100;
		this.bloodBar.maximum = 100;
		let percentLabel = (percent*100).toFixed(1);
		this.bloodBar.labelFunction = function () {
			return `${percentLabel}%`;
		}
		// this.curValue = Math.floor(this.bloodBar.value / 120 * 100);
		// this.tweenBlood();
		this.updateHurtRank();
	}
	/**伤害排名*/
	private updateHurtRank(){
		// this.rankArrayCollection.replaceAll(this.activity.rankData);
		let rankData = []
		let myData = [];
		for( let i = 0;i < UserBoss.ins().rank.length;i++ ){
			let rankitemdata:WorldBossRankItemData = UserBoss.ins().rank[i];
			let rd:{rank:number,name:string,damage:number} = {
				rank: rankitemdata.rank,
				name:rankitemdata.roleName,
				damage:rankitemdata.value
			};
			if ( i < 5 ){
				rankData.push(rd);
			}
			if( rankitemdata.id == Actor.actorID ){
				myData.push(rd);
			}
			if( rankData.length == 5 && !myData.length  )
				break;//已经找到前五 和自己的数据 自己有可能不在伤害列表 这种情况只能遍历完
		}
		//自己不在伤害列表
		if( !myData.length ){
			let rd:{rank:number,name:string,damage:number} = {
				rank: 0,
				name:Actor.myName,
				damage:0
			};
			myData.push(rd);
		}
		this.rankArrayCollection.replaceAll(rankData);
		this.myrankArrayCollection.replaceAll(myData);
	}
	/**boss基础信息*/
	private updateBaseInfo(){
		if(this._curMonsterID == UserBoss.ins().monsterID) return;
		this._curMonsterID = UserBoss.ins().monsterID;

		let config: MonstersConfig = GlobalConfig.MonstersConfig[UserBoss.ins().monsterID];
		if( !config )return;
		this.head.source = `monhead${config.head}_png`;
		this.lvTxt.text = "Lv." + config.level;
		this.nameTxt.text = config.name;
	}
	private curValue: number = 1;
	private tweenBlood(): void {
		//缓动灰色血条
		let bloodPer = (this.curValue * LabaBossUIPanel.GRAYIMG_WIDTH) / 100;
		let self = this;
		egret.Tween.removeTweens(this.grayImgMask);
		if (bloodPer < 3) return;
		let t = egret.Tween.get(this.grayImgMask, {
			onChange: () => {
				if (self.grayImg) self.grayImg.mask = this.grayImgMask;
			}
		}, self);
		t.to({ "width": bloodPer - 3 }, 1000).call(function (): void {
			if (bloodPer <= 0) {
				self.grayImgMask.width = 0;
				egret.Tween.removeTweens(this.grayImgMask);
			}
		}, self);
	}

	/**副本倒计时*/
	private TimerChange(){
		if (!TimerManager.ins().isExists(this.calcTime, this)) TimerManager.ins().doTimer(1000, 0, this.calcTime, this);
		if (!TimerManager.ins().isExists(this.updateLogic, this)) TimerManager.ins().doTimer(60, 0, this.updateLogic, this);
	}
	public calcTime(): void {
		if( this.timer > 0 )
			this.timer--;
		else{
			this.timer = 0;
		}
		if( this.bossHurt )
			this.readyTimer = 0;
		else{
			if( this.readyTimer > 0 )
				this.readyTimer--;
		}
	}
	private onTap(e: egret.TouchEvent): void {
		switch (e.currentTarget) {
			case this.rankReward:
				ViewManager.ins().open(LabaRewardTips,this.activity);
				break;
		}
	}
	private updateReliveTime(){
		if (UserBoss.ins().reliveTime > 0) {
			ViewManager.ins().open(WorldBossBeKillWin);
		} else {
			ViewManager.ins().close(WorldBossBeKillWin);
		}
	}
	/**boss刷新出来接收伤害了*/
	private updateInfo(){
		this.bossHurt = true;
		// if (value > 0 || GameMap.fbType != UserFb.FB_TYPE_LABA) return;
		// let role = EntityManager.ins().getNoDieRole();
		// if (!role){
		// 	ViewManager.ins().open(WorldBossBeKillWin);
		// }else{
		// 	ViewManager.ins().close(WorldBossBeKillWin);
		// }
	}
}

ViewManager.ins().reg(LabaBossUIPanel, LayerManager.Game_Main);