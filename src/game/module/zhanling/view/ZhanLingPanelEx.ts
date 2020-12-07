/**
 * 战灵皮肤界面
 *
 */
class ZhanLingPanelEx extends ZhanLingPanel {
	constructor() {
		super();
		this.skinName = 'ZhanlingSkin';
		this.isTopLevel = true;
	}

	public open(...param: any[]): void {
		this.openView(param);
	}

}
ViewManager.ins().reg(ZhanLingPanelEx, LayerManager.UI_Main);
