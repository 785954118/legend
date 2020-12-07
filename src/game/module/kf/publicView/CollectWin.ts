/**
 * Created by MPeter on 2018/1/17.
 * 跨服战场-采集进度条
 */
class CollectWin extends BaseEuiView {
	public progressGroup: eui.Group;
	public progressBar: eui.ProgressBar;
	public barBg1: eui.Image;
	public state: eui.Label;
	public effGroup: eui.Group;

	/**值特效 */
	private bgmc: MovieClip;

	public constructor() {
		super();
		this.skinName = `CollectSkin`;
		this.progressBar.labelFunction = (value, maximum): string => {
			return '';
		}

	}

	protected childrenCreated(): void {
		this.progressBar.value = 0;
		this.progressBar.visible = false;

		this.bgmc = new MovieClip();
		this.bgmc.playFile(RES_DIR_EFF + "jindutiaoeff1", -1);
		this.bgmc.scaleY = 2;
		this.bgmc.scaleX = 1.25;
		this.effGroup.width = 260;
		this.effGroup.height = 50;
		this.effGroup.scrollEnabled = true;
		this.effGroup.addChild(this.bgmc);
	}

	public open(...param): void {
		this.state.text = `${Actor.myName} 正在采集中...`;
		Tween.removeTweens(this.effGroup);
		this.effGroup.width = 0;
		Tween.get(this.effGroup).to({width: 260}, param[1] * 1000);
	}

	public close(...param): void {
		Tween.removeTweens(this.effGroup);
	}
}

ViewManager.ins().reg(CollectWin, LayerManager.UI_Popup);