/**
 * Created by hrz on 2018/2/3.
 */

class HideBossBtnWin extends BaseEuiView {
    private hideBossBtn:eui.Button;
    private eff_dragon:eui.Group;
    private lbTime:eui.Label;

    private mcBtn:MovieClip;
    private _sec:number;

    constructor(){
        super();

        this.skinName = `HideBossBtnSkin`;
    }

    protected childrenCreated(){

        this.eff_dragon.touchEnabled = false;
        this.eff_dragon.touchChildren = false;

        this.hideBossBtn.visible = false;
        this.eff_dragon.visible = false;
    }

    public initUI(){
        this.hideBossBtn.visible = false;
        this.eff_dragon.visible = false;
    }

    open(...param:any[]) {
        if (param[0]) {
            this.playDragonEff();
        } else {
            this.showBtn();
        }
    }

    private onTap() {
        if (!GameMap.sceneInMain()) {
            UserTips.ins().showCenterTips("|C:0xf3311e&T:请先退出副本后再击杀隐藏BOSS|");
            return;
        }
        if (Encounter.ins().isEncounter()) {
            UserTips.ins().showCenterTips("|C:0xf3311e&T:正在挑战附近的人|");
            return;
        }
        ViewManager.ins().open(HideBossWin);
    }

    private playDragonEff() {
        let mc:MovieClip = ObjectPool.pop(`MovieClip`);
        mc.addEventListener(egret.Event.CHANGE,this.onloadComp,this);
        mc.playFile(`${RES_DIR_EFF}luckyboss_dragon_down`, 1, ()=>{
            mc.removeEventListener(egret.Event.CHANGE,this.onloadComp,this);
            mc.destroy();
        });
        this.eff_dragon.visible = true;
        this.eff_dragon.addChild(mc);
    }

    private onloadComp() {
        TimerManager.ins().doTimer(400,1,this.showBtn, this);
    }

    private showBtn() {
        if (Assert(UserBoss.ins().hideBossData.id, `hideBossData id:${UserBoss.ins().hideBossData.id}`)) {
            ViewManager.ins().close(this);
            return;
        }
        this.hideBossBtn.visible = true;
        this.addTouchEvent(this.hideBossBtn, this.onTap);

        let config = GlobalConfig.MonstersConfig[GlobalConfig.HideBossConfig[UserBoss.ins().hideBossData.id].bossId];
        this.hideBossBtn["headImg"].source = `monhead${config.head}_png`;

        this._sec = Math.floor((DateUtils.formatMiniDateTime(UserBoss.ins().hideBossData.endTime) - GameServer.serverTime)/1000);
        this.lbTime.text = DateUtils.getFormatBySecond(this._sec, DateUtils.TIME_FORMAT_1);

        TimerManager.ins().remove(this.setTime, this);
        TimerManager.ins().doTimer(1000, 0, this.setTime, this);

        if (!this.mcBtn) {
            this.mcBtn = ObjectPool.pop(`MovieClip`);
            this.mcBtn.playFile(RES_DIR_EFF+"luckyboss_hint", -1);
        }
        if (!this.mcBtn.parent)
            this.hideBossBtn['eff_btn'].addChild(this.mcBtn);
    }

    private setTime() {
        if(this._sec > 0) {
            this._sec -= 1;
            this.lbTime.text = DateUtils.getFormatBySecond(this._sec, DateUtils.TIME_FORMAT_1);
        } else {
            UserBoss.ins().hideBossData.id = 0;
            UserBoss.ins().hideBossData.endTime = 0;
            ViewManager.ins().close(this);
        }
    }

    close() {
        if (this.mcBtn) this.mcBtn.destroy();
        this.mcBtn = null;
    }
}

ViewManager.ins().reg(HideBossBtnWin, LayerManager.UI_Main);