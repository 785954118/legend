/**
 * Created by Administrator on 2016/7/28.
 */
class ZhuZaiEquipWin extends BaseEuiView {
	/** 关闭按钮 */
	public closeBtn: eui.Button;
	public closeBtn0: eui.Button;

	public tab: eui.TabBar;
	public viewStack: eui.ViewStack;

	public growPanel: ZhuZaiEquipGrowPanel;
	public advancePanel: ZhuzaiEquipAdvancePanel;
	public fenjiePanel: ZhuZaiFenjiePanel;

	public select: number;
	public selectRole: number;

	public redPoint0: eui.Image;
	public redPoint1: eui.Image;
	public redPoint2: eui.Image;

	constructor() {
		super();
	}

	public initUI(): void {
		super.initUI();

		this.skinName = "ZhuzaiEquipSkin";
	}

	public open(...param: any[]): void {

		this.addTouchEvent(this.closeBtn, this.onClick);
		this.addTouchEvent(this.closeBtn0, this.onClick);

		this.selectRole = param[1];
		this.select = param[2];

		this.tab.selectedIndex = param ? param[0] : 0;
		this.viewStack.selectedIndex = this.tab.selectedIndex;
		this.onTabChange();

		this.addChangeEvent(this.tab, this.onTabChange);

		this.observe(ZhuzaiEquip.ins().postZhuZaiData, this.updateRedPoint);
		this.observe(ZhuzaiEquip.ins().postShengjie, this.playEff);
		this.updateRedPoint();
	}

	public close(...param: any[]): void {
		this.removeTouchEvent(this.closeBtn, this.onClick);
		this.removeTouchEvent(this.closeBtn0, this.onClick);

		this.growPanel.close();
		this.advancePanel.close();
		this.fenjiePanel.close();

		this.removeObserve();
	}

	private onTabChange(e?: egret.Event): void {
		this.viewStack.selectedChild['open'](this.selectRole, this.select);
	}

	private onClick(e: egret.TouchEvent): void {
		switch (e.currentTarget) {
			case this.closeBtn:
			case this.closeBtn0:
				ViewManager.ins().close(this);
				break;
		}
	}

	private updateRedPoint(): void {
		let ins: ZhuzaiEquip = ZhuzaiEquip.ins();
		this.redPoint0.visible = ins.canAllLevelup();
		this.redPoint1.visible = ins.canAllAdvance();
		this.redPoint2.visible = false;
	}

	private playEff(b: boolean): void {
		let mc: MovieClip = ObjectPool.pop("MovieClip");
		mc.scaleX = mc.scaleY = 1;
		mc.rotation = 0;
		mc.x = 250;
		mc.y = 330;
		mc.playFile(RES_DIR_EFF + (b ? "successeff" : "faileff"), 1, () => { ObjectPool.push(mc); });
		this.addChild(mc);
	}
}

ViewManager.ins().reg(ZhuZaiEquipWin, LayerManager.UI_Main);