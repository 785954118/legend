
/**
 * 魂骨副本界面
 * @author wanghengshuai
 * 
 */
class HunShouFBWin extends BaseEuiView{
	
	public BG:eui.Image;
	public Boss:eui.Group;
	public bossName:eui.Image;
	public itemScroller:eui.Scroller;
	public itemList:eui.List;
	public dinghong0:eui.Group;
	public btnChallenge:eui.Button;
	public btnSweep:eui.Button;
	public lbTime:eui.Label;
	public notice:eui.Scroller;
	public zsLimit:eui.Label;
	public sweepInfo:eui.Label;
	public sweepInfoText:eui.Label;
	public max:eui.Label;

	private _collect:ArrayCollection;

	private _zsLvEough:boolean;

	private _bossMc:MovieClip;

	private _isMax:boolean;

	public constructor() {
		super();
	}

	public childrenCreated():void
	{
		super.childrenCreated();
		this.itemList.itemRenderer = ItemBase;
	}

	public open(...args:any[]):void
	{
		this.observe(Hungu.ins().postHunShouFBInfo, this.update);
		this.observe(Hungu.ins().postSweepHunShouFB, this.updateTimes);
		this.addTouchEvent(this, this.onTouch);
		this.update();
	}

	public close():void
	{
		this.removeObserve();
		this.removeTouchEvent(this, this.onTouch);
	}

	private update():void
	{
		this.updateTimes();
		
		let id:number = Hungu.ins().hunShouFBPassID ? Hungu.ins().hunShouFBPassID + 1 : 1;
		this._isMax = false;
		if (id > Object.keys(GlobalConfig.FsFbConfig).length)
		{
			this._isMax = true;
			id --;
		}

		let cfg:FsFbConfig = GlobalConfig.FsFbConfig[id];
		this._zsLvEough = UserZs.ins().lv >= cfg.zsLevelLimit;
		this.zsLimit.textFlow = TextFlowMaker.generateTextFlow(`|C:${this._zsLvEough ? 0x35E62B : 0xFF0000}&T:挑战要求：人物${cfg.zsLevelLimit}转|`);

		if (!this._collect)
		{
			this._collect = new ArrayCollection();
			this.itemList.dataProvider = this._collect;
		}

		this._collect.source = cfg.award;
		this.btnSweep.visible = GlobalConfig.HunGuConf.sweepLayer <= Hungu.ins().hunShouFBPassID;
		this.sweepInfoText.visible = this.sweepInfo.visible = this.btnSweep.visible;
		this.btnChallenge.visible = !this._isMax;
		this.btnChallenge.horizontalCenter = this.btnSweep.visible ? 109 : 0;
		this.max.visible = this._isMax;
		this.zsLimit.visible = !this._isMax;

		if (this.sweepInfo.visible)
			this.sweepInfo.text = (Hungu.ins().hunShouFBPassID) + "";

		this.bossName.source = cfg.pic;
		if (!this._bossMc)
		{
			this._bossMc = ObjectPool.pop("MovieClip");
			this.Boss.addChild(this._bossMc);
		}

		this._bossMc.playFile(RES_DIR_MONSTER + `monster${GlobalConfig.MonstersConfig[cfg.monster].avatar}_3s`, -1);
	}

	private updateTimes():void
	{
		this.lbTime.textFlow = TextFlowMaker.generateTextFlow(`|c:${Hungu.ins().hunShouFBTimes ? 0x35E62B : 0xFF0000}&T:${Hungu.ins().hunShouFBTimes}|`);
	}

	private onTouch(e:egret.TouchEvent):void
	{
		switch(e.target)
		{
			case this.btnSweep:
			case this.btnChallenge:
				if (!Hungu.ins().hunShouFBTimes)
				{
					 UserTips.ins().showTips(`剩余次数不足`);
					return;
				}

				if (e.target == this.btnSweep)
					Hungu.ins().sweepHunShouFB();
				else
				{
					if (!this._zsLvEough)
						UserTips.ins().showTips(`转生等级不足`);
					else if (this._isMax)
						UserTips.ins().showTips(`当前已通关`);
					else
					{
						Hungu.ins().enterHunShouFB();
						ViewManager.ins().close(LadderWin);
					}
				}
				break;
		}
	}
}