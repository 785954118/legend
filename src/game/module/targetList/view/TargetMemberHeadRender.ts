class TargetMemberHeadRender extends WorldBossHeadRender {

	public constructor() {
		super();
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
	}

	public dataChanged(): void {
		super.dataChanged();
		this.removeAttEffect();
	}

	public onTap(e: egret.TouchEvent): void {
		if (!isNaN(this.data)) {
			this.showEffect();
			SysSetting.ins().setValue("mapClickTx", 0);
			SysSetting.ins().setValue("mapClickTy", 0);
			if (KFBossSys.ins().flagHandle == parseInt(this.data)) {
				if (KFBossSys.ins().flagCD - egret.getTimer() > 0) {
					UserTips.ins().showTips(`|C:${ColorUtil.RED}&T:旗子未刷新！|`);
				}
				else {
					KFBossSys.ins().sendCollectFlag();//跨服boss采旗
				}

			}
			else if (KfArenaSys.ins().flagHandle == parseInt(this.data)) {
				if (KfArenaSys.ins().flagCD - egret.getTimer() > 0) {
					UserTips.ins().showTips(`|C:${ColorUtil.RED}&T:旗子未刷新！|`);
				}
				else {
					KfArenaSys.ins().sendCollectFlag();//跨服竞技场采旗
				}


			} else GameLogic.ins().postChangeAttrPoint(this.data);
		}

	}
}