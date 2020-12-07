/**
 * 红包开启后展示列表控件
 */
class HongBaoRewardsItem extends BaseItemRender {
	private myFace:eui.Image;
	private playerName:eui.Label;
	private speaktxt:eui.Label;
	constructor() {
		super();
		this.skinName = 'hongbaoRewardItem';
	}
	protected childrenCreated(): void {
		super.childrenCreated();
	}

	protected dataChanged(): void {
		if( !this.data )return;
		let yb = this.data.yb;
		let gold = this.data.gold;
		let money = `${yb}`;
		let text = "";
		if( !this.itemIndex && this.data.name == Actor.myName ){
			this.currentState = "owner";
			text = "手气爆炸，在红包里抢到了";
		}else{
			this.currentState = "otherman";
			text = `在红包里抢到了`;
		}
		if( gold ){
			money = CommonUtils.overLength(gold);
			text += money+"金币";
		}else{
			text += money+"元宝";
		}
		this.validateNow();
		this.speaktxt.text = text;
		this.myFace.source = `yuanhead${this.data.job}${this.data.sex}`;
		this.playerName.text = this.data.name;
	}

	public destruct(): void {

	}


}