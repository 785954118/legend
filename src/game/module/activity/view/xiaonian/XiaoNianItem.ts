/**
 * 红包界面控件类
 */
class XiaoNianItem extends BaseItemRender {
	constructor() {
		super();
		this.skinName = 'XNHongBaoItem';
	}
	protected childrenCreated(): void {
		super.childrenCreated();

	}

	protected dataChanged(): void {
		if( !this.data )return;
		this.currentState = this.data;
	}

	public destruct(): void {

	}


}