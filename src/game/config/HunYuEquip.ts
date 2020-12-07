/**
 * 魂玉配置
 */
class HunYuEquip {
	public id: number = 0;//开服多久开启
	public level: number = 0;//转生等级限制
	public cost: {type:number,id:number,count:number};//消耗
	public attrs: {type:number,value:number}[];//装备属性
	public expower:number;
	public icon:string;
	public name:string;
}
