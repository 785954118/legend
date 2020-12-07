class DressItemRenderer extends eui.ItemRenderer {
	public imgIcon: eui.Image;
	public imageName: eui.Label;
	public timelabel: eui.Label;
	public levellabel: eui.Label;
	public selectImage: eui.Image;
	public huanhuaImage: eui.Image;
	public redPoint0: eui.Image;

	constructor() {
		super();
		this.skinName = "DressItemSkin";
	}

	public dataChanged(): void {
		let config: DressItemInfo = this.data;
		if (config == null) return;
		this.redPoint0.visible = false;
		let id: number = config.zhuanban.cost["itemId"];
		if (config.lv) {
			this.timelabel.visible = true;
			this.imgIcon.source = id + "_png";
		}
		else {
			this.timelabel.visible = false;
			this.imgIcon.source = id + "_png";
		}
		this.redPoint0.visible = Dress.ins().redPointDress(config.zhuanban.id);

		this.imageName.text = config.zhuanban.name;
		if (config.isDress)
			this.huanhuaImage.visible = true;
		else
			this.huanhuaImage.visible = false;
		if (config.timer == 0)
			this.timelabel.textFlow = new egret.HtmlTextParser().parser(StringUtils.addColor("永久", 0x35e62d));
		else if (config.timer > 0)
			this.timelabel.text = this.updateTimer(config.timer)
		else
			this.timelabel.visible = false;
		if(config.lv > 1) {
			this.levellabel.text = `${config.lv}级`;
		} else {
			this.levellabel.text = `1级`;
		}
	}

	private updateTimer(timer: number): string {
		let str: string = "";
		let endTimer: number = (DateUtils.formatMiniDateTime(timer) - GameServer.serverTime) / 1000;
		if (endTimer >= 0) str = DateUtils.getFormatBySecond(endTimer, 5, 2)
		return str;
	}

	public set selected(value: boolean) {
		this.selectImage.visible = value;
	}
}