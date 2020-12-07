/**
 * 跨服boss主界面UI
 *
 */
class KFBossSceneWin extends BaseEuiView {
	public nameTxt: eui.Label;
	public endGroup: eui.Group;
	public leftTime: eui.Label;
	public winnerName: eui.Label;


	public constructor() {
		super();
		this.skinName = `kfBossSceneSkin`;

	}

	public open(...args): void {
		this.observe(KFBossSys.ins().postBroadcastResult, this.bossEnd);

		this.endGroup.visible = false;
		let curFbId: number = GameMap.fubenID;
		for (let key in GlobalConfig.CrossBossConfig) {
			if (curFbId == GlobalConfig.CrossBossConfig[key].fbid) {
				let dp: CrossBossConfig = GlobalConfig.CrossBossConfig[key];
				let info = KFBossSys.ins().fbInfo[dp.id];
				let serverName = window['getServerName'](info.serverId)
				this.nameTxt.text = dp.sceneName == `跨服战场` ? `[${serverName}]跨服战场` : `苍月岛`;
				break;
			}
		}


	}

	public close(...args): void {
		TimerManager.ins().removeAll(this);
		Tween.removeTweens(this.endGroup);
	}

	private bossEnd(winner: string): void {
		if (GameMap.fbType == UserFb.FB_TYPE_KF_BOSS) {
			this.endGroup.visible = true;
			this.endGroup.alpha = 1;
			this.winnerName.text = `最终归属者是：${winner}`;

			TimerManager.ins().doTimer(10000, 1, () => {
				Tween.get(this.endGroup).to({"alpha": 0}, 300).call(() => {
					this.endGroup.visible = false;
				});
			}, this);
		}
	}
}

ViewManager.ins().reg(KFBossSceneWin, LayerManager.UI_Main);