interface PeakRaceBase {
	openDay: number;
	winMail: number;
	crossWinMail: number;
	likeScore: number;
	openTime: string;
	needZsLv: number;
	promInterval:number;
	crossRelTime:number;
	/**最高点赞次数 */
	likeCount:number;
	/**淘汰赛输多少场出局 */
	signUpLose:number;
	/**淘汰赛间隔多少时间（秒） */
	KnockOutTime:number;
	/**巅峰商城兑换需要的道具 */
	exchangeItems:number[];
	/**赢多少场晋级 */
	promWin:number;
	/**单服赛奖励展示 */
	singleRewards:RewardData[];
	/**跨服赛奖励展示 */
	croosRewards:RewardData[];
	/**跨服间隔时间 天数 */
	interval:number;
	/**每日最大膜拜次数 */
	mobaiNum:number;
	/**每次膜拜增加筹码 */
	mobaiChips:number;
}
