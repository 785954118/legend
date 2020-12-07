/**
 * 红包系统2
 */
class HBSystem2 extends BaseSystem {

    public constructor() {
        super();
        // this.observe(Activity.ins().handlehongbaoInfo, this.updateHongBao);//下发新红包
        // this.observe(Activity.ins().postGetRedEnvelope, this.showHongBaoTips);//开红包返回元宝/金币弹出tips
        // this.observe(Activity.ins().postRewardResult, this.ActRewardResult);//领取红包返回
        // this.observe(Activity.ins().postEnvelopeDataCall, this.showEnvelope);//打开红包展示红包信息
        // this.observe(Activity.ins().postRedEnvelopeData, this.updateHongBao);//下发新红包

        //增加抢红包活动管理

    }

    public static ins(): HBSystem2 {
        return super.ins() as HBSystem2;
    }



    public handleHongbao() {
        let view: PlayFunView = ViewManager.ins().getView(PlayFunView) as PlayFunView;
        if (!view || !view.hongbao) return;
        if (view.hongbao.numElements > 0) return;
        // 增加抢红包类型
        if (Activity.ins().activityData[2001] instanceof ActivityType24Data) {
            let actData: ActivityType24Data = Activity.ins().activityData[2001] as ActivityType24Data;
            for (let j = actData.envelopeData.length - 1; j >= 0;) {
                j = actData.envelopeData.length - 1;
                let eId = actData.envelopeData[j].id;//最新的红包id
                if (actData.envelopeData[j].canStartTimer()) {//红包是否过时
                    let item: HongBaoShowItem = new HongBaoShowItem();
                    item.data = { actId: 2001, eId: eId };
                    view.hongbao.addChild(item);
                    break;
                } else {
                    TimerManager.ins().remove(this.updateHBTime, this); // 防止多次启动定时器
                    TimerManager.ins().doTimer(1000, 0, this.updateHBTime, this);
                    break;
                }
            }
        }
    }

    public updateHongBao() {
        TimerManager.ins().doTimer(1000, 1, this.handleHongbao, this);
    }

    private updateHBTime() {
        let view: PlayFunView = ViewManager.ins().getView(PlayFunView) as PlayFunView;
        if (Activity.ins().activityData[2001] instanceof ActivityType24Data) {
            let actData: ActivityType24Data = Activity.ins().activityData[2001] as ActivityType24Data;
            for (let j = actData.envelopeData.length - 1; j >= 0;) {
                j = actData.envelopeData.length - 1;
                let eId = actData.envelopeData[j].id; //最新的红包id
                if (actData.envelopeData[j].canStartTimer()) {//红包是否过时
                    TimerManager.ins().remove(this.updateHBTime, this);
                    let item: HongBaoShowItem = new HongBaoShowItem();
                    item.data = { actId: 2001, eId: eId };
                    view.hongbao.addChild(item);
                    break;
                } else {
                    // console.log('没到领取时间')
                    break;
                }
            }
        }
    }

    //派发红包显示提示
    //actId:number,eId:number,yb:number,gold:number
    private showHongBaoTips(param: any) {
        let actId = param[0];
        let eId = param[1];
        let yb = param[2];
        let gold = param[3];
        let arr = param[4];
        let actData: ActivityType12Data = Activity.ins().activityData[actId] as ActivityType12Data;
        // this.hongbao.removeChildren();
        if (actData) {
            if (yb) {
                let reward = new RewardData;
                reward.type = 0;
                reward.id = MoneyConst.yuanbao;
                reward.count = yb;
                UserTips.ins().showGoodRewardTips(reward);
            }
            if (eId)
                actData.popEnvelope(eId);//移除领过的红包
            // this.updateHongBao();//检测最新红包
            this.HongBaoResultAni(arr);
        }
    }
    //领取红包成功后展示动画
    private HongBaoResultAni(arr: { job: number, sex: number, name: string, yb: number, gold: number }[]) {
        let view: PlayFunView = ViewManager.ins().getView(PlayFunView) as PlayFunView;
        if (!view || !view.hongbao) return;
        let item: HongBaoOpenItem = view.hongbao.getChildAt(1) as HongBaoOpenItem;
        if (item)
            item.playAni(arr, this.updateHongBao, this);
    }
    //活动领取响应
    private ActRewardResult(activityID: number) {
        if (Activity.ins().activityTimers.indexOf(activityID) == -1) return;
        if (Activity.ins().activityData[activityID]) {
            if (Activity.ins().activityData[activityID] instanceof ActivityType12Data) {
                if (!Activity.ins().isSuccee) {
                    if (Activity.ins().activityData[activityID].isOpenActivity())
                        UserTips.ins().showTips(`|C:0xff0000&T:红包已过期`);
                    else
                        UserTips.ins().showTips(`|C:0xff0000&T:活动已结束`);
                }
            }
        }
    }
    //红包展示
    private showEnvelope(eld: EnvelopeData) {

        //
        // console.log('红包展示！')
        // return
        let view: PlayFunView = ViewManager.ins().getView(PlayFunView) as PlayFunView;
        if (!view || !view.hongbao) return;
        if (!eld) {
            //失败即过时
            UserTips.ins().showTips(`|C:0xff0000&T:红包已过期`);
            view.hongbao.removeChildren();
            this.updateHongBao();
            return;
        }
        if (Activity.ins().activityData[eld.id]) {
            if (Activity.ins().activityData[eld.id] instanceof ActivityType24Data) {
                // let actData:ActivityType12Data = Activity.ins().activityData[eld.id] as ActivityType12Data;
                let item: HongBaoOpenItem = new HongBaoOpenItem();
                if (!eld.desc) {
                    eld.desc = GlobalConfig.ActivityType12Config[eld.id][eld.index].blessWord;
                }
                item.data = { actId: eld.id, eId: eld.eId, job: eld.job, sex: eld.sex, name: eld.name, text: eld.desc, index: eld.index };
                view.hongbao.addChildAt(item, 1);
            }
        }

    }
    public testhongbao() {
        let view: PlayFunView = ViewManager.ins().getView(PlayFunView) as PlayFunView;
        view.hongbao.removeChildren();
        ViewManager.ins().open(FuliWin, 6);
    }
    public removeHongbao() {
        let view: PlayFunView = ViewManager.ins().getView(PlayFunView) as PlayFunView;
        view.hongbao.removeChildren();
    }
    public closeallhongbao() {



    }


}

// namespace GameSystem {
//     export let hbsystem2 = HBSystem2.ins.bind(HBSystem2);
// }