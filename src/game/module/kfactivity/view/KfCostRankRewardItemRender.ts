/**
 * 活动19-1奖励控件
 */
class KfCostRankRewardItemRender extends BaseItemRender {
	private pos:eui.Label;
	private need:eui.Label;
	private reward:eui.List;

	constructor() {
		super();
		this.skinName = 'ISCostRewardItemSkin';
		this.init();
	}

	protected init(): void {
		// this.addEventListener(egret.TouchEvent.TOUCH_END, this.onClick, this);
		this.reward.itemRenderer = ItemBase;
	}
	/**触摸事件 */
	public onClick(e:egret.Event) {

	}
	protected dataChanged(): void {
		if( !this.data )return;
		let data:{rank:string;desc:string;rewards:{type:number,id:number,count:number}[]} = this.data;
		this.pos.text = data.rank+"";
		this.need.text = data.desc;
		this.reward.dataProvider = new eui.ArrayCollection(data.rewards);
	}




}