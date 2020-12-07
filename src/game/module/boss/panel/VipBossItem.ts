class VipBossItem extends BaseItemRender {
	private bg:eui.Image;
	constructor() {
		super();
	}

	public dataChanged(): void {
		if (!this.data) return;
		let index = this.itemIndex+1
		let config:BossHomeConfig = GlobalConfig.BossHomeConfig[index];
		this.bg.source = `vipbossb${index}`;
	}
}