class HunguGroupItem extends BaseItemRender {
	private qualityName:eui.Label;
	private posName:eui.Label;
	//suit0~suitN
	public constructor() {
		super();
		this.skinName = 'hunguGroupItemSkin';

	}

	protected dataChanged(): void {
		if (!this.data)
			return;
		this.qualityName.textFlow = TextFlowMaker.generateTextFlow1(this.data.qualityName);
		this.posName.textFlow = TextFlowMaker.generateTextFlow1(this.data.posName);
		for( let i = 0;i < 3;i++ ){
			if( this[`suit${i}`] && this.data.suits[i])
				this[`suit${i}`].textFlow = TextFlowMaker.generateTextFlow1(this.data.suits[i]);
			else
				DisplayUtils.removeFromParent(this[`suit${i}`]);//特殊魂骨没有3个组件
		}
	}


}

