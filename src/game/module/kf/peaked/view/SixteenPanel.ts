/**
 * Created by MPeter on 2018/1/2.
 * 跨服副本-巅峰赛季-总面板-16强面板
 */
class SixteenPanel extends BaseView {
	/////////////////////////16强界面////////////////////////
	private sixteenGroup: eui.Group;
	/**我的战绩 */
	private myRecord: eui.Button;
	/**我的投注 */
	private myBet: eui.Button;
	/**人气排行 */
	private topRank: eui.Button;
	/**我的战绩红点 */
	private myRecordRedpoint: eui.Image;
	/**我的投注红点 */
	private myBetRedpoint: eui.Image;
	/**排行榜红点 */
	private topRankRedpoint: eui.Image;


	/**状态按钮 */
	private actState_1_1: eui.Component;
	private actState_1_2: eui.Component;
	private actState_1_3: eui.Component;
	private actState_1_4: eui.Component;
	private actState_1_5: eui.Component;
	private actState_1_6: eui.Component;
	private actState_1_7: eui.Component;
	private actState_1_8: eui.Component;

	private actState_2_1: eui.Component;
	private actState_2_2: eui.Component;
	private actState_2_3: eui.Component;
	private actState_2_4: eui.Component;

	private actState_3_1: eui.Component;
	private actState_3_2: eui.Component;

	//跨服赛4组
	private groupBtn0: eui.Button;
	private groupBtn1: eui.Button;
	private groupBtn2: eui.Button;
	private groupBtn3: eui.Button;
	private groupBtnSelect0: eui.Image;
	private groupBtnSelect1: eui.Image;
	private groupBtnSelect2: eui.Image;
	private groupBtnSelect3: eui.Image;

	/**单服赛时间 */
	private singleTimeInfoLabel: eui.Label;
	/**时间段组 */
	private timerGroup: eui.Group;
	/**第一局时间 */
	private gameTime1Txt: eui.Label;
	/**第二局时间 */
	private gameTime2Txt: eui.Label;
	/**第三局时间 */
	private gameTime3Txt: eui.Label;
	/**第四局时间 */
	private gameTime4Txt: eui.Label;
	/**第五局时间 */
	private gameTime5Txt: eui.Label;


	/**冠军头像 */
	private championFace: eui.Image;
	/**冠军名字 */
	private championNameLabel: eui.Label;
	/**查看冠军比分 */
	private vewChampScore: eui.Label;
	/**冠军头像组 */
	private finals: eui.Group;
	/**肖像组 */
	private competion: eui.Group;
	private peaknessProcess: eui.Image;

	private peakEff: MovieClip;


	private _vsBtnList: eui.Component[][];
	private _linkGroupList: eui.Group[][];
	private _playerLabelList: eui.Label[];
	private _curGroup: number = 0;
	//最大数
	private MAX: number = 16;

	//对决组
	private PK_GROUP_0: number = 0;
	private PK_GROUP_1: number = 1;
	private PK_GROUP_2: number = 2;
	private PK_GROUP_3: number = 3;

	public constructor() {
		super();
		this.skinName = `SixteenSkin`;
		//自适应
		this.left = 0;
		this.right = 0;
		this.top = 0;
		this.bottom = 0;
	}

	protected childrenCreated(): void {
		this._linkGroupList = [];
		this._linkGroupList[this.PK_GROUP_0] = [];
		this._linkGroupList[this.PK_GROUP_1] = [];
		this._linkGroupList[this.PK_GROUP_2] = [];
		this._linkGroupList[this.PK_GROUP_3] = [];
		this._vsBtnList = [];
		this._vsBtnList[this.PK_GROUP_1] = [];
		this._vsBtnList[this.PK_GROUP_2] = [];
		this._vsBtnList[this.PK_GROUP_3] = [];
		this._playerLabelList = [];
		for (let i: number = 1; i <= this.MAX; i++) {
			let actBtn1: eui.Component = this[`actState_1_${i}`];
			let actBtn2: eui.Component = this[`actState_2_${i}`];
			let actBtn3: eui.Component = this[`actState_3_${i}`];
			if (actBtn1) {
				actBtn1.name = `${this.PK_GROUP_1}_${i}`;
				actBtn1.currentState = `view`;
				this._vsBtnList[this.PK_GROUP_1].push(actBtn1);
				actBtn1.visible = false;
			}
			if (actBtn2) {
				actBtn2.name = `${this.PK_GROUP_2}_${i}`;
				actBtn2.currentState = `view`;
				this._vsBtnList[this.PK_GROUP_2].push(actBtn2);
				actBtn2.visible = false;
			}
			if (actBtn3) {
				actBtn3.name = `${this.PK_GROUP_3}_${i}`;
				actBtn3.currentState = `view`;
				this._vsBtnList[this.PK_GROUP_3].push(actBtn3);
				actBtn3.visible = false;
			}

			//重置选手的信息
			this[`player${i - 1}`].text = `---`;
			this[`player${i - 1}`].name = ``;
			this._playerLabelList.push(this[`player${i - 1}`]);

			//路径线
			let line0: eui.Group = this[`link_0_${i}`];
			let line1: eui.Group = this[`link_1_${i}`];
			let line2: eui.Group = this[`link_2_${i}`];
			let line3: eui.Group = this[`link_3_${i}`];
			if (line0) this._linkGroupList[this.PK_GROUP_0].push(line0);
			if (line1) this._linkGroupList[this.PK_GROUP_1].push(line1);
			if (line2) this._linkGroupList[this.PK_GROUP_2].push(line2);
			if (line3) this._linkGroupList[this.PK_GROUP_3].push(line3);

			this.finals.touchChildren = false;

		}

		this.groupBtnSelect0.touchEnabled = false;
		this.groupBtnSelect1.touchEnabled = false;
		this.groupBtnSelect2.touchEnabled = false;
		this.groupBtnSelect3.touchEnabled = false;
	}

	public open(...param): void {
		this.observe(PeakedSys.ins().postState, this.upCurState);
		this.observe(PeakedSys.ins().postBetInfo, this.refBetState);
		this.observe(PeakedSys.ins().postKFBetInfo, this.refBetState);
		this.observe(PeakedSys.ins().postBFInfoList, this.upSixteenData);
		this.observe(PeakedSys.ins().postKFInfoList, this.upSixteenData);
		this.observe(PeakedRedpoint.ins().postRedPoint, this.refRedpoint);

		for (let btns of this._vsBtnList) {
			if (btns) {
				for (let btn of btns) {
					this.addTouchEvent(btn, this.onTouchBtn);
				}
			}
		}

		for (let player of this._playerLabelList) {
			this.addTouchEvent(player, this.onTouchPlayer);
		}

		this.addTouchEvent(this.myRecord, this.onTouch);
		this.addTouchEvent(this.myBet, this.onTouch);
		this.addTouchEvent(this.topRank, this.onTouch);
		this.addTouchEvent(this.groupBtn1, this.onChargeTab);
		this.addTouchEvent(this.groupBtn2, this.onChargeTab);
		this.addTouchEvent(this.groupBtn3, this.onChargeTab);
		this.addTouchEvent(this.groupBtn0, this.onChargeTab);
		this.addTouchEvent(this.finals, this.onTouch);
		this.addTouchEvent(this.vewChampScore, this.onTouch);


		this.clearGroupSelect();
		PeakedRedpoint.ins().postRedPoint();

		this.upCurState();
	}

	public close(...param): void {
		for (let btns of this._vsBtnList) {
			if (!btns) continue;
			for (let btn of btns) {
				this.removeTouchEvent(btn, this.onTouchBtn);
			}
		}
		for (let player of this._playerLabelList) {
			this.removeTouchEvent(player, this.onTouchPlayer);
		}

		this.removeTouchEvent(this.myRecord, this.onTouch);
		this.removeTouchEvent(this.myBet, this.onTouch);
		this.removeTouchEvent(this.topRank, this.onTouch);
		this.removeTouchEvent(this.groupBtn1, this.onChargeTab);
		this.removeTouchEvent(this.groupBtn2, this.onChargeTab);
		this.removeTouchEvent(this.groupBtn3, this.onChargeTab);
		this.removeTouchEvent(this.groupBtn0, this.onChargeTab);
		this.removeTouchEvent(this.finals, this.onTouch);
		this.removeTouchEvent(this.vewChampScore, this.onTouch);

		this.$onClose();

		this.peakEff.stop();
		DisplayUtils.removeFromParent(this.peakEff);
	}

	/**更新当前状态 */
	private upCurState(): void {
		if (!this.peakEff) {
			this.peakEff = new MovieClip;
			// this.peakEff.addEventListener(egret.Event.CHANGE, this.loadedFun, this);
			this.peakEff.x = 83;
			this.peakEff.y = 283;
			this.peakEff.touchEnabled = false;
		}
		this.peakEff.playFile(RES_DIR_EFF + "dianfengjuesai", -1);
		this.competion.addChild(this.peakEff);
		this.peakEff.visible = true;
		if (PeakedSys.ins().isKf()) {
			if (PeakedSys.ins().isKFSixteen()) {
				this.currentState = `kf`;
			}
			else {
				this.currentState = `kf_four`;
				this.peakEff.stop();
				DisplayUtils.removeFromParent(this.peakEff);
			}
			this.upKf16Data();
		}
		else {
			this.currentState = `bf`;
		}

		this.upStateData();
	}

	/**更新状态数据 */
	@callLater
	private upStateData(): void {
		let time = 0;
		if (PeakedSys.ins().isKf()) {//跨服下
			let state = PeakedSys.ins().kfStatus;
			if (state == KF_PeakStatus.Finals && PeakedSys.ins().kfStatusIsEnd!=0) {
				this.singleTimeInfoLabel.text = "";
				this.timerGroup.visible = false;
			}
			else {
				//下一场开始时间
				if (PeakedSys.ins().kfStatusIsEnd) state++;
				time = PeakedHelp.kfStatusTimer[state];
				this.singleTimeInfoLabel.text = DateUtils.getFormatBySecond(time, DateUtils.TIME_FORMAT_13) + " " + PeakedData.STATE_KF_TYPE_CN[state];
			}

			//请求跨服信息列表
			PeakedSys.ins().sendKFInfoList();
		}
		else {
			let state = PeakedSys.ins().bfStatus;
			if (state == 0) return;

			if (state == BF_PeakStatus.Finals && PeakedSys.ins().bfStatusIsEnd!=0) {
				this.singleTimeInfoLabel.text = "";
				this.timerGroup.visible = false;
			}
			else {
				//当前赛已完成,则跳到下一场
				if (PeakedSys.ins().bfStatusIsEnd) state++;
				time = PeakedHelp.bfStatusTimer[state];
				this.singleTimeInfoLabel.text = DateUtils.getFormatBySecond(time, DateUtils.TIME_FORMAT_13) + " " + PeakedData.STATE_TYPE_CN[state];
			}
			// this.refBetState();
			//请求本服信息列表
			PeakedSys.ins().sendBFInfoList();
		}

		if (this.timerGroup.visible) {
			//赋值每场的时间
			for (let i: number = 1; i <= 5; i++) {
				this[`gameTime${i}Txt`].text = DateUtils.getFormatBySecond(time, DateUtils.TIME_FORMAT_14);
				time += GlobalConfig.PeakRaceBase.promInterval;
			}
		}
	}

	/**刷新下注状态 */
	private hasBed: boolean = false;
	private lastStatus: number = 0;

	private refBetState(): void {
		let bfStatus: number = PeakedSys.ins().bfStatus;
		let kfStatus: number = PeakedSys.ins().kfStatus;
		let isKf = PeakedSys.ins().isKf();


		if (isKf) {
			if (kfStatus != this.lastStatus) this.hasBed = false;
			this.lastStatus = kfStatus;
		}
		else {
			if (bfStatus != this.lastStatus) this.hasBed = false;
			this.lastStatus = bfStatus;
		}


		bfStatus = PeakedSys.ins().bfStatusIsEnd ? bfStatus + 1 : bfStatus;
		kfStatus = PeakedSys.ins().kfStatusIsEnd ? kfStatus + 1 : kfStatus;

		//决赛下注更新 当前状态为可为决赛下注，且在状态完成后
		if ((PeakedSys.ins().bfStatus + 1 == BF_PeakStatus.Finals || PeakedSys.ins().kfStatus + 1 == KF_PeakStatus.Finals) && PeakedSys.ins().bfStatusIsEnd) {
			let playData;
			if (isKf) {
				playData = PeakedHelp.getKFPlayerData(4, 1, this._curGroup, PeakedSys.ins().isKFSixteen());
			}
			else {
				playData = PeakedHelp.getPlayerData(4, 1);
			}
			if (playData && PeakedHelp.checkIsBet(playData.playerList, `4`)) {
				this.vewChampScore.textFlow = TextFlowMaker.generateTextFlow1(`|U:&T:已下注`);
			}
			else
				this.vewChampScore.textFlow = TextFlowMaker.generateTextFlow1(`|U:&T:决赛下注`);

		}
		else this.vewChampScore.textFlow = TextFlowMaker.generateTextFlow1(`|U:&T:查看比分`);
		//有比赛时才显示
		if (!isKf) {
			this.vewChampScore.visible = bfStatus > BF_PeakStatus.Prom4;
		}
		else
			this.vewChampScore.visible = kfStatus > KF_PeakStatus.Prom4;

		//刷新决赛以下的下注信息
		for (let type in this._vsBtnList) {

			//是否可下注
			let canBet: boolean = false;
			if (isKf) {
				// let curStatus = PeakedSys.ins().kfStatusIsEnd ? kfStatus + 1 : kfStatus;
				//是否不在四强
				if (PeakedSys.ins().isKFSixteen()) {
					canBet = (type == this.PK_GROUP_1 + "" && kfStatus == KF_PeakStatus.Prom16)
						|| (type == this.PK_GROUP_2 + "" && kfStatus == KF_PeakStatus.Prom8)
						|| (type == this.PK_GROUP_3 + "" && kfStatus == KF_PeakStatus.Prom4)

					for (let btn of this._vsBtnList[type]) {
						btn.visible = (type == this.PK_GROUP_1 + "" && kfStatus >= KF_PeakStatus.Prom16)
							|| (type == this.PK_GROUP_2 + "" && kfStatus >= KF_PeakStatus.Prom8)
							|| (type == this.PK_GROUP_3 + "" && kfStatus >= KF_PeakStatus.Prom4)
					}
				}
				else {
					canBet = (type == this.PK_GROUP_1 + "" && kfStatus == KF_PeakStatus.Prom64)
						|| (type == this.PK_GROUP_2 + "" && kfStatus == KF_PeakStatus.Prom32)

					for (let btn of this._vsBtnList[type]) {
						btn.visible = (type == this.PK_GROUP_1 + "" && kfStatus >= KF_PeakStatus.Prom64)
							|| (type == this.PK_GROUP_2 + "" && kfStatus >= KF_PeakStatus.Prom32)
					}
				}


			}
			else {
				// let curStatus = PeakedSys.ins().bfStatusIsEnd ? bfStatus + 1 : bfStatus;
				canBet = (type == this.PK_GROUP_1 + "" && bfStatus == BF_PeakStatus.Prom16)
					|| (type == this.PK_GROUP_2 + "" && bfStatus == BF_PeakStatus.Prom8)
					|| (type == this.PK_GROUP_3 + "" && bfStatus == BF_PeakStatus.Prom4)


				for (let btn of this._vsBtnList[type]) {
					btn.visible = (type == this.PK_GROUP_1 + "" && bfStatus >= BF_PeakStatus.Prom16)
						|| (type == this.PK_GROUP_2 + "" && bfStatus >= BF_PeakStatus.Prom8)
						|| (type == this.PK_GROUP_3 + "" && bfStatus >= BF_PeakStatus.Prom4)
				}

			}
			//当前阶段是否已结束
			if (isKf) canBet = canBet && PeakedSys.ins().kfStatusIsEnd != 0;
			else canBet = canBet && PeakedSys.ins().bfStatusIsEnd != 0;


			for (let btn of this._vsBtnList[type]) {
				if (!btn) continue;
				if (canBet) {
					let groupArr: string[] = btn.name.split(`_`);
					let playData;
					if (isKf) {
						playData = PeakedHelp.getKFPlayerData(+(groupArr[0]), +(groupArr[1]), this._curGroup, PeakedSys.ins().isKFSixteen());
					}
					else {
						playData = PeakedHelp.getPlayerData(+(groupArr[0]), +(groupArr[1]));
					}

					// if (!playData) btn.currentState = `view`;
					// else
					if (playData && PeakedHelp.checkIsBet(playData.playerList, type)) {
						btn.currentState = `beted`;
						this.hasBed = true;
						break;
					}
					else /*if (playData && playData.playerList.lenght) */ {
						btn.currentState = `bet`;
					}
					// else btn.currentState = `view`;
				}
				else {
					btn.currentState = `view`;
				}

			}


			//如果已下注，则当前组其他所有的可下注状态变成查看
			if (canBet && this.hasBed) {
				for (let btn of this._vsBtnList[type]) {
					if (btn.currentState == `bet`) btn.currentState = `view`;
				}
			}
		}
	}

	/**更新16强数据 */
	private upSixteenData(): void {
		if (PeakedSys.ins().isKf()) {
			if (this.currentState == `kf_four`) {
				//默认选已下注的选项
				let betGroup: number = PeakedHelp.findBetKFGroup();
				if (betGroup > -1) this._curGroup = betGroup;
				//没下注，则默认自己所在选项
				else this._curGroup = PeakedHelp.findKFGroupById(Actor.actorID);
				this._curGroup = this._curGroup < 0 ? 0 : this._curGroup;
				if (this[`groupBtnSelect${this._curGroup}`])
					this[`groupBtnSelect${this._curGroup}`].visible = true;
			}

			this.upKf16Data();
		}
		else
			this.up16Data(PeakedSys.ins().player16List);

	}

	/**更新跨服16强数据 */
	@callLater
	private upKf16Data(): void {
		if (PeakedSys.ins().isKFSixteen()) {
			this.up16Data(PeakedSys.ins().kfPlayer16List);
		}
		else if (PeakedSys.ins().kfPlayer64List)
			this.up16Data(PeakedSys.ins().kfPlayer64List.slice(this._curGroup * this.MAX >> 1, this._curGroup * this.MAX + this.MAX >> 1));
	}

	/**更新16强数据 */
	private up16Data(list?: any): void {
		this.clearPlayer();
		if (list) {
			for (let i: number = 0; i < this.MAX; i++) {
				if (i % 2 == 0) {
					let data: PeakPlayerData = list[i / 2];
					if (data && data.playerList[0]) {
						this[`player${i}`].text = `${data.playerList[0].playerName}`;
						this[`player${i}`].name = `${data.playerList[0].playerName}_${data.playerList[0].roleId}`;
						if (data.playerList[0].roleId == Actor.actorID) this[`player${i}`].textColor = ColorUtil.GREEN;
						else this[`player${i}`].textColor = 0xF8B141;
					}

					if (data && data.playerList[1]) {
						this[`player${i + 1}`].text = `${data.playerList[1].playerName}`;
						this[`player${i + 1}`].name = `${data.playerList[1].playerName}_${data.playerList[1].roleId}`;
						if (data.playerList[1].roleId == Actor.actorID) this[`player${i + 1}`].textColor = ColorUtil.GREEN;
						else this[`player${i + 1}`].textColor = 0xF8B141;
					}
				}
			}
		}

		//冠军信息
		let playerData: PeakPlayerInfo;
		if (PeakedSys.ins().isKf()) {
			if (PeakedSys.ins().isKFSixteen()) {
				let championData = PeakedSys.ins().kfPlayer2Data;
				if (championData) playerData = PeakedHelp.findPlayerDtById(championData.winId, PeakedSys.ins().kfPlayer64List);
			}
		}
		else {
			let championData = PeakedSys.ins().player2Data;
			if (championData) playerData = PeakedHelp.findPlayerDtById(championData.winId, PeakedSys.ins().player16List);
		}


		if (playerData) {
			this.championFace.source = `yuanhead${playerData.job}${playerData.sex}`;
			this.championNameLabel.text = playerData.playerName;
			this.championNameLabel.name = `${playerData.playerName}_${playerData.roleId}`;
			this.competion.visible = false;
			this.finals.visible = true;
		}
		else {
			this.championFace.source = ``;
			this.championNameLabel.text = ``;
			this.championNameLabel.name = ``;
			this.competion.visible = true;
			this.finals.visible = false;
		}

		this.upLink();
		this.refBetState();
	}

	/**更新连线数据*/
	private upLink(): void {
		this.clearLink();

		let sys: PeakedSys = PeakedSys.ins();
		let lists: PeakPlayerData[][] = [];
		if (sys.isKf()) {//跨服
			//是不是跨服16强
			if (PeakedSys.ins().isKFSixteen())//假如打入了四强赛
			{
				lists = [sys.kfPlayer16List, sys.kfPlayer8List, sys.kfPlayer4List, [sys.kfPlayer2Data]];
			}
			else {
				lists = [sys.kfPlayer64List.slice(this._curGroup * this.MAX >> 1, this._curGroup * this.MAX + this.MAX >> 1),
					sys.kfPlayer32List.slice(this._curGroup * this.MAX >> 2, this._curGroup * this.MAX + this.MAX >> 2),
					sys.kfPlayer16List.slice(this._curGroup * this.MAX >> 3, this._curGroup * this.MAX + this.MAX >> 3),
					sys.kfPlayer8List.slice(this._curGroup * this.MAX >> 4, this._curGroup * this.MAX + this.MAX >> 4)];
			}
		}
		else {
			lists = [sys.player16List, sys.player8List, sys.player4List, [sys.player2Data]];
		}

		let nx: number = 0;//组索引
		for (let list of lists) {
			if (list && this._linkGroupList[nx].length > 0) {
				let ix: number = 0;
				for (let dt of list) {
					if (!dt) continue;
					if (PeakedHelp.findPlayerIndexById(dt.winId, dt.playerList) == 0) {
						PeakedHelp.setImgGroupSource(this._linkGroupList[nx][ix * 2], "line_light");
					} else if (PeakedHelp.findPlayerIndexById(dt.winId, dt.playerList) == 1) {
						PeakedHelp.setImgGroupSource(this._linkGroupList[nx][ix * 2 + 1], "line_light");
					}
					ix++;
				}
			}
			nx++;
		}
	}


	/**查看玩家 */
	private onTouchPlayer(e: egret.TouchEvent): void {
		let label: eui.Label = e.target;
		if (label.name) {
			let arr: string[] = label.name.split(`_`);
			if (Actor.myName == arr[0]) {
				// UserTips.ins().showTips(`不可查看自己`);
				ViewManager.ins().open(RoleWin);
				return;
			}
			let info: PeakPlayerInfo = PeakedHelp.findPlayerDtById(+(arr[1]));
			if (info)
				UserReadPlayer.ins().sendFindPlayer(arr[1], info.serverId);
			else UserReadPlayer.ins().sendFindPlayer(arr[1]);
		}
	}

	/**点击操作按钮 */
	private onTouchBtn(e: egret.TouchEvent): void {
		let actbtn: eui.Component = e.target.parent;
		let nameStr: string = actbtn.name;
		let groupArr: string[] = nameStr.split(`_`);
		switch (actbtn.currentState) {
			case `view`://查看
				ViewManager.ins().open(PeakViewBattleReportWin, +(groupArr[0]), +(groupArr[1]), this._curGroup);
				break;
			case `bet`://下注
				ViewManager.ins().open(PeakBetWin, +(groupArr[0]), +(groupArr[1]), this._curGroup);
				break;
			case `beted`://已下注
				break;

		}
	}

	/**触摸处理 */
	private onTouch(e: egret.TouchEvent): void {
		switch (e.target) {
			case this.finals:
				let arr: string[] = this.championNameLabel.name.split(`_`);
				if (Actor.myName == arr[0]) {
					// UserTips.ins().showTips(`不可查看自己`);
					ViewManager.ins().open(RoleWin);
					return;
				}

				let info: PeakPlayerInfo = PeakedHelp.findPlayerDtById(+(arr[1]));
				if (info)
					UserReadPlayer.ins().sendFindPlayer(arr[1], info.serverId);
				else UserReadPlayer.ins().sendFindPlayer(arr[1]);
				break;
			case this.vewChampScore:
				if (this.vewChampScore.text == `查看比分`)
					ViewManager.ins().open(PeakViewBattleReportWin, 4, 1, this._curGroup);
				else if (this.vewChampScore.text == `决赛下注`) {
					ViewManager.ins().open(PeakBetWin, 4, 1, this._curGroup);
				}
				break;
			case this.myRecord:
				ViewManager.ins().open(PeakMyBattleRecordWin, this._curGroup);
				break;
			case this.myBet:
				ViewManager.ins().open(PeakMyBetRecordWin);
				break;
			case this.topRank:
				ViewManager.ins().open(PeakTopRankWin);
				break;
		}
	}

	private onChargeTab(e: egret.TouchEvent): void {
		this.clearGroupSelect();
		switch (e.target) {
			case this.groupBtn0://青龙组
				this._curGroup = 0;
				this.groupBtnSelect0.visible = true;
				this.upKf16Data();
				break;
			case this.groupBtn1://白虎组
				this._curGroup = 1;
				this.groupBtnSelect1.visible = true;
				this.upKf16Data();
				break;
			case this.groupBtn2://朱雀组
				this._curGroup = 2;
				this.groupBtnSelect2.visible = true;
				this.upKf16Data();
				break;
			case this.groupBtn3://玄武组
				this._curGroup = 3;
				this.groupBtnSelect3.visible = true;
				this.upKf16Data();
				break;
		}

	}

	/**刷新红点 */
	private refRedpoint(): void {
		this.topRankRedpoint.visible = PeakedRedpoint.ins().redpoint2 > 0;
	}

	/**清空所有连线 */
	private clearLink(): void {
		for (let i: number = 0; i < this.MAX; i++) {
			if (this._linkGroupList[this.PK_GROUP_0][i]) PeakedHelp.setImgGroupSource(this._linkGroupList[this.PK_GROUP_0][i], "line_black");
			if (this._linkGroupList[this.PK_GROUP_1][i]) PeakedHelp.setImgGroupSource(this._linkGroupList[this.PK_GROUP_1][i], "line_black");
			if (this._linkGroupList[this.PK_GROUP_2][i]) PeakedHelp.setImgGroupSource(this._linkGroupList[this.PK_GROUP_2][i], "line_black");
			if (this._linkGroupList[this.PK_GROUP_3][i]) PeakedHelp.setImgGroupSource(this._linkGroupList[this.PK_GROUP_3][i], "line_black");
		}
	}

	/**清空玩家，重置状态 */
	private clearPlayer(): void {
		for (let i: number = 1; i <= this.MAX; i++) {
			//重置选手的信息
			this[`player${i - 1}`].text = ``;
			this[`player${i - 1}`].name = ``;
		}
	}

	/**清空所有组选择状态 */
	private clearGroupSelect(): void {
		this.groupBtnSelect0.visible = false;
		this.groupBtnSelect1.visible = false;
		this.groupBtnSelect2.visible = false;
		this.groupBtnSelect3.visible = false;
	}
}