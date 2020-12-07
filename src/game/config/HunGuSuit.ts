/**
 * 魂骨套装配置
 */
class HunGuSuit {
	public id: number = 0;//开服多久开启
	public count: number = 0;//个数
	public stage: number = 0;//阶
	public attrs:{type:number,value:number}[];//属性
	public expower:number = 0;//额外战力
	public specialAttrs:number = 0;// 特殊属性万分比
	public dec:string;//属性描述
	public effectId:number;//套件特效id
}
