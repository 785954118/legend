/**
 * 怪物攻城
 */
class CityMonsterIconRule extends RuleIconBase {

	public monHead: eui.Image;
	public process: eui.Image;
	public redPoint: eui.Image;

	private _shap: egret.Shape = new egret.Shape();
	private _radius: number = 0;
	public constructor(id:number, t: egret.DisplayObjectContainer) {
		super(id, t);

		this.showMessage = [
			Actor.ins().postLevelChange,
			GameApp.ins().postZeroInit
		];

		this.updateMessage = [
			CityCC.ins().postBossInfo,
			CityCC.ins().postCityBossId,
		];
	}

	protected createTar() {
		let t = super.createTar();

		this.monHead = t["monHead"];
		this.process = t["process"];
		this._radius = t.width >> 1;
		this._shap.x = this._radius
		this._shap.y = this._radius;
		this._shap.rotation = -90;
		t.addChild(this._shap);
		this.process.mask = this._shap;

		return t;
	}

	checkShowIcon(): boolean {
		this.updateIcon();
		return GameServer.serverOpenDay && OpenSystem.ins().checkSysOpen(SystemType.CITYMONSTER);
	}

	checkShowRedPoint(): number {
		this.updateIcon();
		return CityCC.ins().cityBossId;
	}

	tapExecute(): void {
		ViewManager.ins().open(CityBossView);
	}

	getEffName(redPointNum: number): string {
		return undefined;
	}
	updateIcon(): void {
		let bossId = CityCC.ins().cityBossId;
		if (bossId == 0) {
			let [id, value] = CityCC.ins().getMaxKillNumBoss();
			bossId = id;
			this.curAngle = MathUtils.toInteger(value * 360);
		}
		else
			this.curAngle = 360;

		if(!GlobalConfig.MonstersConfig[bossId]) return;

		if(this.monHead) this.monHead.source = 'monhead' + GlobalConfig.MonstersConfig[bossId].head + '_png';
	}

	public set curAngle(value: number) {
		DisplayUtils.drawCir(this._shap, this._radius, value);
	}
}