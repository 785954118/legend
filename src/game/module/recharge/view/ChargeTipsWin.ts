/**
 * 充值提示
 * 为了防止调用第三方SDK充值接口时，充值界面没有加载出来或者延迟等问题，而造成玩家操作卡住的情况
 */
class ChargeTipsWin extends BaseEuiView {

	constructor() {
		super();
	}
	public initUI(): void {
		super.initUI();
		this.skinName = "ChargeTipsSkin";
	}
	
}
ViewManager.ins().reg(ChargeTipsWin, LayerManager.UI_Tips);
