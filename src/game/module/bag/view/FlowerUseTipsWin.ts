/**
 * 送花界面
 * @author wanghengshuai
 * 
 */
class FlowerUseTipsWin extends BaseEuiView{

	public bgClose:eui.Rect;
	public anigroup:eui.Group;
	public BG:eui.Image;
	public sub1Btn:eui.Button;
	public add1Btn:eui.Button;
	public maxBtn:eui.Button;
	public minBtn:eui.Button;
	public itemCount:eui.Label;
	public charmPoint:eui.Label;
	public sendBtn:eui.Button;
	public openListBtn:eui.Button;
	public scroller:eui.Scroller;
	public list:eui.List;
	public selectName:eui.Label;
	public numLabel:eui.Label;
	public closeBtn:eui.Button;

	private _showFriendsList:boolean;

	private _collect:ArrayCollection;

	private _friendID:number;

	private _sendCount:number = 1;

	private _maxCount:number = 0;

	public constructor() {
		super();
		this.skinName = "flowerUseTips";
	}

	public childrenCreated():void
	{
		super.childrenCreated();
		this.list.itemRenderer = FlowerTargetItemrender;
	}

	public open(...args:any[]):void
	{
		this.addTouchEvent(this, this.onTouch);
		this.addTouchEvent(this.list, this.onTouchList);
		this.observe(Friends.ins().postFriendChange, this.update, this);
		this.observe(UserBag.ins().postItemAdd, this.updateMaterial);
		this.observe(UserBag.ins().postItemChange, this.updateMaterial);
		this.observe(UserBag.ins().postItemDel, this.updateMaterial);

		this._sendCount = 1;
		this._friendID = 0;
		this.update();
		this.selectName.text = "";
	}

	public close():void
	{
		this.removeTouchEvent(this, this.onTouch);
		this.removeTouchEvent(this.list, this.onTouchList);
		this.removeObserve();

		this.scroller.visible = false;
	}

	private update():void
	{
		if (!this._collect)
		{
			this._collect = new ArrayCollection();
			this.list.dataProvider = this._collect;
		}

		this._collect.source = Friends.ins().friendsList.source;
		this.updateCount();
		this.updateMaterial();
	}

	private updateMaterial():void
	{	
		let itemData: ItemData = UserBag.ins().getBagItemById(GlobalConfig.TeamFuBenBaseConfig.itemId);
		this._maxCount = itemData ? itemData.count : 0;
		this.itemCount.text = "剩余鲜花：" + this._maxCount;
	}
	
	private onTouch(e:egret.TouchEvent):void
	{
		switch (e.target)
		{
			case this.bgClose:
			case this.closeBtn:
				ViewManager.ins().close(this);
				break;
			case this.sendBtn:
				if (!this._friendID)
				{
					UserTips.ins().showTips(`请选择要赠送鲜花的好友`);
					return;
				}

				if (this._maxCount <= 0 || this._maxCount < this._sendCount)
				{
					UserTips.ins().showTips(`背包内没有足够的道具`);
					return;
				}

				UserFb.ins().sendTfFlower(this._friendID, this._sendCount);
				break;
			case this.minBtn:
				if (this._sendCount != 1)
				{
					this._sendCount = 1;
					this.updateCount();
				}
				break;
			case this.maxBtn:
				if (this._sendCount != this._maxCount)
				{
					this._sendCount = this._maxCount;
					this.updateCount();
				}
				break;
			case this.sub1Btn:
				if (this._sendCount > 1)
				{
					this._sendCount--;
					this.updateCount();
				}
				break;
			case this.add1Btn:
				if (this._sendCount < this._maxCount)
				{
					this._sendCount++;
					this.updateCount();
				}
				break;
			case this.openListBtn:
				this.scroller.visible = !this.scroller.visible;
				break;
		}
	}

	private onTouchList(e:egret.TouchEvent):void
	{
		let selectedItem:FriendData = this.list.selectedItem;
		if (selectedItem) 
		{
			this._friendID = selectedItem.id;
			this.selectName.text = selectedItem.name;
			this.scroller.visible = !this.scroller.visible;
		}
	}

	private updateCount():void
	{
		this.numLabel.text = this._sendCount + "";
		this.charmPoint.text = "魅力值：" + (this._sendCount * GlobalConfig.TeamFuBenBaseConfig.flowerChiv);
	}

}

ViewManager.ins().reg(FlowerUseTipsWin, LayerManager.UI_Popup);