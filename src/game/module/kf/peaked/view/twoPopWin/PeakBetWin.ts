/**
 * Created by MPeter on 2017/12/21.
 * 跨服副本-巅峰赛季-下注面板
 */
class PeakBetWin extends BaseEuiView {
	private bgClose: eui.Rect;
	private tipGroup: eui.Group;

	private betBtn: eui.Button;
	/**输入数量标签 */
	private numLabel: eui.TextInput;
	private maxBtn: eui.Button;
	/**赔率标签*/
	private oddsLabel: eui.Label;

	/**一号位玩家信息 */
	private face0: eui.Image;
	private select0: eui.Image;
	private name0: eui.Label;
	private arrow0: eui.Image;
	/**二号位玩家信息 */
	private face1: eui.Image;
	private select1: eui.Image;
	private name1: eui.Label;
	private arrow1: eui.Image;

	private aPlayerGroup: eui.Group;
	private bPlayerGroup: eui.Group;

	private _curId: number;
	private _maxNum: number;
	public constructor() {
		super();
		this.skinName = `BetSkin`;

		this.numLabel.restrict = "0-9";
		this.numLabel.maxChars = 8;
		this.arrow0.visible = false;
		this.arrow1.visible = false;

		this.aPlayerGroup = <eui.Group>this.face0.parent;
		this.aPlayerGroup.touchChildren = false;
		this.bPlayerGroup = <eui.Group>this.face1.parent;
		this.bPlayerGroup.touchChildren = false;
	}
	public open(...param): void {
		this.addTouchEvent(this.tipGroup, this.onTouch);
		this.addTouchEvent(this.bgClose, this.onTouch);
		this.addTouchEvent(this.betBtn, this.onTouch);
		this.addTouchEvent(this.maxBtn, this.onTouch);
		this.addTouchEvent(this.aPlayerGroup, this.onTouch);
		this.addTouchEvent(this.bPlayerGroup, this.onTouch);
		this.addChangeEvent(this.numLabel, this.changeInput);

		let group1: number = param[0];
		let group2: number = param[1];


		let isSixteen: boolean = PeakedSys.ins().isKFSixteen();
		let playData = PeakedSys.ins().isKf() ? PeakedHelp.getKFPlayerData(group1, group2, param[2], isSixteen) : PeakedHelp.getPlayerData(group1, group2);
		if (playData) {
			//赋值两个玩家的基本信息
			let Adata = playData.playerList[0];
			this.face0.source = Adata ? `yuanhead${Adata.job}${Adata.sex}` : "";
			this.name0.text = Adata ? Adata.playerName : `---`;
			this.select0.name = Adata ? Adata.roleId + "" : "";

			let Bdata = playData.playerList[1];
			this.face1.source = Bdata ? `yuanhead${Bdata.job}${Bdata.sex}` : "";
			this.name1.text = Bdata ? Bdata.playerName : `---`;
			this.select1.name = Bdata ? Bdata.roleId + "" : "";
		}

		// this.oddsLabel.text = `赔率：${1}:${1}`;
		//初始选择表现
		this.select0.visible = this.select1.visible = false;

		let maxNum: number = Actor.chip;
		let dpMax: number = PeakedSys.ins().isKf() ? GlobalConfig.PeakRaceCrossTime[PeakedSys.ins().kfStatus + 1].maxBett : GlobalConfig.PeakRaceTime[PeakedSys.ins().bfStatus+1].maxBett
		this._maxNum = maxNum > dpMax ? dpMax : maxNum;
		this.changeInput(null);
	}
	public close(...param): void {
		this.removeTouchEvent(this.tipGroup, this.onTouch);
		this.removeTouchEvent(this.bgClose, this.onTouch);
		this.removeTouchEvent(this.betBtn, this.onTouch);
		this.removeTouchEvent(this.maxBtn, this.onTouch);
		this.addChangingEvent(this.numLabel, this.changeInput);
	}
	/**变化输入标签 */
	private changeInput(e: egret.TouchEvent): void {
		let curNum: number = parseInt(this.numLabel.text);
		//默认取当前最大值
		if (e == null) curNum = this._maxNum;
		if (curNum < 0) { curNum = 0; }
		else if (curNum > this._maxNum) {
			curNum = this._maxNum;
		}
		this.numLabel.text = curNum + "";

	}
	private onTouch(e: egret.TouchEvent): void {
		switch (e.target) {
			case this.tipGroup:
			case this.bgClose:
				ViewManager.ins().close(this);
				break;
			case this.betBtn:
				let chipNum: number = parseInt(this.numLabel.text);
				if (this._curId) {
					if (chipNum <= 0) {
						UserTips.ins().showTips(`筹码不够`);
						return;
					}
					if (PeakedSys.ins().isKf()) {
						PeakedSys.ins().sendKFBet(this._curId, chipNum);
					}
					else {
						PeakedSys.ins().sendBet(this._curId, chipNum);
					}

				}
				else UserTips.ins().showTips(`请先选择需要下注的玩家`);
				break;
			case this.maxBtn:
				this.changeInput(null);
				break;
			case this.aPlayerGroup:
				if (this.select0.name) {
					this.select0.visible = true;
					this.select1.visible = false;
					this.arrow0.visible = true;
					this.arrow1.visible = false;
					this._curId = parseInt(this.select0.name);
				}
				break;
			case this.bPlayerGroup:
				if (this.select1.name) {
					this.select1.visible = true;
					this.select0.visible = false;
					this.arrow0.visible = false;
					this.arrow1.visible = true;
					this._curId = parseInt(this.select1.name);
				}
				break;
		}
	}
	public static openCheck(...param: any[]): boolean {
		let group1: number = param[0];
		let group2: number = param[1];

		let isSixteen: boolean = PeakedSys.ins().isKFSixteen();
		let playData = PeakedSys.ins().isKf() ? PeakedHelp.getKFPlayerData(group1, group2, param[2], isSixteen) : PeakedHelp.getPlayerData(group1, group2);
		if (playData && playData.playerList.length > 1) {
			return true;
		}
		else if (playData && playData.playerList.length == 1) {
			UserTips.ins().showTips(`人数不足，无法下注！`);
			return false;
		}
		else {
			UserTips.ins().showTips(`本轮轮空,无法下注！`);
			return false;
		}

	}
}
ViewManager.ins().reg(PeakBetWin, LayerManager.UI_Popup);