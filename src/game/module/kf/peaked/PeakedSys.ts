/**
 * Created by MPeter on 2017/12/21.
 * 跨服副本-巅峰赛季系统
 */
class PeakedSys extends BaseSystem {
	/**16强信息  */
	public player16List: PeakPlayerData[] = [];
	/**8强信息  */
	public player8List: PeakPlayerData[] = [];
	/**4强信息  */
	public player4List: PeakPlayerData[] = [];
	/**冠军信息  */
	public player2Data: PeakPlayerData;

	/**排行榜信息列表 */
	public topRankInfoList: PeakTopRankData[] = [];
	/**下注信息 */
	public betInfo: PeakBetData[] = [];

	/**我的战报数据 */
	public myBattleReportList: PeakBattleReportData[] = [];

	/**
	 * 当前跨服1v1的本服状态阶段
	 * 本服状态枚举：BF_PeakStatus
	 */
	public bfStatus: number;
	/**跨服阶段 */
	public kfStatus: number;
	/**本服当前阶段是否结束 */
	public bfStatusIsEnd: number = 0;
	/**跨服当前阶段是否结束 */
	public kfStatusIsEnd: number = 0;
	/**是否报名 */
	public isSignUp: number;
	/**已点攒数*/
	public kideNum: number;


	/**当前淘汰赛第几轮 */
	public bfKonckRound: number;
	/**淘汰赛下场开始时间戳*/
	public bfKonckNextTimer: number;
	/**淘汰赛当前剩余人数*/
	public bfKonckSurplusNum: number;
	/**淘汰赛播报数据*/
	public bfKonckReportList: KonckReportData[] = [];

	/**当前状态活动时间戳*/
	public curStateTime: number;
	/**膜拜次数 */
	public worshipNum: number;

	/////////////////////////////////////////////////////
	/**64强信息  */
	public kfPlayer64List: PeakPlayerData[] = [];
	/**32强信息  */
	public kfPlayer32List: PeakPlayerData[] = [];
	/**16强信息  */
	public kfPlayer16List: PeakPlayerData[] = [];
	/**8强信息  */
	public kfPlayer8List: PeakPlayerData[] = [];
	/**4强信息  */
	public kfPlayer4List: PeakPlayerData[] = [];
	/**冠军信息  */
	public kfPlayer2Data: PeakPlayerData;

	/**当前跨服淘汰赛第几轮 */
	public kfKonckRound: number;
	/**跨服淘汰赛下场开始时间戳*/
	public kfKonckNextTimer: number;
	/**跨服淘汰赛当前剩余人数*/
	public kfKonckSurplusNum: number;
	/**跨服淘汰赛播报数据*/
	public kfKonckReportList: KonckReportData[] = [];

	/**排行榜信息列表 */
	public kfTopRankInfoList: PeakTopRankData[] = [];
	/**下注信息 */
	public kfBetInfo: PeakBetData[] = [];
	/**我的跨服战报数据 */
	public myKFBattleReportList: PeakBattleReportData[] = [];

	public crossScene: number = 10000;

	public constructor() {
		super();

		this.sysId = PackageID.PKCompetition;
		this.regNetMsg(0, this.postState);
		//本服
		this.regNetMsg(1, this.postSignUp);
		this.regNetMsg(2, this.doPKResult);
		this.regNetMsg(3, this.postEliminateReportData);
		this.regNetMsg(4, this.postBFInfoList);
		this.regNetMsg(5, this.postTopRank);
		this.regNetMsg(7, this.postBetInfo);
		//跨服
		this.regNetMsg(8, this.postKFEliminateReportData);
		this.regNetMsg(9, this.postKFInfoList);
		this.regNetMsg(10, this.postKFTopRank);
		this.regNetMsg(12, this.postKFBetInfo);
		this.regNetMsg(13, this.doFbCountDown);
		this.regNetMsg(14, this.postWorship);

		this.observe(GameLogic.ins().postEnterMap, () => {
			this.isCrossScene();
		});
	}

	public static ins(): PeakedSys {
		return super.ins() as PeakedSys;
	}

	/**
	 * 推送当前状态
	 * 67-0
	 */
	public postState(bytes: GameByteArray): void {
		if (bytes) {
			this.bfStatus = bytes.readByte();
			this.bfStatusIsEnd = bytes.readByte();
			this.kfStatus = bytes.readByte();
			this.kfStatusIsEnd = bytes.readByte();
			//当本服赛开始时，重置报名状态
			if (this.bfStatus == 0) this.isSignUp = 0;

			//测试用
			// this.bfStatus = 7;
			// this.bfStatusIsEnd  = 1
			// this.kfStatus = 1
			// this.kfStatusIsEnd = 1;
		}
		PeakedHelp.calcTimerNode();
		//超过了跨服的需要显示的时间点，则本服阶段结束，开始进入跨服阶段
		//特别注意：这里通过时间节点来计算当本服的状态，是为了表现出本服状态已结束，开始进入跨服阶段的一个表现
		if (this.bfStatus == BF_PeakStatus.Finals && this.bfStatusIsEnd) {
			let t: number = PeakedHelp.bfStatusTimer[BF_PeakStatus.Over] * 1000 - GameServer.serverTime;
			//跨服开始，则直接进入本服结束阶段
			if (this.kfStatus > KF_PeakStatus.None) t = 0;
			if (t <= 0) this.bfStatus = BF_PeakStatus.Over;
			else {
				TimerManager.ins().doTimer(t, 1, () => {
					this.bfStatus = BF_PeakStatus.Over;
					//本服赛结束后，需要重新计算下时间节点
					PeakedHelp.calcTimerNode();
					this.postState(null);//刷新状态
				}, this);
			}
		}
		//重新计算时间节点
		

		//跨服需要请求
		if (PeakedSys.ins().isKf()) PeakedSys.ins().sendKFBetInfo();
		// egret.log(`当前状态=`, this.bfStatus, this.bfStatusIsEnd, this.kfStatus, this.kfStatusIsEnd);
	}

	/**
	 * 推送个人报名数据
	 * 67-1
	 */
	public postSignUp(bytes: GameByteArray): number {
		this.isSignUp = bytes.readByte();//是否报名
		this.kideNum = bytes.readInt();//点攒数
		Actor.ins().postChip(bytes.readNumber());
		this.curStateTime = bytes.readInt();//当次活动的开始时间
		this.worshipNum = bytes.readByte();


		//计算时间节点
		PeakedHelp.calcTimerNode();
		return this.isSignUp;
	}

	/**
	 * 推送比赛结果
	 * 67-2
	 */
	public doPKResult(bytes: GameByteArray): void {
		let result: number = bytes.readByte();//0.输,1.赢
		let enemyName: string = bytes.readString();

		ViewManager.ins().open(PeakedFBResult, result, enemyName);
	}

	/**
	 * 推送淘汰赛个人战报数据
	 * 67-3
	 */
	public postEliminateReportData(bytes: GameByteArray): void {
		this.bfKonckRound = bytes.readShort();
		this.bfKonckNextTimer = bytes.readInt();
		this.bfKonckSurplusNum = bytes.readShort();

		this.bfKonckReportList = [];
		let count: number = bytes.readShort();
		for (let i: number = 0; i < count; i++) {
			let data: KonckReportData = new KonckReportData();
			data.readBFData(bytes);
			data.round = i + 1;
			this.bfKonckReportList.push(data);
		}
	}

	/**
	 * 推送本服赛面板数据
	 * 67-4
	 */
	public postBFInfoList(bytes: GameByteArray): void {
		let pkPlayerData: PeakPlayerData;
		//16强
		this.player16List = [];
		let count: number = bytes.readByte();
		for (let i: number = 0; i < count; i++) {
			pkPlayerData = new PeakPlayerData();
			pkPlayerData.readBaseData(bytes);
			this.player16List.push(pkPlayerData);
		}

		//8强
		this.player8List = [];
		count = bytes.readByte();
		for (let i: number = 0; i < count; i++) {
			pkPlayerData = new PeakPlayerData();
			pkPlayerData.playerList = [];
			PeakedHelp.pushPlayerList(this.player16List, this.player16List, pkPlayerData.playerList, i);
			pkPlayerData.readToData(bytes);
			this.player8List.push(pkPlayerData);
		}

		//4强
		this.player4List = [];
		count = bytes.readByte();
		for (let i: number = 0; i < count; i++) {
			pkPlayerData = new PeakPlayerData();
			pkPlayerData.playerList = [];
			PeakedHelp.pushPlayerList(this.player8List, this.player16List, pkPlayerData.playerList, i);
			pkPlayerData.readToData(bytes);
			this.player4List.push(pkPlayerData);
		}

		//2强（产生冠军）
		this.player2Data = new PeakPlayerData();
		this.player2Data.playerList = [];
		PeakedHelp.pushPlayerList(this.player4List, this.player16List, this.player2Data.playerList, 0);
		this.player2Data.readToData(bytes);

		//搜集战报
		this.myBattleReportList = PeakedHelp.countMyRecordData();
	}

	/**
	 * 推送本服赛面板数据
	 * 67-5
	 */
	public postTopRank(bytes: GameByteArray): void {
		let count: number = bytes.readShort();
		this.topRankInfoList = [];
		for (let i: number = 0; i < count; i++) {
			let data = new PeakTopRankData(bytes);
			data.rank = i + 1;
			this.topRankInfoList.push(data);
		}
	}

	/**
	 * 推送本服下注信息
	 * 67-7
	 */
	public postBetInfo(bytes: GameByteArray): void {
		let count: number = bytes.readByte();
		this.betInfo = [];
		for (let i: number = 0; i < count; i++) {
			let dt = new PeakBetData(bytes);
			this.betInfo.push(dt);
		}

		//打开窗口下注时回调则提示下注成功
		if (ViewManager.ins().isShow(PeakBetWin))
			UserTips.ins().showTips(`恭喜您，下注成功`);
		ViewManager.ins().close(PeakBetWin);
	}

	/**************************************跨服*******************************************/
	/**
	 * 推送跨服淘汰赛个人战报数据
	 * 67-8
	 */
	public postKFEliminateReportData(bytes: GameByteArray): void {
		this.kfKonckRound = bytes.readShort();
		this.kfKonckNextTimer = bytes.readInt();
		this.kfKonckSurplusNum = bytes.readShort();

		this.kfKonckReportList = [];
		let count: number = bytes.readShort();
		for (let i: number = 0; i < count; i++) {
			let data: KonckReportData = new KonckReportData();
			data.readKFData(bytes);
			data.round = i + 1;
			this.kfKonckReportList.push(data);
		}
	}

	/**
	 * 推送跨服赛面板数据
	 * 67-9
	 */
	public postKFInfoList(bytes: GameByteArray): void {
		let pkPlayerData: PeakPlayerData;

		//64强
		this.kfPlayer64List = [];
		let count: number = bytes.readByte();
		for (let i: number = 0; i < count; i++) {
			pkPlayerData = new PeakPlayerData();
			pkPlayerData.readBaseData(bytes, true);
			this.kfPlayer64List.push(pkPlayerData);
		}

		//32强
		this.kfPlayer32List = [];
		count = bytes.readByte();
		for (let i: number = 0; i < count; i++) {
			pkPlayerData = new PeakPlayerData();
			pkPlayerData.playerList = [];
			PeakedHelp.pushPlayerList(this.kfPlayer64List, this.kfPlayer64List, pkPlayerData.playerList, i);

			pkPlayerData.readToData(bytes);
			this.kfPlayer32List.push(pkPlayerData);
		}

		//16强
		this.kfPlayer16List = [];
		count = bytes.readByte();
		for (let i: number = 0; i < count; i++) {
			pkPlayerData = new PeakPlayerData();
			pkPlayerData.playerList = [];
			PeakedHelp.pushPlayerList(this.kfPlayer32List, this.kfPlayer64List, pkPlayerData.playerList, i);
			pkPlayerData.readToData(bytes);
			this.kfPlayer16List.push(pkPlayerData);
		}

		//8强
		this.kfPlayer8List = [];
		count = bytes.readByte();
		for (let i: number = 0; i < count; i++) {
			pkPlayerData = new PeakPlayerData();
			pkPlayerData.playerList = [];
			PeakedHelp.pushPlayerList(this.kfPlayer16List, this.kfPlayer64List, pkPlayerData.playerList, i);
			pkPlayerData.readToData(bytes);
			this.kfPlayer8List.push(pkPlayerData);
		}

		//4强
		this.kfPlayer4List = [];
		count = bytes.readByte();
		for (let i: number = 0; i < count; i++) {
			pkPlayerData = new PeakPlayerData();
			pkPlayerData.playerList = [];
			PeakedHelp.pushPlayerList(this.kfPlayer8List, this.kfPlayer64List, pkPlayerData.playerList, i);
			pkPlayerData.readToData(bytes);
			this.kfPlayer4List.push(pkPlayerData);
		}

		//2强（产生冠军）
		this.kfPlayer2Data = new PeakPlayerData();
		this.kfPlayer2Data.playerList = [];
		PeakedHelp.pushPlayerList(this.kfPlayer4List, this.kfPlayer64List, this.kfPlayer2Data.playerList, 0);
		this.kfPlayer2Data.readToData(bytes);

		//搜集战报
		this.myKFBattleReportList = PeakedHelp.countKFMyRecordData();
	}

	/**
	 * 接收跨服点攒排行榜信息处理
	 * 67-10
	 */
	public postKFTopRank(bytes: GameByteArray): void {
		let count: number = bytes.readShort();
		this.kfTopRankInfoList = [];
		for (let i: number = 0; i < count; i++) {
			let data = new PeakTopRankData(bytes);
			data.rank = i + 1;
			this.kfTopRankInfoList.push(data);
		}
	}

	/**
	 * 接收跨服下注信息
	 * 67-12
	 */
	public postKFBetInfo(bytes: GameByteArray): void {
		let count: number = bytes.readByte();
		this.kfBetInfo = [];
		for (let i: number = 0; i < count; i++) {
			let dt = new PeakBetData(bytes);
			this.kfBetInfo.push(dt);
		}
		//打开窗口下注时回调则提示下注成功
		if (ViewManager.ins().isShow(PeakBetWin))
			UserTips.ins().showTips(`恭喜您，下注成功`);
		ViewManager.ins().close(PeakBetWin);
	}

	/**
	 * 副本倒计时
	 * 67-13
	 */
	private doFbCountDown(bytes: GameByteArray): void {
		let t: number = bytes.readInt();
		let curTime: number = Math.floor((DateUtils.formatMiniDateTime(t) - GameServer.serverTime) / 1000);
		egret.log(curTime)
		if (curTime > 0)
			ViewManager.ins().open(FBCountDown, curTime);
	}

	/**
	 * 膜拜成功
	 * 67-14
	 */
	public postWorship(bytes: GameByteArray): void {
		this.worshipNum = bytes.readByte();

		if (!GlobalConfig.PeakRaceBase.mobaiChips) GlobalConfig.PeakRaceBase.mobaiChips = 1000;
		UserTips.ins().showCenterTips(`膜拜成功，筹码+${GlobalConfig.PeakRaceBase.mobaiChips}`);
	}

	/////////////////////////////////////发送//////////////////////////////////////////
	/**
	 * 是否报名
	 * 67-1
	 */
	public sendSignUp(): void {
		this.sendBaseProto(1);
	}

	/**
	 * 获取淘汰赛个人战报数据
	 * 67-3
	 */
	public sendEliminateReport(): void {
		this.sendBaseProto(3);
	}


	/**
	 * 获取本服信息列表
	 * 67-4
	 */
	public sendBFInfoList(): void {
		this.sendBaseProto(4);
	}

	/**
	 * 获取本服人气排行榜
	 * 67-5
	 */
	public sendTopRank(): void {
		this.sendBaseProto(5);
	}

	/**
	 * 请求点赞
	 * 67-6
	 */
	public sendToLikes(id: number): void {
		let bytes: GameByteArray = this.getBytes(6);
		bytes.writeInt(id);
		this.sendToServer(bytes);
	}

	/**
	 * 获取本服下注
	 * 67-7
	 */
	public sendBet(id: number, num: number): void {
		let bytes: GameByteArray = this.getBytes(7);
		bytes.writeInt(id);
		bytes.writeInt(num);

		this.sendToServer(bytes);
	}

	/**************************************跨服*******************************************/
	/**
	 * 获取跨服淘汰赛个人战报数据
	 * 67-8
	 */
	public sendKFEliminateReport(): void {
		this.sendBaseProto(8);
	}

	/**
	 * 获取跨服信息列表
	 * 67-9
	 */
	public sendKFInfoList(): void {
		this.sendBaseProto(9);
	}

	/**
	 * 获取跨服人气排行榜
	 * 67-10
	 */
	public sendKFTopRank(): void {
		this.sendBaseProto(10);
	}

	/**
	 * 跨服请求点赞
	 * 67-11
	 */
	public sendKFToLikes(id: number): void {
		let bytes: GameByteArray = this.getBytes(11);
		bytes.writeInt(id);
		this.sendToServer(bytes);
	}

	/**
	 * 获取跨服下注
	 * 67-12
	 */
	public sendKFBet(id: number, num: number): void {
		let bytes: GameByteArray = this.getBytes(12);
		bytes.writeInt(id);
		bytes.writeInt(num);
		this.sendToServer(bytes);
	}

	/**
	 * 获取跨服下注信息
	 * 67-13
	 */
	public sendKFBetInfo(): void {
		this.sendBaseProto(13);
	}

	/**
	 * 膜拜冠军
	 * 67-14
	 */
	public sendWorship(): void {
		this.sendBaseProto(14);
	}

	/////////////////////////////////工具类/////////////////////////////////////
	/**是否开启 */
	public isOpen(): boolean {
		//判断特戒是否激活
		let b = OpenSystem.ins().checkSysOpen(SystemType.RING);
		//没全部激活
		let maxCount = Object.keys(GlobalConfig.ActorExRingConfig).length;
		let term: boolean = SpecialRing.ins().ringActiNum < maxCount;

		if (GameServer.serverOpenDay >= GlobalConfig.PeakRaceBase.openDay && b && !term)
			return true;
		return false;
	}

	/**是否在跨服中 */
	public isKf(): boolean {
		return this.bfStatus == BF_PeakStatus.Over && this.bfStatusIsEnd != 0;
	}

	/**是否报名 */
	public canSignUp(): boolean {
		let t: number = PeakedHelp.bfStatusTimer[BF_PeakStatus.Knockout] * 1000 - GameServer.serverTime;
		// return t > 0 && this.kfStatus == KF_PeakStatus.None;
		return true;
	}

	/**是否为跨服16强 */
	public isKFSixteen(): boolean {
		return this.kfStatus > KF_PeakStatus.Prom32 || (this.kfStatus == KF_PeakStatus.Prom32 && this.kfStatusIsEnd != 0);
	}

	public isCrossScene(): void {
		//因为在跨服返回过程中，中间跳转了一个场景，所以需要定位下，跨服回来，进入第二个场景时，才打开巅峰赛季页面
		if (this.crossScene == 2) {
			ViewManager.ins().open(PeakedMainWin);
		}
		this.crossScene++;
	}


}
namespace GameSystem {
	export let pkCompetitionSys = PeakedSys.ins.bind(PeakedSys);
}