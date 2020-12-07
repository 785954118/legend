/**
 * 送花记录界面
 * @author wanghengshuai
 * 
 */
class FlowerOpenWin extends BaseEuiView{
	
	public scroller:eui.Scroller;
	public list:eui.List;
	public charmCount:eui.Label;
	public closeBtn:eui.Button;
	public closeBtn0:eui.Button;

	private _collect:ArrayCollection;

	public constructor() {
		super();
		this.skinName = "flowerOpenSkin";
	}

	public childrenCreated():void
	{
		super.childrenCreated();
		this.list.itemRenderer = FlowerRewardItemRender;
	}

	public open(...args:any[]):void
	{
		this.addTouchEvent(this.closeBtn, this.onTouch);
		this.addTouchEvent(this.closeBtn0, this.onTouch);
		this.observe(UserFb.ins().postTeamFbFlowarRecords, this.update);

		this.update();
	}

	public close():void
	{
		this.removeTouchEvent(this.closeBtn, this.onTouch);
		this.removeTouchEvent(this.closeBtn0, this.onTouch);
		this.removeObserve();
		UserFb.ins().clearTfFlowerRecords();

		let win:PlayFunView = ViewManager.ins().getView(PlayFunView) as PlayFunView;
		if (win)
			win.removeFlowerItem();
	}

	private update():void
	{
		if (!this._collect)
		{
			this._collect = new ArrayCollection();
			this.list.dataProvider = this._collect;
		}

		let source:{roleName:string, count:number}[] = UserFb.ins().tfFlowerRecords.concat();
		source.reverse();
		this._collect.source = source;
		
		let len:number = source.length;
		let total:number = 0;
		for (let i:number = 0; i < len; i++)
			total += (source[i].count * GlobalConfig.TeamFuBenBaseConfig.flowerChiv);

		this.charmCount.text = "你的魅力提高了 " + total + " 点";
	}

	private onTouch(e:egret.TouchEvent):void
	{
		ViewManager.ins().close(this);
	}

}

ViewManager.ins().reg(FlowerOpenWin, LayerManager.UI_Popup);
