/**
 * 活动22
 * @author wanghengshuai
 */
class ActivityType22Data extends ActivityBaseData {

	public tScore: number;

	public refreshFree: boolean;

	public shopItems: SpringBeginShopVo[];

	public scoreItems: SpringBeginShopVo[];

	public limitItems: SpringBeginShopVo[];

	private _refreshTime: number = 0;

	private _oldTimer: number;

	constructor(bytes: GameByteArray) {
		super(bytes);
		this.update(bytes);
	}

	public update(bytes: GameByteArray): void {
		this.tScore = bytes.readInt();
		this.refreshFree = bytes.readByte() == 1;
		this._refreshTime = bytes.readInt();
		this._oldTimer = egret.getTimer();

		let len: number = bytes.readShort();
		this.shopItems = [];
		this.shopItems.length = len;
		for (let i: number = 0; i < len; i++) {
			this.shopItems[i] = new SpringBeginShopVo();
			this.shopItems[i].parser(bytes);
		}

		len = bytes.readShort();
		this.scoreItems = [];
		this.scoreItems.length = len;

		for (let i: number = 0; i < len; i++) {
			this.scoreItems[i] = new SpringBeginShopVo();
			this.scoreItems[i].parser2(bytes);
		}

		//限制商品
		// this.limitItems = [];
		// len = bytes.readShort();
		// let vo: SpringBeginShopVo;
		// for (let i: number = 0; i < len; i++) {
		// 	vo = new SpringBeginShopVo();
		// 	vo.parser3(bytes);
		// 	this.limitItems.push(vo);
		// }

	}

	public canReward(): boolean {
		return this.checkRedPoint();
	}

	public isOpenActivity(): boolean {
		let beganTime = Math.floor((DateUtils.formatMiniDateTime(this.startTime) - GameServer.serverTime) / 1000);
		let endedTime = Math.floor((DateUtils.formatMiniDateTime(this.endTime) - GameServer.serverTime) / 1000);
		if (beganTime < 0 && endedTime > 0) {
			return true;
		}
		return false;
	}

	public getleftTime() {
		if (!this.isOpenActivity()) {
			return 0;
		}
		let endedTime = Math.floor((DateUtils.formatMiniDateTime(this.endTime) - GameServer.serverTime) / 1000);
		return endedTime;
	}

	//判断红点
	public checkRedPoint(): boolean {
		if (this.refreshFree)
			return true;

		let config: ActivityType22_3Config = Activity.ins().getConfig22_3(this.id);
		if (config && this.tScore >= config.score)
			return true;

		let itemData: ItemData = UserBag.ins().getBagItemById(GlobalConfig.ActivityType22_1Config[this.id][1].freshItem);
		if (itemData && itemData.count > 0)
			return true;

		return false;
	}

	public getRemainTime(): string {
		let beganTime = Math.floor((DateUtils.formatMiniDateTime(this.startTime) - GameServer.serverTime) / 1000);
		let endedTime = Math.floor((DateUtils.formatMiniDateTime(this.endTime) - GameServer.serverTime) / 1000);
		let desc: string;
		if (beganTime >= 0) {
			desc = "活动未开启";
		} else if (endedTime <= 0) {
			desc = "活动已结束";
		} else {
			desc = DateUtils.getFormatBySecond(endedTime, DateUtils.TIME_FORMAT_5, 3)
		}
		return desc;
	}

	public getRefreshTime(): number {
		return this._refreshTime - (egret.getTimer() - this._oldTimer) / 1000;
	}
}