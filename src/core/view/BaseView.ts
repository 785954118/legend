//显示基类,用于增加一些显示相关的共有函数
class BaseView extends eui.Component {

	/**
	 * 监听事件
	 * @param {Function} func 监听的事件标记
	 * @param {Function} myfunc 监听响应的函数
	 * @param callobj 是否立刻执行响应函数一次
	 */
	public observe(func: Function, myfunc: Function, callobj: any = undefined) {
		MessageCenter.addListener(func, myfunc, this, callobj);
	}

	public removeObserve() {
		MessageCenter.ins().removeAll(this);
	}

	public addTouchEvent(obj: any, func: Function) {
		this.addEvent(egret.TouchEvent.TOUCH_TAP, obj, func);
	}

	public addTouchEndEvent(obj: any, func: Function) {
		this.addEvent(egret.TouchEvent.TOUCH_END, obj, func);
	}

	public addChangeEvent(obj: any, func: Function) {
		if (obj && obj instanceof eui.TabBar) {
			this.addEvent(egret.TouchEvent.CHANGE, obj, (...param) => {
				SoundUtil.ins().playEffect(SoundUtil.WINDOW);
				func.call(this, ...param);
			});
		} else {
			this.addEvent(egret.TouchEvent.CHANGE, obj, func);
		}
	}

	public addChangingEvent(obj: any, func: Function) {
		this.addEvent(egret.TouchEvent.CHANGING, obj, func);
	}

	public addEvent(ev: string, obj: any, func: Function) {
		if (!obj) {//Assert(obj, "不存在绑定对象")
			console.error(`不存在绑定对象`);
			return;
		}
		obj.addEventListener(ev, func, this);
	}

	public removeTouchEvent(obj: any, func: Function) {
		if (obj) obj.removeEventListener(egret.TouchEvent.TOUCH_TAP, func, this);
	}

	public $onClose() {

		let fun = function (tar: egret.DisplayObjectContainer) {
			for (let i: number = 0; i < tar.numChildren; i++) {
				let obj = tar.getChildAt(i);
				if (obj instanceof BaseView) {
					(<BaseView>obj).$onClose();
				} else if (obj instanceof egret.DisplayObjectContainer) {
					fun(obj);
				}
			}
		};

		fun(this);

		this.removeObserve();
	}
}