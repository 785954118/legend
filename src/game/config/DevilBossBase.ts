/**
 * Created by MPeter on 2018/3/3.
 *
 */
interface DevilBossBase {
	rebornCd: number;
	startTime: number[];
	rebornCost: number;
	/**开启天数限制*/
	openDay: number;
	/**cd时间*/
	cdTime: number;
	/**归属者奖励*/
	belongAwards: RewardData[];
	/**归属者拍卖奖励*/
	belongSaleAwards: RewardData[];
	/**参与者奖励*/
	partAwards: RewardData[];
	/**参与者拍卖奖励*/
	partSaleAwards: RewardData[];
	/**合服开启天数限制*/
	hefuTimeLimit: number;
}