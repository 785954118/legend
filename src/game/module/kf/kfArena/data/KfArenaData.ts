/**
 * Created by MPeter on 2018/3/14.
 *
 */
class KfArenaData {
	/**服务器ID*/
	public servId: number;
	/**玩家名字*/
	public playerName: string;
	/**击杀数*/
	public killNum: number;
	/**助攻*/
	public aidNum: number;
	/**采集*/
	public collectNum: number;
	/**该局分数*/
	public curScore: number;
	/**该局获得分数*/
	public curGetScore: number;
	/**该局总分数*/
	public totalScore: number;

	/**是否首杀*/
	public isFirstKiller: boolean;
	/**是否首采*/
	public isFirstCollect: boolean;
	/**是否MVP*/
	public isMvp: boolean;
	/**是否连胜*/
	public isOnWin: boolean;
	/**是否为逃兵*/
	public isDeserter: boolean;

	public rank: number;

	public constructor(bytes?: GameByteArray) {
		if (bytes) this.readData(bytes);
	}

	private readData(bytes: GameByteArray): void {
		this.servId = bytes.readInt();
		this.playerName = bytes.readString();
		this.killNum = bytes.readShort();
		this.aidNum = bytes.readShort();
		this.collectNum = bytes.readShort();
		this.curScore = bytes.readShort();
		this.curGetScore = bytes.readShort();
		this.totalScore = bytes.readShort();

		this.isFirstKiller = bytes.readBoolean();
		this.isFirstCollect = bytes.readBoolean();
		this.isMvp = bytes.readBoolean();
		this.isOnWin = bytes.readBoolean();
		this.isDeserter = bytes.readBoolean();
	}

	/*排行数据*/
	public readRankData(bytes: GameByteArray): void {
		this.servId = bytes.readInt();
		this.playerName = bytes.readString();
		this.killNum = bytes.readShort();
		this.aidNum = bytes.readShort();
		this.collectNum = bytes.readShort();
		this.curScore = bytes.readShort();
		this.totalScore = bytes.readShort();
	}

}
