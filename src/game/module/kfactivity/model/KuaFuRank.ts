/**
 * 跨服消费榜数据
 */
class KuaFuRankData{
    public actorId: number;//玩家id
    public rmb: number;//消费元宝数量
    public rank: number;//排名
    public serverId: number;//serverId
    public roleName: string;//角色名字
    public job: number;//职业
    public sex: number;//性别
    constructor() {
        this.actorId = 0;
        this.rmb = 0;
        this.rank = 0;
        this.serverId = 0;
        this.roleName = "";
        this.job = 0;
        this.sex = 0;
    }
}
