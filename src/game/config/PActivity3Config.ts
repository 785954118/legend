/**
 * 个人活动类型1
 * 累充
 */
class PActivity3Config {
    public Id: number;   //活动序号
    public index: number;   //奖励序号
    public type: number;   //活动小类
    public day: number = 1;   //天数
    public val: number;//充值数量
    public rewards: RewardData[];   //奖励
    public showType:number;//面板类型
    public activityID:number[];//嵌套类型
}
