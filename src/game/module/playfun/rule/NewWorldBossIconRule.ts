/**
 * Created by hrz on 2017/9/13.
 */

class NewWorldBossIconRule extends RuleIconBase {
    private alertText: eui.Label;
    constructor(id:number,t: egret.DisplayObjectContainer){
        super(id, t);

        this.showMessage = this.updateMessage = [
            UserBoss.ins().postNewBossOpen
        ];
    }

    protected createTar(){
        let t = super.createTar();
        this.alertText = new eui.Label();
        // this.alertText.fontFamily = "黑体";
        this.alertText.size = 14;
        this.alertText.width = 120;
        this.alertText.textAlign = "center";
        this.alertText.textColor = 0x35e62d;
        this.alertText.horizontalCenter = 0;
        t.addChild(this.alertText);
        this.alertText.y = 70;

        if (UserBoss.ins().newWorldBossData.startTime) {
            this.runTime();
            if(!TimerManager.ins().isExists(this.runTime, this)) TimerManager.ins().doTimer(1000, 0, this.runTime, this);
        } else {
            this.alertText.text = "活动结束";
        }
        return t;
    }

    private runTime(): void {
        let time: number = Math.floor((UserBoss.ins().newWorldBossData.startTime - GameServer.serverTime)/1000);
        if (time >= 0) {
            this.alertText.text = DateUtils.getFormatBySecond(time, DateUtils.TIME_FORMAT_12)
        }else if (GlobalConfig.NewWorldBossBaseConfig.bossTime*1000+UserBoss.ins().newWorldBossData.startTime > GameServer.serverTime) {
            this.alertText.text = "";
        } else {
            this.alertText.text = "活动结束";
            TimerManager.ins().remove(this.runTime, this);
            this.updateShow();
        }
    }

    checkShowIcon(): boolean {
        if( !GameServer.serverOpenDay )return false;
        let b = UserBoss.ins().newWorldBossData.isOpen;
        if (b && UserBoss.ins().newWorldBossData.startTime) {
            if(!TimerManager.ins().isExists(this.runTime, this)) TimerManager.ins().doTimer(1000, 0, this.runTime, this);
        }
        return b;
    }

    checkShowRedPoint(): number {
        return GameServer.serverTime > UserBoss.ins().newWorldBossData.startTime && (GlobalConfig.NewWorldBossBaseConfig.bossTime*1000+UserBoss.ins().newWorldBossData.startTime > GameServer.serverTime) ? 1 : 0;
    }

    getEffName():string {
        if(this.checkShowRedPoint()){
            this.effX = 38;
            this.effY = 38;
            return "actIconCircle";
        }
        return "";
    }

    tapExecute(): void {
        ViewManager.ins().open(NewWorldBossWin);
    }
}