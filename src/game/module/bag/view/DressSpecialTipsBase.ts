/**
 * 时装特殊属性
 */
class DressSpecialTipsBase extends BaseView{
	public attrType:eui.Label;
	public desc1:eui.Group;
	public suit:eui.Label;

	public constructor() {
		super();
		this.skinName = "DressSpecialAttrSkin";
	}
	public setData(data:any): void {
		this.clear();
		if(data == null)return;
		let title:string = data.title;
		let attrDesc: string = data.attrDesc;

		this.attrType.textFlow = TextFlowMaker.generateTextFlow1(title);
		this.suit.textFlow = TextFlowMaker.generateTextFlow1(attrDesc);
	}
	private clear(): void{
		this.attrType.textFlow = null;
		this.suit.textFlow = null;
	}
}