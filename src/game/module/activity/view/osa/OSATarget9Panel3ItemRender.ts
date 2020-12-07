/**
 * 9类型3 转盘控件
 */
class OSATarget9Panel3ItemRender extends BaseItemRender {
    private turntime:eui.Label;
    private gift:ItemBase;
    private lingqu:eui.Image;
    private isget:eui.Group;
    private redPoint:eui.Image;

    private activityID:number;
    private index:number;
    private alreadyTime:eui.Label;
    private targetTime:eui.Label;
    private ins:Activity|PActivity;
    private actType:number;
    constructor(){
        super();
        this.skinName = `luckyTurntableItemSkin`;

    }

    protected childrenCreated() {
        super.childrenCreated();
        this[`isget`].addEventListener(egret.TouchEvent.TOUCH_END, this.onTap, this);
    }

    private onTap(e:egret.TouchEvent) {
        let itemicon:ItemIcon = this[`gift`].getItemIcon();
        this.flyItemEx(itemicon);
        this.ins.sendReward(this.activityID,0,this.index+1);
    }

    dataChanged() {
        super.dataChanged();
        if( !this.data || ( !(this.data.config instanceof ActivityType9Config) && !(this.data.config instanceof PActivity9Config) ))return;
        this.actType = this.data.actType;
        let config = this.data.config;
        this.activityID = config.Id;
        let i = this.index = this.data.index;
        let data: ActivityType9Data|PActivityType9Data;
        if( this.actType == ActivityType.Normal ){
            this.ins = Activity.ins();
            data = this.ins.activityData[config.Id] as ActivityType9Data;
        }else if( this.actType == ActivityType.Personal ){
            this.ins = PActivity.ins();
            data = this.ins.activityData[config.Id] as PActivityType9Data;
        }
        // this[`turntime`].text = config.reward[i].times;
        if( !data )return;
        this.targetTime.text = `/`+config.reward[i].times;

        this[`gift`].data = {id:config.reward[i].id,type:config.reward[i].type,count:config.reward[i].count};
        this[`gift`].isShowName(false);
        // this[`gift`].showNum(false);
        // this[`bar`].maximum = 100;
        this[`lingqu`].touchEnabled = false;
        let color = 0;
        let curCount = data.count >= config.reward[i].times?config.reward[i].times:data.count;
        if( data.record >> (i+1) & 1 ){
            //已领取
            // this[`bar`].value = 100;
            this[`lingqu`].visible = true;
            this[`isget`].touchEnabled = false;//点击飞道具
            color = 0x00ff00;
        }else{
            //未领取
            this[`lingqu`].visible = false;
            if( data.count >= config.reward[i].times ){
                //可领取
                // this[`bar`].value = 100;
                this[`isget`].touchEnabled = true;//点击飞道具
                color = 0x00ff00;
            }else{
                //不可领取
                let prerewards:{type:number,id:number,count:number,times?:number} = config.reward[i-1];
                let curCount:number = data.count;
                let totalCount:number = config.reward[i].times;
                if( prerewards ){
                    curCount = data.count - prerewards.times;
                    totalCount = config.reward[i].times - prerewards.times;
                }
                curCount = curCount>0?curCount:0;
                // this[`bar`].value = Math.floor(curCount/totalCount*100);
                this[`isget`].touchEnabled = false;//点击飞道具
                color = 0xff0000;
            }
        }
        this.alreadyTime.textFlow = TextFlowMaker.generateTextFlow1(`|C:${color}&T:${curCount}`);
        this.updateRedPoint(this.activityID,i);//更新特效红点
    }

    private updateRedPoint(activityID:number,idx:number){
        //是否有抽奖次数可领取判断
        //达到抽奖次数 并且未领取  抽奖次数奖励位第二位开始
        let b = this.ins.isGetRollReward(activityID,idx);
        this[`redPoint`].visible = b;
    }

    private flyItemEx(itemicon:ItemIcon){
        let flyItem:eui.Image = new eui.Image(itemicon.imgIcon.source);
        flyItem.x = itemicon.imgIcon.x;
        flyItem.y = itemicon.imgIcon.y;
        flyItem.width = itemicon.imgIcon.width;
        flyItem.height = itemicon.imgIcon.height;
        flyItem.scaleX = itemicon.imgIcon.scaleX;
        flyItem.scaleY = itemicon.imgIcon.scaleY;
        itemicon.imgIcon.parent.addChild(flyItem);
        GameLogic.ins().postFlyItemEx(flyItem);
    }

}