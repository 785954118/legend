/**
 * 巅峰赛季帮助类
 *
 */
class PeakedHelp {
	public constructor() {
	}

	/**组索引*/
	private static PK_GROUP_1: number = 1;
	private static PK_GROUP_2: number = 2;
	private static PK_GROUP_3: number = 3;
	private static PK_GROUP_4: number = 4;

	/**计算时间节点 */
	static bfStatusTimer: number[];
	static kfStatusTimer: number[];

	static calcTimerNode(): void {
		//只计算一次
		// if (this.bfStatusTimer) return;

		let baseDP: PeakRaceBase = GlobalConfig.PeakRaceBase;
		let timeDps: PeakRaceTime[] = GlobalConfig.PeakRaceTime;
		let sysDt: PeakedSys = PeakedSys.ins();
		this.bfStatusTimer = [];
		this.kfStatusTimer = [];

		//本服时间
		let curTime: number = Math.floor(DateUtils.formatMiniDateTime(sysDt.curStateTime) / DateUtils.MS_PER_SECOND);

		//注意：因为服务器在本服赛完了之后，会将时间撮改为下一轮的开始时间撮，所以需要减间隔的时间，因为本服赛的状态 结束，是根据时间来算的
		//如果这里没加上，到跨服赛，会出现问题，切记！！！
		if (PeakedSys.ins().bfStatus >= BF_PeakStatus.Finals && PeakedSys.ins().bfStatusIsEnd) {
			if (!GlobalConfig.PeakRaceBase.interval) GlobalConfig.PeakRaceBase.interval = 14;
			curTime -= GlobalConfig.PeakRaceBase.interval * DateUtils.MS_PER_DAY / DateUtils.MS_PER_SECOND;
		}

		this.bfStatusTimer[BF_PeakStatus.None] = curTime;
		this.bfStatusTimer[BF_PeakStatus.Over] = curTime + baseDP.crossRelTime;
		for (let status: number = 1; status <= BF_PeakStatus.Finals; status++) {
			this.bfStatusTimer[status] = curTime + timeDps[status].relTime;
		}

		//跨服时间
		timeDps = GlobalConfig.PeakRaceCrossTime;
		this.kfStatusTimer[KF_PeakStatus.None] = curTime;
		for (let status: number = 1; status <= KF_PeakStatus.Finals; status++) {
			this.kfStatusTimer[status] = curTime + timeDps[status].relTime;
		}
	}

	/**获得单服赛时间规则 */
	static getTimerRuleStr(): string {
		let baseDP: PeakRaceBase = GlobalConfig.PeakRaceBase;

		let colorStr: string = `|C:${ColorUtil.GREEN}&T:`;
		let str: string = `1、报名等级：达到${colorStr}${baseDP.needZsLv}|转\n`;
		const TIME_FORMAT = DateUtils.TIME_FORMAT_13;

		let sTime = DateUtils.getFormatBySecond(this.bfStatusTimer[BF_PeakStatus.SignUp], TIME_FORMAT);
		let eTime = DateUtils.getFormatBySecond(this.bfStatusTimer[BF_PeakStatus.Knockout], TIME_FORMAT);
		str += `2、报名时间：${colorStr}${sTime}|到${colorStr}${eTime}|\n`;

		sTime = DateUtils.getFormatBySecond(this.bfStatusTimer[BF_PeakStatus.Knockout], TIME_FORMAT);
		str += `3、淘汰赛：${colorStr}${sTime}|举行，所有报名玩家争夺16强席位\n`;

		sTime = DateUtils.getFormatBySecond(this.bfStatusTimer[BF_PeakStatus.Prom16], TIME_FORMAT);
		str += `4、八强赛：${colorStr}${sTime}|举行\n`;

		sTime = DateUtils.getFormatBySecond(this.bfStatusTimer[BF_PeakStatus.Prom8], TIME_FORMAT);
		str += `5、四强赛：${colorStr}${sTime}|举行\n`;

		sTime = DateUtils.getFormatBySecond(this.bfStatusTimer[BF_PeakStatus.Prom4], TIME_FORMAT);
		str += `6、半决赛：${colorStr}${sTime}|举行\n`;

		sTime = DateUtils.getFormatBySecond(this.bfStatusTimer[BF_PeakStatus.Finals], TIME_FORMAT);
		str += `7、决赛：${colorStr}${sTime}|举行\n`;
		return str;
	}

	/**获得跨服赛时间规则 */
	static getKFTimerRuleStr(): string {
		let colorStr: string = `|C:${ColorUtil.GREEN}&T:`;
		let str: string = `1、报名条件：单服16强自动报名\n`;
		const TIME_FORMAT = DateUtils.TIME_FORMAT_13;

		let sTime = DateUtils.getFormatBySecond(this.kfStatusTimer[KF_PeakStatus.Knockout], TIME_FORMAT);
		str += `2、淘汰赛：${colorStr}${sTime}|举行，决出64强\n`;

		sTime = DateUtils.getFormatBySecond(this.kfStatusTimer[KF_PeakStatus.Prom64], TIME_FORMAT);
		str += `3、32强赛：${colorStr}${sTime}|举行\n`;

		sTime = DateUtils.getFormatBySecond(this.kfStatusTimer[KF_PeakStatus.Prom32], TIME_FORMAT);
		str += `4、16强赛：${colorStr}${sTime}|举行\n`;

		sTime = DateUtils.getFormatBySecond(this.kfStatusTimer[KF_PeakStatus.Prom16], TIME_FORMAT);
		str += `4、八强赛：${colorStr}${sTime}|举行\n`;

		sTime = DateUtils.getFormatBySecond(this.kfStatusTimer[KF_PeakStatus.Prom8], TIME_FORMAT);
		str += `5、四强赛：${colorStr}${sTime}|举行\n`;

		sTime = DateUtils.getFormatBySecond(this.kfStatusTimer[KF_PeakStatus.Prom4], TIME_FORMAT);
		str += `6、半决赛：${colorStr}${sTime}|举行\n`;

		sTime = DateUtils.getFormatBySecond(this.kfStatusTimer[KF_PeakStatus.Finals], TIME_FORMAT);
		str += `7、决赛：${colorStr}${sTime}|举行\n`;
		return str;
	}

	/**计算淘汰赛我赢的次数 */
	static calcEliminateWinNum(): number {
		let count: number = 0;
		if (PeakedSys.ins().isKf()) {
			for (let data of PeakedSys.ins().kfKonckReportList) {
				if (data.result) count++
			}
		}
		else {
			for (let data of PeakedSys.ins().bfKonckReportList) {
				if (data.result) count++
			}
		}

		return count;
	}


	/**
	 *获取本服玩家信息
	 */
	static getPlayerData(group1: number, group2: number): PeakPlayerData {
		let sys: PeakedSys = PeakedSys.ins();
		if (group1 == this.PK_GROUP_1) {
			return sys.player16List[group2 - 1];
		}
		else if (group1 == this.PK_GROUP_2) {
			if (sys.player8List[group2 - 1]) return sys.player8List[group2 - 1];
			else {
				return this.findLastDt(group2, sys.player16List);
			}
		}
		else if (group1 == this.PK_GROUP_3) {
			if (sys.player4List[group2 - 1]) return sys.player4List[group2 - 1];
			else {
				return this.findLastDt(group2, sys.player8List);
			}
		}
		else {
			//默认获取冠军信息
			if (sys.player2Data) return sys.player2Data;
			else return this.findLastDt(group2, sys.player4List);
		}
	}

	/**
	 *获取跨服玩家信息
	 */
	static getKFPlayerData(group1: number, group2: number, idx: number = 0, isSixteen: boolean = false): PeakPlayerData {
		let sys: PeakedSys = PeakedSys.ins();
		if (group1 == this.PK_GROUP_1) {
			if (isSixteen) {
				if (sys.kfPlayer16List[group2 - 1]) return sys.kfPlayer16List[group2 - 1];
				else return this.findLastDt(group2, sys.kfPlayer64List);
			}
			else {
				return sys.kfPlayer64List.slice(idx * 8, idx * 8 + 8)[group2 - 1];
			}
		}
		else if (group1 == this.PK_GROUP_2) {
			if (isSixteen) {
				if (sys.kfPlayer8List[group2 - 1]) return sys.kfPlayer8List[group2 - 1];
				else return this.findLastDt(group2, sys.kfPlayer16List);
			}
			else {
				if (sys.kfPlayer32List.slice(idx * 4, idx * 4 + 4)[group2 - 1]) return sys.kfPlayer32List.slice(idx * 4, idx * 4 + 4)[group2 - 1];
				else return this.findLastDt(group2, sys.kfPlayer64List.slice(idx * 8, idx * 8 + 8));
			}
		}
		else if (group1 == this.PK_GROUP_3) {
			if (isSixteen) {
				if (sys.kfPlayer4List[group2 - 1]) return sys.kfPlayer4List[group2 - 1];
				else return this.findLastDt(group2, sys.kfPlayer8List);
			}
			else {
				if (sys.kfPlayer16List.slice(idx * 2, idx * 2 + 2)[group2 - 1]) return sys.kfPlayer16List.slice(idx * 2, idx * 2 + 2)[group2 - 1];
				else return this.findLastDt(group2, sys.kfPlayer32List.slice(idx * 4, idx * 4 + 4));
			}
		}
		else {
			//默认获取冠军信息
			if (sys.kfPlayer2Data) return sys.kfPlayer2Data;
			else return this.findLastDt(group2, sys.kfPlayer4List);
		}
	}

	/**查找上一组的组对象数据 */
	private static findLastDt(ix: number, list: PeakPlayerData[]): PeakPlayerData {
		if (list && list[(ix - 1) * 2 + 1]) {
			let aid = list[(ix - 1) * 2 >> 0].winId;
			let bid = list[(ix - 1) * 2 + 1 >> 0].winId;
			let dt = new PeakPlayerData();
			dt.playerList = [];
			dt.playerList.push(this.findPlayerDtById(aid));
			dt.playerList.push(this.findPlayerDtById(bid));
			dt.reportList = [];
			return dt;
		}
		else return null;
	}

	/**根据ID获取玩家名字 */
	static findPlayerDtById(id: number, list?: PeakPlayerData[]): PeakPlayerInfo {
		if (!list) {
			if (PeakedSys.ins().isKf()) {
				list = PeakedSys.ins().kfPlayer64List;
			}
			else {
				list = PeakedSys.ins().player16List;
			}
		}
		for (let playerData of list) {
			for (let data of playerData.playerList) {
				if (id == data.roleId) return data;
			}
		}
	}

	/**通过ID检测玩家是否胜利
	 * id 玩家ID
	 * curStatus 当前阶段
	 */
	static checkIsWinById(id: number, status: number, list?: PeakPlayerData[]): boolean {
		if (!list) {
			if (PeakedSys.ins().isKf()) {
				list = PeakedHelp.getPlayerListByStage(status);
			}
			else {
				list = PeakedHelp.getPlayerListByStage(status);
			}
		}

		for (let data of list) {
			if (id == data.winId) return true;
		}
		return false;

	}

	/**
	 * 根据当前状态阶段获取玩家组列表
	 */
	static getPlayerListByStage(curStatus: number): PeakPlayerData[] {
		if (PeakedSys.ins().isKf()) {
			switch (curStatus) {
				case KF_PeakStatus.Knockout:
				case KF_PeakStatus.Prom64:
					return PeakedSys.ins().kfPlayer64List;
				case KF_PeakStatus.Prom32:
					return PeakedSys.ins().kfPlayer32List;
				case KF_PeakStatus.Prom16:
					return PeakedSys.ins().kfPlayer16List;
				case KF_PeakStatus.Prom8:
					return PeakedSys.ins().kfPlayer8List;
				case KF_PeakStatus.Prom4:
					return PeakedSys.ins().kfPlayer4List;
				case KF_PeakStatus.Finals:
					return [PeakedSys.ins().kfPlayer2Data];
			}
		}
		else {
			switch (curStatus) {
				case BF_PeakStatus.Prom16:
				case BF_PeakStatus.Knockout:
					return PeakedSys.ins().player16List;
				case BF_PeakStatus.Prom8:
					return PeakedSys.ins().player8List;
				case BF_PeakStatus.Prom4:
					return PeakedSys.ins().player4List;
				case BF_PeakStatus.Finals:
					return [PeakedSys.ins().player2Data];
			}

		}
	}

	/**统计本服我的战绩数据 */
	static countMyRecordData(): PeakBattleReportData[] {
		let prm16: PeakPlayerData[] = PeakedSys.ins().player16List;
		let prm8: PeakPlayerData[] = PeakedSys.ins().player8List;
		let prm4: PeakPlayerData[] = PeakedSys.ins().player4List;
		let prm2: PeakPlayerData = PeakedSys.ins().player2Data;

		//搜集战报
		let collectReport = (pkPlayerData: PeakPlayerData, tReportList: PeakBattleReportData[], stateType: BF_PeakStatus) => {
			let n: number = pkPlayerData.playerList.length;
			for (let i: number = 0; i < n; i++) {
				let pdt = pkPlayerData.playerList[i];
				if (pdt.roleId == Actor.actorID) {
					let enemyName = n > 1 ? pkPlayerData.playerList[i == 0 ? 1 : 0].playerName : "轮空";

					if (pkPlayerData.reportList.length == 0 && !pkPlayerData.playerList[1] && stateType < PeakedSys.ins().bfStatus) {
						//已经过了当前的赛事，且战报为列表为空，当前状态完成时则定为轮空
						let reportData = new PeakBattleReportData();
						reportData.stateType = stateType;
						reportData.playerName = enemyName;
						reportData.result = 1;
						reportData.round = 0;
						tReportList.push(reportData);
					}
					else {
						let round: number = 0;
						for (let pId of pkPlayerData.reportList) {
							let reportData = new PeakBattleReportData();
							reportData.stateType = stateType;
							reportData.playerName = enemyName;
							reportData.result = pId == Actor.actorID ? 1 : 0;
							reportData.round = ++round;

							tReportList.push(reportData);
						}
					}
					break;
				}
			}
		}

		let dtList: PeakBattleReportData[] = [];
		for (let pData of prm16) {
			collectReport(pData, dtList, BF_PeakStatus.Prom16)
		}
		for (let pData of prm8) {
			collectReport(pData, dtList, BF_PeakStatus.Prom8)
		}
		for (let pData of prm4) {
			collectReport(pData, dtList, BF_PeakStatus.Prom4)
		}
		collectReport(prm2, dtList, BF_PeakStatus.Finals);

		return dtList;
	}

	/**统计跨服我的战绩数据 */
	static countKFMyRecordData(): PeakBattleReportData[] {
		let prm64: PeakPlayerData[] = PeakedSys.ins().kfPlayer64List;
		let prm32: PeakPlayerData[] = PeakedSys.ins().kfPlayer32List;
		let prm16: PeakPlayerData[] = PeakedSys.ins().kfPlayer16List;
		let prm8: PeakPlayerData[] = PeakedSys.ins().kfPlayer8List;
		let prm4: PeakPlayerData[] = PeakedSys.ins().kfPlayer4List;
		let prm2: PeakPlayerData = PeakedSys.ins().kfPlayer2Data;

		//搜集战报
		let collectReport = (pkPlayerData: PeakPlayerData, tReportList: PeakBattleReportData[], stateType: KF_PeakStatus) => {
			let n: number = pkPlayerData.playerList.length;
			for (let i: number = 0; i < n; i++) {
				let pdt = pkPlayerData.playerList[i];
				if (pdt.roleId == Actor.actorID) {
					let enemyName = n > 1 ? pkPlayerData.playerList[i == 0 ? 1 : 0].playerName : "轮空";

					if (pkPlayerData.reportList.length == 0 && !pkPlayerData.playerList[1] && stateType < PeakedSys.ins().kfStatus) {
						//已经过了当前的赛事，且战报为列表为空，则定为轮空
						let reportData = new PeakBattleReportData();
						reportData.stateType = stateType;
						reportData.playerName = enemyName;
						reportData.result = 1;
						reportData.round = 0;
						tReportList.push(reportData);
					}
					else {
						let round: number = 0;
						for (let pId of pkPlayerData.reportList) {
							let reportData = new PeakBattleReportData();
							reportData.stateType = stateType;
							reportData.playerName = enemyName;
							reportData.result = pId == Actor.actorID ? 1 : 0;
							reportData.round = ++round;

							tReportList.push(reportData);
						}
					}
					break;
				}
			}
		}

		let dtList: PeakBattleReportData[] = [];
		for (let pData of prm64) {
			collectReport(pData, dtList, KF_PeakStatus.Prom64)
		}
		for (let pData of prm32) {
			collectReport(pData, dtList, KF_PeakStatus.Prom32)
		}
		for (let pData of prm16) {
			collectReport(pData, dtList, KF_PeakStatus.Prom16)
		}
		for (let pData of prm8) {
			collectReport(pData, dtList, KF_PeakStatus.Prom8)
		}
		for (let pData of prm4) {
			collectReport(pData, dtList, KF_PeakStatus.Prom4)
		}
		collectReport(prm2, dtList, KF_PeakStatus.Finals);

		return dtList;
	}

	/**根据id查找下注信息 注意必须同时要传状态，因为可以连续下注同一人 */
	private static findBetInfoById(id: number, status: number, betInfoList?: PeakBetData[]): PeakBetData {
		if (!betInfoList) {
			let isKF: boolean = PeakedSys.ins().isKf();
			betInfoList = isKF ? PeakedSys.ins().kfBetInfo : PeakedSys.ins().betInfo
		}
		if (!betInfoList) return null;

		for (let info of betInfoList) {
			if (info.playerId == id && info.status == status) return info;
		}
		return null;
	}

	/**根据组获取当前的状态 */
	private static getStatusByGroup(group: number): number {
		if (PeakedSys.ins().isKf()) {
			if (PeakedSys.ins().isKFSixteen()) {
				switch (group) {
					case this.PK_GROUP_1:
						return KF_PeakStatus.Prom16;
					case this.PK_GROUP_2:
						return KF_PeakStatus.Prom8;
					case this.PK_GROUP_3:
						return KF_PeakStatus.Prom4;
					case this.PK_GROUP_4:
						return KF_PeakStatus.Finals;
				}
			}
			else {
				switch (group) {
					case this.PK_GROUP_1:
						return KF_PeakStatus.Prom64;
					case this.PK_GROUP_2:
						return KF_PeakStatus.Prom32;
				}
			}
		}
		else {
			switch (group) {
				case this.PK_GROUP_1:
					return BF_PeakStatus.Prom16;
				case this.PK_GROUP_2:
					return BF_PeakStatus.Prom8;
				case this.PK_GROUP_3:
					return BF_PeakStatus.Prom4;
				case this.PK_GROUP_4:
					return BF_PeakStatus.Finals;
			}
		}
	}

	/**检查是否下注 */
	static checkIsBet(list: PeakPlayerInfo[], group: string): boolean {
		let groupNum: number = parseInt(group);
		let isKF: boolean = PeakedSys.ins().isKf();
		for (let dt of list) {
			if (!dt) continue;
			let betInfo = this.findBetInfoById(dt.roleId, this.getStatusByGroup(parseInt(group)));
			//判断下注信息表里是否有下注信息
			if (betInfo) {
				if (isKF) {
					if (PeakedSys.ins().isKFSixteen()) {
						if (groupNum == this.PK_GROUP_1 && betInfo.status == KF_PeakStatus.Prom16)
							return true;
						else if (groupNum == this.PK_GROUP_2 && betInfo.status == KF_PeakStatus.Prom8)
							return true;
						else if (groupNum == this.PK_GROUP_3 && betInfo.status == KF_PeakStatus.Prom4)
							return true;
						else if (groupNum == this.PK_GROUP_4 && betInfo.status == KF_PeakStatus.Finals)
							return true;
					}
					else {
						if (groupNum == this.PK_GROUP_1 && betInfo.status == KF_PeakStatus.Prom64)
							return true;
						else if (groupNum == this.PK_GROUP_2 && betInfo.status == KF_PeakStatus.Prom32)
							return true;
					}

				}
				else {
					if (groupNum == this.PK_GROUP_1 && betInfo.status == BF_PeakStatus.Prom16)
						return true;
					else if (groupNum == this.PK_GROUP_2 && betInfo.status == BF_PeakStatus.Prom8)
						return true;
					else if (groupNum == this.PK_GROUP_3 && betInfo.status == BF_PeakStatus.Prom4)
						return true;
					else if (groupNum == this.PK_GROUP_4 && betInfo.status == BF_PeakStatus.Finals)
						return true;
				}

			}
		}

		return false;
	}

	/**通过id查找玩家在列表组中索引 */
	static findPlayerIndexById(id: number, list: PeakPlayerInfo[]): number {
		for (let i: number = 0; i < list.length; i++) {
			if (list[i].roleId == id) {
				return i;
			}
		}
		return -1;
	}

	/**设置image组内所有的image资源信息 */
	static setImgGroupSource(group: eui.Group, source: string): void {
		for (let i: number = 0; i < group.numChildren; i++) {
			let img: eui.Image = <eui.Image>group.getChildAt(i);
			if (img) img.source = source;
		}
	}

	static statusIsOver(status: number, isKf: boolean): boolean {
		if (isKf) {
			return PeakedSys.ins().kfStatus > status || (PeakedSys.ins().kfStatus == status && PeakedSys.ins().kfStatusIsEnd != 0);
		}
		else {
			return PeakedSys.ins().bfStatus > status || (PeakedSys.ins().bfStatus == status && PeakedSys.ins().bfStatusIsEnd != 0);
		}
	}

	/**根据操作组来判断当前状态是否完成 */
	static statusIsOverByGroup(group: number): boolean {
		let isOver: boolean = false;
		if (PeakedSys.ins().isKf()) {
			if (PeakedSys.ins().isKFSixteen()) {
				if (group == this.PK_GROUP_1) isOver = PeakedHelp.statusIsOver(KF_PeakStatus.Prom16, false);
				else if (group == this.PK_GROUP_2) isOver = PeakedHelp.statusIsOver(KF_PeakStatus.Prom8, false);
				else if (group == this.PK_GROUP_3) isOver = PeakedHelp.statusIsOver(KF_PeakStatus.Prom4, false);
				else isOver = PeakedHelp.statusIsOver(KF_PeakStatus.Finals, false);
			}
			else {
				if (group == this.PK_GROUP_1) isOver = PeakedHelp.statusIsOver(KF_PeakStatus.Prom64, false);
				else if (group == this.PK_GROUP_2) isOver = PeakedHelp.statusIsOver(KF_PeakStatus.Prom32, false);
			}
		}
		else {
			if (group == this.PK_GROUP_1) isOver = PeakedHelp.statusIsOver(BF_PeakStatus.Prom16, false);
			else if (group == this.PK_GROUP_2) isOver = PeakedHelp.statusIsOver(BF_PeakStatus.Prom8, false);
			else if (group == this.PK_GROUP_3) isOver = PeakedHelp.statusIsOver(BF_PeakStatus.Prom4, false);
			else isOver = PeakedHelp.statusIsOver(BF_PeakStatus.Finals, false);
		}
		return isOver;
	}

	/**插入新的列表 */
	static pushPlayerList(toList: PeakPlayerData[], soList: PeakPlayerData[], playerList: PeakPlayerInfo[], index: number): void {
		if (toList[index * 2]) {
			let dt = PeakedHelp.findPlayerDtById(toList[index * 2].winId, soList);
			if (dt)
				playerList.push(dt);
		}

		if (toList[index * 2 + 1]) {
			let dt = PeakedHelp.findPlayerDtById(toList[index * 2 + 1].winId, soList);
			if (dt)
				playerList.push(dt);
		}
	}

	/**根据玩家id判断玩家是否进入16强 */
	static isSixteenById(id: number): boolean {
		for (let dt of PeakedSys.ins().player16List) {
			if (dt) {
				for (let info of dt.playerList) {
					if (info.roleId == id) return true;
				}
			}
		}
		return false;
	}

	/**排序 */
	static sortBetFun(a: PeakBetData, b: PeakBetData): number {
		if (a.status > b.status) return 1;
		else if (a.status < b.status) return -1;
		else return 0;
	}

	/**根据id查找跨服组 */
	static findKFGroupById(id: number): number {
		let index: number = 0;
		for (let dt of PeakedSys.ins().kfPlayer64List) {
			for (let playInfo of dt.playerList) {
				if (playInfo.roleId == id) {
					return index / 16 >> 0;
				}
				index++;
			}
		}
		return -1;
	}

	/**查找下注跨服组 */
	static findBetKFGroup(): number {
		let kfStatus: number = PeakedSys.ins().kfStatus;
		let index: number = 0;
		for (let dt of PeakedSys.ins().kfBetInfo) {
			if ((dt.status == KF_PeakStatus.Prom64 && kfStatus == KF_PeakStatus.Knockout)
				|| (dt.status == KF_PeakStatus.Prom32 && kfStatus == KF_PeakStatus.Prom64)) {
				return this.findKFGroupById(dt.playerId);
			}
		}
		return -1;
	}

	/**是否可点赞 */
	static canSupport(): boolean {
		//时间来判断：超过一星期，且跨服结束，则不可点赞
		let curT: number = this.kfStatusTimer[KF_PeakStatus.None] + DateUtils.DAYS_PER_WEEK * DateUtils.SECOND_PER_DAY;
		if (GameServer.serverTime / DateUtils.MS_PER_SECOND > curT && PeakedSys.ins().kfStatus >= KF_PeakStatus.Finals && PeakedSys.ins().kfStatusIsEnd) {
			return false;
		}

		//中间休息时间段不可点赞
		// if (PeakedSys.ins().kfPlayer2Data && PeakedSys.ins().kfPlayer2Data.winId) {
		// 	return false
		// }
		return true;
	}

}  