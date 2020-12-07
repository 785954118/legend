/**
 * 跨服排行榜
 */
class KfRankPanel extends BaseComponent {

	/**剩余时间 */
	public actTime: eui.Label;
	/**说明*/
	public actInfo:eui.Label;

	//playName0~2
	//recharge0~2
	//rank0~2
	private list:eui.List;
	private listdata:eui.ArrayCollection;
	private myNumber:eui.Label;
	private myRanking:eui.Label;

	private activityID:number;
	private _time:number = 0;
	private actorIds:{actorId:number;serverId:number}[];
	private rechargeBtn:eui.Button;
	constructor() {
		super();
		// this.skinName = "ISCostRankSkin";
		this.actorIds = [];
	}

	protected childrenCreated() {

	}

	public close(){
		this.removeObserve();
		TimerManager.ins().removeAll(this);
	}

	public open(...param: any[]): void {
		this.observe(Activity.ins().postKuaFuRank, this.updateData);
		this.observe(UserReadPlayer.ins().postPlayerResult, this.openOtherPlayerView);
		this.addTouchEvent(this.rechargeBtn,this.onClick);
		TimerManager.ins().doTimer(1000,0,this.setTime,this);
		this.activityID = param[0];
		this.list.itemRenderer = KfCostRankItemRender;
		this.listdata = new eui.ArrayCollection();
		this.list.dataProvider = this.listdata;
		Activity.ins().sendKuaFuRank(this.activityID)//请求跨服排行榜数据

	}
	private onClick(e:egret.TouchEvent){
		switch ( e.currentTarget ){
			case this.rechargeBtn:
				ViewManager.ins().open(Recharge1Win);
				break;
		}
	}
	/**更新数据 */
	public updateData(): void {
		let actData: ActivityType19Data = Activity.ins().activityData[this.activityID] as ActivityType19Data;
		if( !actData )return;
		// let config: ActivityType19Config[] = GlobalConfig.ActivityType19Config[this.activityID];
		let rankList:KuaFuRankData[] = actData.GetRankList();
		if( rankList.length ){
			this.currentState = "normal";
		}else{
			//没人上榜
			this.currentState = "none";
		}
		this.validateNow();

		this.myNumber.text = actData.mycost + "";
		this.myRanking.text = "未上榜";

		if( this.currentState == "none" ){
			return;
		}

		let otherPlayerDatas:KuaFuRankData[] = [];
		let len = rankList.length > 3?rankList.length:3;
		this.actorIds = [];
		let myRank = 0;
		for( let i = 0;i < len;i++ ){
			let kfdata:KuaFuRankData = rankList[i];
			if( i < 3 ){
				if( kfdata && kfdata.actorId ){
					let actD:{actorId:number;serverId:number} = {
						actorId:kfdata.actorId,
						serverId:kfdata.serverId
					}
					this.actorIds.push(actD);
					let serverName = window['getServerName'](kfdata.serverId)
					this[`playName${i}`].text = `[${serverName}].` + kfdata.roleName;
					this[`recharge${i}`].text = `已消费：${kfdata.rmb}`;
					this[`playName${i}`].visible = this[`recharge${i}`].visible = true;
				}else{
					let actD:{actorId:number;serverId:number} = {
						actorId:0,
						serverId:0					}
					this.actorIds.push(actD);
					this[`playName${i}`].visible = this[`recharge${i}`].visible = false;
				}
				//初始化前三装扮空间
				this[`rank${i}`].data = null;

			}else{
				if( kfdata )
					otherPlayerDatas.push(kfdata);
			}
			if( kfdata && Actor.actorID == kfdata.actorId )
				myRank = kfdata.rank;
		}
		//请求前三穿戴情况
		for( let r = 0;r < this.actorIds.length;r++ ){
			if( this.actorIds[r] && this.actorIds[r].actorId ){
				UserReadPlayer.ins().sendFindPlayer(this.actorIds[r].actorId,this.actorIds[r].serverId);
			}
		}
		this.listdata.replaceAll(otherPlayerDatas);
		this._time = actData.getleftTime();

		this.myNumber.text = actData.mycost + "";
		this.myRanking.text = myRank?myRank+"":"未上榜";

		let scro = this.list.parent as eui.Scroller;
		scro.stopAnimation();
		this.list.scrollV = 0;

		this.setTime();

	}

	public setTime(){
		if(this._time > 0) {
			this._time -= 1;
			this.actTime.text = DateUtils.getFormatBySecond(this._time, DateUtils.TIME_FORMAT_5, 3);
		}
	}
	/**
	 * 查看角色界面
	 */
	private openOtherPlayerView(otherPlayerData:OtherPlayerData) {
		if (otherPlayerData) {
			for( let i = 0;i < this.actorIds.length;i++ ){
				if( this.actorIds[i].actorId == otherPlayerData.id )
					this[`rank${i}`].data = {otherPlayerData:otherPlayerData};
			}
		}
	}

}
