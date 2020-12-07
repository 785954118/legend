class NoticeListRenderer extends BaseItemRender {
	private job: string[] = ["", "战士", "法师", "道士"];
	public static QUALITY_COLOR: string[] = ["#e2dfd4", "#35e62d", "#d242fb", "#ff750f", "#f3311e", "#ffd93f"];
	public showText: eui.Label;
	private activityID: number;
	private activityType: number;
	private actType:number;//个人活动/正常活动
	constructor() {
		super();
		this.skinName = "HuntListRendererSkin";
	}

	public dataChanged(): void {
		let str = "";
		this.activityID = this.data.activityID;
		this.activityType = this.data.activityType;
		this.actType = this.data.actType;
		switch (this.activityType) {
			case ActivityDataFactory.ACTIVITY_TYPE_17:
				let actDatas = GlobalConfig.ActivityType17_3Config[this.activityID];
				let awards = actDatas[CommonUtils.getObjectLength(actDatas)].group;
				let item: ItemConfig = GlobalConfig.ItemConfig[awards[this.data.index-1].id];
				let cstr = ItemConfig.getQualityColor(item);
				let nstr = item.name;

				str = `恭喜|C:0x16b2ff&T:${this.data.name}|在幸运星转盘中抽到了|C:${cstr}&T:${nstr} X${awards[this.data.index-1].count}|`;
				break;
			default:
				let name = this.data.name;
				let index = this.data.index;
				let config: ActivityType9Config|PActivity9Config;
				if( this.actType == ActivityType.Normal ){
					config = GlobalConfig.ActivityType9Config[this.activityID][index];
				}else if( this.actType == ActivityType.Personal ){
					config = GlobalConfig.PActivityType9Config[this.activityID][index];
				}
				if (config) {
					let nstr: string = "";
					let cstr: number = ColorUtil.NORMAL_COLOR;
					//货币
					if (!config.reward[0].type) {
						let type: number = 1;//颜色类型
						switch (config.reward[0].id) {
							case MoneyConst.yuanbao:
								type = 5;
								break;
							case MoneyConst.gold:
								type = 0;
								break;
							case MoneyConst.soul:
								type = 2;
								break;
							case MoneyConst.piece:
								type = 2;
								break;
							case MoneyConst.godweaponExp:
								type = 2;
								break;
							default:
								break;
						}
						nstr = RewardData.getCurrencyName(config.reward[0].id);
						cstr = ItemBase.QUALITY_COLOR[type];
						str = "<font color = '#12b2ff'>" + name + "</font> 获得 <font color='" + cstr + "'>" + nstr + "</font>";

					} else {
						//道具
						let item: ItemConfig = GlobalConfig.ItemConfig[config.reward[0].id];
						nstr = item.name;
						cstr = ItemConfig.getQualityColor(item);
						let itemtype = ItemConfig.getType(item);
						if (itemtype == 0) {
							if (item) {
								if (item.zsLevel > 0) {
									nstr += "(" + item.zsLevel + "转 ";
								} else {
									nstr += "(" + item.level + "级 ";
								}
								nstr += this.job[ItemConfig.getJob(item)] + ")";
							}
						}

						str = "<font color = '#12b2ff'>" + name + "</font> " + (this.data.des ? this.data.des : "获得") + " <font color='" + cstr + "'>" + nstr + "</font>";

					}
				}


		}

		this.showText.textFlow = TextFlowMaker.generateTextFlow(str);
	}




}