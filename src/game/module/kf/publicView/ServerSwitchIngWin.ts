/**
 * Created by MPeter on 2017/12/16.
 * 跨服-切换服务器中提示窗口
 */
class ServerSwitchIngWin extends BaseEuiView {
	/**切换提示标签 */
	private switchLabel: eui.Label;


	private symbolStrs: string[] = [`.`, '..', '...'];
	private _tick: number = 0;
	public constructor() {
		super();
		this.skinName = `KFSwitchServerSkin`;
	}
	public open(...args): void {
		this._tick = 0;
		TimerManager.ins().doTimer(500, 0, () => {
			this._tick++;
			this.switchLabel.text = `服务器切换中${this.symbolStrs[this._tick % 3]}`;
		}, this);
	}
	public close(...args): void {
        TimerManager.ins().removeAll(this);
	}
}

ViewManager.ins().reg(ServerSwitchIngWin, LayerManager.UI_Popup);
