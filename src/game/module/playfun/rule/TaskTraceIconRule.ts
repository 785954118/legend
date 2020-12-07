/**
 * Created by Administrator on 2016/7/21.
 */
class TaskTraceIconRule extends RuleIconBase {

    constructor(id: number, t: egret.DisplayObjectContainer) {
        super(id, t);

        this.showMessage = [
            UserTask.ins().postUpdteTaskTrace,
            Actor.ins().postLevelChange,
            GameLogic.ins().postEnterMap
        ];
    }

    private currentEff: string = "";

    checkShowIcon(): boolean {
        let b = UserTask.ins().getTaskState() && !UserFb.ins().pkGqboss;
        return b;
    }

    getEffName(redPointNum: number): string {
        let eff: string;
        let data: AchievementData = UserTask.ins().taskTrace;
        if (data) {
            switch (data.state) {
                case 0:
                    eff = "achieveCom";
                    this.effX = 130;
                    this.effY = 35;
                    break;
                case 1:
                    eff = "GWOpenEff";
                    this.effX = 140;
                    this.effY = 32;
                    break;
            }
        }
        if (this.currentEff != eff) {
            let playPunView: PlayFunView = ViewManager.ins().getView(PlayFunView) as PlayFunView;
            if (playPunView.ruleEff[this.tar.hashCode]) {
                DisplayUtils.removeFromParent(playPunView.ruleEff[this.tar.hashCode]);
                playPunView.ruleEff[this.tar.hashCode] = null;
            }
        }
        this.currentEff = eff;
        return eff;
    }

    tapExecute(): void {
        let data: AchievementData = UserTask.ins().taskTrace;
        if (data.state == 0) {
            GameGuider.taskGuidance(data.id, 1);
            GuideUtils.ins().updateByClick();

            // let config = UserTask.ins().getAchieveConfById(data.id);
            // if (config.control == GuideType.ChallengeBoss && UserFb.ins().pkGqboss) {
            // 	this.lastTaskType = config.type;
            // 	this.lastTaskId = data.id;
            // }

        } else {
            UserTask.ins().sendGetAchieve(data.achievementId);
            UserTask.ins().postParabolicItem();
            Hint.ins().postAchievementAft(data);
            if (!UserTask.ins().getAchieveConfById(data.id + 1)) {
                UserTips.ins().showTips("已完成所有任务!");
            }
            let view: PlayFunView = ViewManager.ins().getView(PlayFunView) as PlayFunView;
            view.hejiRule.updatekStep(true);


        }
        this.update();
    }
}