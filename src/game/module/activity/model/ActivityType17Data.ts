/**
 * 类型17活动数据(幸运转盘)
 * Created by MPeter 2017/12/17
 */
class ActivityType17Data extends ActivityBaseData {
    /**日志公告 */
    public noticeArr: { name: string, index: number }[] = [];
    
    /**激活星星标记 */
    public actStar: number[] = [];
    /**当前积分 */
    public score: number;
    /**当前充值金额 */
    public curRecharge: number;
    /**剩余天数 */
    public overDay: number;

    //中奖标记位
    public recrod: number;
    /**奖励索引 从1开始 */
    public awardIndex:number = 0;

    constructor(bytes: GameByteArray) {
        super(bytes);

        let num: number = bytes.readShort();
        for (let i: number = 1; i <= num; i++) {
            this.actStar[i] = bytes.readShort();
        }

        let len = bytes.readShort();
        this.noticeArr = [];
        for (let i = 0; i < len; i++) {
            this.noticeArr.push({ name: bytes.readString(), index: bytes.readByte() })
        }
        this.noticeArr.reverse();

        this.score = bytes.readInt();
        this.curRecharge = bytes.readInt();
        this.overDay = bytes.readInt();
        this.recrod = bytes.readInt();
    }

    public update(bytes: GameByteArray): void {
        //奖励序号
        this.awardIndex = bytes.readShort();
        //奖励位
        this.recrod = bytes.readInt();
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

    //判断红点
    public checkRedPoint(): boolean {
        return Activity.ins().getType17RedPoint(this.id);
    }


}

