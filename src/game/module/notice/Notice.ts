/**
 * 公告数据
 */
import actor = GameSystem.actor;

class Notice extends BaseSystem {

	private data: ChatInfoData;

	public constructor() {
		super();

		this.sysId = PackageID.Notice;
		this.regNetMsg(1, this.doNotice);
		this.regNetMsg(2, this.doNoticeOpen);

		TimerManager.ins().doTimer(3000, 1, this.checkUpdata, this);
	}

	public static ins(): Notice {
		return super.ins() as Notice;
	}

	/** 显示更新公告 */
	private checkUpdata(): void {
		if (!GlobalConfig.UpdateRemindConfig.appearTime || !GlobalConfig.UpdateRemindConfig.disappearTime)
			return;

		if (UserZs.ins().lv * 1000 + Actor.level < GlobalConfig.UpdateRemindConfig.appearLv)
			return;

		if ((GameServer.serverOpenDay + 1) < GlobalConfig.UpdateRemindConfig.serverDayLimit)
			return;

		let serverTime: number = GameServer.serverTime;
		if (DateUtils.formatStrTimeToMs(GlobalConfig.UpdateRemindConfig.appearTime) <= serverTime && serverTime < DateUtils.formatStrTimeToMs(GlobalConfig.UpdateRemindConfig.disappearTime))
			ViewManager.ins().open(UpdateRemindWin, GlobalConfig.UpdateRemindConfig.lotteryNotice);
	}

	private doNotice(bytes: GameByteArray): void {
		let type: number = bytes.readShort();
		let str: string = bytes.readString();
		//是否是新消息 0--是的   1--不是
		let isNew: number = bytes.readUnsignedByte();
		if (type == 1) {
			if (isNew == 0) {
				(<NoticeView>ViewManager.ins().open(NoticeView)).showNotice(str);
			}
		} else if (type == 2) {
			if (!this.data) {
				this.data = new ChatInfoData(null);
			}
			this.data.str = str;
			this.data.type = 7;
		}
		if (type == 3) {
			(<NoticeView>ViewManager.ins().open(NoticeView)).showNotice(str);
			// Chat.ins().insertChatMsg(new ChatSystemData(3, str));
		}
		if(type == 4){
			if(isNew == 0){
				ViewManager.ins().open(YBguangboWin,str)
			}
		}else{
			Chat.ins().postSysChatMsg(new ChatSystemData(type, str));
		}
		
	}

	private doNoticeOpen(bytes: GameByteArray): void {
		UserFuLi.ins().isOpenNotice = bytes.readBoolean();
		Notice.ins().postGameNotice();
	}

	public setNoticeOPen(): void {
		this.sendBaseProto(2);
	}

	public postGameNotice(): void {

	}
}

namespace GameSystem {
	export let notice = Notice.ins.bind(Notice);
}