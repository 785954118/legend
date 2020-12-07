/**
 * 魂骨装备配置
 */
class HunGuEquip {
	public id: number = 0;//装备id
	public stage: number = 0;//阶级
	public attrs: {type:number,value:number}[];//装备属性
	public expower:number;//额外战力
	public hunyuNum:number;//孔的数量
	public addStageCost:{type:number,id:number,count:number}[];//升阶消耗
	public nextId:number;//升阶后id
}
