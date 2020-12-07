class ChatSystemItemRenderer extends BaseItemRender {

	public str:eui.Label;
	public type:eui.Image;

	public constructor() {
		super();
		this.skinName = "SysMesItemSkin";
	}

	public dataChanged(): void {
		// this.type.source = "lt_0"+this.data.type;
		let str = this.data.str;
		

		if(this.data.type == 1)
		{
			this.str.textFlow = TextFlowMaker.generateTextFlow("|C:0xFD2F2F&T:"+this.data.str+"|");
			this.type.source = "lt_01";
		}else{
			this.str.textFlow = TextFlowMaker.generateTextFlow(this.data.str);
			this.type.source = "lt_02";
		}
		this.height = Math.ceil( (this.str.text.length/26))*20 > 44?Math.ceil( (this.str.text.length/26))*20:44;
	}
}