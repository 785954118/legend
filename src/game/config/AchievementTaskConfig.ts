/**
 * 任务--成就配置
 */
interface AchievementTaskConfig {
	/** 索引 */
	index: number;
	/** 成就id */
	achievementId: number;
	/** 任务id */
	taskId: number;
	/** 任务显示对象类型 */
	showType: number;
	/** 成就目标 */
	target: number;
	/** 成就名字 */
	name: string;
	/** 成就描述 */
	desc: string;
	/** 成就奖励 */
	awardList: RewardData[];
	/** 操作类型 */
	control: number;
	/** 操作对象 */
	controlTarget: number[];
	/** 成就类型 */
	achievementType: number;
	/** 成就积分 */
	score: number;
	/** 任务类型 */
	type: number;
	/** 成就长描述 */
	longdesc: string;
	/** 成就未完成提醒 **/
	startwarning:string;
	/** 成就完成提醒 **/
	finishwarning:string;

}