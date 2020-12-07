/**
 * 
 */
class QHBItem extends eui.ItemRenderer {
	


	public constructor() {
		super();
	}

	private labelInfo: eui.Label;
	private yuanbaoImg: eui.Image;

	public dataChanged() {
		if (this.data == "") {
			this.labelInfo.text = "";
			return;
		}
		let str =  "|C:0x05B4C7&T:" + this.data.name + "|" +' 抢到了 '+"|C:0xECAA36&T:" + this.data.yuanbao + "|"
		
		this.labelInfo.textFlow = TextFlowMaker.generateTextFlow1(str);
		this.yuanbaoImg.x = this.labelInfo.width;
	}
}