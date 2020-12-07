class GuildAppltListItemRender extends BaseItemRender {

	private nameLab: eui.Label;
	private attack: eui.Label;
	private ok: eui.Button;
	private cancel: eui.Button;
	private myFace: eui.Image;
	public attack0: eui.Label;
	public vip: eui.Group;
	private vipTitle: eui.Image;
	private vipNum: egret.DisplayObjectContainer;
	private vipNum0: egret.DisplayObjectContainer;

	public constructor() {
		super();
		this.skinName = "MemberApplyItemSkin";
	}

	public onTap(e: eui.Button): void {
		//工会战期间  不允许对申请玩家进行操作
		if( GuildWar.ins().getModel().isWatStart ){
			WarnWin.show("工会战期间,不允许对申请玩家进行操作", () => {
			}, this);
			return;
		}
		switch (e) {
			case this.ok:
				let commentLv = Guild.ins().getBuildingLevels(GuildBuilding.GUILD_COMMENT - 1) || 0;
				let exmember = commentLv?GlobalConfig.GuildConfig.affairMember[commentLv-1]:0;
				if (Guild.ins().getMemberNum() >= (GlobalConfig.GuildConfig.maxMember[Guild.ins().guildLv - 1] + exmember)) {
					UserTips.ins().showTips("|C:0xf3311e&T:公会成员已满|");
					return;
				}
				Guild.ins().sendProcessJoin(this.data.roleID, 1);
				break;
			case this.cancel:
				Guild.ins().sendProcessJoin(this.data.roleID, 0);
				break;
		}
	}

	protected dataChanged(): void {
		if (this.data instanceof GuildApplyInfo) {
			let info: GuildApplyInfo = this.data;
			if (info.vipLevel > 0) {
				this.nameLab.x = 162;
			} else {
				this.nameLab.x = 109;
			}
			let name: string = "<font color='#C2BAA5'>" + info.name + "</font>";
			this.nameLab.textFlow = (new egret.HtmlTextParser).parser(name);
			// this.attack.text = "战斗力：" ;
			this.attack0.text = info.attack + "";
			this.myFace.source = `head_${info.job}${info.sex}`;

			this.vipTitle.visible = info.vipLevel > 0;
			// this.vip.addChild(this.vipTitle)
			//VIP等级
			// this.vip.removeChildren();
			// this.vip.visible = info.vipLevel > 0;
			// if (info.vipLevel < 10) {
			// 	this.vipNum = BitmapNumber.ins().createNumPic(info.vipLevel, 'vip_v');
			// } else {
			// 	this.vipNum = BitmapNumber.ins().createNumPic(1, 'vip_v');
			// 	this.vipNum0 = BitmapNumber.ins().createNumPic(0, 'vip_v');
			// 	this.vipNum0.x = 33;
			// 	this.vipNum0.y = 4;
			// 	this.vip.addChild(this.vipNum0);
			// }
			// this.vipNum.x = 18;
			// this.vipNum.y = 4;
			// this.vip.addChild(this.vipNum);
		}
	}
}