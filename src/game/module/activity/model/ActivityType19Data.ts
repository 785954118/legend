/**
 * 类型19活动数据
 */
class ActivityType19Data extends ActivityBaseData {
    /**当前消费元宝 */
    public mycost: number;
    //中奖标记位
    public recrod: number;
    /**奖励索引 从1开始 */
    public awardIndex:number = 0;

    /**跨服消费排行榜*/
    private _data:Map<KuaFuRankData>;
    private _list:KuaFuRankData[];
    constructor(bytes: GameByteArray) {
        super(bytes);
        this._data = {};
        this._list = [];
    }
    public CleanRandData(){
        this._data = {};
        this._list = [];
    }
    public SetRankData(value:KuaFuRankData):void{
        this._list[value.rank-1]  = value;
        this._data[value.actorId] = value;
    }
    public GetRankData():Map<KuaFuRankData>{
        return this._data;
    }
    public GetRankList():KuaFuRankData[]{
        return this._list;
    }

    public update(bytes: GameByteArray): void {
        // //奖励序号
        // this.awardIndex = bytes.readShort();
        // //奖励位
        // this.recrod = bytes.readInt();
    }

    public canReward(): boolean {
        return this.checkRedPoint();
    }
    
    public isOpenActivity(): boolean {
        let beganTime = Math.floor((DateUtils.formatMiniDateTime(this.startTime) - GameServer.serverTime) / 1000);
        let endedTime = Math.floor((DateUtils.formatMiniDateTime(this.endTime) - GameServer.serverTime) / 1000);
        if (beganTime < 0 && endedTime > 0) {
            return true;
        }
        return false;
    }

    public getleftTime(){
        if( !this.isOpenActivity() ){
            return 0;
        }
        let endedTime = Math.floor((DateUtils.formatMiniDateTime(this.endTime) - GameServer.serverTime) / 1000);
        return endedTime;
    }

    //判断红点
    public checkRedPoint(): boolean {
        // let act:ActivityType19Data = Activity.ins().getActivityDataById(this.id) as ActivityType19Data;
        let config:ActivityType19Config = GlobalConfig.ActivityType19Config[this.id][1];
        if( config.activityID ){
            let act1:ActivityType1Data = Activity.ins().getActivityDataById(config.activityID) as ActivityType1Data;
            if( act1 && act1.canReward() )
                return true;
        }
        return false;
    }


}

