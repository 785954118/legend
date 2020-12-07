class BossRewardsItem extends BaseItemRender {
	private experience:ItemBase;
	private randomRune:ItemBase;
	private runeCream:ItemBase;
	private target:ItemBase;
	private leftlabel:eui.Label;
	private labelGroup:eui.Group;
	constructor() {
		super();
	}

	public dataChanged(): void {
		let rewards:RewardData[] = this.data.rewards;
		this.experience.data = rewards[0];
		// this.experience.setItemImg(RewardData.getCurrencyRes(0));
		this.randomRune.data = rewards[1];
		this.runeCream.data = rewards[2];

		//战纹锁
		let model: SkyLevelModel = SkyLevelModel.ins();
		let nextCfg: FbChallengeConfig = model.getNextOpenLevel();
		if (nextCfg) {
			if( !this.target.data ){
				this.target.data = nextCfg.showIcon;
			}
			let curCfg:FbChallengeConfig = GlobalConfig.FbChallengeConfig[model.cruLevel];

			let cfg:ItemConfig = GlobalConfig.ItemConfig[nextCfg.showIcon];
			let runeType:number = ItemConfig.getQuality(cfg);
			let endstr = "层解锁";
			if( runeType == FBChallengePanel.RunType )
				endstr = `层获得`;
			if( curCfg.group == nextCfg.group )
				this.leftlabel.text = `${nextCfg.layer}`+endstr;
			else
				this.leftlabel.text = `再闯${nextCfg.id - curCfg.id}`+endstr;
			// //解锁战纹类型
			// if (nextCfg.equipPos) {
			// 	this.leftlabel.text = `${nextCfg.layer}层开启新战纹槽`;
			// }
			// //开启新战纹槽
			// else {
			// 	this.leftlabel.text = `${nextCfg.layer}层解锁新类型`;
			// }

		}

		this.labelGroup.visible = this.target.visible = nextCfg && GameMap.fbType != UserFb.FB_TYPE_HUN_SHOU;
	}


}