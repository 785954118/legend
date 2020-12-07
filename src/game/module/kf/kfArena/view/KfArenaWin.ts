/**
 * Created by MPeter on 2018/3/12.
 *  跨服3v3竞技场- 主界面
 */
class KfArenaWin extends BaseEuiView {
	/** 页签对应索引 **/
	public static Page_Select_Rank = 0;//排行页
	public static Page_Select_Macth = 1;//匹配页
	public static Page_Select_Join = 2; //参与
	public static Page_Select_Duan = 3;//段位
	/** 关闭按钮 */
	public closeBtn: eui.Button;
	/** tabPanel */
	public viewStack: eui.ViewStack;
	/** 标签页 */
	public tab: eui.TabBar;
	public roleSelect: RoleSelectPanel;	//上部角色选择部分
	public rankPanel: KfArenaRankPanel;	 //排行
	private macthPanel: KfArenaMacthPanel; //匹配
	private joinPanel: KfArenaJoinPanel; //参与
	public duanPanel: KfArenaDuanPanel; //段位
	public redPointGroup: eui.Group;
	public redPoint0: eui.Image;
	public redPoint1: eui.Image;
	public redPoint2: eui.Image;
	public redPoint3: eui.Image;
	private seeRule: eui.Button;

	public constructor() {
		super();
		this.skinName = "KfArenaSkin";
		this.isTopLevel = true;
	}

	protected childrenCreated(): void {
		this.viewStack.selectedIndex = 0;
		this.tab.dataProvider = this.viewStack;
	}

	public open(...param): void {
		this.tab.selectedIndex = this.viewStack.selectedIndex = param[0];
		this.addTouchEvent(this.closeBtn, this.onTouch);
		this.addChangeEvent(this.tab, this.onTabTouch);
		this.addTouchEvent(this.seeRule, this.onTouch);
		this.addChangingEvent(this.tab, this.onTabTouching);
		this.observe(KfArenaRedPoint.ins().postRedPoint, this.redPointEx);
		this.setOpenIndex(this.tab.selectedIndex);
		this.redPointEx();
	}

	private onTabTouching(e: egret.TouchEvent) {
		if (!this.checkIsOpen(e.currentTarget.selectedIndex)) {
			e.preventDefault();
			return;
		}
	}

	private checkIsOpen(index: number) {
		return true;
	}

	public close(...param): void {

	}

	private onTouch(e: egret.TouchEvent): void {
		switch (e.target) {
			case this.closeBtn:
				ViewManager.ins().close(this);
				break;
			case this.seeRule:
				ViewManager.ins().open(CommonHelpWin, GlobalConfig.HelpInfoConfig[34].text);
				break;
		}
	}

	/**
	 * 点击标签页按钮
	 */
	private onTabTouch(e: egret.TouchEvent): void {
		this.setOpenIndex(e.currentTarget.selectedIndex);
		this.redPointEx();
	}

	private setOpenIndex(selectedIndex: number): void {
		switch (selectedIndex) {
			case KfArenaWin.Page_Select_Rank:
				this.rankPanel.open();
				break;
			case KfArenaWin.Page_Select_Macth:
				this.macthPanel.open();
				break;
			case KfArenaWin.Page_Select_Join:
				this.joinPanel.open();
				break;
			case KfArenaWin.Page_Select_Duan:
				this.duanPanel.open();
				break;
		}
	}

	public redPointEx() {
		this.redPoint0.visible = false;
		this.redPoint1.visible = KfArenaRedPoint.ins().redpoint_1 > 0;
		this.redPoint2.visible = KfArenaRedPoint.ins().redpoint_2 > 0;
		this.redPoint3.visible = KfArenaRedPoint.ins().redpoint_3 > 0;
	}
}
ViewManager.ins().reg(KfArenaWin, LayerManager.UI_Main);
