class SDRewardWin extends BaseEuiView{
	
	public closeBtn:eui.Rect;
	public nametxt:eui.Label;
	public rewardShow:eui.Scroller;
	public list:eui.List;

	public constructor() {
		super();
		this.skinName = "SDRewardSkin";
		this.isTopLevel = true;
	}

	public childrenCreated():void
	{
		super.childrenCreated();
		this.list.itemRenderer = SDShowItemRender;
	}

	public open(...args:any[]):void
	{
		let len:number = Object.keys(GlobalConfig.ActivityType11_1Config[args[0]]).length;
		let dataArr:any[] = [];
		let conf:ActivityType11_1Config;
		for (let key in GlobalConfig.ActivityType11_1Config[args[0]])
		{
			conf = GlobalConfig.ActivityType11_1Config[args[0]][key];
			dataArr.push({reward:conf.reward, showText:conf.showText});
		}

		this.list.dataProvider = new ArrayCollection(dataArr);
	}
}

ViewManager.ins().reg(SDRewardWin, LayerManager.UI_Main);