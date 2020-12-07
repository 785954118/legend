class DailyRechargePanel extends BaseView{
	
	public title:eui.Image;
	public infoBg:eui.Group;
	public actTime0:eui.Label;
	public actInfo0:eui.Label;
	public content:eui.List;

	public activityID:number;

	private _time:number = 0;
	private actType:number;
	public constructor() {
		super();
		this.skinName = "DailyRechargeSkin";
	}

	protected childrenCreated():void
	{
		super.childrenCreated();
		this.content.itemRenderer = DailyRechargeItemRender;
	}

	public open(...args:any[]):void
	{
		this.observe(Activity.ins().postActivityIsGetAwards, this.updateData);
		this.observe(PActivity.ins().postActivityIsGetAwards, this.updateData);
		TimerManager.ins().doTimer(1000, 0, this.setTime, this);
		this.actType = ActivityPanel.getActivityTypeFromId(this.activityID);
		this.updateData();
	}

	public close():void
	{
		this.removeObserve();
		TimerManager.ins().removeAll(this);
	}

	public updateData():void
	{
		var data:ActivityType3Data|PActivityType3Data;
		var configs:ActivityType3Config[]|PActivity3Config[];
		if( this.actType == ActivityType.Normal ){
			data = Activity.ins().getActivityDataById(this.activityID) as ActivityType3Data;
			configs = GlobalConfig.ActivityType3Config[this.activityID];
		}else if( this.actType== ActivityType.Personal ){
			data = PActivity.ins().getActivityDataById(this.activityID) as PActivityType3Data;
			configs = GlobalConfig.PActivity3Config[this.activityID];
		}

		var config:ActivityType3Config|PActivity3Config;
		var datas:Array<any> = [];
		var i:number = 0;
		var state:number = 0;
		for (var k in configs)
		{
			config =  configs[k];
			state = ((data.recrod  >> config.index) & 1) ? 2 : (data.chongzhiTotal >= config.val ? 1 : 0);
			datas[i] = [config, state, data.chongzhiTotal, this.activityID, config.index];
			i++;
		}

		this.content.dataProvider = new eui.ArrayCollection(datas);	

        this._time = data.getLeftTime();
        this.actTime0.text = DateUtils.getFormatBySecond(this._time, DateUtils.TIME_FORMAT_5, 4);
	}

	private setTime() {
        if(this._time > 0) {
            this._time -= 1;
            this.actTime0.text = DateUtils.getFormatBySecond(this._time, DateUtils.TIME_FORMAT_5,4);
        }
    }
}