class FriendAppListItemRender extends BaseItemRender {
	public img_vipLv0: eui.Image;
	public img_vipLv1: eui.Image;
	public img_userIcon: eui.Image;
	public label_name: eui.Label;
	public btn_yes: eui.Button;
	public btn_no: eui.Button;
	public labelGuild: eui.Label;
	private headBg: eui.Image;
	public constructor() {
		super();
		this.skinName = `FriendsAppListItemSkin`;
	}

	public childrenCreated(): void {
		super.childrenCreated();

		this.btn_yes.addEventListener(egret.TouchEvent.TOUCH_TAP, (e) => {
			Friends.ins().sendAgreeApp(this.data.id, 1);
			e.stopPropagation();
			e.stopImmediatePropagation();
		}, this)

		this.btn_no.addEventListener(egret.TouchEvent.TOUCH_TAP, (e) => {
			Friends.ins().sendAgreeApp(this.data.id, 0);
			e.stopPropagation();
			e.stopImmediatePropagation();
		}, this)

		this.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
			if (this.data)
				ViewManager.ins().open(PlayerTipsWin, this.data);
		}, this);
	}

	public dataChanged(): void {
		super.dataChanged();

		let data: FriendData = this.data;
		this.label_name.text = data.name + "(" + (data.zs > 0 ? data.zs + "转" : "") + data.lv + "级)";
		//this.label_power.text = "战斗力:" + data.power;

		this.img_userIcon.source = `head_${data.job}${data.sex}`;
		this.labelGuild.text = data.guildName;
		let num_0: number = Math.floor(data.vip / 10) || 0;
		let num_1: number = data.vip % 10 || 0;
		if (num_0) {
			this.img_vipLv0.source = `xvip_4${num_0}_png`;
		} else {
			this.img_vipLv0.source = null;
		}
		this.img_vipLv1.source = `xvip_4${num_1}_png`;
		this.headBg.source = ChatListItemRenderer.HEAD_BG[data.sex];
	}
}