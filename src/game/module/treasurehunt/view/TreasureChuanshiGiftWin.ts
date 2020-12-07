class TreasureChuanshiGiftWin extends BaseEuiView{
	
	public bgClose:eui.Rect;
	public anigroup:eui.Group;
	public already:eui.Label;
	public gift:eui.List;
	public get:eui.Button;
	public closeBtn0:eui.Button;

	private type:number;

	private id:number;

	private num:number;

	private lastSelected:number = -1;
	private choose:eui.Label;
	private add:eui.Group;
	private sub1Btn0:eui.Button;
	private add1Btn0:eui.Button;
	private minBtn0:eui.Button;
	private maxBtn0:eui.Button;
	private numLabel0:eui.EditableText;
	private useNum: number;
	private maxNum: number = 0;
	public constructor() {
		super();
		this.skinName = "TreasureChuanshiGift";
	}

	public open(...args:any[]):void
	{
		this.type = args[0];
		this.id = args[1];
		this.num = args[2];
		this.addTouchEvent(this, this.onTouch);
		this.observe(UserBag.ins().postGiftResult, this.otherClose);
		this.addTouchEndEvent(this.minBtn0, this.onTap);
		this.addTouchEndEvent(this.maxBtn0, this.onTap);
		this.addTouchEndEvent(this.sub1Btn0, this.onTap);
		this.addTouchEndEvent(this.add1Btn0, this.onTap);
		this.addChangeEvent(this.numLabel0, this.onTxtChange);
		this.numLabel0.restrict = "0-9";
		this.numLabel0.text = "0";
		this.add.touchEnabled = false;
		this.add.touchChildren = false;
		this.update();
	}

	private update():void
	{
		let config = GlobalConfig.OptionalGiftConfig[this.id];
		this.gift.itemRenderer = TreasureChuanshiItemRender;
		if( config.show[0]["reward"].length <= 4 ){
			this.currentState = "special";
		}else{
			this.currentState = "normal";
		}
		this.validateNow();
		this.gift.dataProvider = new eui.ArrayCollection(config.show[0]["reward"]);
		this.gift.validateNow();

		this.choose.textFlow = TextFlowMaker.generateTextFlow1(config.show[0]["str"]);
		this.maxNum = this.num;
		this.useNum = 0;
	}

	public close(...args:any[]):void
	{
		this.removeTouchEvent(this, this.onTouch);
		this.lastSelected = -1;
	}

	private onTouch(e:egret.TouchEvent):void
	{
		if (e.target == this.get)
		{
			if (this.gift.selectedIndex < 0)
			{
				UserTips.ins().showTips("请选择一个奖励");
				return;
			}
			if( !this.useNum ){
				UserTips.ins().showTips("请选择开启的数量");
				return;
			}

			UserBag.ins().sendChoosableGift(this.id, this.useNum, this.gift.selectedIndex);
		}
		else if (e.target.parent == this.gift)
		{
			if (this.lastSelected >= 0)
				(this.gift.getChildAt(this.lastSelected) as TreasureChuanshiItemRender).checkSelcted(this.gift.selectedIndex);

			this.lastSelected = this.gift.selectedIndex;
			if (this.gift.dataProvider && this.lastSelected > -1 && this.lastSelected < this.gift.dataProvider.length) {
				(this.gift.getChildAt(this.lastSelected) as TreasureChuanshiItemRender).checkSelcted(this.gift.selectedIndex);
			}
			this.add.touchChildren = true;
			this.useNum = this.num;
			this.numLabel0.text = this.useNum + "";
		}
		else if( e.target == this.bgClose )
			this.otherClose();


	}

	private otherClose():void
	{
		ViewManager.ins().close(this);
	}

	private onTap(e: egret.TouchEvent): void {
		switch (e.target) {
			case this.minBtn0:
				this.useNum = 1;
				break;
			case this.maxBtn0:
				this.useNum = this.maxNum;
				break;
			case this.sub1Btn0:
				this.useNum--;
				if (this.useNum <= 0) {
					this.useNum = 1;
				}
				break;
			case this.add1Btn0:
				this.useNum++;
				if (this.useNum > this.maxNum) {
					this.useNum = this.maxNum;
				}
				break;
		}
		this.numLabel0.text = this.useNum + "";
	}
	private onTxtChange(e: egret.Event): void {
		let num = Number(this.numLabel0.text);
		if (num > this.maxNum) {
			num = this.maxNum;
		} else if (num <= 0) {
			num = 1;
		}
		this.useNum = num;
		this.numLabel0.text = this.useNum + "";
	}


}

ViewManager.ins().reg(TreasureChuanshiGiftWin, LayerManager.UI_Popup);