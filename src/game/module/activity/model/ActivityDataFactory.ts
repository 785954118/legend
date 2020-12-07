/**
 * 活动数据工厂类
 */

class ActivityDataFactory {
	public static TimeType_Normal = 0;//普通开服时间
	public static TimeType_Fixed = 1;//固定开服时间
	public static TimeType_Total = 2;//合服开服时间

	public static ACTIVITY_TYPE_1: number = 1;
	public static ACTIVITY_TYPE_2: number = 2;
	public static ACTIVITY_TYPE_3: number = 3;
	public static ACTIVITY_TYPE_4: number = 4;
	public static ACTIVITY_TYPE_5: number = 5;
	public static ACTIVITY_TYPE_6: number = 6;
	public static ACTIVITY_TYPE_7: number = 7;
	public static ACTIVITY_TYPE_8: number = 8;
	public static ACTIVITY_TYPE_9: number = 9;
	public static ACTIVITY_TYPE_10: number = 10;
	public static ACTIVITY_TYPE_11: number = 11;
	public static ACTIVITY_TYPE_12: number = 12;
	public static ACTIVITY_TYPE_17: number = 17;
	public static ACTIVITY_TYPE_18: number = 18;
	public static ACTIVITY_TYPE_19: number = 19;
	public static ACTIVITY_TYPE_20: number = 20;
	public static ACTIVITY_TYPE_21: number = 21;
	public static ACTIVITY_TYPE_22: number = 22;
	public static ACTIVITY_TYPE_24: number = 24;

	static create(bytes: GameByteArray): ActivityBaseData {
		let id = bytes.readInt();
		let startTime = bytes.readInt();
		let endTime = bytes.readInt();
		let type = bytes.readShort();
		let len = bytes.readInt();

		let data: ActivityBaseData;
		switch (type) {
			case ActivityDataFactory.ACTIVITY_TYPE_1:
				data = new ActivityType1Data(bytes);
				break;
			case ActivityDataFactory.ACTIVITY_TYPE_2:
				data = new ActivityType2Data(bytes);
				break;
			case ActivityDataFactory.ACTIVITY_TYPE_3:
				data = new ActivityType3Data(bytes);
				break;
			case ActivityDataFactory.ACTIVITY_TYPE_4:
				data = new ActivityType4Data(bytes);
				break;
			case ActivityDataFactory.ACTIVITY_TYPE_5://合服7天累计登录
				data = Activity.ins().getActivityDataById(id);
				if (!data)
					data = new ActivityType5Data(bytes);
				else
					(data as ActivityType5Data).updateRecord(bytes);
				break;
			case ActivityDataFactory.ACTIVITY_TYPE_6:
				data = new ActivityType6Data(bytes);
				break;
			case ActivityDataFactory.ACTIVITY_TYPE_7:
				data = new ActivityType7Data(bytes);
				break;
			case ActivityDataFactory.ACTIVITY_TYPE_8:
				data = new ActivityType8Data(bytes);
				break;
			case ActivityDataFactory.ACTIVITY_TYPE_9:
				data = new ActivityType9Data(bytes);
				break;
			case ActivityDataFactory.ACTIVITY_TYPE_10:

				data = new ActivityType10Data(bytes);
				break;
			case ActivityDataFactory.ACTIVITY_TYPE_11:
				data = new ActivityType11Data(bytes, id, startTime, endTime);
				break;
			case ActivityDataFactory.ACTIVITY_TYPE_12:
				if (!Activity.ins().activityData[id])
					data = new ActivityType12Data(bytes, id);
				else {
					data = Activity.ins().activityData[id];
					data.init(bytes, id);
				}
				break;
			case ActivityDataFactory.ACTIVITY_TYPE_17:
				data = new ActivityType17Data(bytes);
				break;
			case ActivityDataFactory.ACTIVITY_TYPE_18:
				data = new ActivityType18Data(bytes);
				break;
			case ActivityDataFactory.ACTIVITY_TYPE_19:
				//目前这个类型通过25-22消息请求返回数据(跨服消费排行榜)
				data = new ActivityType19Data(bytes);
				break;
			case ActivityDataFactory.ACTIVITY_TYPE_20:
				data = new ActivityType20Data(bytes);
				break;
			case ActivityDataFactory.ACTIVITY_TYPE_21:
				//这个活动具体数据服务器不会下发 因为主要是掉落处理所以不处理 这里为了对齐上面数据 所以会有个21Data
				data = new ActivityType21Data(bytes);
				break;
			case ActivityDataFactory.ACTIVITY_TYPE_22:
				data = new ActivityType22Data(bytes);
				break;
			case ActivityDataFactory.ACTIVITY_TYPE_24:
				if (!Activity.ins().activityData[id])
					data = new ActivityType24Data(bytes, id);
				else {
					data = Activity.ins().activityData[id];
					data.init(bytes, id);
				}
				break;
			default: {
				debug.log("错误活动类型:" + type);
				for (var i: number = 0; i < len; i++) {
					bytes.readByte();
				}
				return null;
			}
		}
		if (!data)
			return null;
		data.id = id;
		data.startTime = startTime;
		data.endTime = endTime;
		data.type = type;
		data.activityType = ActivityType.Normal;
		let cfg: ActivityConfig = GlobalConfig.ActivityConfig[id];
		if (cfg) {
			data.timeType = cfg.timeType;
			data.pageStyle = cfg.pageStyle;
			data.pageSkin = cfg.pageSkin;
		}

		//只有type为3的需要主动请求数据
		// if (data.type == ActivityDataFactory.ACTIVITY_TYPE_3 && data.isOpenActivity()) {
		// 	Activity.ins().sendLianxuReward(id);
		// }
		return data;
	}

	static createEx(): void {
		let data: ActivityBaseData;
		let actConfig: ActivityBtnConfig[] = GlobalConfig.ActivityBtnConfig;
		//开服时间
		let serverZeroTime = DateUtils.formatMiniDateTime(GameServer._serverZeroTime);
		//合服时间
		let serverHeZeroTime = DateUtils.formatMiniDateTime(GameServer._serverHeZeroTime);
		for (let k in actConfig) {
			let cfg: ActivityBtnConfig = actConfig[k];
			//判定活动是否是对应当前服务器的合服次数
			let curhefuCount = cfg.hfTimes ? cfg.hfTimes : 0;
			let timeType = cfg.timeType ? cfg.timeType : 0;
			if (timeType && timeType == ActivityDataFactory.TimeType_Total && (curhefuCount && curhefuCount != GameServer._hefuCount))
				continue;
			if (cfg.id > 10000) {
				data = new ActivityType0Data(null);
				data.id = cfg.id;
				data.type = cfg.type;
				data.activityType = ActivityType.Normal;
				data.timeType = cfg.timeType;
				if (cfg.pageStyle)
					data.pageStyle = cfg.pageStyle;
				if (cfg.relyOn) {
					//直接拿依赖活动id的时间来给静页活动
					data.relyOn = cfg.relyOn;
					for (let i = 0; i < cfg.relyOn.length; i++) {
						if (Activity.ins().activityData[cfg.relyOn[i]]) {
							data.startTime = DateUtils.formatMiniDateTime(Activity.ins().activityData[cfg.relyOn[i]].startTime);
							data.endTime = DateUtils.formatMiniDateTime(Activity.ins().activityData[cfg.relyOn[i]].endTime);
							break;
						}
					}
				}
				else if (cfg.timeType == ActivityDataFactory.TimeType_Normal) {//开服时间
					let arr = cfg.startTime.split("-");
					let openDay = +arr[0];
					let openTime = arr[1].split(":");

					let startDate = new Date(serverZeroTime);
					startDate.setDate(startDate.getDate() + openDay);
					startDate.setHours(+openTime[0], +openTime[1], 0, 0);
					data.startTime = startDate.getTime();

					if (cfg.endTime) {
						arr = cfg.endTime.split("-");
						let endDay = +arr[0];
						let endTime = arr[1].split(":");

						let endDate = new Date(serverZeroTime);
						endDate.setDate(endDate.getDate() + endDay);
						endDate.setHours(+endTime[0], +endTime[1], 0, 0);
						data.endTime = endDate.getTime();
					} else {
						data.endTime = GameServer.serverTime + 30 * 24 * 60 * 60 * 1000;//加30天
					}
				} else if (cfg.timeType == ActivityDataFactory.TimeType_Fixed) {//活动时间
					data.startTime = (new Date(cfg.startTime)).getTime();
					data.endTime = (new Date(cfg.endTime)).getTime();
				} else if (cfg.timeType == ActivityDataFactory.TimeType_Total) {//合服活动时间
					let arr: string[] = [];
					let endDay = DateUtils.DAYS_PER_WEEK;
					if (cfg.endTime) {
						arr = cfg.endTime.split("-");
						endDay = +arr[0];
					}
					switch (cfg.id) {
						case ActivityBtnType.HEFU_XUNBAO://合服寻宝
							data.startTime = serverHeZeroTime;//开服那天起
							data.endTime = serverHeZeroTime + GlobalConfig.TreasureHuntConfig.hefuDay * 24 * 60 * 60 * 1000;
							break;
						case ActivityBtnType.HEFU_BOSS:
						case ActivityBtnType.HEFU_JZLC:
						case ActivityBtnType.HEFU_CZZS:
							data.startTime = serverHeZeroTime;//开服那天起
							data.endTime = serverHeZeroTime + endDay * DateUtils.SECOND_PER_DAY * 1000;
							break;
					}
				} else {
					data.startTime = serverZeroTime;//开服那天起
					data.endTime = GameServer.serverTime + 30 * 24 * 60 * 60 * 1000;//加30天
				}

				let endedTime = Math.floor((data.endTime - GameServer.serverTime) / 1000);
				if (endedTime > 0) {
					Activity.ins().activityData[cfg.id] = data;
				}
				else {
					//三英雄
					if (cfg.id == ActivityBtnType.THREE_HEROES) {
						if (ThreeHeroes.ins().showIcon3DaysLater)
							Activity.ins().activityData[cfg.id] = data;
					}

				}
			}
		}
	}
}

/**
 * 活动显示页类型
 * 活动表如果不配pageStyle字段 就默认按照timeType来区分显示在合服活动或者开服活动
 * */
enum ActivityPageStyle {
	THANKS = 1,//2017年的感恩节(如果发现当年感恩节适合可以重用)
	NEWYEAR = 2, //元旦
	CHRISTMAS = 3,//圣诞节
	HAPPYSEVENDAY = 4,//七天乐
	TOTALRECHARGE = 5, //累充
	CELEBRATION = 6,//庆典活动
	LABA = 7,//腊八
	YBZHUANPAN = 8,//元宝转盘
	ZHANLING = 9, //战灵活动
	SPRINGBEGIN = 10, //立春活动
	XIAONIAN = 11, //小年活动
	SPRINGFESTIVAL = 12, //春节活动
	SPRINGEIGHTDAY = 13, //春节8天乐活动
	KAIMENHONG = 14, //开门红活动
	SANBA = 15, //三八节活动
	LONGTAITOU = 16, //龙抬头活动
	VERSIONCELE = 17, //版本庆典
}