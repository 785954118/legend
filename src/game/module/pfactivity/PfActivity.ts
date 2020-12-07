/**
 * 活动数据
 */
class PfActivity extends BaseSystem {

	/** 微信已分享次数 */
	public wxInviteCount: number = 0;
	/** 下次可分享的时间点 */
	public inviteTime: number;

	public focusState:number = -1;//-1 不显示关注 0 未关注 1 已关注
	public shareState:number = -1;//-1 不显示 其他显示
	public isShowGameDesktop:number = 0;// 是否显示收藏 0不显示 1显示

	public constructor() {
		super();
		this.sysId = PackageID.pfActivity;
		this.regNetMsg(1, this.doWanBaGift);
		this.regNetMsg(3, this.doZhiShangData);
		this.regNetMsg(4, this.doWeiXinInviteGift);
	}

	public static ins(): PfActivity {
		return super.ins() as PfActivity;
	}

	protected initLogin(){
		this.sendWanBaGift();

		window["isFocus"]();

		window["isShare"]();

		window["isShowGameDesktop"]((status:number)=>{
			if(SysSetting.ins().getValue("isSaveGameDesktop")){
				status = 0;
			}
			this.postGameDesktop(status);
		});
	}

	public postGuanZhu(code:number) {
		this.focusState = code;
		if(this.focusState == 1) this.sendGuanZhuGift();
	}

	public postShare(code:number){
		this.shareState = code;
	}

	public postGameDesktop(status:number) {
		this.isShowGameDesktop = status;
		return status;
	}

	//收藏，保存到桌面
	public saveGameDesktop() {
		window["saveGameDesktop"](()=>{
			SysSetting.ins().setValue("isSaveGameDesktop", 1);
			this.postGameDesktop(0);
		});
	}

	/**
	 * 处理玩吧礼包
	 * 33-1
	 * @param bytes
	 */
	private doWanBaGift(bytes: GameByteArray): void {
		//param[0]星期几
		//param[1]是否领取成功
		ViewManager.ins().open(WanBaGiftWin, bytes.readByte(), bytes.readBoolean());
	}

	/**
	 * 发送领取玩吧礼包
	 * 33-1
	 */
	public sendWanBaGift(): void {
		if (!LocationProperty.gifi)
			return;
		this.sendBaseProto(1);
	}

	//}

	/**
	 * 请求领取关注奖励
	 * 33-2
	 */
	public sendGuanZhuGift(): void {
		this.sendBaseProto(2);
	}

	/**
	 * 5级指上渠道上报
	 * 33-3
	 */
	private doZhiShangData(bytes: GameByteArray): void {
		if (LocationProperty.appid != PlatFormID.ZHI_SHANG)
			return;
		ReportData.getIns().reportUrl(LocationProperty.callUrl);
	}

	/**
	 * 领取分享奖励
	 * 33-4
	 */
	public sendWeiXinInviteGift(): void {
		this.sendBaseProto(4);
	}

	/**
	 * 分享状态信息
	 * 33-4
	 */
	private doWeiXinInviteGift(bytes: GameByteArray): void {
		PfActivity.ins().wxInviteCount = bytes.readInt();
		PfActivity.ins().inviteTime = bytes.readInt();
		this.postInviteInfoUpdate();
	}

	/**派发分享状态信息 */
	public postInviteInfoUpdate(): void {

	}

	public copyMsgToBoard(msg:string) {
		if(document && document.createElement) {
			let input = document.createElement("input");
			input.value = msg;
			document.body.appendChild(input);
			input.select();
			input.setSelectionRange(0,input.value.length);
			document.execCommand("Copy");
			document.body.removeChild(input);
			return true;
		}
		return false;
	}
}

namespace GameSystem {
	export let pfactivity = PfActivity.ins.bind(PfActivity);
}