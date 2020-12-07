/**
 * Created by hrz on 2017/12/15.
 */

class ChristmasRechargeItem extends BaseItemRender {
    private reward:ItemBase;
    private schedule:eui.Label;
    private lingqu:eui.Image;
    private redPoint:eui.Group;
    private ball:eui.Image;

    constructor(){
        super();
    }

    dataChanged(){
        let config:ActivityType3Config| PActivity3Config;
        let actData:ActivityType3Data|PActivityType3Data;
        if( this.data instanceof ActivityType3Config ){
            config = this.data as ActivityType3Config;
            actData = Activity.ins().getActivityDataById(config.Id) as ActivityType3Data;
        }else if( this.data instanceof PActivity3Config ){
            config = this.data as PActivity3Config;
            actData = PActivity.ins().getActivityDataById(config.Id) as PActivityType3Data;
        }
        this.reward.data = config.rewards[0];
        this.reward.hideName();

        this.schedule.textFlow =  TextFlowMaker.generateTextFlow1(`|C:0x00ff00&T:${Math.floor(actData.chongzhiTotal/100)}|/${Math.floor(config.val/100)}`);

        let state = actData.getRewardStateById(config.index);
        if (state == Activity.Geted) {
            this.lingqu.visible = true;
            this.redPoint.visible = false;
            this.reward.touchEnabled = true;
            this.reward.touchChildren = true;
            this.ball.source = `cd_treeitembg2`
        } else if (state == Activity.CanGet) {
            this.lingqu.visible = false;
            this.redPoint.visible = true;
            this.reward.touchEnabled = false;
            this.reward.touchChildren = false;
            this.ball.source = `cd_treeitembg2`
        } else {
            this.lingqu.visible = false;
            this.redPoint.visible = false;
            this.reward.touchEnabled = true;
            this.reward.touchChildren = true;
            this.ball.source = `cd_treeitembg1`
        }
    }
}