/**
 * 活动类型17
 * Created by MPeter 2017/12/17
 */
class OSATarget17Panel1 extends ActivityPanel {
    public infoBg: eui.Group;
    /**当前积分 */
    public inte: eui.Label;
    /**当天充值 */
    public recharge: eui.Label;
    /**累计获得积分 */
    public accinte: eui.Label;
    /**剩余时间 */
    public endtime: eui.Label;
    /**红点 */
    private redPoint: eui.Image;
    /**转盘按钮 */
    public luckyzp: eui.Button;
    /**帮助按钮 */
    public help: eui.Button;

    public star001: eui.Image;
    public star002: eui.Image;
    public star003: eui.Image;
    public star004: eui.Image;
    public star005: eui.Image;
    public star006: eui.Image;
    public star007: eui.Image;
    public star008: eui.Image;
    public star009: eui.Image;
    public star010: eui.Image;
    public star011: eui.Image;
    public star012: eui.Image;
    public star013: eui.Image;
    public star014: eui.Image;
    public star015: eui.Image;

    public star101: eui.Image;
    public star102: eui.Image;
    public star103: eui.Image;
    public star104: eui.Image;
    public star105: eui.Image;
    public star106: eui.Image;
    public star107: eui.Image;
    public star108: eui.Image;

    public star201: eui.Image;
    public star202: eui.Image;
    public star203: eui.Image;
    public star204: eui.Image;
    public star205: eui.Image;

    public showPanel: Function;
    public constructor() {
        super();
        this.skinName = `luckyStarSkin`;
    }

    public close(...param: any[]): void {
        this.removeObserve();
        this.$onClose();

        TimerManager.ins().removeAll(this);
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.luckyzp, this.gotoLuckTurn);
        this.addTouchEvent(this.help, this.openHelp);

        this.updateData();
        this.refRedpoint();
    }
    /**更新数据 */
    public updateData(): void {
        let data: ActivityType17Data = Activity.ins().activityData[this.activityID] as ActivityType17Data;
        if( !data )return;
        let config1: ActivityType17_1Config[] = GlobalConfig.ActivityType17_1Config[this.activityID];


        this.inte.text = data.score + "";
        this.recharge.text = data.curRecharge + "";
        this.endtime.text = data.overDay + `天`;
        let addScore: number = 0;

        for (let n in data.actStar) {
            //计算累计积分
            addScore += data.actStar[n] * config1[n].score;
            //点亮星星
            for (let i: number = 1; i <= config1[n].star; i++) {
                let indexStr: string = i < 10 ? `0${i}` : i + "";
                if (i <= data.actStar[n]) {
                    this[`star${parseInt(n) - 1}${indexStr}`].source = `star${parseInt(n) + 3}`;
                }
                else this[`star${parseInt(n) - 1}${indexStr}`].source = `star1`;
            }
        }

        //计算总积分
        let totalScore: number = 0;
        for (let key in config1) {
            totalScore += config1[key].score * config1[key].star;
        }
        this.accinte.text = addScore + "/" + totalScore;
    }

    /**跳转到幸运转盘 */
    private gotoLuckTurn(): void {
        if (this.showPanel) this.showPanel(2);
    }
    /**查看帮助 */
    private openHelp(): void {
        ViewManager.ins().open(CommonHelpWin, GlobalConfig.HelpInfoConfig[26].text);
    }

    private refRedpoint(): void {
        let data: ActivityType17Data = Activity.ins().activityData[this.activityID] as ActivityType17Data;
        if( data )
            this.redPoint.visible = data.checkRedPoint();
    }

}
