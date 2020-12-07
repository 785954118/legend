/**
 * 烈焰印记
 * Created by wanghengshuai on 2018/1/2.
 */
class LyMarkPanel extends BaseEuiView{
	
	public power:PowerPanel;
	public nameImg:eui.Image;
	public img:eui.Image;
	public costTitle:eui.Label;
	public costImg:eui.Image;
	public costCount:eui.Label;
	public lvupBtn:eui.Button;
	public attr:eui.Group;
	public lvtxt:eui.Label;
	public arrow:eui.Image;
	public nowAttr:eui.Label;
	public nextAttr:eui.Label;
	public skill:eui.Group;
	public skill1:LyMarkSkillItem;
	public skill2:LyMarkSkillItem;
	public skill3:LyMarkSkillItem;
	public skill4:LyMarkSkillItem;
	public skill5:LyMarkSkillItem;
	public skill6:LyMarkSkillItem;
	public exp:eui.Group;
	public schedule:eui.Group;
	private expBar:ProgressBarEff;
	public skill0:LyMarkSkillItem;
	public mixItemTxt:eui.Label;
	public lvupGroup:eui.Group;


	private _balls:MovieClip[];

	private _angle:number = 0.1;

	private _angles:number[] = [0, 0, 0, 0,0 ,0 , 0];

	private _circleCenter:{x:number, y:number} = {x:279, y:229};
	
	private _a:number = 155;
	private _b:number = 80;

	private _oldBallNum:number = 0;

	private _materailInfo:{enough:boolean, id:number};

	private _redEffect:MovieClip;

	public constructor() {
		super();

		this.expBar = new ProgressBarEff();
	}

	public childrenCreated():void
	{
		super.childrenCreated();
		this.mixItemTxt.textFlow = TextFlowMaker.generateTextFlow1(`|U:&T:${this.mixItemTxt.text}`);	

		this.expBar.setWidth(470);
		this.expBar.x = -85;
		this.expBar.y = -15;
		this.schedule.addChild(this.expBar);
	}

	public open(...args:any[]):void
	{
		this.observe(LyMark.ins().postMarkData, this.update);
		this.observe(UserBag.ins().postItemAdd, this.updateMaterial);
		this.observe(UserBag.ins().postItemChange, this.updateMaterial);
		this.observe(LyMark.ins().postUpgrade, this.updateEff);
		this.addTouchEvent(this, this.onTouch);

		this._oldBallNum = 0;
		this.update();
	}

	public close():void
	{
		this.removeTouchEvent(this, this.onTouch);
		this.removeObserve();
		this._materailInfo = null;
		this.resetBalls();
		this.clearRedEff();
		this.expBar.reset();
	}

	private resetBalls():void
	{
		TimerManager.ins().removeAll(this);
		if (this._balls)
		{
			let len:number = this._balls.length;
			for (let i:number = 0; i < len; i++)
			{
				this._balls[i].destroy();
				this._balls[i] = null;
			}

			this._balls.length = 0;
			this._balls = null;
		}
	}

	private update():void
	{
		let max:boolean = LyMark.ins().isMax, level:number = LyMark.ins().lyMarkLv;
		this.currentState = max ? "max" : "normal";
		this.lvtxt.text = "Lv." + LyMark.ins().lyMarkLv;

		//战斗力
		let objAtts: AttributeData[] = [];
		let cfg:FlameStampLevel = GlobalConfig.FlameStampLevel[level];
		let attr:{value:number,type:number};
		for (let k in cfg.attrs)
			objAtts.push(new AttributeData(cfg.attrs[k].type, cfg.attrs[k].value));
		
		let totalPower:number = UserBag.getAttrPower(objAtts);
		this.nowAttr.textFlow = TextFlowMaker.generateTextFlow1(AttributeData.getAttStr(objAtts, 0, 1, "："));


		if (this.expBar.getMaxValue() != cfg.exp) {
			this.expBar.setData(LyMark.ins().lyMarkExp, cfg.exp);
		}
		else 
			this.expBar.setValue(LyMark.ins().lyMarkExp);

		if (!max)
		{
			//下一级
			objAtts = [];
			let nextCfg:FlameStampLevel = GlobalConfig.FlameStampLevel[level + 1];
			for (let k in nextCfg.attrs)
				objAtts.push(new AttributeData(nextCfg.attrs[k].type, nextCfg.attrs[k].value));

			this.nextAttr.textFlow = TextFlowMaker.generateTextFlow1(AttributeData.getAttStr(objAtts, 0, 1, "："));

			let itemConfig:ItemConfig = GlobalConfig.ItemConfig[cfg.costItem];
			this.costImg.source = itemConfig.icon + '_png';

			this.updateMaterial();
		}
		else
			this.clearRedEff();

		//技能
		let skillLv:number, effectCfg:FlameStampEffect;
		let bollNum:number = 0, realLv:number = 0;
		for (let i:number = 0; i <= 6; i++)
		{
			realLv = skillLv = LyMark.ins().getSkillLvById(i + 1);	
			if (!skillLv)
				skillLv = 1;
			
			effectCfg = GlobalConfig.FlameStampEffect[i + 1][skillLv];
			this["skill" + i].setCfg(effectCfg);

			if ((i + 1 == 1 || i + 1 == 2) && realLv)
				bollNum = effectCfg.stamp;

			if (realLv)
				totalPower += effectCfg.exPower;
		}

		//总战力
		let roleNum:number = SubRoles.ins().subRolesLen;
		this.power.setPower(totalPower * roleNum);

		//旋转印记
		if (bollNum && this._oldBallNum != bollNum)
		{
			this.resetBalls();
			this._oldBallNum = bollNum;

			if (!this._balls)
			{
				this._balls = [];
				TimerManager.ins().doTimer(17 * 3, 0, this.doCircle, this);
			}

			let ball:MovieClip;
			let radian:number = 2 * Math.PI / bollNum;
			for (let i:number = 0; i < bollNum; i++)
			{
				ball = ObjectPool.pop("MovieClip");
				this.img.parent.addChild(ball);
	
				this._angles[i] = radian * i;
				ball.x = this._a * Math.cos(radian * i) + this._circleCenter.x;
				ball.y = this._b * Math.sin(radian * i) + this._circleCenter.y;
				this._balls.push(ball);
				ball.playFile(`${RES_DIR_EFF}lymarkeff`, -1);
			}
		}

	}

	private doCircle():void
	{
		if (!this._balls)
		{
			TimerManager.ins().removeAll(this);
			return;
		}

		let len:number = this._balls.length, ball:MovieClip;
		let parent:egret.DisplayObjectContainer;
		let imgIndex:number = 0, selfIndex:number = 0;
		for (let i:number = 0; i < len; i++)
		{
			ball = this._balls[i];
			ball.x = this._a * Math.cos(this._angles[i]) + this._circleCenter.x;
			ball.y = this._b * Math.sin(this._angles[i]) + this._circleCenter.y;
			this._angles[i] += this._angle;
			this._angles[i] = this._angles[i] % (2 * Math.PI);
			parent = ball.parent;
			imgIndex = parent.getChildIndex(this.img);
			selfIndex = parent.getChildIndex(ball);
			if (this._angles[i] >= 2.5 && this._angles[i] <= 6)
			{
				if (selfIndex > imgIndex)
					parent.addChildAt(ball, 3);
			}
			else
			{
				if (selfIndex < imgIndex)
					parent.addChildAt(ball, parent.numChildren);
			}
		}
	}

	private updateMaterial():void
	{
		if (LyMark.ins().isMax)
			return;
		
		let cfg:FlameStampLevel = GlobalConfig.FlameStampLevel[LyMark.ins().lyMarkLv];			
		let itemData: ItemData = UserBag.ins().getBagItemById(cfg.costItem);
		let count:number = itemData ? itemData.count : 0;
		this.costCount.textFlow = TextFlowMaker.generateTextFlow1(`|C:${count < cfg.costCount ? '0xFF0000' : '0x00FF00'}&T:${count}|/${cfg.costCount}`);
		this._materailInfo = {enough:count >= cfg.costCount, id:cfg.costItem};

		let needExp:number = cfg.exp - LyMark.ins().lyMarkExp;
		if (count >= cfg.costCount && count * GlobalConfig.FlameStampMat[cfg.costItem].exp >= needExp)
		{
			if (!this._redEffect)
			{
				this._redEffect = ObjectPool.pop("MovieClip");
				this._redEffect.touchEnabled = false;
				this.lvupGroup.addChild(this._redEffect);
				this._redEffect.x = 77;
				this._redEffect.y = 28;
				this._redEffect.playFile(RES_DIR_EFF + "chargeff1", -1);
			}
		}
		else
			this.clearRedEff();
		
	}

	private clearRedEff():void
	{
		if (this._redEffect)
		{
			this._redEffect.destroy();
			this._redEffect = null;
		}
	}

	private onTouch(e:egret.TouchEvent):void
	{
		switch (e.target)
		{
			case this.lvupBtn:
				if (this._materailInfo.enough)
					LyMark.ins().sendUpgrade();
				else
					UserTips.ins().showTips("材料不足");
				break;
			case this.mixItemTxt:
				ViewManager.ins().open(LyMarkMixWin);
				break;
			case this.skill0:
			case this.skill1:
			case this.skill2:
			case this.skill3:
			case this.skill4:
			case this.skill5:
			case this.skill6:
				ViewManager.ins().open(LyMarkSkillTipsWin, (e.target as LyMarkSkillItem).getCfg());
				break;
		}

	}
	/**
	 * 暴击特效
	 * [暴击倍数]
	 * */
	private actEff:eui.Group;
	private updateEff(param:any){
		let crit = param[0];
		if( crit > 1 ){
			let img = new eui.Image(`xn_wingup${crit}`);
			img.horizontalCenter = 0;
			img.verticalCenter = 0;
			img.scaleX = img.scaleY = 0.5;
			let t: egret.Tween = egret.Tween.get(img);
			t.to({ "scaleX": 1.5,"scaleY": 1.5 ,"alpha":0}, 500).call(() => {
				DisplayUtils.removeFromParent(img);
			}, this);
			this.actEff.addChild(img);
		}
	}
}