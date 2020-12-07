/**基本UI，用于策划拼接通用组件 此基类复制逻辑类方法和属性
 * 不能复制get set 方法，有这些方法的类要改写get set方法
 * @see RoleInfoPanel
*/
class BaseComponent extends BaseView {
	public className: string = "@策划@使用此组件必须填写逻辑类名";

	protected static filterKeys: string[] = ["data"];

	protected static copyKeys: string[] = ["open", "close"];

	public constructor() {
		super();
	}

	// /**组件实例完成 className（如果组件没有绑定逻辑类，将会报错）*/
	// protected childrenCreated(): void {
	// 	try {
	// 		let cls = eval(this.className);
	// 		let obj = new cls();
	// 		if (obj != null) {
	// 			for (let key in obj) {
	// 				if ((this[key] == null || BaseComponent.copyKeys.indexOf(key) != -1) &&
	// 					BaseComponent.filterKeys.indexOf(key) == -1) {
	// 					this[key] = obj[key];
	// 				}
	// 			}
	// 		}
	// 		// var cls = eval(this.className);
	// 		// let p = cls.prototype;
	// 		// let keys = Object.keys(p);
	// 		// for (let name of keys) {
	// 		// 	// let obj = new cls();
	// 		// 	if (this[name] == null) {
	// 		// 		this[name] = cls.prototype[name];
	// 		// 	}
	// 		// }
	// 		if (this["init"]) {
	// 			this["init"]();
	// 		}
	// 	} catch (error) {
	// 		//如果出现此错误，说明资源里面有使用了BaseComponent组件，但组件没有绑定相应的类，解决：在资源里面搜索<ns1:XXXXXX（XXXXXX为出错的类），找到然后在源码界面对
	// 		//应行上写上对应的类名,className="XXXXXX" 即可
	// 		debug.log(`######错误！！！className为空，出错逻辑类为：<ns1:${egret.getQualifiedClassName(this)}，请查看资源里面的BaseComponent组件是否有未绑定的逻辑类`);
	// 	}
	// }

	public open(...param: any[]): void {

	}

	public close(...param: any[]): void {

	}
	public get data(): any {
		return this["_data"];
	}
	//为了适配 render类型
	public set data(value) {
		this["_data"] = value;
		eui.PropertyEvent.dispatchPropertyEvent(this, eui.PropertyEvent.PROPERTY_CHANGE, "data");
		if (this["dataChanged"])
			this["dataChanged"]();
	}
}