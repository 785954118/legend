/**
 * 类型20活动
 */
class ActivityType20Config {
    public Id: number;
    public index: number;
    public openTime: number;//开启时间:秒
    public duration: number;//时长:秒
    public rankReward:{start:number,endi:number,head:string,context:string,reward:{type:number,id:number,count:number}[]}[];//排名奖励
    public enterTime:number;//提前进入时间 开启时间之前:秒
    public monsterId:{id:number,monster:string,scale:number};
    public showReward:{type:number,id:number,count:number}[];
}
