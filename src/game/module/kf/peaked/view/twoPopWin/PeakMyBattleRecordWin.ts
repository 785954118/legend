/**
 * Created by MPeter on 2017/12/21.
 * 跨服副本-巅峰赛季-我的战绩
 */
class PeakMyBattleRecordWin extends BaseEuiView {
	public bgClose: eui.Rect;
	public tipGroup: eui.Group;
	public anigroup: eui.Group;
	/**战绩列表 */
	public list: eui.List;
	private scrollerList: eui.Scroller;
	public constructor() {
		super();
	}
	public initUI(): void {
		this.skinName = `MyRecordSkin`;
		this.list.itemRenderer = PeakMyBattleRecordItemRender;
	}
	public open(...param): void {
		this.addTouchEvent(this.bgClose, this.onClose);
		this.addTouchEvent(this.tipGroup, this.onClose);
		this.addTouchEvent(this.list, this.onTouchList);

		let listDt = [];
		let sys: PeakedSys = PeakedSys.ins();
		if (PeakedSys.ins().isKf()) {
			listDt = PeakedSys.ins().myKFBattleReportList;
			listDt = PeakedHelp.countKFMyRecordData();
		}
		else listDt = PeakedSys.ins().myBattleReportList;
		
		this.list.dataProvider = new eui.ArrayCollection(listDt);
		DisplayUtils.scrollerToBottom(this.scrollerList);

	}
	/**关闭 */
	private onClose(e: egret.TouchEvent): void {
		ViewManager.ins().close(this);
	}
	/**触摸列表 */
	private onTouchList(e: egret.TouchEvent): void {
		if (e.target instanceof eui.Label && e.target.parent instanceof PeakMyBattleRecordItemRender) {
			let data = <PeakPlayerInfo>e.target.parent.data;

			//查看
			if (data)
				UserReadPlayer.ins().sendFindPlayer(data.roleId);
		}
	}
}
ViewManager.ins().reg(PeakMyBattleRecordWin, LayerManager.UI_Popup);