class GuildMemberItem1Render extends BaseItemRender {

	private nameLab: eui.Label;
	private office: eui.Label;
	private conLab: eui.Label;
	private vip: eui.Group;
	private monthcard: eui.Image;
	private vipTitle: eui.Image;
	private vipNum: egret.DisplayObjectContainer;
	private vipNum0: egret.DisplayObjectContainer;
	public zuncard: eui.Image;


	public constructor() {
		super();
		this.skinName = "MemberItemSkin";
	}
	public dataChanged(): void {
		if (this.data instanceof GuildMemberInfo) {
			let info: GuildMemberInfo = this.data;
			if (info) {
				this.nameLab.text = info.name;
				this.office.text = GuildLanguage.guildOffice[info.office];
				this.conLab.text = info.contribution + "";
				this.monthcard.visible = false;//info.monthCard == 1;
				this.vip.removeChildren();
				// if(info.vipLevel<10)
				// {
				// 	this.vip.addChild(BitmapNumber.ins().createNumPic(info.vipLevel, 'vip_v'));
				// }else{
				// 	this.vip.addChild(BitmapNumber.ins().createNumPic(0, 'vip_v1'));
				// }

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
			}
		}
	}
}