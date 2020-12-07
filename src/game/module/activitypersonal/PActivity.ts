/**
 * 个人活动数据(移植Activity)
 */
class PActivity extends BaseSystem {
    /** 未达成 */
    public static NotReached: number = 0;
    /** 可领取 */
    public static CanGet: number = 1;
    /** 已领取 */
    public static Geted: number = 2;

    /** 未击杀boss组 */
    public static NOKILL: number = 0;
    /** 已击杀boss组 */
    public static KILL: number = 1;
    /**活动数据 */
    public activityData: Map<ActivityBaseData> = {};

    //打开过的面板列表 根据活动id存的
    public palyEffList: boolean[] = [];

    //开启的达标活动的信息  0--当前达标榜的排名  1--这个
    /**当前 排行是否达标 */
    public isDaBiao: boolean;
    public isGetAward: boolean;
    public myDabiaoInfo: any;
    public myPaiming: any;
    public rankInfoList: PDabiaoData[] = [];
    /** 登录天数*/
    public dayNum: number;
    /** 登录奖励是否已领*/
    public isAwards: number;
    /**当前达标奖励档位 前端从0开始*/
    public indexCurrDabiao: number = 0;

    public nextDayState: number = 0;
    /**类型5活动的累计登陆数据 需要优化到5里边 由于5号消息和原有2号7号消息流程冲突 服务器需要时间修改 这里暂时这样*/
    public hfLoginDay: number = 1;
    public geLoginDay: number = 1;

    public constructor() {
        super();

        this.sysId = PackageID.PActivity;
        this.regNetMsg(1, this.doActivityData);
        this.regNetMsg(2, this.postRewardResult);
        // this.regNetMsg(3, this.doDaBiaoInfo);
        // this.regNetMsg(4, this.postIsGetAwards);
        // this.regNetMsg(5, this.doRewardStatu);
        this.regNetMsg(7, this.postChangePage);
        // this.regNetMsg(11, this.doSevenDayData);
        // this.regNetMsg(12, this.doChangeSevenDayData);
        // // this.regNetMsg(13, this.doLianxuData);
        //
        // this.regNetMsg(21, this.doNextDayLoginData);
        // this.regNetMsg(20, this.doNextDayLoginReward);
    }

    public static ins(): PActivity {
        return super.ins() as PActivity;
    }

    protected initZero() {
        //0点重新请求活动数据
        if (this.activityData) {
            for (let id in this.activityData) {
                let activityId = +id;
                if (activityId < 10000) {
                    let config = GlobalConfig.ActivityConfig[id];
                    if (config) {
                        this.sendChangePage(activityId);
                        // if (config.activityType == 3) {
                        // }
                    }
                }
            }
        }
    }

    /** 获取活动数据 */
    public getActivityDataById(id: number): ActivityBaseData {
        return this.activityData[id];
    }


    /** 获取打开过的面板列表 根据活动id存的 */
    public getPalyEffListById(id: number): boolean {
        return this.palyEffList[id];
    }

    /** 设置打开过的面板列表 根据活动id存的 */
    public setPalyEffListById(id: number, value: boolean): void {
        this.palyEffList[id] = value;
    }

    public getrankInfoListByIndex(index: number): PDabiaoData {
        return this.rankInfoList[index];
    }

    /**
     * 初始化活动信息
     * 68-1
     * @param bytes
     */
    private doActivityData(bytes: GameByteArray): void {
        this.activityData = {};
        let count: number = bytes.readShort();
        for (let i = 0; i < count; i++) {
            let activityData: ActivityBaseData = PActivityDataFactory.create(bytes);
            if (activityData) {
				let id = activityData.id;
                this.activityData[id] = activityData;
            }
        }
        this.postActivityIsGetAwards();
        // ActivityDataFactory.createEx();
    }
    /** 特殊活动变更 */
    public postSpecials(): void {

    }

    /**派发活动信息初始化 */
    public postActivityIsGetAwards(): void {

    }

    /**
     * 领取结果
     * 68-2
     * @param bytes
     */
    public isSuccee = false;

    public postRewardResult(bytes: GameByteArray): number {
        this.isSuccee = bytes.readBoolean();
        let activityID = bytes.readInt();
        this.getActivityDataById(activityID).update(bytes);
        this.postActivityPanel(activityID);
        this.postActivityIsGetAwards();

        return activityID;
    }

    /**派发更新单个活动界面,(目前是开服活动) */
    public postActivityPanel(activityId: number): number {
        return activityId;
    }

    /**
     * 请求领取活动奖励
     * 68-2
     * @param actID  活动ID rewardID 奖励ID
     * 【注意】类型9活动
     * 发送顺序: 活动id 请求类型(0/1or2)
     * 第三个参数:
     * 请求类型0: 累计次数奖励
     * 请求类型1or2: 不需要参数 但会分单抽和多抽 单抽会需要再请求这条消息返回确切奖励(因为第一次是转盘转动中 返回index)  多抽则不需要
     *
     */
    public sendReward(actID:number, rewardID:number,param1?:any): void {
        let bytes: GameByteArray = this.getBytes(2);
        let cfg:PActivityConfig = GlobalConfig.PActivityConfig[actID];
        if( cfg && cfg.activityType == PActivityDataFactory.PACTIVITY_TYPE_9 ){
            if( rewardID ){
                //请求类型1or2
                bytes.writeInt(actID);
                bytes.writeShort(rewardID);
            }else{
                //请求类型0
                bytes.writeInt(actID);
                bytes.writeShort(rewardID);
                bytes.writeByte(param1);
            }
        }else{
            bytes.writeInt(actID);
            bytes.writeShort(rewardID);
        }
        this.sendToServer(bytes);
    }

    // /*
    //  *连续充值数下推
    //  * 68-13
    //  * @param bytes
    //  */
    // private doLianxuData(bytes: GameByteArray): void {
    // 	let activityId: number = bytes.readInt();
    // 	(<ActivityType3Data>this.getActivityDataById(activityId)).updateData(bytes);
    // 	this.postActivityIsGetAwards();
    // }

    /*请求连续充值活动奖励*/
    public sendLianxuReward(actId: number): void {
        let bytes: GameByteArray = this.getBytes(13);
        bytes.writeInt(actId);
        this.sendToServer(bytes);
    }

    /*
     * 合服累计登录
     * 68-5
     * @param bytes
     * //此处ActivityType5Data 应该改成PActivityType5Data 用于区分个人活动和正常活动
     */
    public doRewardStatu(bytes: GameByteArray): void {
        let activityId: number = bytes.readInt();
        let data: ActivityType5Data = this.getActivityDataById(activityId) as ActivityType5Data;
        if (data) {
             data.updateData(bytes);
        }
        this.postActivityIsGetAwards();
    }

    /*
     * 切换活动页面下发
     * 68-7
     * @param bytes
     */
    public postChangePage(bytes: GameByteArray): number {
        // 单份活动数据
        let activityData: ActivityBaseData = PActivityDataFactory.create(bytes);
        if (activityData) {
            this.activityData[activityData.id] = activityData;
        }

        this.postActivityIsGetAwards();
        return activityData ? activityData.id : 0;
    }

    /*
     * 切换活动页面发送
     * 68-7
     * @param bytes
     */
    public sendChangePage(actId: number): void {
        let bytes: GameByteArray = this.getBytes(7);
        bytes.writeInt(actId);
        this.sendToServer(bytes);
    }

    private doDaBiaoInfo(bytes: GameByteArray): void {
        this.dabiaoDecode(bytes);
        this.postGetDaBiaoInfo();
    }

    public postGetDaBiaoInfo(): void {

    }

    /*
     * 次日登录
     * 68-21
     * @param bytes
     */
    private doNextDayLoginData(bytes: GameByteArray): void {
        this.nextDayState = bytes.readShort();
        debug.log(this.nextDayState);
    }

    /*
     * 次日登陆领取
     * 68-20
     * @param bytes
     */
    private doNextDayLoginReward(bytes: GameByteArray): void {
        let state: number = bytes.readShort();
        if (state) {
            this.nextDayState = 2;
            UserTips.ins().showTips(StringUtils.addColor("领取奖励成功", 0xf3311e));
        }
    }

    /*发送次日登陆领取*/
    public sendNextDayReward(): void {
        let bytes: GameByteArray = this.getBytes(20);
        this.sendToServer(bytes);
    }


    /*请求达标信息*/
    public sendDabiaoInfo(dabiao: number): void {
        let bytes: GameByteArray = this.getBytes(3);
        bytes.writeInt(dabiao);
        this.sendToServer(bytes);
    }

    /*领取达标奖励*/
    public sendGetDabiaoReward(dabiao: number): void {
        let bytes: GameByteArray = this.getBytes(4);
        bytes.writeInt(dabiao);
        this.sendToServer(bytes);
    }

    /**收到达标活动状态 */
    private postIsGetAwards(bytes: GameByteArray): void {
        this.isGetAward = bytes.readBoolean();
    }


    /**
     * 发送领取七天登录奖励
     * @param day
     */
    public sendGetSevenDayAwards(day: number): void {
        let bytes: GameByteArray = this.getBytes(12);
        bytes.writeShort(day);
        this.sendToServer(bytes);
    }

    public doSevenDayData(bytes: GameByteArray): void {
        this.dayNum = bytes.readShort();
        this.isAwards = bytes.readInt();
        this.postSevendayIsAwards();
    }

    public doChangeSevenDayData(bytes: GameByteArray): void {
        let flag: boolean = bytes.readBoolean();
        if (flag) {
            let changeDay: number = bytes.readShort();
            this.isAwards = bytes.readInt();
            this.postSevendayAwardCallback();
        } else {
            UserTips.ins().showTips("|C:0xf3311e&T:背包已满，请清理背包|");
        }
        this.postSevendayIsAwards();
    }

    /**七天登录领取回调 */
    public postSevendayAwardCallback(): void {

    }

    /** 七天登录系统是否有奖励领取 */
    public postSevendayIsAwards(): void {

    }

    /** 次日登陆信息更新 */
    public postNextDayInfo(): void {

    }

    /**
     * 获取七天登录状态
     */
    public getSevenDayStast(): boolean {

        let day: number = DateUtils.DAYS_PER_WEEK;
        if (this.dayNum > 14)
            day = 14;
        else
            day = this.dayNum;
        for (let i: number = 1; i <= day; i++) {
            let config: LoginRewardsConfig = GlobalConfig.LoginRewardsConfig[i];
            if (config) {
                if (this.dayNum >= config.day) {
                    if ((this.isAwards >> config.day & 1) == 0)
                        return true;
                }
            }
        }
        return false;
    }

    public getSevenDayLogIsVisible(): boolean {
        return ((this.isAwards >> 14 & 1) == 0);
    }

    public getbtnInfo(str: string | number): PActivityBtnConfig {
        let config: PActivityBtnConfig[] = GlobalConfig.PActivityBtnConfig;
        if (config[str]) {
            return config[str];
        }
        return null;
    }

    /**
     * 是否显示红点（通过活动按钮信息）
     * @param  {PActivityBtnConfig} abc 活动按钮信息
     * @returns boolean
     */
    public isShowRedPointByBtnInfo(abc: PActivityBtnConfig): boolean {
        var result: boolean = false;
        result = this.checkAcCanGet(abc.id + "");

        return result;
    }

    //检查指定活动的id 是否可以领取奖励
    public checkAcCanGet(index: string): boolean {
        let data: Map<ActivityBaseData> = this.activityData;
        for (let k in data) {
            if (k == index && data[k].isOpenActivity() && data[k].canReward() && data[k].specialState()) {
                return true;
            }
        }
        return false;
    }

    //检查累计充值 是否可以领取奖励
    public checkOtherCharge2CanGet(): boolean {
        let rechargeData: RechargeData = Recharge.ins().getRechargeData(1);
        let config: ChongZhi2Config[] = GlobalConfig.ChongZhi2Config[((rechargeData.day / 7) >= 1) ? 2 : 1][rechargeData.day % 7];
        for (let k in config) {
            if (((rechargeData.isAwards >> config[k].index) & 1) == 0 && rechargeData.num >= config[k].pay) {
                return true;
            }
        }
        return false;
    }

    public dabiaoDecode(bytes: GameByteArray): void {
        this.isDaBiao = bytes.readBoolean();
        this.indexCurrDabiao = Math.max(bytes.readInt() - 1, 0);//服务器从1开始，前端为了方便取值，自-1,最小为0
        let rankType: number = bytes.readShort();
        if (rankType == RankDataType.TYPE_LEVEL) {
            bytes.readInt();
            bytes.readInt();
        } else if (rankType == RankDataType.TYPE_BAOSHI) {
            this.myDabiaoInfo = bytes.readInt();
        } else if (rankType == RankDataType.TYPE_ZHANLING) {
            let zj: number = bytes.readInt();
            let zx: number = bytes.readInt();
            this.myDabiaoInfo = [zj, zx]
        } else if (rankType == RankDataType.TYPE_LONGHUN) {
            this.myDabiaoInfo = bytes.readInt();
        } else if (rankType == RankDataType.TYPE_XIAOFEI) {
            this.myDabiaoInfo = bytes.readInt();
        } else if (rankType == RankDataType.TYPE_HF_XIAOFEI) {
            this.myDabiaoInfo = bytes.readInt();
            this.myPaiming = bytes.readInt();
        }
        else {
            this.myDabiaoInfo = bytes.readDouble();
        }
        let len: number = bytes.readShort();
        let data: PDabiaoData;
        this.rankInfoList = [];
        for (let i: number = 0; i < len; i++) {
            if (!this.rankInfoList[i]) {
                this.rankInfoList.push(new PDabiaoData());
            }
            data = this.rankInfoList[i];
            data.prase(bytes, rankType);
        }
    }

    //活动类型3
    public getisCangetDabiao3(id: number): boolean {
        let activityData: PActivityType3Data = PActivity.ins().getActivityDataById(id) as PActivityType3Data;
        if (activityData.canOnlyReward) {
            activityData.canOnlyReward();
            return activityData.btn1 || activityData.btn2;
        } else {
            return this.checkAcCanGet(id + "");
        }
    }

    /**返回指定ID活动内是否有任意限购道具满足购买条件 */
    public getisCanBuyXianGou(actId: string): boolean {
        let rtn: boolean = false;
        let configList: PActivity2Config[] = GlobalConfig.PActivity2Config[actId];
        if (configList) {
            for (let i = 0; i < configList.length; i++) {
                rtn = this.getisCanBuyXianGouItem(actId, i);
                if (rtn) break;
            }
        }
        return rtn;
    }

    /**返回指定ID活动内指定index活动是否满足购买条件*/
    public getisCanBuyXianGouItem(actId: string, itemId: number): boolean {
        let rtn: boolean = false;
        let activityData: PActivityType2Data = PActivity.ins().activityData[actId] as PActivityType2Data;
        let configList: PActivity2Config[] = GlobalConfig.PActivity2Config[actId];
        if (activityData && configList) {
            let config: PActivity2Config = configList[itemId];

            let buyData: number = activityData.buyData[itemId] || 0;
            if (config && buyData) {
                let myMoney = (config.currencyType == 1 ? Actor.gold : Actor.yb);
                let a: boolean = (config.currencyType == 1);
                let b: boolean = (myMoney >= config.price);
                let c: boolean = (config.count - buyData > 0);
                rtn = a && b && c;
            }
        }
        return rtn;
    }

    /**
     * 判定是否在合服寻宝期间
     * @param 活动Id
     * */
    public IsHefuXunBaoTimer() {
        if (!GameServer._serverHeZeroTime)
            return false;//没合服

        let startTime = DateUtils.formatMiniDateTime(GameServer._serverHeZeroTime);//合服0点那天起
        let endTime = startTime + GlobalConfig.TreasureHuntConfig.hefuDay * 24 * 60 * 60 * 1000;
        let curTime = GameServer.serverTime;
        if (curTime >= startTime && curTime <= endTime) {
            return true;
        }
        return false;
    }

    /**
     * 判断某个积分页签下是否有可兑换
     * @param 页签转数
     * 此处ActivityType7Config应改成PActivityType7Config 区分个人活动数据
     **/
    public IsBossScoreTitle(id: number, title: number) {
        // let actconfig: ActivityType7Config[] = GlobalConfig.ActivityType7Config[id];
        // let actdata:ActivityType7Data = Activity.ins().getActivityDataById(id) as ActivityType7Data;
        // for (let k in actconfig) {
        //     let cfg: ActivityType7Config = actconfig[k];
        //     if (cfg.title == title) {
        //         if (this.getIsBuy(cfg) && actdata.bossScore >= cfg.score) {
        //             return true;
        //         }
        //     }
        // }
        return false;
    }
    //同上
    public getIsBuy(config: ActivityType7Config) {
        if (config) {
            let activityData: ActivityType7Data = Activity.ins().getActivityDataById(config.Id) as ActivityType7Data;
            if (config.count && activityData.personalRewardsSum[config.index] >= config.count) {
                return false;
            }
            if (config.scount && activityData.worldRewardsSum[config.index] >= config.scount) {
                return false;
            }
            return true;
        }
    }

    public getType7RedPoint(activityID: number) {
        let itemData: ItemData
        let config: ActivityType7Config[] = GlobalConfig.ActivityType7Config[activityID];
        let actdata:ActivityType7Data = Activity.ins().getActivityDataById(activityID) as ActivityType7Data;
        for (let i in config) {
            if (Activity.ins().getIsBuy(config[i]))
            {
                if (config[i].itemId)
                {
                    itemData = UserBag.ins().getBagItemById(config[i].itemId);
                    if (itemData && itemData.count >= config[i].itemCount)
                        return true;
                }
                else if (actdata.bossScore >= config[i].score)
                    return true;
            }
        }

        return false;
    }

    public getCurrentRingAwardIndex(record: number): number {
        let index = 1;
        if (record > 0) {
            while ((record >> index & 1) != 0) {
                index++;
            }
        }
        return index;
    }

    public getRingAward(index: number): ActivityType8Config {
        for (let i in GlobalConfig.ActivityType8Config) {
            let cfg: ActivityType8Config = GlobalConfig.ActivityType8Config[i][1];
            if (cfg.showType == ActivityType8Data.TYPE_RING) {//火焰戒指收费副本ID
                for (let j in GlobalConfig.ActivityType8Config[i]) {
                    if (j == index.toString()) {
                        return GlobalConfig.ActivityType8Config[i][j];
                    }
                }
            }
        }
        return null;
    }

    /**
     * 获取烈焰收费副本最后奖励
     * @returns {ActivityType8Config}
     */
    public getLastRingAward(): ActivityType8Config {
        let lastCfg: ActivityType8Config;
        for (let i in GlobalConfig.ActivityType8Config) {
            let cfg: ActivityType8Config = GlobalConfig.ActivityType8Config[i][1];
            if (cfg.showType == ActivityType8Data.TYPE_RING) {//火焰戒指收费副本ID
                for (let j in GlobalConfig.ActivityType8Config[i]) {
                        lastCfg =  GlobalConfig.ActivityType8Config[i][j];
                }
            }
        }
        return lastCfg;
    }

    /**
     * 挑战烈焰副本时候添加事件监听，退出副本要重新打开挑战页面
     */
    public addEvent(): void {
        MessageCenter.addListener(GameLogic.ins().postEnterMap, this.openRingActivity, this);
    }

    /**
     * 挑战失败不打开挑战页面，移除事件监听
     */
    public removeEvent(): void {
        MessageCenter.ins().removeListener(GameLogic.ins().postEnterMap['funcallname'], this.openRingActivity, this);
    }

    public openRingActivity(): void {
        if (GameMap.fbType == 0) {
            MessageCenter.ins().removeListener(GameLogic.ins().postEnterMap['funcallname'], this.openRingActivity, this);
            ViewManager.ins().open(ActivityWin, 201);
            Activity.ins().sendChangePage(201);
        }
    }

    public getType8RedPoint(activityID: number): boolean {
        let isRedPoint = false;
        let data: ActivityType8Data = Activity.ins().activityData[activityID] as ActivityType8Data;
        if (data && data.record == 0) {
            isRedPoint = true;
        }
        return isRedPoint;
    }

    public getType9RedPoint(activityID: number): boolean {
        let isRedPoint = false;
        let data: PActivityType9Data = PActivity.ins().activityData[activityID] as PActivityType9Data;
        if (this.getRollSum(activityID)) {
            //是否有抽奖卷
            isRedPoint = true;
        }else{
            //是否有抽奖次数可领取判断
            let config:PActivity9Config[] = GlobalConfig.PActivityType9Config[activityID];
            for( let i in config[0].reward ){
                //达到抽奖次数 并且未领取  抽奖次数奖励位第二位开始
                if( this.isGetRollReward(activityID,+i) ){
                    isRedPoint = true;
                    break;
                }
            }
        }
        return isRedPoint;
    }

    public getType10RedPoint(activityID: number): boolean{
        let data: ActivityType10Data = Activity.ins().activityData[activityID] as ActivityType10Data;
        let config:ActivityType10Config = GlobalConfig.ActivityType10Config[activityID][data.getLevel()];
        if( !config )
            return false;
        if( data.yb >= config.recharge && Actor.yb >= config.yuanBao )
            return true;
        return false;
    }
    
     public getType17RedPoint(activityID: number): boolean{
        let data: ActivityType17Data = Activity.ins().activityData[activityID] as ActivityType17Data;
        let config:ActivityType17_2Config = GlobalConfig.ActivityType17_2Config[activityID];
        if( !config )
            return false;
        if( data.score >= config.score )
            return true;
        return false;
    }
    
    /**
     * 是否达到抽奖次数 并且未领取
     * @param 活动id
     * @param 领取的抽奖次数索引
     * */
    public isGetRollReward(activityID:number,id:number){
        let data: PActivityType9Data = PActivity.ins().activityData[activityID] as PActivityType9Data;
        let config:PActivity9Config[] = GlobalConfig.PActivityType9Config[activityID];
        if( config && config[0] ){
            if( config[0].reward[id].times && data.count >= config[0].reward[id].times && !(data.record >> (id+1) & 1) ){
                return true;
            }
        }
        return false;
    }
    /**是否有抽奖卷*/
    public getRollSum(activityID:number):boolean{
        let config:PActivity9Config[] = GlobalConfig.PActivityType9Config[activityID];
        if( config && config[0] ){
            let itemData: ItemData = UserBag.ins().getBagItemById(config[0].item);
            if( itemData ){
                return true;
            }
        }
        return false;
    }

    /**判断是否10连抽*/
    public getIsRollTen(activityID:number){
        let config:PActivity9Config = GlobalConfig.PActivityType9Config[activityID][0];
        if( config ){
            let sum:number = 0;
            if( config.item ){
                let item:ItemData = UserBag.ins().getBagItemById(config.item);
                if( item ){
                    sum += item.count;
                }
                if( sum >= 10 )
                    return true;
            }
            sum = 10 - sum;
            if( config.yb ){
                if( Actor.yb >= config.yb*sum )
                    return true;
            }
        }
        return false;
    }
}


class PDabiaoData {
    public rankIndex: number;//名次
    public id: number;//玩家id
    public name: string;//名字
    public level: number;//等级
    public zsLevel: number;//转生等级
    public monthCard: number;//月卡标识
    public vipLv: number;//vip等级
    /**
     * 0--战力排行榜  表示战力
     * 5 等级  表示等级
     * 6 翅膀  翅膀等级
     * 7 战士     战士战力
     * 8 法师  法师战力
     * 9 道士  道士战力
     * 12 宝石  宝石等级
     * 13 战灵 int 战灵阶 int 战灵星
     * 14 龙魂 int 龙魂总等级
     */
    public numType: any;

    public prase(bytes: GameByteArray, rankType: number): void {

        if (rankType == RankDataType.TYPE_XIAOFEI || rankType == RankDataType.TYPE_HF_XIAOFEI) {
            this.rankIndex = bytes.readShort();
            this.id = bytes.readInt();
            this.name = bytes.readString();
            this.numType = bytes.readInt();
            return;
        }

        this.rankIndex = bytes.readShort();
        this.id = bytes.readInt();
        this.name = bytes.readString();
        this.level = bytes.readShort();
        this.zsLevel = bytes.readShort();
        this.monthCard = bytes.readShort();
        this.vipLv = bytes.readShort();

        if (RankDataType.TYPE_LEVEL != rankType) {
            if (rankType == RankDataType.TYPE_BAOSHI || rankType == RankDataType.TYPE_LONGHUN) {
                this.numType = bytes.readInt();
            } else if (rankType == RankDataType.TYPE_ZHANLING) {
                let zj: number = bytes.readInt();
                let zx: number = bytes.readInt();
                this.numType = [zj, zx];
            } else {
                this.numType = bytes.readDouble();
            }
        }
    }
}

namespace GameSystem {
    export let pactivity = PActivity.ins.bind(PActivity);
}