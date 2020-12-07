/**
 * 跨服排行榜奖励
 */
class KfRankRewardPanel extends BaseComponent {
	/**剩余时间 */
	public actTime: eui.Label;
	private _time:number = 0;
	/**说明*/
	public actInfo:eui.Label;

	private activityID:number;
	private list:eui.List;
	private listdata:eui.ArrayCollection;
	constructor() {
		super();
		// this.skinName = "ISCostRewardSkin";
	}

	protected childrenCreated() {

	}
	public close(){
		this.removeObserve();
		TimerManager.ins().removeAll(this);
	}
	public open(...param: any[]): void {
		// this.observe(Activity.ins().postKuaFuRank, this.updateData);
		this.activityID = param[0];
		this.list.itemRenderer = KfCostRankRewardItemRender;
		this.listdata = new eui.ArrayCollection;
		this.list.dataProvider = this.listdata;
		this.updateData();
	}

	/**更新数据 */
	public updateData(): void {
		let actData: ActivityType19Data = Activity.ins().activityData[this.activityID] as ActivityType19Data;
		if( !actData )return;
		let config: ActivityType19Config[] = GlobalConfig.ActivityType19Config[this.activityID];
		// let rankList:KuaFuRankData[] = KuaFuRank.ins().GetRankList();
		let arr:{rank:string;desc:string;rewards:{type:number,id:number,count:number}[]}[] = [];
		for( let k in config ){
			let rank:string = "";
			rank = (config[k].range[0] == config[k].range[1])?`${config[k].range[0]}`:`${config[k].range[0]}-${config[k].range[1]}`;
			let desc = config[k].condition?`（消费≥${config[k].condition}元宝即可参与本排行）`:"";
			let rewards:{type:number,id:number,count:number}[] = config[k].rewards;
			let arrdata:{rank:string;desc:string;rewards:{type:number,id:number,count:number}[]} = {
				rank:rank,
				desc:desc,
				rewards:rewards
			};
			arr.push(arrdata);
		}
		this.listdata.replaceAll(arr);
		this._time = actData.getleftTime();

		let scro = this.list.parent as eui.Scroller;
		scro.stopAnimation();
		this.list.scrollV = 0;

		this.setTime();

		let actConfig:ActivityConfig = GlobalConfig.ActivityConfig[this.activityID];
		this.actInfo.textFlow = TextFlowMaker.generateTextFlow1(`${actConfig.desc}`);
	}

	public setTime(){
		if(this._time > 0) {
			this._time -= 1;
			this.actTime.text = DateUtils.getFormatBySecond(this._time, DateUtils.TIME_FORMAT_5, 3);
		}
	}

}
