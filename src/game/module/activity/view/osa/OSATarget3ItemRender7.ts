/**
 * 活动3控件7
 */
class OSATarget3ItemRender7 extends BaseItemRender {
	private get0:eui.Button;
	private reward:ItemBase;
	private num:eui.BitmapLabel;
	private already:eui.Label;
	private rewardList:eui.List;
	private isGet:boolean;//是否可领取
	private redPoint:eui.Image;
	private actId:number;
	private index:number;
	constructor(){
		super();
		this.skinName = `OSAItem`;
	}

	protected childrenCreated() {
		super.childrenCreated();
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick,this);
		this.rewardList.itemRenderer = ItemBase;
		this.isGet = true;
	}

	/**触摸事件 */
	public onClick(e:egret.Event) {
		switch (e.target){
			case this.get0:
				if( this.isGet ){
					if( this.data instanceof ActivityType3Config ) {
						Activity.ins().sendReward(this.actId,this.index);
					}else if( this.data instanceof PActivity3Config ) {
						PActivity.ins().sendReward(this.actId,this.index);
					}
				}else{
					let config: ActivityType3Config|PActivity3Config;
					let activityData: ActivityType3Data|PActivityType3Data;
					let ins:Activity|PActivity;
					if( this.data instanceof ActivityType3Config ) {
						config = GlobalConfig.ActivityType3Config[this.actId][this.index];
						ins = Activity.ins();
						activityData = ins.getActivityDataById(this.actId) as ActivityType3Data;
					}else if( this.data instanceof PActivity3Config ) {
						config = GlobalConfig.PActivity3Config[this.actId][this.index];
						ins = PActivity.ins();
						activityData = ins.getActivityDataById(this.actId) as PActivityType3Data;
					}

					let tips = 0;
					switch (config.showType){
						case Show3Type.TYPE7:
							if( activityData.dabiao[this.index-1] < config.day )
								tips = config.day - activityData.dabiao[this.index-1];
							break;

					}
					if( !tips ){
						ins.sendReward(this.actId,this.index);
						return;
					}
					if( config.showType == Show3Type.TYPE7 && activityData.dabiao[this.index-1] < config.day )
						UserTips.ins().showTips("累计充值"+(+tips)+"天之后即可领取奖励");

				}
				break;
		}
	}

	dataChanged() {
		super.dataChanged();
		let config:ActivityType3Config|PActivity3Config;
		let ins:Activity|PActivity;
		let activityData: ActivityType3Data|PActivityType3Data;
		if( this.data instanceof ActivityType3Config ){
			config = this.data as ActivityType3Config;
			ins = Activity.ins();
			activityData = ins.getActivityDataById(config.Id) as ActivityType3Data;
		}else if( this.data instanceof PActivity3Config ){
			config = this.data as PActivity3Config;
			ins = PActivity.ins();
			activityData = ins.getActivityDataById(config.Id) as PActivityType3Data;
		}

		this.num.text = config.day+"";
		this.rewardList.dataProvider = new eui.ArrayCollection(config.rewards);

		//控件按钮状态
		let btnType:number = activityData.getRewardStateById(config.index);
		switch (btnType){
			case Activity.NotReached:
				this.get0.label = "未完成";
				this.get0.currentState = "disabled";
				this.isGet = false;
				this.redPoint.visible = false;
				break;
			case Activity.CanGet:
				this.get0.label = "领取";
				this.get0.currentState = "up";
				this.isGet = true;
				this.redPoint.visible = true;
				break;
			case Activity.Geted://已领取
				this.isGet = false;
				this.redPoint.visible = false;
				this.get0.visible = false;
				this.already.visible = true;
				break;
		}

		this.actId = config.Id;
		this.index = config.index;
	}
}