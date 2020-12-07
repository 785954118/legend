/**
 * Created by wanghengshuai on 2018/3/15.
 *    活动类型11 showType 3
 */
class OSATarget11Panel3 extends BaseView {

	public infoBg: eui.Group;
	public actTime: eui.Label;
	public actDesc: eui.Label;
	public shopBtn: eui.Button;
	public tabD: eui.List;
	public project: eui.Group;
	public item: eui.Scroller;
	public list: eui.List;
	public title: eui.Image;
	public bar: eui.ProgressBar;
	public totalScore: eui.Label;
	public rewardlist: eui.List;
	public refreshTime: eui.Label;
	public redPointImg: eui.Image;

	private _btnCollect: ArrayCollection;

	private _listCollect: ArrayCollection;

	private _rewardCollect: ArrayCollection;

	private _items: any[];

	private _curDayIndex: number = 0;

	private osa22Panel2: OSATarget22Panel2;

	public activityID: number;

	private activity22ID: number;

	public constructor(id: number) {
		super();
		this.activityID = id;
		this.setCurSkin();
	}

	protected childrenCreated(): void {
		super.childrenCreated();

		this.tabD.itemRenderer = FDtabBtnItemRender;
		this.list.itemRenderer = FDProjectItemRender;
		this.rewardlist.itemRenderer = FDrewardItemRender;
	}

	public open(...param: any[]): void {

		this.setCurSkin();
		this._curDayIndex = 0;

		this.setAct22ID();
		this.updateView();
		this.tabD.selectedIndex = this._curDayIndex;
		this.updateData();
		this.addTouchEvent(this, this.onTouch);
		this.observe(Activity.ins().postActivityIsGetAwards, this.refreshReds);
		this.addChangeEvent(this.tabD, this.onClickBtn);
		TimerManager.ins().doTimer(1000, 0, this.setTime, this);
		if (this.osa22Panel2) {
			this.osa22Panel2.close();
			DisplayUtils.removeFromParent(this.osa22Panel2);
		}
	}

	private setAct22ID(): void {
		this.activity22ID = 0;
		for (let k in Activity.ins().activityData) {
			let ac: ActivityBaseData = Activity.ins().activityData[k];
			if (!ac) continue;
			if (ac.pageStyle == ActivityPageStyle.VERSIONCELE && ac.type == ActivityDataFactory.ACTIVITY_TYPE_22 && Activity.ins().getActivityDataById(+k).isOpenActivity() && !Activity.ins().getActivityDataById(+k).getHide()) {
				this.activity22ID = ac.id;
				return;
			}
		}
	}

	public close(): void {
		this._btnCollect = null;
		this._listCollect = null;

	}

	private setCurSkin(): void {
		let aCon: ActivityConfig = GlobalConfig.ActivityConfig[this.activityID];
		if (aCon.pageSkin)
			this.skinName = aCon.pageSkin;
		else
			this.skinName = "fiveDaySkin";

		if (this.actDesc)
			this.actDesc.text = aCon.desc;
	}

	private updateView(): void {
		let data: ActivityType11Data = Activity.ins().getActivityDataById(this.activityID) as ActivityType11Data;

		this._items = [];
		let confs: ActivityType11_2Config[] = GlobalConfig.ActivityType11_2Config[this.activityID];
		let conf: ActivityType11_2Config;
		let btnArr: any[] = [];
		let groups: any[];
		let group: number;
		let achieve: { times: number, isGot: boolean };
		for (let k in confs) {
			conf = confs[k];
			group = conf.group;
			groups = this._items[group - 1];
			if (!groups) {
				groups = [];
				this._items[group - 1] = groups;
				btnArr.push({gName: conf.gName, showRed: false});
			}

			achieve = data.achieveInfo[conf.index - 1];
			if (!achieve.isGot && achieve.times >= conf.dayLimit)
				btnArr[group - 1].showRed = true;

			groups.push(conf);
		}

		if (!this._btnCollect) {
			this._btnCollect = new ArrayCollection();
			this.tabD.dataProvider = this._btnCollect;
		}

		this._btnCollect.source = btnArr;
		this.tabD.validateNow();

		let data2: ActivityType22Data = Activity.ins().activityData[this.activity22ID] as ActivityType22Data;
		this.redPointImg.visible = ActivityType11Data.FIRST_OPEN_SHOP || data2.refreshFree;
	}

	private refreshReds(): void {
		this.updateView();
		this.updateData();
	}

	/** 当前选中天和组的奖励信息 */
	private updateData(): void {
		let items: any[] = this._items[this._curDayIndex];
		if (!items || !items.length)
			return;

		if (!this._listCollect) {
			this._listCollect = new ArrayCollection();
			this.list.dataProvider = this._listCollect;
		}

		let len: number = items.length;
		let conf: ActivityType11_2Config;
		let datas: any[] = [];
		let state: number = 0;
		let achieve: { times: number, isGot: boolean };
		let activityData: ActivityType11Data = Activity.ins().getActivityDataById(this.activityID) as ActivityType11Data;
		for (let i: number = 0; i < len; i++) {
			conf = items[i];
			achieve = activityData.achieveInfo[conf.index - 1];
			if (achieve.isGot)
				state = 2;
			else if (achieve.times >= conf.dayLimit)
				state = 1;
			else
				state = 0;

			datas[i] = {activityID: this.activityID, conf: conf, state: state, times: achieve.times};
		}

		datas.sort(this.sort);
		this._listCollect.source = datas;

		len = Object.keys(GlobalConfig.ActivityType11_1Config[this.activityID]).length;
		let list: any[] = [];
		list.length = len;
		let config: ActivityType11_1Config;
		let i: number;
		for (i = 1; i <= len; i++) {
			config = GlobalConfig.ActivityType11_1Config[this.activityID][i];
			if (activityData.rewardInfo >> i & 1) //已领取
				state = 2;
			else if (activityData.hiScore >= config.score) //可领取
				state = 1;
			else
				state = 0;

			list[i - 1] = {activityID: this.activityID, index: i, state: state, config: config};
		}

		if (!this._rewardCollect) {
			this._rewardCollect = new ArrayCollection();
			this.rewardlist.dataProvider = this._rewardCollect;
		}

		this._rewardCollect.source = list;
		this.totalScore.text = activityData.hiScore + "";
	}

	private sort(a: any, b: any): number {
		if (a.state == 1 && b.state != 1)
			return -1;

		if (a.state != 1 && b.state == 1)
			return 1;

		if (a.state == 2 && b.state != 2)
			return 1;

		if (a.conf.index < b.conf.index)
			return -1;

		if (a.conf.index > b.conf.index)
			return 1;

		return 0;
	}

	private onTouch(e: egret.TouchEvent): void {
		switch (e.target) {
			case this.shopBtn:
				if (!this.osa22Panel2) {
					this.osa22Panel2 = ObjectPool.pop(`OSATarget22Panel2`, [this.activity22ID]);
					this.osa22Panel2.top = 0;
					this.osa22Panel2.bottom = 0;
					this.osa22Panel2.left = 0;
					this.osa22Panel2.right = 0;
				}

				this.osa22Panel2.activityID = this.activity22ID;
				this.parent.addChild(this.osa22Panel2)
				this.osa22Panel2.open();
				this.close();
				DisplayUtils.removeFromParent(this);
				ActivityType11Data.FIRST_OPEN_SHOP = false;
				Activity.ins().postActivityIsGetAwards();
				break;
		}
	}

	private onClickBtn(e: egret.TouchEvent): void {
		if (this._curDayIndex == e.currentTarget.selectedIndex)
			return;

		this._curDayIndex = e.currentTarget.selectedIndex;
		this.updateData();
	}

	private setTime() {
		let data: ActivityType11Data = Activity.ins().activityData[this.activityID] as ActivityType11Data;
		if (data)
			this.actTime.text = data.getRemainTime();

		let data2: ActivityType22Data = Activity.ins().activityData[this.activity22ID] as ActivityType22Data;
		if (data2) {
			let time: number = data2.getRefreshTime();
			this.refreshTime.text = DateUtils.getFormatBySecond(time > 0 ? time : 0, DateUtils.TIME_FORMAT_1, 5) + `后刷新`;
		}
		else
			this.refreshTime.text = `00:00:00后刷新`;

	}
}