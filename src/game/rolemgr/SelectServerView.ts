/**
 *
 * @author 
 *
 */
class SelectServerView extends BaseEuiView {

	public constructor() {
		super();
	}

	public initUI(): void {
		super.initUI();
		this.skinName = "SelectServerSkin";
	}
}

ViewManager.ins().reg(SelectServerView, LayerManager.UI_Main);
