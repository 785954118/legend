/**
 * 游戏场景
 */
class MainScene extends BaseScene {
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
		super.onEnter();

		this.addLayerAt(LayerManager.Game_Bg, 1);

		this.addLayerAt(LayerManager.Game_Main, 2);

		this.addLayer(LayerManager.Main_View);
		this.addLayer(LayerManager.UI_Main);
		this.addLayer(LayerManager.UI_Main2);
		this.addLayer(LayerManager.UI_Popup);
		this.addLayer(LayerManager.UI_Tips);

		ViewManager.ins().open(GameSceneView);
		ViewManager.ins().open(ChatMainUI);
		ViewManager.ins().open(UIView2);
		ViewManager.ins().open(TipsView);

		SoundManager.ins().stopBg();

		GameApp.ins().postLoginInit();
		//解决ios不播放音乐bug
		if (DeviceUtils.IsMobile) {
			egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchPlaySound, this);
		}
	}

	private onTouchPlaySound(){
		egret.MainContext.instance.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchPlaySound, this);
		SoundUtil.ins().playEffect(SoundUtil.WINDOW);
	}

	/**
	 * 退出Scene调用
	 */
	public onExit(): void {
		super.onExit();
	}
}
