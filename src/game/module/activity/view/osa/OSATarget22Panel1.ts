/**
 * 活动22-1
 * @author wanghengshuai
*/
class OSATarget22Panel1 extends BaseView{
	
	public activityID: number;

	public refreshTime:eui.Label;
	public refreshTips:eui.Label;
	public integralTips:eui.Label;
	public integralStoreBtn:eui.Button;
	public refreshShopBtn:eui.Button;
	public costGroup:eui.Group;
	public price:eui.Label;
	public integral:eui.Group;
	public integralName:eui.Label;
	public integralNum:eui.Label;
	public listView:eui.List;
	public goodsOverView:eui.Label;
	public title:eui.Image;
	public infoBg:eui.Group;
	public actTime0:eui.Label;
	public actInfo0:eui.Label;
	public closeBtn:eui.Button;
	public tab:eui.TabBar;
	public redPoint:eui.Image;
	public noGoods:eui.Label;
	public point:eui.Label;
	public redPoint1:eui.Image;
	public redPoint0:eui.Image;
	public refreshItem:eui.Image;
	public refreshItemNum:eui.Label;

	private _collect:ArrayCollection;

	private _isEnough:boolean;

	public constructor(id:number) {
		super();
		this.activityID = id;
		this.setCurSkin();
	}

	private setCurSkin():void
	{
		let aCon:ActivityConfig = GlobalConfig.ActivityConfig[this.activityID];
		if (aCon.pageSkin)
			this.skinName = aCon.pageSkin;
		else
			this.skinName = "activityStoreSkin";
	}

	public childrenCreated():void
	{
		super.childrenCreated();
		this.goodsOverView.textFlow = TextFlowMaker.generateTextFlow1(`|U:&T:${this.goodsOverView.text}`);
		this.listView.itemRenderer = ActivityStoreItemRender;	
	}

 	public open(...param: any[]): void {
         
		this.setCurSkin();
		let aCon:ActivityConfig = GlobalConfig.ActivityConfig[this.activityID];
		this.actInfo0.text = aCon.desc;

		this.observe(Activity.ins().postActivityIsGetAwards, this.updateData);
		this.observe(UserBag.ins().postItemAdd, this.updateMaterial);
		this.observe(UserBag.ins().postItemChange, this.updateMaterial);
		this.observe(UserBag.ins().postItemDel, this.updateMaterial);

		TimerManager.ins().doTimer(1000,0,this.setTime,this);
		this.addTouchEvent(this, this.onTouch);

		this.currentState = "activityStore";
		this.updateData();
		this.updateMaterial();
    }

	public close(...param: any[]): void {
        this.removeTouchEvent(this, this.onTouch);
	    this.removeObserve();
    	TimerManager.ins().removeAll(this);
    }

	private updateMaterial():void
	{
		let itemData: ItemData = UserBag.ins().getBagItemById(GlobalConfig.ActivityType22_1Config[this.activityID][1].freshItem);
		let count:number = itemData ? itemData.count : 0;
		this.refreshItemNum.textFlow = TextFlowMaker.generateTextFlow(`|C:${count ? 0x00ff00 : 0xff0000}&T:${count}`);
		this._isEnough = count > 0;

		if (this.currentState == "activityStore")
		{
			let data: ActivityType22Data = Activity.ins().activityData[this.activityID] as ActivityType22Data;
			this.redPoint1.visible = data.refreshFree || this._isEnough;
		}
	}

	public updateData():void
	{
		if (!this._collect)
		{
			this._collect = new ArrayCollection();
			this.listView.dataProvider = this._collect;
		}

		let data: ActivityType22Data = Activity.ins().activityData[this.activityID] as ActivityType22Data;
		let datas:any[] = [];
		let items:SpringBeginShopVo[] = this.currentState == "activityStore" ? data.shopItems : data.scoreItems;
		let len:number = items ? items.length : 0;
		for (let i:number = 0; i < len; i++)
			datas.push({data:items[i], isScore:this.currentState == "integralStore", activityID:this.activityID});

		this._collect.source = datas;

		
		if (this.currentState == "activityStore")
		{
			this.costGroup.visible = !data.refreshFree;
			this.price.text = GlobalConfig.ActivityType22_1Config[this.activityID][1].freshPrice + "";
			this.refreshShopBtn.label = data.refreshFree ? "免费刷新" : "刷   新";
			this.redPoint1.visible = data.refreshFree || this._isEnough;

			let config:ActivityType22_3Config = Activity.ins().getConfig22_3(this.activityID);
			this.redPoint0.visible = config && data.tScore >= config.score;
		}
		
		this.integralNum.text = data.tScore + "";	

		let itemcfg:ItemConfig = GlobalConfig.ItemConfig[GlobalConfig.ActivityType22_1Config[this.activityID][1].freshItem];
		this.refreshItem.source = itemcfg ? itemcfg.icon + "_png" : "";
	}

	private onTouch(e:egret.TouchEvent):void
	{
		switch (e.target)
		{
			case this.goodsOverView:
				ViewManager.ins().open(ActivityStoreRewardShowWin, this.activityID);
				break;
			case this.integralStoreBtn:
				this.currentState = this.currentState == "integralStore" ? "activityStore" : "integralStore";
				this.updateData();
				break;
			case this.refreshShopBtn:
				let data: ActivityType22Data = Activity.ins().activityData[this.activityID] as ActivityType22Data;
				if (data.refreshFree)
					Activity.ins().sendReward(this.activityID, 0, 5, 0);
				else
				{
					if (Actor.yb < GlobalConfig.ActivityType22_1Config[this.activityID][1].freshPrice && !this._isEnough)
						UserTips.ins().showTips(`|C:0xf3311e&T:元宝不足|`);
					else
						Activity.ins().sendReward(this.activityID, 0, 5, 0);  
				}
				break;
		}
	}

	private setTime(){
        let data: ActivityType22Data = Activity.ins().activityData[this.activityID] as ActivityType22Data;
        this.actTime0.text = data.getRemainTime();

		let time:number = data.getRefreshTime();
		this.refreshTime.text = DateUtils.getFormatBySecond(time > 0 ? time : 0, DateUtils.TIME_FORMAT_1, 5);
    }
}