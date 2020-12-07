/**
 * Created by MPeter on 2017/12/21.
 * 跨服副本-巅峰赛季-我的下注
 */
class PeakMyBetRecordWin extends BaseEuiView {
	private bgClose: eui.Rect;
	private tipGroup: eui.Group;
	private scrollerList: eui.Scroller;
	/**下注播报列表 */
	private list: eui.List;
	/**主信息标签 */
	private infoLabel: eui.Label;
	public constructor() {
		super();
	}
	public initUI(): void {
		this.skinName = `MyBetRecordSkin`;
		this.list.itemRenderer = PeakMyBetItemRender;
	}
	public open(...param): void {
		this.addTouchEvent(this.bgClose, this.onClose);
		this.addTouchEvent(this.tipGroup, this.onClose);
		this.observe(PeakedSys.ins().postKFBetInfo, this.updata);

		//跨服状态，需要单独请求下注信息
		this.updata();
	}

	private onClose(e: egret.TouchEvent): void {
		ViewManager.ins().close(this);
	}

	private updata(): void {
		let list: PeakBetData[] = [];
		let count: number = 0;
		let getNum: number = 0;

		let betInfo = PeakedSys.ins().isKf() ? PeakedSys.ins().kfBetInfo : PeakedSys.ins().betInfo;
		if (betInfo) {
			for (let info of betInfo) {
				count += info.batNum;
				list.push(info);
				//结束后才计算
				if (PeakedHelp.statusIsOver(info.status, PeakedSys.ins().isKf())) {
					if (PeakedHelp.checkIsWinById(info.playerId, info.status)) getNum += info.batNum;
					else getNum -= info.batNum;
				}

			}
		}


		let extS: string = getNum > 0 ? `，|C:${ColorUtil.GREEN}&T:获利：${getNum}|` : `|C:${ColorUtil.RED}&T:损失：${-getNum}筹码|`;
		if (getNum == 0) extS = "";
		let str: string = `你已经下注${list.length}场比赛，下注总额: |C:${ColorUtil.GREEN}&T:${count}|筹码${extS}`;
		this.infoLabel.textFlow = TextFlowMaker.generateTextFlow1(str);

		list.sort(PeakedHelp.sortBetFun);
		this.list.dataProvider = new eui.ArrayCollection(list);
		DisplayUtils.scrollerToBottom(this.scrollerList);
	}
}
ViewManager.ins().reg(PeakMyBetRecordWin, LayerManager.UI_Popup);