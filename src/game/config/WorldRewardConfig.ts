/**
 * 世界表
 */
class WorldRewardConfig {
	public id: number;
	/** 要求关卡数 */
	public needLevel: number;
	/** 奖励 */
	public rewards: RewardData[];
	/** 章节名字 */
	public name:string;
	/** 地图 */
	public icon: string;
	/** 地标位置 */
	public position: any;
	/** 大地图章节组id */
	public groupId: number
}