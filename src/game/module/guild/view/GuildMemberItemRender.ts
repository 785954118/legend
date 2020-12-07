class GuildMemberItem2Render extends BaseItemRender {

	private conLab: eui.Label;
	private attack: eui.Label;
	private nameLab: eui.Label;
	private onLine: eui.Label;
	private headBG: eui.Image;
	private face: eui.Image;
	/**弹劾 */
	private impeachBtn: eui.Button;
	/**禅让 */
	private demiseBtn: eui.Button;
	/**降职 */
	private downBtn: eui.Button;
	/**踢出 */
	private kickBtn: eui.Button;
	/**任命 */
	private appointBtn: eui.Button;
	private group1: eui.Group;
	private group2: eui.Group;
	private group3: eui.Group;

	private vip: eui.Group;
	private vipTitle: eui.Image;
	private vipNum: egret.DisplayObjectContainer;
	private vipNum0: egret.DisplayObjectContainer;

	public constructor() {
		super();
		this.skinName = "MemberItem2Skin";
	}

	public childrenCreated(): void {
		super.childrenCreated();
		if (!this.hasEventListener(egret.Event.REMOVED_FROM_STAGE)) {
			this.addEventListener(egret.Event.REMOVED_FROM_STAGE, () => {
				MessageCenter.ins().removeAll(this);
			}, this)
		}
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: egret.TouchEvent) => {
			if (e.target instanceof eui.Button) {
				return;
			}
			if (this.data)
				ViewManager.ins().open(PlayerTipsWin, this.data);
		}, this);

	}

	public onTap(e: eui.Button): void {
		//工会战期间  不允许 禅让/降职/任命副会长/踢出
		if (GuildWar.ins().getModel().isWatStart) {
			WarnWin.show("工会战期间,不允许禅让/降职/任命副会长/踢出操作", () => {
			}, this);
			return;
		}
		let info: GuildMemberInfo = this.data;
		let roleID: number = info.roleID;
		switch (e) {
			case this.impeachBtn:
				WarnWin.show(`是否消耗${GlobalConfig.GuildConfig.impeachCost}元宝弹劾会长？（弹劾后成为会长）`, () => {
					if (Actor.yb >= GlobalConfig.GuildConfig.impeachCost) {
						Guild.ins().sendDemise();
					}
					else
						UserTips.ins().showTips("元宝不足");
				}, this);
				break;
			case this.demiseBtn:
				WarnWin.show(`是否禅让会长职位给[${info.name}]`, () => {
					Guild.ins().sendChangeOffice(roleID, GuildOffice.GUILD_BANGZHU);
				}, this);
				break;
			case this.downBtn:
				WarnWin.show(`是否免除[${info.name}]副会长之职`, () => {
					Guild.ins().sendChangeOffice(roleID, GuildOffice.GUILD_MEMBER);
				}, this);
				break;
			case this.kickBtn:
				WarnWin.show(`确定将[${info.name}]踢出公会？`, () => {
					Guild.ins().sendKick(roleID);
				}, this);
				break;
			case this.appointBtn:
				WarnWin.show(`确定任命[${info.name}]为副会长？`, () => {
					if (Guild.ins().canAppointFHZ()) {
						Guild.ins().sendChangeOffice(roleID, GuildOffice.GUILD_FUBANGZHU);
					}
					else
						UserTips.ins().showTips("副会长人数已达上限");
				}, this);
				break;
			default:
				ViewManager.ins().open(PlayerTipsWin, this.data);
				break;
		}
	}

	protected dataChanged(): void {
		if (this.data instanceof GuildMemberInfo) {
			let info: GuildMemberInfo = this.data;
			this.nameLab.textFlow = new egret.HtmlTextParser().parser(`[${GuildLanguage.guildOffice[info.office]}]<font color='#DFDCDC'>${info.name}</font>`);
			this.conLab.text = "贡献度：" + info.contribution;
			this.attack.text = "战斗力：" + info.attack;
			this.face.source = `head_${info.job}${info.sex}`;
			this.headBG.source = ChatListItemRenderer.HEAD_BG[info.sex];
			let downTime: number = 0;
			let myOfiice = Guild.ins().myOffice;
			if( myOfiice == GuildOffice.GUILD_BANGZHU || myOfiice == GuildOffice.GUILD_FUBANGZHU ){
				this.onLine.visible = true;
				if (info.downTime > 0) {
					downTime = (GameServer.serverTime - DateUtils.formatMiniDateTime(info.downTime)) * 0.001;
					// this.onLine.textFlow = new egret.HtmlTextParser().parser(`<font color='#f3311e'>${DateUtils.getFormatBySecond(downTime, 7)}</font>`);
					this.onLine.textFlow = TextFlowMaker.generateTextFlow1(`|C:0xf3311e&T:${DateUtils.getFormatBySecond(downTime, 7)}`);
				} else
					this.onLine.textFlow = new egret.HtmlTextParser().parser(`<font color='#13CE0C'>在线</font>`);
			}else{
				this.onLine.visible = false;
			}

			this.group1.visible = false;
			this.group2.visible = false;
			this.group3.visible = false;

			this.impeachBtn.visible = downTime >= 432000;//5天的秒数

			this.vip.removeChildren();
			this.vip.visible = info.vipLevel > 0;
			this.vipTitle.visible = info.vipLevel > 0;
			if (info.vipLevel < 10) {
				this.vipNum = BitmapNumber.ins().createNumPic(info.vipLevel, 'vip_v');
			} else {
				this.vipNum = BitmapNumber.ins().createNumPic(1, 'vip_v');
				this.vipNum0 = BitmapNumber.ins().createNumPic(0, 'vip_v');
				this.vipNum0.x = 33;
				this.vipNum0.y = -1;
				this.vip.addChild(this.vipNum0);
			}
			this.vipNum.x = 18;
			this.vipNum.y = -1;
			this.vip.addChild(this.vipNum);

			switch (myOfiice) {
				case GuildOffice.GUILD_BANGZHU: {
					if (info.office == GuildOffice.GUILD_BANGZHU)
						break;
					else if (info.office == GuildOffice.GUILD_FUBANGZHU) {
						this.group2.visible = true;
					} else {
						this.group3.visible = true;
						this.appointBtn.visible = true;
					}
				}
					break;
				case GuildOffice.GUILD_FUBANGZHU:
					if (info.office == GuildOffice.GUILD_BANGZHU) {
						this.group1.visible = true;
					} else if (info.office == GuildOffice.GUILD_FUBANGZHU)
						break;
					else {
						this.group3.visible = true;
						this.appointBtn.visible = false;
					}
					break;
				case GuildOffice.GUILD_ZHANGLAO:
				case GuildOffice.GUILD_HUFA:
				case GuildOffice.GUILD_TANGZHU:
					if (info.office == GuildOffice.GUILD_BANGZHU)
						this.group1.visible = true;
					break;
				default:
					break;
			}
		}

	}
}