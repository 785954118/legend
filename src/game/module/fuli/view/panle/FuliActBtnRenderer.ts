class FuliActBtnRenderer extends BaseItemRender {

	public selectIcon: eui.Image;
	public iconDisplay: eui.Image;
	public redPoint: eui.Group;
	public mc: MovieClip;

	constructor() {
		super();
		this.skinName = "ActBtnSkin";

		DisplayUtils.removeFromParent(this.mc);
		this.mc = null;
	}

	protected dataChanged(): void {
		this.iconDisplay.source = this.data.icon;
		let isShowEff:boolean = false;
		switch (this.data.type) {
			//签到
			case 1:
				// this.redPoint.visible = DailyCheckIn.ins().showRedPoint();
				isShowEff = DailyCheckIn.ins().showRedPoint();
				break;
			//7天登陆
			case 2:
				isShowEff = Activity.ins().getSevenDayStast();
				break;
			//月卡
			case 3:
				isShowEff = false;
				break;
			//特权
			case 4:
				isShowEff = Recharge.ins().franchise&&Recharge.ins().franchiseget?true:false;
				break;
			//公告
			case 5:
				isShowEff = Activity.ins().checkNoticeRed();
				break;
			//激活码
			case 6:
				isShowEff = false;
				break;
			//vip礼包
			case 7:
				isShowEff = UserVip.ins().getVipGiftRedPoint(this.data.id);
				break;
		}
		if( isShowEff ){
			if (!this.mc) {
				this.mc = new MovieClip();
				this.mc.x = 40;
				this.mc.y = 42;
			}
			this.mc.playFile(RES_DIR_EFF + "actIconCircle", -1);
			this.addChild(this.mc);
		}else{
			DisplayUtils.removeFromParent(this.mc);
			this.mc = null;
		}
		this.redPoint.visible = isShowEff;

		// if (!UserFuLi.ins().isOpen[this.data.type] && this.data.type < 3) {
		// 	if (!this.mc) {
		// 		this.mc = new MovieClip();
		// 		this.mc.x = 40;
		// 		this.mc.y = 42;
		// 	}
		// 	this.mc.playFile(RES_DIR_EFF + "actIconCircle", -1);
		// 	this.addChild(this.mc);
		// } else {
		// 	DisplayUtils.removeFromParent(this.mc);
		// }
	}
}