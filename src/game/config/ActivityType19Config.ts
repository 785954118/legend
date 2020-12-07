/**
 * 类型19活动
 */
class ActivityType19Config {
    public Id: number;//活动序号
    public index: number;//奖励序号
    public range: number[];//排行区域
    public condition: number;//上榜条件
    public rewards: {type:number,id:number,count:number}[];//奖励
    public showType: number;//显示方式
    public activityID:number;//嵌套活动id
}
