/**
 * 七天登录格子
 */
class SevenDayLogItem extends BaseItemRender {
	public static ChineseNum: string[] = ["零","一","二","三","四","五","六","七","八","九"];
	private sureBtn: eui.Button;
	private sureImg: eui.Image;
	private dayTxt: eui.Label;
	private awardsList: eui.List;
	public day:number = 0;
	public state:number = 0;
	constructor() {
		   super();
		this.skinName = 'SevenDayLogItemSkin';
		this.awardsList.itemRenderer = ItemBase;
	}
	
	protected dataChanged(): void {
		let data: LoginRewardsConfig = this.data as LoginRewardsConfig;
		if(data) {
			this.day = data.day;
			this.dayTxt.text = "第" + SevenDayLogItem.ChineseNum[this.day] + "天";
			if(Activity.ins().dayNum >= this.day){
				if(this.getRemindByIndex(this.day)){
					this.sureBtn.visible = false;
					this.sureImg.visible = true;
				}else{
					this.sureBtn.visible = true;
					this.sureImg.visible = false;
				}
			}else{
				this.sureBtn.visible = false;
				this.sureImg.visible = false;
			}
			this.awardsList.dataProvider = new eui.ArrayCollection(data.rewards);
		}
	}

	private getRemindByIndex(index: number): boolean {
		return ((Activity.ins().isAwards >> index) & 1) == 1;
	}

}
