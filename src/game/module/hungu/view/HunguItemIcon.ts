class HunguItemIcon extends BaseComponent {
	public config: ItemConfig;
	public icon:eui.Image;
	public constructor() {
		super();
		this.skinName = "hunyuItemSkin";
	}

	public setData(config: ItemConfig) {
		this.config = config;
		if (config) {
			this.icon.source = config.icon + '_png';
		}
	}

}