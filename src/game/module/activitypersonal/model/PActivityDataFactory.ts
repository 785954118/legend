/**
 * 个人活动数据工厂类
 */

class PActivityDataFactory {
	public static PACTIVITY_TYPE_1: number = 1;//达标
	public static PACTIVITY_TYPE_2: number = 2;//限购
	public static PACTIVITY_TYPE_3: number = 3;//累充
	public static PACTIVITY_TYPE_4: number = 4;
	public static PACTIVITY_TYPE_5: number = 5;
	public static PACTIVITY_TYPE_6: number = 6;
	public static PACTIVITY_TYPE_7: number = 7;
	public static PACTIVITY_TYPE_8: number = 8;
	public static PACTIVITY_TYPE_9: number = 9;//转盘
	public static PACTIVITY_TYPE_10: number = 10;
	public static PACTIVITY_TYPE_11: number = 11;
	public static PACTIVITY_TYPE_17: number = 17;
	static create(bytes: GameByteArray): ActivityBaseData {
		let id = bytes.readInt();
		let startTime = bytes.readInt();
		let endTime = bytes.readInt();
		let type = bytes.readShort();
		let len = bytes.readInt();

		let data: ActivityBaseData;
		switch (type) {
			case PActivityDataFactory.PACTIVITY_TYPE_1:
				data = new PActivityType1Data(bytes);
				break;
			case PActivityDataFactory.PACTIVITY_TYPE_2:
				data = new PActivityType2Data(bytes);
				break;
			case PActivityDataFactory.PACTIVITY_TYPE_3:
				data = new PActivityType3Data(bytes);
				break;
			case PActivityDataFactory.PACTIVITY_TYPE_9:
				data = new PActivityType9Data(bytes);
				break;
			default: {
				// debug.log("错误个人活动类型:" + type);
				if (!ErrorLog.Assert(type, `错误个人活动:${id} 类型:` + type))
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
		data.activityType = ActivityType.Personal;

		let paconfig:PActivityConfig = GlobalConfig.PActivityConfig[id];
		if( paconfig ){
			data.duration = paconfig.duration;
		}

		return data;
	}

}
