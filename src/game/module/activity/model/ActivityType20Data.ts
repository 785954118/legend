/**
 * 类型20活动数据
 */
class ActivityType20Data extends ActivityBaseData {
    public index:number;//活动奖励序号
    public timer:number;//index对应的活动结束时间
    // public rankData:LBBossRankData[];//10-20同步伤害数据 这里不需要了
    public isGoIn:number;//1:可以进入 0:不可进入
    constructor(bytes: GameByteArray) {
        super(bytes);
        this.update(bytes);
    }
    public update(bytes: GameByteArray): void {
        this.index = bytes.readInt() || 1;
        this.timer = bytes.readInt();//2010开始的index结束时间
        if( this.timer )
            this.timer = Math.floor(DateUtils.formatMiniDateTime(this.timer)/DateUtils.MS_PER_SECOND);//转1970时间戳:秒
        this.isGoIn = bytes.readByte();
        // let len = bytes.readShort();
        // this.rankData = [];//
        // for( let i = 0;i < len;i++ ){
        //     let lb:LBBossRankData = new LBBossRankData();
        //     lb.rank = bytes.readShort();
        //     lb.name = bytes.readString();
        //     lb.damage = bytes.readDouble();
        //     this.rankData.push(lb);
        // }
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
        if( this.IsEnd() )return false;
        let startTime = this.getStartTimer();
        let endTime = this.getEndTimer();
        let curTime = Math.floor(GameServer.serverTime/DateUtils.MS_PER_SECOND);
        if( curTime < startTime || curTime >= endTime )
            return false;
        // if( !this.timer )//不能时刻同步这个时间 客户端自行计算红点
        //     return false;
        // let config:ActivityType20Config = GlobalConfig.ActivityType20Config[this.id][this.index];
        // if( this.timer - config.duration > 0 )
        //     return true;
        return true;
    }
    /**
     * 当天刷新活动是否全部结束
     * 服务器只会发将要发生或者正在发生的index结束时间 不会关心是否活动期间
     * 因此只要判定是否同一天就知道是否在当天的boss全部刷新完
     * 注意:此活动不会配置跨0点的副本 并且副本必须是每天刷新完 按时间轮询顺序
     * */
    public IsEnd(){
        let endTimer = this.getEndTimer();
        let endDate = new Date(endTimer*DateUtils.MS_PER_SECOND);
        let curDate = new Date(GameServer.serverTime);
        if( curDate.getDate() != endDate.getDate() )return true;
        // if( Math.floor(GameServer.serverTime/DateUtils.MS_PER_SECOND) >= endTimer )return true;
        return false;
    }
    /**能否进入当前活动副本*/
    public go2BossFb(){
        return this.isGoIn;
        // if( this.IsEnd() )return false;
        // //时间达到了提前进入时间就允许进入副本
        // let readyTimer = this.getReadyTimer();
        // if( readyTimer <= 0 )return false;
        // let endTimer = this.getEndTimer();
        // let curTimer = Math.floor(GameServer.serverTime/DateUtils.MS_PER_SECOND);
        // if( curTimer >= readyTimer && curTimer < endTimer ) {
        //     return true;
        // }
        // return false;
    }
    /**距离当前副本开始还剩多少时间*/
    public getReadyTimer(){
        let config:ActivityType20Config = GlobalConfig.ActivityType20Config[this.id][this.index];
        // if( !config )return 0;
        // let date = new Date(GameServer.serverTime);
        // date.setHours(0,0,0);
        // let timer = Math.floor(date.getTime()/DateUtils.MS_PER_SECOND);
        // timer = timer + config.openTime - config.enterTime;
        // return timer;

        return this.timer - config.duration - config.enterTime
    }
    /**当前副本开始时间*/
    public getStartTimer(){
        let config:ActivityType20Config = GlobalConfig.ActivityType20Config[this.id][this.index];
        // let date = new Date(GameServer.serverTime);
        // date.setHours(0,0,0);
        // let timer = Math.floor(date.getTime()/DateUtils.MS_PER_SECOND);
        // timer = timer + config.openTime;
        // return timer;
        return this.timer - config.duration;
    }
    /**当前副本结束时间*/
    public getEndTimer(){
        return this.timer;
        // let config:ActivityType20Config = GlobalConfig.ActivityType20Config[this.id][this.index];
        // let date = new Date(GameServer.serverTime);
        // date.setHours(0,0,0);
        // let timer = Math.floor(date.getTime()/DateUtils.MS_PER_SECOND);
        // timer = timer + config.openTime + config.duration;
        // return timer;
    }
    /**当前副本剩余多长时间*/
    public getResidueTimer():number{
        if( this.IsEnd() )return 0;
        let startTimer = this.getStartTimer();
        let endTimer = this.getEndTimer();
        let curTimer = Math.floor(GameServer.serverTime/DateUtils.MS_PER_SECOND);
        if( curTimer >= startTimer && curTimer < endTimer )
            return endTimer - curTimer;
        return endTimer - curTimer;
    }

    /**当前副本准备时间到开始时间还有多长时间*/
    public getResidueStartTimer():number{
        if( this.IsEnd() )return 0;
        let startTimer = this.getStartTimer();
        let curTimer = Math.floor(GameServer.serverTime/DateUtils.MS_PER_SECOND);
        if( curTimer >= startTimer )return 0;
        return startTimer - curTimer;
    }


    public getDateTime(str:string) {
        let arr = str.split(/[-,.,:]/g);
        let date = new Date(+arr[0],+arr[1]-1,+arr[2],+arr[3]||0,+arr[4]||0);
        return date;
    }
}
/**排名数据类*/
class LBBossRankData{
    public rank:number;//排名
    public name:string;//玩家名
    public damage:number;//伤害
    constructor(){
        this.rank = 0;
        this.name = "";
        this.damage = 0;
    }
}

