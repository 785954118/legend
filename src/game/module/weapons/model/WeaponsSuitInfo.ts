/**
 * WeaponsSuitInfo
 * 当前角色使用的套装
 */
class WeaponsSuitInfo {
	public id:number;//兵魂id
	public level:number;//套装等级
	public attr:{};//属性
	public ex_attr:{};//扩展属性
	constructor() {
		this.id       = 0;
		this.level    = 0;
		this.attr 	  = {};
		this.ex_attr  = {};
	}

	public setInfo(id:number){

	}

}