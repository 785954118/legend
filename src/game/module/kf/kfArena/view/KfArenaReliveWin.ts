/**
 * Created by MPeter on 2018/3/15.
 * 跨服3v3复活框
 */
class KfArenaReliveWin extends BaseEuiView {
	public reliveBtn: eui.Button;
	public exitBtn: eui.Button;
	public killTips: eui.Label;
	public reliveTxt: eui.Label;
	public reliveTimesTxt: eui.Label;
	private alive: eui.Label;
	private remainM: number = 0;

	public constructor() {
		super();
		this.skinName = "WorldBossGoldSkin";
	}

	protected childrenCreated(): void {
		this.reliveBtn.visible = false;
		this.alive.visible = false;
	}

	public open(...param): void {
		this.setWin(param[0], param[1]);
	}

	private setWin(cd, killerHandler: number): void {
		if (killerHandler > 0) {
			let killer = EntityManager.ins().getEntityByHandle(killerHandler);
			let str: string = "";
			if (killer) {
				let masterKiller = EntityManager.ins().getEntityByHandle(killer.infoModel.masterHandle);//如果是召唤兽 就是它主人的handler
				if (killer instanceof CharRole) {
					str = killer.infoModel.name;
				}
				else if (killer.infoModel.masterHandle && masterKiller) {
					str = `${masterKiller.infoModel.name}`;
				}
				else {
					str = `Boss${killer.infoModel.name}`;
				}
			}

			this.killTips.textFlow = TextFlowMaker.generateTextFlow1(`你被|C:${0x23C42A}&T:${str}|击败`)
		}

		this.reliveTimesTxt.text = cd + "秒";
		TimerManager.ins().remove(this.refushLabel, this);
		this.remainM = cd;
		TimerManager.ins().doTimer(1000, this.remainM, this.refushLabel, this, this.overTime, this);


	}


	private refushLabel(): void {
		this.remainM--;
		this.reliveTimesTxt.text = this.remainM + "秒";
	}

	private overTime(): void {
		ViewManager.ins().close(this);
	}

}
ViewManager.ins().reg(KfArenaReliveWin, LayerManager.UI_Popup);
