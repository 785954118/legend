/**
 *
 * @author 
 *
 */
class GainGoodsItem1 extends BaseItemRender{
	private desc: eui.Label;
	
	private newData:BreakDownListItemData;
	constructor() {
		   super();
		this.skinName = "GainGoodsItemSkin";
	}
	
	protected dataChanged(): void {
		let newData: BreakDownListItemData = this.data;
		this.desc.text = newData.str;
		// if(arr instanceof Array) {
		// 	this.desc.text = arr[0];
		// 	this.openId = arr[1][0];
		// 	if(arr[1].length > 1)
		// 		this.openPage = arr[1][1];
		// }
	}

	public get userData():BreakDownListItemData
	{
		return this.data as BreakDownListItemData;
	}
}
