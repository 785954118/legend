/**
 * Created by hrz on 2018/1/15.
 */

class YBZhuanPanWin extends BaseEuiView {
	/** 关闭按钮 */
	public closeBtn: eui.Button;
	// public closeBtn0: eui.Button;
	/** tabPanel */
	public viewStack: eui.ViewStack;

	public menuScroller: eui.Scroller;
	public menuList: eui.List;
	// public rightBtn: eui.Button;
	// public leftBtn: eui.Button;
	// public rightEff: MovieClip;
	// public leftEff: MovieClip;//
	// private leftRed: eui.Image;
	// private rightRed: eui.Image;

	public activityPanelList: any[] = [];
	private _datas: ActivityBtnConfig[];
	private BtnArr: ActivityBtnConfig[];//应该显示的活动
	private dataArr: eui.ArrayCollection;

	private selectIndex: number;

	public roleSelect: RoleSelectPanel;
	private title: eui.Image;

	private _pageStyle: number;

	constructor() {
		super();
		this.skinName = "CEYBZhuanPanSkin";
		this.isTopLevel = true;
		this.selectIndex = 0;
	}

	public initUI(): void {
		super.initUI();
		this._pageStyle = ActivityPageStyle.YBZHUANPAN;
		this.menuList.itemRenderer = ActivityBtnRenderer;

	}

	private checkIndexByActivityId(actId: number): number {
		for (let i = 0; i < this.activityPanelList.length; i++) {
			if (this.activityPanelList[i].activityID == actId) {
				return i;
			}
		}
		return 0;
	}

	public static openCheck(...param: any[]): boolean {
		for (let k in Activity.ins().activityData) {
			if( !Activity.ins().activityData[k] )continue;
			if (Activity.ins().activityData[k].pageStyle != ActivityPageStyle.YBZHUANPAN)
				continue;

			if (Activity.ins().getActivityDataById(+k).isOpenActivity()) {
				return true;
			}
		}
		UserTips.ins().showTips(`|C:0xff0000&T:很遗憾,活动已经结束了`);
		return false;
	}

	private actId: number;

	public open(...param: any[]): void {

		this.actId = param[0];

		this.updateView();

		this.addTouchEvent(this.closeBtn, this.onClick);
		// this.addTouchEvent(this.closeBtn0, this.onClick);
		this.addChangeEvent(this.menuList, this.onClickMenu);
		this.observe(Activity.ins().postActivityPanel, this.updatePanel);//所有活动刷新
		this.observe(Activity.ins().postActivityIsGetAwards, this.refushRedPoint);
		this.observe(Recharge.ins().postUpdateRecharge, this.refushRedPoint);
		this.observe(Recharge.ins().postRechargeTotalDay, this.refushRedPoint);
		this.observe(Recharge.ins().postUpdateRechargeEx, this.refushRedPoint);
		// this.observe(Activity.ins().postChangePage, this.ChangePageCallBack);//单份活动刷新
	}

	public close(...param: any[]): void {
		for (let i: number = 0; i < this.activityPanelList.length; i++) {
			this.activityPanelList[i].close();
		}
	}

	private refushRedPoint(): void {
		this.dataArr.replaceAll(this.BtnArr);
		this.menuList.dataProvider = this.dataArr;
	}

	private updateView() {
		let index: number = 0;
		let i = 0;
		for (let i = 0; i < this.viewStack.numElements; i++) {
			ObjectPool.push(this.viewStack.getElementAt(i));
		}
		this.viewStack.removeChildren();
		this.activityPanelList = [];
		this._datas = [];
		i = 0;
		for (let k in Activity.ins().activityData) {
			if( !Activity.ins().activityData[k] )continue;
			if (Activity.ins().activityData[k].pageStyle != this._pageStyle) {
				continue;//此界面不处理非活动外的活动
			}
			if (Activity.ins().getActivityDataById(+k).isOpenActivity()) {
				let data: ActivityBtnConfig = Activity.ins().getbtnInfo(k);
				if( data.activityType && data.activityType == ActivityType.Nesting )continue;//过滤嵌套活动
				if (!ErrorLog.Assert(data, "ybzhuanpan  data   " + k))
					this._datas.push(data);
			}
		}

		this._datas.sort(this.sort);
		this.BtnArr = [];
		for (let k in this._datas) {
			let id: number = this._datas[k].id;
			let act: ActivityBaseData = Activity.ins().getActivityDataById(+id);
			if (act && act.id == id) {
				let hide: boolean = act.getHide();
				if (!hide) {
					let panel: ActivityPanel = ActivityPanel.create(id, act.activityType);
					if (!panel)
						continue;
					panel.top = 0;
					panel.left = 0;
					panel.bottom = 0;
					panel.right = 0;
					this.activityPanelList[i] = panel;
					this.viewStack.addChild(this.activityPanelList[i]);
					this.BtnArr.push(this._datas[k]);
					if (this.actId && this.actId == id) {
						index = i;
					}
					i++;
				}
			}

		}


		this.dataArr = new eui.ArrayCollection(this.BtnArr);
		this.menuList.dataProvider = this.dataArr;

		if (this.viewStack.numElements > 0) {
			// if( index )//道具获取方式指定跳转
			// 	index = this.checkIndexByActivityId(index);
			this.setOpenIndex(index);
		}
		this.viewStack.validateNow();
		this.menuList.validateNow();

		if (index >= 5) {
			let scrollH = 92 * index;
			if (scrollH > this.menuList.contentWidth - this.menuScroller.width) {
				scrollH = this.menuList.contentWidth - this.menuScroller.width;
			}
			this.menuList.scrollH = scrollH;
		}

		// this.title.source = `biaoti_ganen`;

	}

	private updatePanel(activityID: number) {
		for (let k in this.activityPanelList) {
			if (this.activityPanelList[k].activityID == activityID) {
				this.activityPanelList[k].updateData();
				break;
			}
		}
	}

	private onClick(e: egret.TouchEvent): void {
		switch (e.currentTarget) {
			case this.closeBtn:
			// case this.closeBtn0:
				ViewManager.ins().close(this);
				break;
		}
	}

	private setOpenIndex(selectedIndex: number): void {
		this.activityPanelList[selectedIndex].open();
		this.viewStack.selectedIndex = selectedIndex;
		this.menuList.selectedIndex = selectedIndex;
		Activity.ins().setPalyEffListById(this.activityPanelList[selectedIndex].activityID, true);
		this.refushRedPoint();
	}

	private onClickMenu(e: egret.TouchEvent): void {
		this.actId = 0;//不再指定打开某个活动
		if (this.selectIndex != e.currentTarget.selectedIndex) {
			SoundUtil.ins().playEffect(SoundUtil.WINDOW);
			if (this.activityPanelList[this.selectIndex])
				this.activityPanelList[this.selectIndex].close();
		}
		this.selectIndex = e.currentTarget.selectedIndex;
		if (this.activityPanelList[this.selectIndex].activityID > 10000)
			this.setOpenIndex(this.selectIndex);
		else {
			let config = GlobalConfig.ActivityConfig[this.activityPanelList[this.selectIndex].activityID];
			if (config) {
				if (config.activityType == 3) {
					this.setOpenIndex(this.selectIndex);
				} else {
					this.setOpenIndex(this.selectIndex);
					// Activity.ins().sendChangePage(this.activityPanelList[this.selectIndex].activityID);
				}
			}
		}
	}

	private ChangePageCallBack() {
		if (this.actId)
			this.selectIndex = this.checkIndexByActivityId(this.actId);
		this.setOpenIndex(this.selectIndex);
	}

	private sort(a: ActivityBtnConfig, b: ActivityBtnConfig): number {
		if (a.sort > b.sort)
			return 1;
		else if (a.sort < b.sort)
			return -1;
		else
			return 0;
	}
}

ViewManager.ins().reg(YBZhuanPanWin, LayerManager.UI_Main);