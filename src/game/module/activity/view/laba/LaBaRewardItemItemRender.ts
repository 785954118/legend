/** 腊八奖励排名控件 */
class LaBaRewardItemItemRender extends BaseItemRender{
	private ranks:eui.Label;
	private rewardList:eui.List;
	public constructor() {
		super();
		//this.skinName = "LaBaBossPlayerRankSkin";
	}

	public childrenCreated():void{
		super.childrenCreated();
		this.rewardList.itemRenderer = ItemBase;
	}

	public dataChanged():void{
		if( !this.data )return;
		let config = this.data.config as ActivityType20Config;
		let index = this.data.index;
		let show:{start:number,endi:number,head:string,context:string,reward:{type:number,id:number,count:number}[]} = config.rankReward[index];
		let rank = "";
		if( index == config.rankReward.length-1 ){
			rank = "其他名次";
		}
		else if( show.start == show.endi ){
			rank = `第${show.start}名`;
		}else{
			rank = `第${show.start}-${show.endi}名`;
		}
		this.ranks.text = rank;
		this.rewardList.dataProvider = new eui.ArrayCollection(show.reward);
	}

	public destruct(): void {

	}
}