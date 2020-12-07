/**
 * 欢迎面板
 */
class WelcomeWin extends BaseEuiView {

	public slogon: eui.Label;
	public sureBtn: eui.Button;
	private sureBtnEff: MovieClip;
	private eff: MovieClip;
	private sureGroup: eui.Group;
	private effgroup:eui.Group;

	constructor() {
		super();
		this.skinName = "welcomePanelSkin";
	}

	public initUI(): void {
		super.initUI();
		let str: string = LocationProperty.appid;
		if (str != "" && GlobalConfig.TerraceDescConfig[str]) {
			this.slogon.text = GlobalConfig.TerraceDescConfig[str].desc;
		} else {
			this.slogon.text = "";
		}
	}

	protected createChildren() {
		super.createChildren();
		this.validateNow();
	}

	public open(...param: any[]): void {
		this.addTouchEvent(this, this.onTap);
		this.playEff();
	}

	public close(...param: any[]): void {
		this.removeTouchEvent(this, this.onTap);
		egret.Tween.removeTweens(this.pic);
	}
	private pic:eui.Image;
	public onTap(e: egret.TouchEvent): void {
		// ViewManager.ins().close(WelcomeWin);
		this.sureBtn.visible = false;
		let tw:egret.Tween = egret.Tween.get(this.pic);
		let playPunView: PlayFunView = ViewManager.ins().getView(PlayFunView) as PlayFunView;
		if( !playPunView || !playPunView.location  )
			return;
		let btn = playPunView.location;
		if( btn ){
			let p:egret.Point = btn.localToGlobal();
			this.sureGroup.globalToLocal(p.x, p.y, p);
			tw.to({scaleX:0,scaleY:0,x:p.x,y:p.y },500).call(()=>{
				ViewManager.ins().close(WelcomeWin);
			});
		}
		if (this.eff) {
			DisplayUtils.removeFromParent(this.eff);
			this.eff = null;
		}
		Hint.ins().postWelcome();
		//Setting.currPart = 1;
		//Setting.currStep = 1;
	}

	public playEff() {
		if (!this.eff) {
			this.eff = new MovieClip;
			this.eff.x = this.sureGroup.width / 2;
			this.eff.y = this.sureGroup.height / 2 - 5;
			this.eff.scaleX = this.effgroup.scaleX;
			this.eff.scaleY = this.effgroup.scaleY;
			this.sureGroup.addChild(this.eff);
		}
		this.eff.playFile(RES_DIR_EFF + 'achieveCom', -1);
	}

}

ViewManager.ins().reg(WelcomeWin, LayerManager.UI_Popup);