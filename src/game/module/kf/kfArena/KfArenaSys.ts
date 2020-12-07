/**
 * Created by MPeter on 2018/3/12.
 *  跨服3v3竞技场系统
 */
class KfArenaSys extends BaseSystem {
	/**是否为跨服竞技场场景*/
	public isKFArena: boolean = false;
	/**剩余次数 */
	public times: number = 0;
	/** 当前段位*/
	public duanLevel: number = 0;
	/** 积分*/
	public score: number = 0;
	/** 是否为队长*/
	public isTFCaptain: boolean;
	/**当前战绩 */
	public curMouth: kfArenaMark;
	/** 历史战绩*/
	public history: kfArenaMark;

	/** 队长id 0 表示没有战队*/
	public leaderID: number = 0;
	/** 匹配状态 1 匹配中*/
	public macthState: number;

	/** 副本房间成员 */
	public tfMembers: KfArenaRoleVo[];

	/**邀清人列表 */
	public inviteDataList: KFInviteData[] = [];

	/**世界邀请的cd */
	public worldTimeCd: number = 0;

	public flagHandle: number = 10011010110;
	public flagCD: number = 0;

	public duanName: string[] = ["青铜", '白银', '黄金', '白金', '钻石', '王者'];

	//战斗场景
	public scoreA: number;
	public scoreB: number;
	public myCampId: number;

	/**可邀清帮派成员列表 */
	public guildDataList: GuildMemberInfo[];
	/**可邀清好友列表 */
	public friendsDataList: GuildMemberInfo[];

	/**我的排名*/
	public ownRank: number;
	/**排名数据列表*/
	public rankDataList: KfArenaRankData[];

	/**昨日段位 */
	public yesterdayDuan: number;
	/**每日段位奖励 是否已经领取 1已经领取了，0没有领取*/
	public dailyState: number;
	/** 获得的巅峰令个数*/
	public dflCount: number = 0;
	/**巅峰令奖励领取情况，按位读 */
	public dflState: number;

	/** 开启倒计时 */
	private _openLeftTime: number = 0;

	private _openTimer: number = 0;

	/** 活动是否开启 0 开启前 1 开启中*/
	public isStartIng: number = 0;

	public constructor() {
		super();
		this.sysId = PackageID.KfArena;
		this.regNetMsg(1, this.postPlayerInfo);
		this.regNetMsg(2, this.postTeamInfo);
		this.regNetMsg(5, this.postReceiveInvitation);
		this.regNetMsg(7, this.postBack);
		this.regNetMsg(9, this.postRefFlag);
		this.regNetMsg(10, this.doCollectFlag);
		this.regNetMsg(11, this.postRelive);
		this.regNetMsg(13, this.postFbInfo);
		this.regNetMsg(14, this.doResult);
		this.regNetMsg(16, this.postMacthState);
		this.regNetMsg(17, this.postChangeScore);
		this.regNetMsg(19, this.postDataInfo);
		this.regNetMsg(20, this.postKfArenaGuilds);
		this.regNetMsg(21, this.postNotice);
		this.regNetMsg(23, this.postJoinRewards);
		this.regNetMsg(26, this.postOpenKfArena);

		this.regNetMsg(25, this.postRank);



		this.observe(GameLogic.ins().postEnterMap, this.changeScene);

	}

	/**
	 * 创建战队
	 * 77-1
	 */
	public sendCreateTeam(): void {
		this.sendBaseProto(1);
	}

	/** 玩家个人信息
	 * 77-1
	 */
	public postPlayerInfo(bytes: GameByteArray): void {
		// console.log('玩家个人信息')
		// console.log(bytes)

		this.times = bytes.readInt();
		// console.log(this.times)
		// console.log(bytes)
		this.duanLevel = bytes.readInt();
		// console.log(this.duanLevel)
		// console.log(bytes)
		this.score = bytes.readInt();
		// console.log(this.score)
		// console.log(bytes)
		if (!this.curMouth)
			this.curMouth = new kfArenaMark();
		this.curMouth.parse(bytes);
		if (!this.history)
			this.history = new kfArenaMark();
		this.history.parse(bytes);
	}

	/**
	 * 单人匹配
	 * 77-2
	 */
	public sendPersonalMatch(): void {
		this.sendBaseProto(2);
	}

	/**
	 * 战队信息
	 * 77-2
	 */
	public postTeamInfo(bytes: GameByteArray): void {
		this.leaderID = bytes.readInt();
		this.macthState = bytes.readInt();
		let len: number = bytes.readInt();
		this.tfMembers = [];
		for (let i: number = 0; i < len; i++) {
			let vo: KfArenaRoleVo = new KfArenaRoleVo();
			this.tfMembers[i] = vo;
			vo.parse(bytes);
		}
		this.isTFCaptain = Actor.actorID == this.leaderID;
	}

	/** 离开或者解散队伍
	 * 77-3
	 */
	public sendLeaveTeam(): void {
		this.sendBaseProto(3);
	}

	/** 开始匹配
	 * 77-4
	 */
	public sendStartMacth(): void {
		this.sendBaseProto(4);
	}

	/** 取消匹配
	 * 77-16
	 */
	public sendCancelMacth(): void {
		this.sendBaseProto(16);
	}

	/** 可邀请的帮派成员
	 * 77-20
	 */
	public sendGuilds(type: number): void {
		let bytes: GameByteArray = this.getBytes(20);
		bytes.writeInt(type);
		this.sendToServer(bytes);
	}

	/** 邀请玩家
	 * 77-5
	 */
	public sendInvite(id: number): void {
		let bytes: GameByteArray = this.getBytes(5);
		bytes.writeInt(id);
		this.sendToServer(bytes);
		this.postKfArenaDelID(id);
	}

	public postKfArenaDelID(id: number): number {
		return id;
	}

	/** 收到邀请
	 * 77-5
	 */
	public postReceiveInvitation(bytes: GameByteArray): void {
		let data = new KFInviteData();
		data.parse(bytes);
		//不在副本内
		if (!this.checkInviteByID(data.roleId))
			this.inviteDataList.push(data);
		if (this.inviteDataList.length > 0)
			ViewManager.ins().open(kfReceiveInviteWin, 0);
	}

	/** 判断已有邀请人*/
	public checkInviteByID(id: number): boolean {
		for (let i = 0; i < this.inviteDataList.length; i++) {
			if (this.inviteDataList[i].roleId == id)
				return true;
		}
		return false;
	}

	/** 世界邀请
	 * 77-6
	 */
	public sendWorldInvite(): void {
		this.sendBaseProto(6);
	}

	/** 回复邀请 0 拒绝 1 同意
	 * 77-7
	 */
	public sendRespondInvite(leaderId: number, state: number): void {
		let bytes: GameByteArray = this.getBytes(7);
		bytes.writeInt(leaderId);
		bytes.writeInt(state);
		this.sendToServer(bytes);
	}

	/** 返回信息
	 * 77-7
	 */
	public postBack(bytes: GameByteArray): void {
		let type = bytes.readInt();
		switch (type) {
			case 1://邀请成功
				ViewManager.ins().open(KfArenaWin, 1);
				break
		}
	}

	/** 匹配状态
	 * 77-16
	 */
	public postMacthState(bytes: GameByteArray): void {
		this.macthState = bytes.readInt();
	}

	/** 可邀请的帮派成员列表
	 * 77-20
	 */
	public postKfArenaGuilds(bytes: GameByteArray): number {
		let type: number = bytes.readInt();
		let len = bytes.readInt();
		if (type == KFInviteType.Guild) {
			this.guildDataList = [];
			for (let i = 0; i < len; i++) {
				let info = new GuildMemberInfo();
				info.parse(bytes);
				this.guildDataList.push(info);
			}
		}
		else if (type == KFInviteType.Friend) {
			this.friendsDataList = [];
			for (let i = 0; i < len; i++) {
				let info = new GuildMemberInfo();
				info.parse(bytes);
				this.friendsDataList.push(info);
			}
		}
		return type;
	}

	public getDataList(type: number): GuildMemberInfo[] {
		let list: GuildMemberInfo[] = [];
		let temList: GuildMemberInfo[];
		if (type == KFInviteType.Friend)
			temList = this.friendsDataList;
		else
			temList = this.guildDataList;
		if (!temList) return list;
		for (let i = 0; i < temList.length; i++) {
			if (temList[i].roleID == Actor.actorID)
				continue;
			let info = new GuildMemberInfo();
			info.copyData(temList[i]);
			list.push(info);
		}
		return list;
	}

	/** 世界邀请加入队伍
	 * 77-18
	 */
	public sendJoinTeam(id: number): void {
		let bytes: GameByteArray = this.getBytes(18);
		bytes.writeInt(id);
		this.sendToServer(bytes);
	}


	/** 踢出玩家
	 * 77-8
	 */
	public sendOutTeam(id: number): void {
		let bytes: GameByteArray = this.getBytes(8);
		bytes.writeInt(id);
		this.sendToServer(bytes);
	}

	/**
	 * 刷新旗帜
	 * 77-9
	 * */
	public postRefFlag(bytes: GameByteArray): void {
		let handle: number = bytes.readDouble();
		this.flagCD = bytes.readInt() * 1000 + egret.getTimer();//采集CD时间

		this.flagHandle = 10011010110;
	}

	/**
	 * 获取旗帜信息
	 * 77-10
	 * */
	private doCollectFlag(bytes: GameByteArray): void {
		//采集者
		let handle: number = bytes.readDouble();
		//踩集剩余时间
		let lefttimer: number = bytes.readInt();


		if (handle && handle == Actor.handle && lefttimer) {
			ViewManager.ins().open(CollectWin, handle, lefttimer);
			GameLogic.ins().currAttackHandle = 0;
		}
		else ViewManager.ins().close(CollectWin);
	}

	/**
	 * 请求采旗信息
	 * 77-10
	 * */
	public sendCollectFlag(): void {
		this.sendBaseProto(10);
	}

	/**
	 * 复活
	 * 77-11
	 * */
	public postRelive(bytes: GameByteArray): void {
		let cd: number = bytes.readInt();
		let handle: number = bytes.readDouble();
		ViewManager.ins().open(KfArenaReliveWin, cd, handle);
	}

	/**
	 * 进入副本初始信息
	 * 77-13
	 * */
	public postFbInfo(bytes: GameByteArray): void {
		let time: number = bytes.readInt();//正式开始时间戳
		this.myCampId = bytes.readByte();//阵营ID
		this.scoreA = bytes.readInt();//A阵营积分
		this.scoreB = bytes.readInt();//B阵营积分

		ViewManager.ins().open(KfArenaFightWin, (DateUtils.formatMiniDateTime(time) - GameServer.serverTime) / DateUtils.MS_PER_SECOND >> 0);
	}

	/**
	 * 结算
	 * 77-14
	 * */
	public doResult(bytes: GameByteArray): void {
		let scoreA: number = bytes.readInt();//A阵营积分
		let scoreB: number = bytes.readInt();//B阵营积分
		let len: number = bytes.readShort();
		let dtLit: KfArenaData[] = [];
		for (let i: number = 0; i < len; i++) {
			let data = new KfArenaData(bytes);
			data.rank = i + 1;
			dtLit.push(data);
		}
		//额外奖励
		let extAwards: RewardData[] = [];
		len = bytes.readShort();
		for (let i: number = 0; i < len; i++) {
			let award = new RewardData();
			award.type = bytes.readInt();
			award.id = bytes.readInt();
			award.count = bytes.readInt();
			extAwards.push(award);
		}

		ViewManager.ins().open(KfArenaResultWin, scoreA, scoreB, dtLit, extAwards);
	}

	/**
	 * 进入战区
	 * 77-15
	 * */
	public enterBattle(): void {
		this.sendBaseProto(15);
	}

	/**
	 * 变化积分
	 * 77-17
	 * */
	public postChangeScore(bytes: GameByteArray): void {
		this.scoreA = bytes.readInt();//A阵营积分
		this.scoreB = bytes.readInt();//B阵营积分
	}

	/**
	 * 派发场景内数据信息
	 * 77-19
	 * */
	public postDataInfo(bytes: GameByteArray): KfArenaData[] {
		let len: number = bytes.readShort();
		let rankDatas: KfArenaData[] = [];
		for (let i: number = 0; i < len; i++) {
			let data = new KfArenaData();
			data.readRankData(bytes);
			rankDatas.push(data);
		}
		if (!ViewManager.ins().isShow(KfArenaInfoWin)) {
			ViewManager.ins().open(KfArenaInfoWin, rankDatas);
		}
		return rankDatas;
	}

	/**
	 * 请求排行数据
	 * 77-19
	 * */
	public sendDataInfo(): void {
		this.sendBaseProto(19);
	}

	/**
	 * 派发场景内的公告数据
	 * 77-21
	 * */
	public postNotice(bytes: GameByteArray): KfArenaNoticeData {
		return new KfArenaNoticeData(bytes);
	}

	/**
	 * 派发排行
	 * 77-25
	 * */
	public postRank(bytes: GameByteArray): void {
		this.rankDataList = [];
		let count: number = bytes.readInt();
		for (let i: number = 0; i < count; i++) {
			this.rankDataList.push(new KfArenaRankData(bytes));
		}
		this.ownRank = bytes.readInt();

	}


	/**
	 * 请求排行
	 * 77-25
	 * */
	public sendRank(): void {
		this.sendBaseProto(25);
	}

	/** 当前有没有队伍*/
	public getIsJoinTeam(): boolean {
		return this.leaderID != 0;
	}

	/**检测当前变更场景*/
	public changeScene(): void {
		if (GameMap.fbType == UserFb.FB_TYPE_KF_ARENA) {
			this.isKFArena = true;


		}
		else if (GameMap.lastFbTyp == UserFb.FB_TYPE_KF_ARENA) {
			this.isKFArena = false;
			this.flagHandle = 0;
		}
	}

	/**通过段位获取每日段位奖励 */
	public getDuanAwards(): RewardData[] {
		let data = GlobalConfig.CrossArenaBase.everyDayAward;
		for (let i in data) {
			if (data[i].metal == this.duanLevel) {
				return data[i].award;
			}
		}
		return null;
	}

	/**获取当前段位 */
	public getDuanName(): string {
		return this.duanName[this.duanLevel - 1];
	}

	public isOpen(): boolean {
		let open: boolean = GlobalConfig.CrossArenaBase.openDay <= GameServer.serverOpenDay + 1 && UserZs.ins().lv >= GlobalConfig.CrossArenaBase.zhuanshengLevel;
		if (open) {
			//开启前倒计时5分钟内开启或者开启中
			if(this.isStartIng == 1 || this.isStartIng == 0 && this._openLeftTime > 0)
				return true;
		}
		return false;
	}

	/**
	 * 领取每日段位奖励
	 * 77-23
	 * */
	public sendDailyRewards(): void {
		this.sendBaseProto(23);
	}

	/** 领取巅峰令达标奖励
	 * 77-24
	 */
	public sendJoinRewards(index: number): void {
		let bytes: GameByteArray = this.getBytes(24);
		bytes.writeInt(index);
		this.sendToServer(bytes);
	}

	/**
	 * 奖励领取信息
	 * 77-23
	 * */
	public postJoinRewards(bytes: GameByteArray): void {
		this.yesterdayDuan = bytes.readInt();
		this.dailyState = bytes.readInt();
		this.dflCount = bytes.readInt();
		this.dflState = bytes.readInt();
	}

	/**
	 * 开启预告
	 * 77-26
	 * */
	public postOpenKfArena(bytes: GameByteArray): void {
		this.isStartIng = bytes.readInt();
		this._openLeftTime = bytes.readInt();
		this._openTimer = egret.getTimer();
	}


	/** 获得开启剩余时间 */
	public getOpenLeftTime(): number {
		return this._openLeftTime - (egret.getTimer() - this._openTimer) / 1000;
	}

	/** 段位页红点*/
	public getDuanRedPoint(): number {
		return this.dailyState == 0 ? 1 : 0;
	}

	/** 参与页红点*/
	public getJoinRedPoint(): number {
		let peakAwards: KfArenaPeakAwards[] = GlobalConfig.CrossArenaBase.peakAwards;
		let index: number = 1;
		let num = 0;
		for (let i in peakAwards) {
			if (((this.dflState >> index) & 1) != 1) {
				if (KfArenaSys.ins().dflCount >= peakAwards[i].count) {
					num++;
				}
			}
			index++;
		}
		return num;
	}
}
namespace GameSystem {
	export let kfArenaSys = KfArenaSys.ins.bind(KfArenaSys);
}
