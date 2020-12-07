class EncounterBgWin extends BaseEuiView {
	constructor() {
		super();
		this.skinName = "ZaoYuBGSkin";
		this.isTopLevel = true;
		// this.setSkinPart("roleSelect", new RoleSelectPanel());
		this.encounterPanel = new EncounterInfoWin();
		this.viewStack.addChild(this.encounterPanel);
		this.tab.dataProvider = this.viewStack;
	}

	public viewStack: eui.ViewStack;
	private encounterPanel: EncounterInfoWin;
	private btnClose: eui.Button;
	private btnClose0: eui.Button;
	private tab: eui.TabBar;
	private roleSelect: RoleSelectPanel;

	public open() {
		this.roleSelect.hideRole();
		this.addTouchEvent(this.btnClose, this.onTap);
		this.addTouchEvent(this.btnClose0, this.onTap);
		this.encounterPanel.open();
	}

	public close() {
		this.encounterPanel.close();
	}

	public onTap(e: egret.Event) {
		switch (e.target) {
			case this.btnClose:
			case this.btnClose0:
				ViewManager.ins().close(EncounterBgWin);
				break;
		}
	}
}


ViewManager.ins().reg(EncounterBgWin, LayerManager.UI_Main);