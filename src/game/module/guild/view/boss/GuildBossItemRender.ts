class GuildBossItemRender extends BaseItemRender {
	private bossname: eui.Label;
	private rankTxt: eui.Label;
	private bossImage: eui.Image;
	private bosshp: eui.ProgressBar;
	private redPoint0: eui.Image;
	public passImg: eui.Image;

	public constructor() {
		super();
		this.skinName = "GuildBossItemSkin";
		this.bosshp.maximum = 100;
		this.bosshp.slideDuration = 0;
	}

	protected dataChanged(): void {
		let id: number = GuildBoss.ins().passId;
		let index: number = this.data + 1;
		let config: GuildBossInfoConfig = GlobalConfig.GuildBossInfoConfig[index];

		let bossConfig: MonstersConfig = GlobalConfig.MonstersConfig[config.boss["monId"]];
		this.bossImage.source = config.ShowImg;//`gb_b${index}`;
		// let state: number = GuildBoss.ins().passRecord[index];
		if (this.data < id) {
			this.bossname.textColor = 0x9F946D;
			this.bosshp.value = 0;

			let state: number = GuildBoss.ins().passRecord[index];
			this.passImg.visible = true;
			this.redPoint0.visible = GuildBoss.ins().isOpen() && (state == 1);
		} else if (this.data == id) {
			this.bossname.textColor = 0xD1C28F;
			this.bosshp.value = Math.ceil(((bossConfig.hp - GuildBoss.ins().bossHP) / bossConfig.hp) * 10000) / 100 >> 0;
			this.redPoint0.visible = GuildBoss.ins().isOpen() && GuildBoss.ins().leftTimes > 0 ? true : false;
			this.passImg.visible = false;
		} else {
			this.bossname.textColor = 0xD1C28F;
			this.bosshp.value = 100;
			this.redPoint0.visible = false;
			this.passImg.visible = false;
		}
		this.bossname.text = `${index}.${bossConfig.name}`;
	}

	private isOpen() {
		return new Date().getDay() != GlobalConfig.GuildBossConfig.notOpenDayOfWeek;
	}
}