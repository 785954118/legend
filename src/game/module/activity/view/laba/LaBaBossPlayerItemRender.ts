/** 腊八伤害排名控件 */
class LaBaBossPlayerItemRender extends BaseItemRender{
	private rank:eui.Label;
	private name1:eui.Label;
	private hurt:eui.Label;
	public constructor() {
		super();
		this.skinName = "LaBaBossPlayerRankSkin";
	}

	public childrenCreated():void{
		super.childrenCreated();

	}

	public dataChanged():void{
		if( !this.data )return;
		this.rank.text = this.data.rank + "";
		this.rank.visible = this.data.rank?true:false;
		this.name1.text = this.data.name;
		CommonUtils.labelIsOverLenght(this.hurt, this.data.damage);
	}

	public destruct(): void {

	}
}