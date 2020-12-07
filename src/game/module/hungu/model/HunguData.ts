/**
 * 魂骨数据
 */
class HunguData {
	private _items:HungguItems[];
	constructor() {
		// this._items = [];
		// for( let i = 0; i < GlobalConfig.HunGuConf.equipCount;i++ ){
		// 	let hgi:HungguItems = new HungguItems();
		// 	this._items.push(hgi);
		// }
	}
	public get items():HungguItems[]{
		if( !this._items ){
			this._items = [];
			for( let i = 0; i < GlobalConfig.HunGuConf.equipCount;i++ ){
				let hgi:HungguItems = new HungguItems();
				this._items.push(hgi);
			}
		}
		return this._items;
	}
	public set items(its:HungguItems[]){
		this._items = its;
	}
}
/**魂骨装备*/
class HungguItems{
	public itemId:number;
	public hunyu:number[];
	constructor() {
		this.itemId = 0;
		this.hunyu = [];
		for( let i = 0;i < GlobalConfig.HunGuConf.hunyuCount;i++ ){
			this.hunyu.push(0);
		}
	}
}

/**魂骨装备部位索引*/
enum HGPOS{
	ITEM0 = 0,
	ITEM1 = 1,
	ITEM2 = 2,
	ITEM3 = 3,
	ITEM4 = 4,
	ITEM5 = 5,
	ITEM6 = 6,
	ITEM7 = 7,
}
