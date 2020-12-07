/**
 * 活动类型1
 * @author hepeiye
 *
 */
class ActivityType1Config {
    Id: number;   //活动序号
    index: number;   //奖励序号
    level: number;   //等级
    zslevel: number;   //转生等级
    wingLv: number;//翅膀
    zzLv: number;//铸造
    lhLv: number;//龙魂
    szLv: number;//图鉴
    tjPower: number;//图鉴总战力
    equipPower: number;//装备总评分
    showType: number;//显示方式
    total: number;//奖励总分数
    rewards: RewardData[];   //奖励
    consumeYuanbao: number;
    /**
     * 火焰戒指达标需要的等级
     */
    huoyanRingLv: number;

    lunhLv:number;//轮回等级达标

    zhanlingLv:number; //战灵等级

}
