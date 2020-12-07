class ItemIcon extends BaseComponent {
	public config: ItemConfig;
	public imgBg: eui.Image;
	public imgIcon: eui.Image;
	public imgJob: eui.Image;
	public imgheirloom: eui.Image;
	public actived: eui.Image;//兵魂激活后的框
	public effect: MovieClip;
	public tag: eui.Image;
	public extreme:eui.Image;
	public imgBg1: eui.Image;
	public constructor() {
		super();
		this.skinName = "ItemIconSkin";
	}

	public setSoul(isSoul: boolean): void {
		this.tag.visible = isSoul;
	}

	public setData(config: ItemConfig) {
		this.config = config;
		if (config != null) {
			this.setIconfix(config);
			this.imgIcon.source = config.icon + '_png';
			this.imgBg.source = 'quality' + ItemConfig.getQuality(config);
			let type = ItemConfig.getType(config);
			let job = ItemConfig.getJob(config);
			this.imgJob.source = (type == 0 || type == 4) && job && this.imgJob.visible ? `job${job}Item` : '';
			if (GlobalConfig.ClientGlobalConfig.effectItems.indexOf && GlobalConfig.ClientGlobalConfig.effectItems.indexOf(config.id) >= 0) {
				if (this.effect == null) {
					this.effect = new MovieClip;
					this.effect.x = 35;
					this.effect.y = 35;
					this.addChildAt(this.effect, 2);
					this.effect.addEventListener(egret.Event.ADDED_TO_STAGE, this.resumePlay, this);
				}
				this.effect.playFile(RES_DIR_EFF + 'quality_0' + ItemConfig.getQuality(config));
			}
			else if (this.effect != null) {
				// this.effect.clearCache();
			}
		}
		else {
			this.imgIcon.source = '';
			this.imgBg.source = 'quality0';
			this.imgJob.source = '';
			if (this.effect != null) {
				// this.effect.clearCache();
			}
		}

	}

	/**
	 * 由于策划现在不能改物品表 并且为了不影响物品读取的规律性
	 * 先用这个强行修复错误的icon
	 */
	private setIconfix(config: ItemConfig) {
		switch (config.id) {
			case 200136://精炼石
				config.icon = 200136;
				break;
		}
	}

	private resumePlay(e: Event): void {
		this.effect.play(-1);
	}

	public setActived(b: boolean) {
		this.actived.visible = b;
	}

	public setImgBg1(res?:string){
		this.imgBg1.visible = true;
		this.imgBg.visible = !this.imgBg1.visible;
		if( res )
			this.imgBg1.source = res;
	}

}