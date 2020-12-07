/**巅峰赛季系统数据集合 */
class PeakedData {
	public static STATE_TYPE_CN: string[] = [``, ``, ``, `16进8强`, `8进4强`, `半决赛`, `决赛`, ``];
	public static STATE_TYPE_AWARD_CN: string[] = [``, ``, `参与奖`, `16强`, `8强`, `4强`, `亚军`, `冠军`];
	public static STATE_ICON_CN: string[] = [``, `报名`, `淘汰赛`, `8强赛`, `4强赛`, `半决赛`, `决赛`, `跨服赛`];
	public static STATE_KF_TYPE_CN: string[] = [``, ``, `64进32强`, `32进16强`, `16进8强`, `8进4强`, `半决赛`, `决赛`, ``];
	public static STATE_KF_TYPE_AWARD_CN: string[] = [``, `参与奖`, `64强`, `32强`, `16强`, `8强`, `4强`, `亚军`, `冠军`];
	public static STATE_KF_ICON_CN: string[] = [`跨服赛`, `淘汰赛`, `32强赛`, `16强赛`, `8强赛`, `4强赛`, `半决赛`, `决赛`];
	public static SERV_CN: string[] = [`本服赛`, `跨服赛`];
	public constructor() {
	}
}
/**参赛玩家数据 */
class PeakPlayerData {
	public playerList: PeakPlayerInfo[];
	/**胜利者的ID */
	public winId: number;
	/**播报数据(赢的玩家ID)*/
	public reportList: number[];

	public constructor(bytes?: GameByteArray) {
		if (bytes) this.readBaseData(bytes);
	}
	public readBaseData(bytes: GameByteArray, isKF: boolean = false): void {
		let count: number = bytes.readByte();
		this.playerList = [];
		for (let i: number = 0; i < count; i++) {
			let info = new PeakPlayerInfo();
			if (isKF) info.readKFData(bytes);
			else info.readData(bytes);
			this.playerList.push(info);
		}
		this.winId = bytes.readInt();

		count = bytes.readByte();
		this.reportList = [];
		for (let i: number = 0; i < count; i++) {
			this.reportList.push(bytes.readInt());
		}
	}

	public readToData(bytes: GameByteArray): void {
		this.winId = bytes.readInt();
		let count: number = bytes.readByte();
		this.reportList = [];
		for (let i: number = 0; i < count; i++) {
			this.reportList.push(bytes.readInt());
		}
	}
}

/**巅峰玩家信息结构体 */
class PeakPlayerInfo {
	public roleId: number;
	public serverId: number;
	public playerName: string;
	public job: number;
	public sex: number;
	public pos: number;//所在位置：0上1下
	public constructor(bytes?: GameByteArray) {
		this.serverId = 0;
		if (bytes) this.readData(bytes);

	}
	public readData(bytes: GameByteArray): void {
		this.roleId = bytes.readInt();
		this.playerName = bytes.readString();
		this.job = bytes.readByte();
		this.sex = bytes.readByte();
		this.pos = bytes.readByte();
	}
	public readKFData(bytes: GameByteArray): void {
		this.roleId = bytes.readInt();
		this.serverId = bytes.readInt();
		this.playerName = bytes.readString();
		this.job = bytes.readByte();
		this.sex = bytes.readByte();
		this.pos = bytes.readByte();
	}
}

/**巅峰人气排行榜数据 */
class PeakTopRankData {
	/**玩家ID */
	public playerId: number;
	/**玩家名字 */
	public playerName: string;
	/**服务器Id */
	public servId: number;
	/**点攒数 */
	public likeNum: number;
	public rank: number;
	public constructor(bytes?: GameByteArray) {
		if (bytes) this.readData(bytes);

	}

	public readData(bytes: GameByteArray): void {
		this.playerId = bytes.readInt();
		this.playerName = bytes.readString();
		this.servId = bytes.readInt();
		this.likeNum = bytes.readInt();
	}
}

/**
 * 巅峰下注信息结构体
 * 
 */
class PeakBetData {
	/**场次 :4,16强晋级赛;5,8强晋级赛;6,4强晋级赛;7,决赛*/
	public status: number;
	/**下注玩家ID */
	public playerId: number;
	/**下注数 */
	public batNum: number;
	public constructor(bytes?: GameByteArray) {
		if (bytes) this.readData(bytes);
	}

	public readData(bytes: GameByteArray): void {
		this.status = bytes.readByte();
		this.playerId = bytes.readInt();
		this.batNum = bytes.readInt();
	}

}

/**
 * 巅峰战报数据结构体
 */
class PeakBattleReportData {
	/**当前 */
	public stateType: number;
	/**场次 */
	public round: number;
	/**对手名字 */
	public playerName: string;
	/**结果 */
	public result: number;

	public constructor() {
	}
}
/**
 * 淘汰赛战报数据结构体
 */
class KonckReportData {
	public id: number;
	/**玩家名字 为空表示轮空*/
	public player: string;
	/**玩家服务器ID,0表示本服 */
	public servId: number;
	/**结果 0输，1赢 */
	public result: number;
	/**轮数 */
	public round: number
	public constructor() {

	}
	public readBFData(bytes: GameByteArray): void {
		this.id = bytes.readInt();
		this.player = bytes.readString();
		this.result = bytes.readByte();
	}
	public readKFData(bytes: GameByteArray): void {
		this.id = bytes.readInt();
		this.player = bytes.readString();
		this.servId = bytes.readInt();
		this.result = bytes.readByte();
	}
}

/**
 * 本服1v1竞赛状态
 */
enum BF_PeakStatus {
	None = 0, //未开始状态
	SignUp = 1, //报名开始状态
	Knockout = 2, //淘汰赛状态
	Prom16 = 3, //16强晋级赛
	Prom8 = 4, //8强晋级赛
	Prom4 = 5, //4强晋级赛
	Finals = 6, //决赛
	Over = 7,//本服赛结束
}
/**
 * 跨服1v1竞赛阶段状态
 */
enum KF_PeakStatus {
	None = 0, //未开始状态
	Knockout = 1, //淘汰赛状态
	Prom64 = 2,  //64强晋级赛
	Prom32 = 3,  //32强晋级赛
	Prom16 = 4, //16强晋级赛
	Prom8 = 5, //8强晋级赛
	Prom4 = 6, //4强晋级赛
	Finals = 7, //决赛
	Over = 8, //结束
}

