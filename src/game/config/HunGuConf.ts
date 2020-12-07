/**
 * 魂骨基础配置
 */
class HunGuConf {
	public openzhuanshenglv: number = 0;//开启转生等级
	public openserverday: number = 0;//开启天数(第几天开启)
	public showzhuanshenglv:number = 0;//提前展示页签转生等级限制
	public equipCount: number = 0;//装备部位数
	public hunyuCount: number = 0;//部位魂玉数
	public suit: any;//共鸣种类{[0]={},[1]={0,1},[2]={2,3,4,5,6,7}}
	//部位对应的魂玉种类，第几个部位，魂玉的种类
	// {[0]={3,3,3,3,3},[1]={3,3,3,3,3},[2]={1,2,1,2,3},[3]={2,1,2,1,3},[4]={1,2,1,2,3},[5]={2,1,2,1,3},[6]={1,2,1,2,3},[7]={2,1,2,1,3}}
	public hunyuType: any;
	public unlockCost: any;//激活魂玉的消耗，第几个孔，对应消耗元宝数量 {[1]=1000,[2]=2000,[3]=3000,[4]=4000,[5]=5000}
	public gainItemId:number;//界面获取魂骨索引道具id
	public canFenjieItem:number[];//可额外分解的物品列表
	public hunguName:string[];//部位名称
	public suitName:any;//魂骨共鸣名字
	/** 魂兽副本每天奖励次数 */
	public dayRewardCount:number;
	/** 魂兽副本 扫荡开启关卡 */
	public sweepLayer:number;
	/** 魂兽副本 开启天数（开服第几天开启） */
	public fbOpenDay:number;
	/** 魂兽副本开启转生等级 */
	public needZsLv:number;
	/** 提前展示魂兽副本页签转生等级限制 */
	public showZsLv:number;
}
