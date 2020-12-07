/**
 *
 * @author hepeiye
 *
 */
class ActivityPanel extends BaseView {
	private _activityID: number;
	private _activityBtnType: number = -1;
	public activityType: number = ActivityType.Normal;
	constructor() {
		super();
	}

	/**
	 * 活动按钮类型
	 * @returns number
	 */
	get activityBtnType(): number {
		return this._activityBtnType;
	}

	get activityID(): number {
		return this._activityID;
	}

	set activityID(value: number) {
		this._activityID = value;
		let config:ActivityConfig | PActivityConfig;
		let abc: ActivityBtnConfig | PActivityBtnConfig;
		if( this.activityType == ActivityType.Normal ){
			config = GlobalConfig.ActivityConfig[value];
			abc = GlobalConfig.ActivityBtnConfig[value];
		}else if( this.activityType == ActivityType.Personal ){
			config = GlobalConfig.PActivityConfig[value];
			abc = GlobalConfig.PActivityBtnConfig[value];
		}
		if (config && config.tabName)
			this.name = config.tabName;

		this._activityBtnType = abc.type;
	}

	/**
	 * 创建活动面板
	 * actType:个人活动 or 正常活动
	 * */
	static create(activityID: number,actType:number): ActivityPanel {
		let config:ActivityConfig | PActivityConfig;
		if( actType ==  ActivityType.Normal){
			config = GlobalConfig.ActivityConfig[activityID];//正常活动(开服 合服 节日...)
		}else{
			config = GlobalConfig.PActivityConfig[activityID];//个人活动
		}
		if (activityID > 10000) {//特殊活动分开处理
			let pan: ActivityPanel = ObjectPool.pop(`OSATarget0Panel`);
			pan.activityType = actType;
			pan.activityID = activityID;
			return pan;
		}

		// let panel: ActivityPanel = ObjectPool.pop(`ActivityType${config.activityType}Panel`);
		let panel:ActivityPanel;
		if (config.activityType == 1){
			panel = ObjectPool.pop(`OSATarget${config.activityType}Panel`, activityID);
			panel.activityType = actType;
			panel.activityID = activityID;
		}else{
			panel = ObjectPool.pop(`OSATarget${config.activityType}Panel`);
			panel.activityType = actType;
			panel.activityID = activityID;
		}
		//let panel: ActivityPanel = ObjectPool.pop(`OSATarget${config.activityType}Panel`);
		//panel.activityID = activityID;
		return panel;
	}

	// 子类必须实现
	public updateData() {

	}

	/**
	 * 通过活动id判断是个人活动还是正常活动
	 * */
	static getActivityTypeFromId(activityID:number):number{
		let config:ActivityBtnConfig|PActivityBtnConfig;
		if( GlobalConfig.ActivityBtnConfig[activityID] ) {//正常活动
			config = GlobalConfig.ActivityBtnConfig[activityID]
		}else if( GlobalConfig.PActivityBtnConfig[activityID] ){//个人活动
			config = GlobalConfig.PActivityBtnConfig[activityID]
		}
		if( config ){
			return config.activityType;
		}
		return ActivityType.Normal;
	}

}
