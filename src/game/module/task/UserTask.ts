class UserTask extends BaseSystem {

	/**活跃度 */
	public vitality: number;
	/**每日任务 */
	public task: TaskData[];
	/**活跃度奖励 */
	public vitalityAwards: VitalityData[];
	/**成就任务 */
	public achiEvement: AchievementData[];
	/**任务追踪 */
	public taskTrace: AchievementData;

	public constructor() {
		super();

		this.sysId = PackageID.Task;
		this.regNetMsg(1, this.doTaskData);
		this.regNetMsg(2, this.doTaskChangeData);
		this.regNetMsg(3, this.doVitality);
		this.regNetMsg(4, this.doVitalityAwards);
		this.regNetMsg(5, this.doAchieveData);
		this.regNetMsg(7, this.doJoinAchieveData);
		this.regNetMsg(8, this.doAchieveChangeData);

		this.regNetMsg(9, this.doLimitDataChange);
		this.regNetMsg(10, this.doUpdateLimitData);

		this.achiEvement = [];
	}

	public static ins(): UserTask {
		return super.ins() as UserTask;
	}

	/**
	 * 领取日常任务
	 * @param id
	 */
	public sendGetTask(id: number): void {
		let bytes: GameByteArray = this.getBytes(1);
		bytes.writeInt(id);
		this.sendToServer(bytes);
	}

	/**
	 * 领取活跃度奖励
	 * @param id
	 */
	public sendGetVitalityAwards(id: number): void {
		let bytes: GameByteArray = this.getBytes(2);
		bytes.writeInt(id);
		this.sendToServer(bytes);
	}

	/**
	 * 领取成就任务
	 * @param id
	 */
	public sendGetAchieve(id: number): void {
		let bytes: GameByteArray = this.getBytes(3);
		bytes.writeInt(id);
		this.sendToServer(bytes);
	}

	/**
	 * 任务数据同步
	 * @param bytes
	 */
	private doTaskData(bytes: GameByteArray): void {
		this.task = [];
		this.vitalityAwards = [];
		let count: number = bytes.readInt();
		for (let i = 0; i < count; i++) {
			let data: TaskData = new TaskData;
			data.id = bytes.readInt();
			data.value = bytes.readInt();
			data.state = bytes.readInt();
			this.task.push(data);
		}
		this.vitality = bytes.readInt();
		let awardsCount: number = bytes.readInt();
		for (let i = 0; i < awardsCount; i++) {
			let awardsData: VitalityData = new VitalityData;
			awardsData.id = bytes.readInt();
			awardsData.state = bytes.readInt();
			this.vitalityAwards.push(awardsData);
		}
		this.sortTask();
	}

	/**
	 * 更改任务数据
	 * @param bytes
	 */
	private doTaskChangeData(bytes: GameByteArray): void {
		let id: number = bytes.readInt();
		let data: TaskData = UserTask.ins().getTaskDataById(id);
		if (ErrorLog.Assert(data, "UserTask  doTaskChangeData id  = " + id)) {
			return;
		}
		data.value = bytes.readInt();
		data.state = bytes.readInt();
		UserTask.ins().sortTask();
		UserTask.ins().postTaskChangeData();
	}

	public postTaskChangeData() {

	}

	private doVitality(bytes: GameByteArray): void {
		this.vitality = bytes.readInt();
	}

	/**
	 * 更新活跃度奖励
	 * @param bytes
	 */
	private doVitalityAwards(bytes: GameByteArray): void {
		let id: number = bytes.readInt();
		let data: VitalityData = this.getVitalityAwardsById(id);
		data.state = bytes.readInt();
		UserTask.ins().postTaskChangeData();
	}

	/**
	 * 成就数据同步
	 * @param bytes
	 */
	private doAchieveData(bytes: GameByteArray): void {
		this.achiEvement.length = 0;
		let count: number = bytes.readInt();
		for (let i: number = 0; i < count; i++) {
			let data: AchievementData = new AchievementData;
			data.achievementId = bytes.readInt();
			data.id = bytes.readInt();
			data.state = bytes.readInt();
			data.value = bytes.readInt();
			let cfg = this.getAchieveConfById(data.id);
			if (cfg == null) {
				debug.warn("无法获得成就配置:" + data.id + "，请检查配置");
			} else {
				data.achievementType = cfg.achievementType;
			}

			if (data.achievementId == 1000) {
				this.taskTrace = data;
				if (this.taskTrace.id == 100003 && this.taskTrace.state == 0) {
					//Guider.ins().show(1, 1)
				}
				UserTask.ins().postUpdteTaskTrace();
			} else {
				this.achiEvement.push(data);
			}
		}
		this.sortAchiEvement();
		this.postUpdateAchieve();
	}

	public getTaskData(achievementId: number, taskId: number): AchievementData{
		let count: number = this.achiEvement.length;
		let data: AchievementData;
		for (let i: number = 0; i < count; i++) {
			let temp: AchievementData = this.achiEvement[i];
			if(temp.achievementId == achievementId && temp.id == taskId){
				data = temp;
				break;
			}
		}
		return data;
	}

	public getTaskTarget(taskId: number): number{
		let target:number = 0;
		let cfg = this.getAchieveConfById(taskId);
		if(cfg){
			target = cfg.target;
		}
		return target;
	}

	public postUpdateAchieve(): void {

	}

	public postUpdteTaskTrace(): void {

	}

	public postUpdteLimitTaskData(taskData?): any {
		return taskData;
	}

	public postLimitTaskEnd(): void {

	}

	private doJoinAchieveData(bytes: GameByteArray): void {
		this.changeAchieve(bytes);
	}

	private doAchieveChangeData(bytes: GameByteArray): void {
		this.changeAchieve(bytes);
	}

	public limitTaskList: LimitTaskData[] = [];
	public limitTaskDic: { [key: number]: LimitTaskData } = {};
	public limitTaskState: number = 0;

	public limitTaskCount: number = 0;

	public limitTaskEndTime: number = -1;
	public currTaskListsId: number = -1;

	private doLimitDataChange(bytes: GameByteArray): void {
		let state: number = bytes.readByte();
		this.limitTaskState = state;
		this.limitTaskCount = 0;
		if (state == 0) {
			this.currTaskListsId = bytes.readInt();
			this.initLimitTaskData(this.currTaskListsId);
		} else if (state == 1) {
			this.currTaskListsId = bytes.readInt();
			this.initLimitTaskData(this.currTaskListsId);
			this.limitTaskEndTime = bytes.readInt();

			let config = GlobalConfig.LimitTimeConfig[this.currTaskListsId];
			if (this.currTaskListsId == 1 && config.time == this.limitTaskEndTime) {
				//第一次触发
				ViewManager.ins().open(LimitStartTipsView);
			}

			this.limitTaskEndTime += Math.floor(GameServer.serverTime / 1000);
			let len: number = bytes.readShort();
			for (let i: number = 0; i < len; i++) {
				let id: number = bytes.readInt();
				this.limitTaskDic[id].parser(bytes);
				if (this.limitTaskDic[id].state == 2) this.limitTaskCount++;
			}
		}

		UserTask.ins().postUpdteLimitTaskData();
	}

	private initLimitTaskData(id: number): void {
		this.limitTaskList = [];
		this.limitTaskDic = {};
		let config = GlobalConfig.LimitTimeConfig[id];
		for (let k in config.taskIds) {
			let baseData = GlobalConfig.LimitTimeTaskConfig[config.taskIds[k]];
			let item: LimitTaskData = new LimitTaskData();
			item.setBaseData(baseData);
			this.limitTaskList.push(item);
			this.limitTaskDic[item.id] = item;
		}
	}

	private doUpdateLimitData(bytes: GameByteArray): void {
		let id: number = bytes.readInt();
		let item: LimitTaskData = this.limitTaskDic[id];
		if (!item) {
			debug.log("限时任务未初始化：" + id);
			return;
		}
		item.parser(bytes);
		if (item.state == 2) this.limitTaskCount++;
		UserTask.ins().postUpdteLimitTaskData(item);
		// let progress: number = bytes.readInt();
		// let state: number = bytes.readByte();
	}

	/**
	 * 请求限时任务数据
	 * @param bytes
	 */
	public sendGetLimitTask(): void {
		this.sendBaseProto(5);
	}

	/**
	 * 请求领取限时任务奖励
	 * @param bytes
	 */
	public sendGetLimitTaskReward(id: number): void {
		let bytes: GameByteArray = this.getBytes(6);
		bytes.writeInt(id);
		this.sendToServer(bytes);
	}


	private lastState: number = -1;

	/**
	 * 更新成就数据
	 * @param bytes
	 */
	public changeAchieve(bytes: GameByteArray): void {
		let achievementId: number = bytes.readInt();
		let data: AchievementData;
		if (achievementId == 1000) {
			data = this.taskTrace;
		}

		else
			data = this.getAchieveDataById(achievementId);
		if (ErrorLog.Assert(data, "UserTask  data is null  achievementId = " + achievementId)) {
			return;
		}
		data.id = bytes.readInt();
		data.state = bytes.readInt();
		data.value = bytes.readInt();
		// data.achievementType = this.getAchieveConfById(data.id).achievementType;

		if (data.achievementId == 1000) {
			UserTask.ins().postUpdteTaskTrace();
			// let config: AchievementTaskConfig = UserTask.ins().getAchieveConfById(data.id);
			// if (config && config.longdesc != "" && this.lastState != data.state) {
			// ViewManager.ins().closeLastTopView();
			// 	ViewManager.ins().open(TaskAlertWin);
			// 	this.lastState = data.state;
			// }
		} else {
			this.sortAchiEvement();
			UserTask.ins().postTaskChangeData();
		}
	}

	/**通过成就类型获取成就数据 */
	public getChengjiuDataByType(type: number): AchievementData[] {
		if (this.achiEvement == undefined) {
			Log.trace("通过成就类型获取成就数据  achiEvement = null");
			return;
		}
		let reArr: AchievementData[] = [];
		for (let i: number = 0; i < this.achiEvement.length; i++) {
			if (this.achiEvement[i].achievementType == type)
				reArr.push(this.achiEvement[i]);
		}
		return this.sortAchievementAcByType(reArr);
	}

	/**整理指定的成就数据集*/
	public sortAchievementAcByType(reArr: AchievementData[]): AchievementData[] {
		if (reArr) {
			reArr.sort(function (a: AchievementData, b: AchievementData) {
				if (a.state == 2) return 1;
				if (b.state == 2) return -1;
				return b.state - a.state
			});
		}
		return reArr;
	}

	/**
	 * 通过成就id获取成就数据
	 * @param id
	 */
	public getAchieveDataById(id: number): AchievementData {
		if (this.achiEvement == undefined) {
			Log.trace("通过成就类型获取成就数据  achiEvement = null");
			return;
		}
		for (let i: number = 0; i < this.achiEvement.length; i++) {
			if (this.achiEvement[i].achievementId == id)
				return this.achiEvement[i]
		}
		return null;
	}

	/**
	 * 通过任务id获取成就数据
	 * @param id
	 */
	public getAchieveByTaskId(id: number): AchievementData {
		for (let i: number = 0; i < this.achiEvement.length; i++) {
			if (this.achiEvement[i].id == id)
				return this.achiEvement[i]
		}
		return null;
	}

	/**
	 * 通过奖励id获取奖励数据
	 * @param id
	 */
	public getVitalityAwardsById(id: number): VitalityData {
		for (let i: number = 0; i < this.vitalityAwards.length; i++) {
			if (this.vitalityAwards[i].id == id)
				return this.vitalityAwards[i]
		}
		return null;
	}

	/**
	 * 通过任务id获取任务数据
	 * @param id
	 */
	public getTaskDataById(id: number): TaskData {
		if (!this.task)
			return null;
		for (let i: number = 0; i < this.task.length; i++) {
			if (this.task[i].id == id)
				return this.task[i]
		}
		return null;
	}

	/**
	 * 通过任务id获取成就配置
	 * @param id
	 */
	public getAchieveConfById(id: number): AchievementTaskConfig {
		let list: AchievementTaskConfig[] = GlobalConfig.AchievementTaskConfig;
		let i: any;
		for (i in list) {
			let config: AchievementTaskConfig = list[i];
			if (config.taskId == id)
				return config;
		}
		return null;
	}

	/**
	 * 通过任务id获取奖励配置
	 * @param id
	 */
	public getAwardsConfigById(id: number): DailyAwardConfig {
		let list: DailyAwardConfig[] = GlobalConfig.DailyAwardConfig;
		let i: any;
		for (i in list) {
			let config: DailyAwardConfig = list[i];
			if (config.id == id)
				return config;
		}
		return null;
	}

	public getTaskStast(): void {
		if (this.task) {
			let i: number;
			for (i = 0; i < this.task.length; i++) {
				if (this.task[i].state == 1) {
					UserTask.ins().postUpdataTaskPoint(true);
					return;
				}
			}
			for (i = 0; i < this.vitalityAwards.length; i++) {
				let config: DailyAwardConfig = this.getAwardsConfigById(this.vitalityAwards[i].id);
				if (this.vitality >= config.valueLimit && this.vitalityAwards[i].state == 0) {
					UserTask.ins().postUpdataTaskPoint(true);
					return;
				}
			}
			for (i = 0; i < this.achiEvement.length; i++) {
				if (this.achiEvement[i].state == 1) {
					UserTask.ins().postUpdataTaskPoint(true);
					return;
				}
			}
			UserTask.ins().postUpdataTaskPoint(false);
			return;
		}
	}

	public postUpdataTaskPoint(bo?: boolean) {
		return bo;
	}

	private sortTask(): void {
		if (this.task.length > 2) {
			this.task.sort(this.sort);
			let state1Task: TaskData[] = [];
			for (let i: number = 0; i < this.task.length; i++) {
				if (this.task[i].state != 0) {
					state1Task.push(this.task[i]);
					this.task.splice(i, 1);
					i--;
				}
			}
			if (state1Task.length > 0)
				this.task = this.task.concat(state1Task);
		}
	}

	private sort(a: TaskData, b: TaskData): number {
		let s1: number = a.id;
		let s2: number = b.id;
		if (s1 < s2)
			return -1;
		else if (s1 > s2)
			return 1;
		else
			return 0;
	}

	private sortAchiEvement(): void {
		for (let i: number = 0; i < this.achiEvement.length; i++) {
			let data: AchievementData = this.achiEvement[i];
			if (data.state == 1) {
				this.achiEvement.splice(i, 1);
				this.achiEvement.unshift(data);
			} else if (data.state == 2) {
				this.achiEvement.splice(i, 1);
				this.achiEvement.push(data);
			}
		}
	}

	/**是否开启了成就功能 */
	public getIsOpenChengjiu(): boolean {
		return Actor.level >= 7;
	}

	/**是否有成就奖励可领取 */
	public getIsHaveChengjiuReward(): boolean {
		if (!this.getIsOpenChengjiu()) return false;

		let maxTypeDatas: number[] = LiLian.ins().chengjiuMaxData();
		for (let type of maxTypeDatas) {
			let datas: AchievementData[] = this.getChengjiuDataByType(type);
			if (datas == undefined) {
				Log.trace("是否有成就奖励可领取 datas = null");
				return;
			}
			for (let d of datas) {
				if (d.state == 1) return true;
			}
		}

		return false;
	}

	/**根据指定类型是否有成就奖励可领取 */
	public getIsHaveChengjiuRewardBytype(type: number): boolean {
		let datas: AchievementData[] = this.getChengjiuDataByType(type);
		for (let d of datas) {
			if (d.state == 1) return true;
		}
		return false;
	}

	/**
	 * 获取主线人物状态
	 * return false:已做完        true：未做完
	 */
	public getTaskState(): boolean {
		let data: AchievementData = UserTask.ins().taskTrace;
		if (data) {
			let config: AchievementTaskConfig = UserTask.ins().getAchieveConfById(data.id);
			let nextConfig: AchievementTaskConfig = UserTask.ins().getAchieveConfById(data.id + 1);
			if (!nextConfig && data.state == 2)
				return false;
			else
				return true;
		}
		return false;
	}


	public getLimitTaskRed(): number {
		for (let i: number = 0; i < UserTask.ins().limitTaskList.length; i++) {
			if (UserTask.ins().limitTaskList[i].state == 1) {
				return 1;
			}
			// //第一二阶段任务如果没完成要一直有红点
			// let timeId:number = UserTask.ins().getLimitTimeId(UserTask.ins().limitTaskList[i].id);
			// if( timeId && (timeId == 1 || timeId == 2) ){
			// 	if( UserTask.ins().limitTaskList[i].state == 2 ){
			// 		continue;
			// 	}
			// 	return 1;
			// }else{
			// 	if (UserTask.ins().limitTaskList[i].state == 1) {
			// 		return 1;
			// 	}
			// }
		}
		return 0;
	}

	public postParabolicItem(): void {

	}

	/**通过限时任务id返回第几阶段*/
	public getLimitTimeId(id:number){
		for( let k in GlobalConfig.LimitTimeConfig ){
			let cfg:LimitTimeConfig =  GlobalConfig.LimitTimeConfig[k];
			if( cfg.taskIds.indexOf(id) != -1 ){
				return cfg.id;
			}
		}
		return 0;
	}
}

namespace GameSystem {
	export let userTask = UserTask.ins.bind(UserTask);
}
