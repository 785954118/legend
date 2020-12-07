// TypeScript file

class ChritmasSnowMainItem extends BaseItemRender {
    private boxUnder:eui.Image;
    private goBtn:eui.Button;
    private redPoint:eui.Group;
    private reward:ItemBase;
    private schedule:eui.Label;

    private states:string[] = [`lingqu`,`normal`,`done`];

    constructor(){
        super();
        this.skinName = `snowManItemSkin`;
    }

    protected childrenCreated(){
        this.goBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
    }

    private onTap(e:egret.TouchEvent) {
        let config:ActivityType7Config = this.data;
        Activity.ins().sendReward(config.Id, config.index);
    }

    dataChanged() {
        let config:ActivityType7Config = this.data;
        let data:ActivityType7Data = Activity.ins().getActivityDataById(config.Id) as ActivityType7Data;
        let state = data.getAwardState(config.index);
        if (state == Activity.Geted)
            this.currentState = this.states[2];
        else if (state == Activity.CanGet)
            this.currentState = this.states[0];
        else {
            this.currentState = this.states[1];
            this.schedule.textFlow = TextFlowMaker.generateTextFlow1(`|C:0x00ff00&T:${config.score}|雪球`);
        }

        this.reward.data = config.rewards[0];
        this.reward.hideName();
    }
}