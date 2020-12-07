/** 功勋商店配置 */
class FeatsStore {
    index: number;
    /**1货币商店 2道具商店*/
    shopType: number;
    goods: RewardData[];
    /**
     * 1每日限购 2不限次数 3永久限购
     */
    buyType: number;
    costMoney: { type: number, count: number }
    daycount: number;
    costItem: RewardData;
    use: string;

    exchangeCount: number;
}