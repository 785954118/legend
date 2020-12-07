/**
 * Created by Peach.T on 2017/10/18.
 */
class CityBossView extends BaseEuiView {
    public roleSelect:BaseComponent;
    public viewStack:eui.ViewStack;
    public personalBoss:MonsterCityWarView;
    public tab:eui.TabBar;
    public redPoint0:eui.Image;
    public redPoint1:eui.Image;
    public seeRule:eui.Button;
    public npc:BaseComponent;

    private lastSelect: number = 0;
    private closeBtn0:eui.Button;
    public constructor() {
        super();
        this.skinName = `CitySkin`;
        this.isTopLevel = true;//设为1级UI
    }
    public open(...param: any[]): void {
        this.addTouchEvent(this.closeBtn0, this.onTap);
        this.tab.addEventListener(egret.Event.CHANGE, this.setSelectedIndex, this);
        this.addTouchEvent(this.seeRule, this.onSeeRule);
        this.viewStack.selectedIndex = 0;
        this.viewStack.getElementAt(0)['open']();
    }
    public close(...param: any[]): void{
        this.removeTouchEvent(this.closeBtn0, this.onTap);
    }
    private onTap(e: egret.TouchEvent): void {
        switch (e.currentTarget) {
            case this.closeBtn0:
                ViewManager.ins().close(this);
                break;
        }
    }
    private onSeeRule(e: egret.TouchEvent):void
    {
        ViewManager.ins().open(ZsBossRuleSpeak, 16);
    }

    private setSelectedIndex(e: egret.Event) {
        this.viewStack.getElementAt(this.lastSelect)['close']();
        this.lastSelect = this.viewStack.selectedIndex;
        this.viewStack.getElementAt(this.lastSelect)['open']();
    }
}

ViewManager.ins().reg(CityBossView, LayerManager.UI_Main);