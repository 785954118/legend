/**
 *
 * @author
 *
 */
class StartGameScene extends BaseScene {
	/**
	 * 构造函数
	 */
	public constructor() {
		super();
	}

	/**
	 * 进入Scene调用
	 */
	public onEnter(): void {

		let mgr: RoleMgr = RoleMgr.ins();

		super.onEnter();

		if (LocationProperty.isCanLogin())
			RoleMgr.ins().connectServer();
		else {
			this.addLayer(LayerManager.UI_Main);

			// ViewManager.ins().open(StartGameView);
		}

		RES.loadGroup('gamePer');
	}

	/**
	 * 退出Scene调用
	 */
	public onExit(): void {
		super.onExit();
	}
}
