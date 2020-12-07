/**
 * 活动19-1控件
 */
class KfCostRankItemRender extends BaseItemRender {
	private pos:eui.Label;
	private player:eui.Label;
	private value:eui.Label;

	constructor() {
		super();
		this.skinName = 'ISCostRankItemSkin';
		this.init();
	}

	protected init(): void {
		this.addEventListener(egret.TouchEvent.TOUCH_END, this.onClick, this);

	}
	/**触摸事件 */
	public onClick(e:egret.Event) {

	}
	protected dataChanged(): void {
		if( this.data && (this.data instanceof  KuaFuRankData) ){
			this.pos.text = this.data.rank + "" ;
			let serverName = window['getServerName'](this.data.serverId)
			this.player.text = `[${serverName}].`+this.data.roleName;
			this.value.text = `已消费：${this.data.rmb}`;
		}
	}




}