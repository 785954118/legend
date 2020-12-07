/**
 * 多日连充
 */
class OSATarget0Panel4 extends BaseView {
	private title: eui.Image;
	private infoBg: eui.Group;
	private actTime0: eui.Label;
	private actInfo0: eui.Label;
	private todayRecharge: eui.Label;
	private already0: eui.Label;
	private get0: eui.Button;
	private redPoint0: eui.Image;
	private reward0: eui.List;
	private target0: eui.Label;
	private already1: eui.Label;
	private get1: eui.Button;
	private redPoint1: eui.Image;
	private reward1: eui.List;
	private target1: eui.Label;
	private already2: eui.Label;
	private get2: eui.Button;
	private redPoint2: eui.Image;
	private reward2: eui.List;
	private target2: eui.Label;

	public activityID: number;

	public constructor() {
		super();
		this.skinName = "LoopRechargeSkin";
	}
	protected childrenCreated(): void {
		super.childrenCreated();
	}

	open() {
		this.setData();
		this.observe(Recharge.ins().postMuchDayRecReward, this.setData);
	}
	close() {
		this.removeObserve();
	}
	private setData(): void {
		let confing = GlobalConfig.MultiDayRechargeConfig;
		let awardIndex = 0;
		for (let i in confing[1].awardList) {
			if (awardIndex <= GameServer.serverOpenDay && GameServer.serverOpenDay < parseInt(i)) {
				break;
			}
			awardIndex = parseInt(i);
		}
		let index = 0;
		let dayNum =  Recharge.ins().mDayNum ;
		if(Recharge.ins().mRecNum >= confing[dayNum].num){
			dayNum =  Recharge.ins().mDayNum ;
		}else{
			dayNum =  Recharge.ins().mDayNum - 1;
		}
		for (let i in confing) {
			let conf = confing[i];
			this["reward" + index].itemRenderer = ItemBase;
			this["reward" + index].dataProvider = new eui.ArrayCollection(conf.awardList[awardIndex]);
			let str = StringUtils.addColor(`（${dayNum >(index+1)?i:dayNum}/${i}）`,dayNum>=parseInt(i)?0x00FF00:0xFF9900);
			// this["target" + index].text = `累计${i}天（${dayNum >(index+1)?i:dayNum}/${i}）充值${conf.num}元宝`;
			this["target" + index].textFlow = new egret.HtmlTextParser().parser(`累计${i}天${str}充值${conf.num}元宝`);
			this["redPoint" + index].visible = false;
			if (Recharge.ins().mDayNum > parseInt(i)) {
				this["get" + index]
				// this["get" + index].label = `已领取`;
				this["get" + index].enabled = false;
			} else if (Recharge.ins().mDayNum == parseInt(i) && Recharge.ins().mRecNum >= conf.num && Recharge.ins().mReward == 0) {
				this["redPoint" + index].visible = true;
				this["get" + index].label = `立即领取`;
				this["get" + index].enabled = true;
				this.addTouchEvent(this["get" + index], this.onTap);
			} else {
				this["get" + index].enabled = false;
			}

			index++;
		}
		this.todayRecharge.text = `本日累计充值：${Recharge.ins().mRecNum}`;
		let data: ActivityBtnConfig = Activity.ins().getbtnInfo(this.activityID);
		this.actInfo0.text = data.acDesc;
	}
	private onTap(): void {
		Recharge.ins().sendMuchDayRecReward();
	}
}