/**
 * Created by Administrator on 2016/7/22.
 */

class ActivityType2Config {
	Id: number;   //活动序号
    index: number;   //奖励序号
    vip: number;   //等级
    needRecharge:number;//当前需要充值数
    /**货币类型 2元宝 1金币 */
    currencyType: number;
    originalPrice:number;
    price: number;   //实际价格
    count: number;//可购买次数
    rewards: RewardData[];   //奖励
    countReward:{count:number,reward:RewardData[]}[];//跨服购买次数奖励
    discount:number; //打折数值
    source:string[];//描述图片
    showType:number;
    scount:number; //全服购买次数
    limitTime:Array<Number>; //限制购买时间
    shamScount:number; //伪库存
    shamScountLimit; //伪库存限制数
    shamScountRed:string; //伪库存减1的时间
    giftName:string;

}
