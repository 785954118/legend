/**
 * 历练（爵位修改为成就和勋章）2016.11.18
 */
class LiLianWin extends BaseEuiView {
	private static SHENQI   = 1;
	private static JUEWEI   = 0;
	private static XUNZHANG = 2;
	private static BOOK     = 3;
	//private static JADE     = 4;
	private static WEIWANG     = 4;

	private closeBtn: eui.Button;
	private viewStack: eui.ViewStack;
	private tab: eui.TabBar;
	private redPoint0: eui.Image;
	private redPoint1: eui.Image;//成就红点
	private redPoint2: eui.Image;//神器
	private redPoint3: eui.Image;//图鉴
	//private redPoint4: eui.Image;//玉佩
	private redPoint4: eui.Image;//威望

	private liLianPanel: NewLilianWin;	 //历练神功页
	// private nobilityPanel: NobilityPanel; //历练爵位页
	private xunzhangPanel: XunzhangPanel; //勋章
	private artifactWin: NewArtifactWin;	 //历练神器页
	// private chengjiuPanel: ChengjiuPanel; //成就
	private bookPanel: BookWin;//图鉴
	//private yupei:JadePanel; //玉佩
	private WeiWang:WeiWangPanel; //威望
	private _ext:any;
	private help:eui.Button;
	constructor() {
		super();
		this.skinName = "LiLianWinSkin";
		this.isTopLevel = true;
		// this.setSkinPart("roleSelect", new RoleSelectPanel());

		// this.setSkinPart("liLianPanel", new NewLilianWin());
		// this.setSkinPart("xunzhangPanel", new XunzhangPanel());
		// this.setSkinPart("artifactWin", new NewArtifactWin());
		// this.setSkinPart("bookPanel", new BookWin());
	}

	public initUI(): void {
		super.initUI();
		// this.liLianPanel = new NewLilianWin;
		// this.viewStack.addChild(this.liLianPanel);

		// this.artifactWin = new ArtifactWin;
		// this.viewStack.addChild(this.artifactWin);

		// this.xunzhangPanel = new XunzhangPanel();
		// this.viewStack.addChild(this.xunzhangPanel);

		// this.artifactWin = new NewArtifactWin();
		// this.viewStack.addChild(this.artifactWin);

		// this.nobilityPanel = new NobilityPanel;
		// this.viewStack.addChild(this.nobilityPanel);
		let index:number = LiLianWin.JUEWEI;
		if (!LiLian.ins().checkJueWeiOpen()) {
			index = LiLianWin.SHENQI;
		}
		this.viewStack.selectedIndex = index;
		this.tab.dataProvider = this.viewStack;
		this.tab.validateNow();
	}


	public destoryView(): void {
		super.destoryView();
		// this.artifactWin.destructor();
	}

	public static openCheck(...param: any[]): boolean {
		let selectedIndex = param[0] == undefined ? LiLianWin.SHENQI : param[0];
		switch (selectedIndex) {
			//神器
			case LiLianWin.SHENQI:
				break;
			//爵位
			case LiLianWin.JUEWEI:
				// id = GlobalConfig.TrainBaseConfig.actImbaId;
				if (!LiLian.ins().checkJueWeiOpen()) {
					UserTips.ins().showTips(`激活神器 霸者之证 后开启`);
					return false;
				}
				break;
			//勋章
			case LiLianWin.XUNZHANG:
				if (!LiLian.ins().checkXunZhangOpen()) {
					UserTips.ins().showTips(`激活神器 太初勋章 后开启`);
					return false;
				}
				break;
			//图鉴
			case LiLianWin.BOOK:
				if (!LiLian.ins().checkBookOpen()) {
					UserTips.ins().showTips(OpenSystem.ins().getNoOpenTips(SystemType.BOOK));
					return false;
				}
				break;
			//玉佩
			/**case LiLianWin.JADE:
				if (Actor.level < GlobalConfig.YuPeiBasicConfig.openLv) {
					UserTips.ins().showTips("玉佩角色等级达到" + GlobalConfig.YuPeiBasicConfig.openLv + "级开启");
					return false;
				}
				break;*/
			//威望
			case LiLianWin.WEIWANG:
				if (!WeiWangCC.ins().isOpen)
				{
					UserTips.ins().showTips(`开服第${GlobalConfig.PrestigeBase.openDay}天${GlobalConfig.PrestigeBase.openLevel}级开启`);
					return false;
				}
				break;
		}
		return true;
	}

	public open(...param: any[]): void {

		this.addChangeEvent(this.tab, this.onTabTouch);
		this.addChangingEvent(this.tab, this.onTapTouching);
		this.addTouchEvent(this.closeBtn, this.onTouch);
		this.addTouchEvent(this.help, this.onTouch);
		this.observe(LiLian.ins().postLilianData, this.delayRedPoint);
		this.observe(LiLian.ins().postNobilityData, this.delayRedPoint);
		this.observe(UserTask.ins().postTaskChangeData, this.delayRedPoint);
		this.observe(Artifact.ins().postNewArtifactUpdate, this.delayRedPoint);
		this.observe(Artifact.ins().postNewArtifactInit, this.delayRedPoint);
		this.observe(BookRedPoint.ins().postRedPoint, this.delayRedPoint);
		this.observe(BookRedPoint.ins().postLvlUp, this.delayRedPoint);
		this.observe(Box.ins().postUpdateData, this.delayRedPoint);
		this.observe(Box.ins().postUpdateFreeBox, this.delayRedPoint);
		this.observe(LiLian.ins().postJadeLv, this.delayRedPoint);
		this.observe(UserBag.ins().postItemAdd, this.delayRedPoint);
		this.observe(UserBag.ins().postItemChange, this.delayRedPoint);

		let index:number = LiLianWin.JUEWEI;
		if (!LiLian.ins().checkJueWeiOpen()) {
			index = LiLianWin.SHENQI;
		}
		if (param[0]) {
			index = param[0];
		}
		this._ext = param[1];
		this.help.visible = false;
		// else {
		// 	if (Actor.level < GlobalConfig.TrainBaseConfig.openLevel) {
		// 		index = 2;
		// 	} else {
		// 		index = 0;
		// 	}
		// }

		this.setOpenTabIndex(index);
	}

	public close(...param: any[]): void {
		let num = this.viewStack.numChildren;
		for (let i = 0; i < num; i++) {
			(this.viewStack.getChildAt(i) as any).close();
		}

		let uiview2: UIView2 = ViewManager.ins().getView(UIView2) as UIView2;
		if (uiview2)
			uiview2.closeNav(UIView2.NAV_LILIAN);

	}

	private setOpenTabIndex(index: number): void {
		this.tab.selectedIndex = this.viewStack.selectedIndex = index;
		this.setOpenIndex(index);
		this.setRedPoint();
	}

	private onTouch(e: egret.TouchEvent): void {
		switch (e.currentTarget) {
			case this.closeBtn:
				ViewManager.ins().close(this);
				break;
			case this.help:
				// ViewManager.ins().open(ZsBossRuleSpeak, 11);
				break;
		}
	}

	/**
	 * 点击标签页按钮
	 */
	private onTabTouch(e: egret.TouchEvent): void {
		// if (e.currentTarget.selectedIndex == this.viewStack.selectedIndex)
		// 	return;
		this.setOpenIndex(e.currentTarget.selectedIndex);
	}

	private oldIndex: number = LiLianWin.JUEWEI;
	private setOpenIndex(selectedIndex: number): void {
		let id: number = 0;
		// this.help.visible = false;
		switch (selectedIndex) {
			//神器
			case LiLianWin.SHENQI:
				this.artifactWin.open();
				break;
			//爵位
			case LiLianWin.JUEWEI:
				// id = GlobalConfig.TrainBaseConfig.actImbaId;
				if (LiLian.ins().checkJueWeiOpen()) {
					this.liLianPanel.open();
				} else {
					UserTips.ins().showTips(`激活神器 霸者之证 后开启`)
					this.tab.selectedIndex = this.oldIndex;
				}
				break;
			//勋章
			case LiLianWin.XUNZHANG:
				if (LiLian.ins().checkXunZhangOpen()) {
					this.xunzhangPanel.open();
				} else {
					UserTips.ins().showTips(`激活神器 太初勋章 后开启`)
					this.tab.selectedIndex = this.oldIndex;
				}
				break;
			//图鉴
			case LiLianWin.BOOK:
				if (LiLian.ins().checkBookOpen()) {
					if(this._ext){
						this.bookPanel.open(this._ext);
						this._ext = null;
					}else{
						this.bookPanel.open();
					}
					// this.help.visible = true;
				}else{
					UserTips.ins().showTips(OpenSystem.ins().getNoOpenTips(SystemType.BOOK));
					this.tab.selectedIndex = this.oldIndex;
				}

				break;
			//玉佩
			/**case LiLianWin.JADE:
				if (Actor.level >= GlobalConfig.YuPeiBasicConfig.openLv)
					this.yupei.open();
				else
				{
					UserTips.ins().showTips("玉佩角色等级达到" + GlobalConfig.YuPeiBasicConfig.openLv + "级开启")
					this.tab.selectedIndex = this.oldIndex;
				}
				break;*/
			//威望
			case LiLianWin.WEIWANG:
				if (WeiWangCC.ins().isOpen)
					this.WeiWang.open();
				else
				{
					UserTips.ins().showTips(`开服第${GlobalConfig.PrestigeBase.openDay}天${GlobalConfig.PrestigeBase.openLevel}级开启`);
					this.tab.selectedIndex = this.oldIndex;
				}
				break;

		}
		this.oldIndex = this.tab.selectedIndex;
	}

	private delayRedPoint(){
		if (!TimerManager.ins().isExists(this.setRedPoint, this)) TimerManager.ins().doTimer(60, 1, this.setRedPoint, this);
	}

	private setRedPoint(): void {
		//神器
		let lilian = LiLian.ins();
		this.redPoint0.visible = Artifact.ins().showRedPoint();
		//爵位
		this.redPoint1.visible = lilian.getLilianShenGongStast() || lilian.isGetTrainDayAwardAll();
		//勋章
		let isMaxLevel: boolean = LiLian.ins().getNobilityIsMaxLevel();
		this.redPoint2.visible = lilian.checkXunZhangOpen() && lilian.getNobilityIsUpGrade() && !isMaxLevel;
		this.redPoint3.visible = BookRedPoint.ins().redpoint || BookRedPoint.ins().canLvlUp;
		//this.redPoint4.visible = lilian.checkJadeRed();
		this.redPoint4.visible = false;
	}

	private onTapTouching(e: egret.Event) {
		if(!LiLianWin.openCheck(e.currentTarget.selectedIndex)){
			e.preventDefault();
			return;
		}
		ViewManager.ins().close(LimitTaskView);
	}
}
ViewManager.ins().reg(LiLianWin, LayerManager.UI_Main);
