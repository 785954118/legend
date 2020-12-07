/**
 * 送鲜花记录子项
 * @author wanghengshuai
 * 
 */
class FlowerRewardItemRender extends BaseItemRender{
	
	public playerName:eui.Label;
	public flowerCount:eui.Label;

	public constructor() {
		super();
		this.skinName = "flowerRewardItem";
	}

	public dataChanged():void
	{
		//source:{roleName:string, count:number}
		this.playerName.text = this.data.roleName;
		this.flowerCount.textFlow = TextFlowMaker.generateTextFlow(`被你的魅力折服，送上了|C:${0x00FF00}&T:【${this.data.count}】|朵泣血神花`);
	}
}