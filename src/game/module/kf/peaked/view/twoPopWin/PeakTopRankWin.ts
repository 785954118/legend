/**
 * Created by MPeter on 2017/12/21.
 * 跨服副本-巅峰赛季-人气排行
 */
class PeakTopRankWin extends BaseEuiView {
	private bgClose: eui.Rect;
	private tipGroup: eui.Group;
	private list: eui.List;
	private scrollerList: eui.Scroller;
	private _listDt: eui.ArrayCollection;

	public constructor() {
		super();
		this.skinName = `SupportRankSkin`;
	}

	public initUI(): void {
		this.list.itemRenderer = PeakTopRankItemRender;
		this._listDt = new eui.ArrayCollection();
		this.list.dataProvider = this._listDt;
	}

	public open(...param): void {
		this.observe(PeakedSys.ins().postSignUp, this.onSingUp);
		this.observe(PeakedSys.ins().postTopRank, this.upList);
		this.observe(PeakedSys.ins().postKFTopRank, this.upList);

		this.addTouchEvent(this.bgClose, this.onTouch);
		this.addTouchEvent(this.tipGroup, this.onTouch);
		this.addTouchEvent(this.list, this.onTouch);


		this.onSingUp();
	}

	/**更新注册信息，请求刷新排行榜 */
	private onSingUp(): void {
		if (PeakedSys.ins().isKf()) {
			PeakedSys.ins().sendKFTopRank();
		}
		else {
			PeakedSys.ins().sendTopRank();
		}
	}

	private upList(): void {
		if (PeakedSys.ins().isKf()) {
			this._listDt.replaceAll(PeakedSys.ins().kfTopRankInfoList);
		}
		else {
			this._listDt.replaceAll(PeakedSys.ins().topRankInfoList);
		}

	}

	private onTouch(e: egret.TouchEvent): void {
		switch (e.target) {
			case this.bgClose:
			case this.tipGroup:
				ViewManager.ins().close(this);
				break;
			default:
				if (e.target.parent instanceof PeakTopRankItemRender) {
					//点赞
					let data: PeakTopRankData = e.target.parent.data;
					if (e.target instanceof eui.Button) {
						if (PeakedSys.ins().isKf()) {
							PeakedSys.ins().sendKFToLikes(data.playerId);
						}
						else {
							PeakedSys.ins().sendToLikes(data.playerId);
						}

					}
					else if (e.target instanceof eui.Label) {
						UserReadPlayer.ins().sendFindPlayer(data.playerId, data.servId);
					}
				}
		}

	}
}

ViewManager.ins().reg(PeakTopRankWin, LayerManager.UI_Popup);