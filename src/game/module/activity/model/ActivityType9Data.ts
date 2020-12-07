/**
 * 类型9活动数据
 * Created by hujinheng 2017/11/17
 */
class ActivityType9Data extends ActivityBaseData {

    public record: number;//抽奖次数领奖位
    public count:number;//累计次数
    public indexs:number[];//抽奖数组索引(单抽 10抽)
    public noticeArr:{name:string,index:number}[];
    constructor(bytes: GameByteArray) {
        super(bytes);
        this.update(bytes);
    }
    private getIns(){
        let ins:Activity|PActivity;
        if( this.activityType == ActivityType.Personal ){
            ins = PActivity.ins();
        }else{
            ins = Activity.ins();
        }
        return ins;
    }
    public update(bytes: GameByteArray): void {
        this.record = bytes.readInt();
        this.count = bytes.readInt();
        let len = bytes.readByte();
        this.indexs = [];
        for( let i = 0;i < len;i++ ){
            this.indexs.push(bytes.readByte())
        }
        //公告记录
        len = bytes.readByte();
        this.noticeArr = [];
        for (let i = 0; i < len; i++) {
            this.noticeArr.push({name:bytes.readString(), index:bytes.readByte()})
        }
        this.noticeArr.reverse();
    }

    public canReward(): boolean {
        return this.checkRedPoint();

    }

    public isOpenActivity(): boolean {

        // if( this.timeType == ActivityDataFactory.TimeType_Fixed ){
        //     let aconfig:ActivityConfig = GlobalConfig.ActivityConfig[this.id];
        //     if( aconfig ){
        //         let startTime = (new Date(aconfig.startTime)).getTime();
        //         let endTime = (new Date(aconfig.endTime)).getTime();
        //         if( GameServer.serverTime > startTime && GameServer.serverTime < endTime ){
        //             return true;
        //         }
        //     }
        // }else{
            let beganTime = Math.floor((DateUtils.formatMiniDateTime(this.startTime) - GameServer.serverTime) / 1000);
            let endedTime = Math.floor((DateUtils.formatMiniDateTime(this.endTime) - GameServer.serverTime) / 1000);
            if (beganTime < 0 && endedTime > 0) {
                return true;
            }
        // }
        return false;
    }

    //判断红点
    public checkRedPoint(): boolean {
        return this.getIns().getType9RedPoint(this.id);
    }

    public getRemainTime(): string {
        let beganTime = Math.floor((DateUtils.formatMiniDateTime(this.startTime) - GameServer.serverTime) / 1000);
        let endedTime = Math.floor((DateUtils.formatMiniDateTime(this.endTime) - GameServer.serverTime) / 1000);
        let desc: string;
        if (beganTime >= 0) {
            desc = "活动未开启";
        } else if (endedTime <= 0) {
            desc = "活动已结束";
        } else {
            desc = DateUtils.getFormatBySecond(endedTime, DateUtils.TIME_FORMAT_5, 3)
        }
        return desc;
    }

    public getLastTime(): string {
        let endedTime = Math.floor((DateUtils.formatMiniDateTime(this.endTime) - GameServer.serverTime) / 1000);
        let desc: string = DateUtils.getFormatBySecond(endedTime, DateUtils.TIME_FORMAT_5, 3);
        return desc;
    }

    /**
     * 返回值 0未领取 1已领取
     * @param index
     * @returns {number}
     */
    getStateByIndex(index:number):number {
        let state = (this.record >> index) & 1;
        return state;
    }
}

