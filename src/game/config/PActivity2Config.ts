/**
 * 活动类型2 限购
 */

class PActivity2Config {
    public Id: number;   //活动序号
    public index: number;   //奖励序号
    public vip: number;   //等级
    public needRecharge:number;//当前需要充值数
    /**货币类型 2元宝 1金币 */
    public currencyType: number;
    public originalPrice:number;
    public price: number;   //实际价格
    public count: number;//可购买次数
    public rewards: RewardData[];   //奖励
    countReward:{count:number,reward:RewardData[]}[];//跨服购买次数奖励 个人活动暂未用到
    public discount:number; //打折数值
    public source:string[];//描述图片
    public showType:number;
    public scount:number; //全服购买次数
    public limitTime:Array<Number>; //限制购买时间
    public shamScount:number; //伪库存
    public shamScountLimit; //伪库存限制数
    public shamScountRed:string; //伪库存减1的时间
    public giftName:string;

}
