/**
 * Created by hrz on 2018/2/6.
 */

class HideBossWin extends BaseEuiView {
    private bgClose:eui.Rect;
    private boss:eui.Group;
    private dropRewardList:eui.List;
    private challengeBtn:eui.Button;

    private bossMc:MovieClip;

    constructor(){
        super();
        this.skinName = `LuckyBossSkin`;
    }

    protected childrenCreated() {
        this.boss.touchEnabled = false;
        this.boss.touchChildren = false;

        this.dropRewardList.itemRenderer = ItemBase;
    }

    open() {
        this.addTouchEvent(this.challengeBtn, this.onTap);
        this.addTouchEvent(this.bgClose, this.onTap);

        this.showBoss();
        this.showAward();

    }

    close() {
        if(this.bossMc) this.bossMc.destroy();
        this.bossMc = null;
    }

    private showAward(){
        let id = UserBoss.ins().hideBossData.id;
        let rewardShow = GlobalConfig.HideBossConfig[id].rewardShow;
        this.dropRewardList.dataProvider = new eui.ArrayCollection(rewardShow.concat());
    }

    private showBoss() {
        if (!this.bossMc) {
            let bossImage:MovieClip = ObjectPool.pop("MovieClip");
            this.bossMc = bossImage;
            bossImage.scaleX = -1;
            bossImage.scaleY = 1;
            bossImage.x = 78;
            bossImage.y = 50;
            this.boss.addChild(bossImage);
        }

        let id = UserBoss.ins().hideBossData.id;
        let bossId = GlobalConfig.HideBossConfig[id].bossId;
        let bossBaseConfig: MonstersConfig = GlobalConfig.MonstersConfig[bossId];
        this.bossMc.playFile(RES_DIR_MONSTER + `monster${bossBaseConfig.avatar}_3s`, -1);
    }

    private onTap(e:egret.TouchEvent) {
        let tar = e.currentTarget;
        if (tar == this.bgClose) {
            ViewManager.ins().close(this);
        } else if (tar == this.challengeBtn) {
            if (Encounter.ins().isEncounter()) {
                UserTips.ins().showCenterTips(`正在挑战附近的人`);
            }
            else if (GameMap.sceneInMain()) {
                UserBoss.ins().hideBossData.lastId = UserBoss.ins().hideBossData.id;
                UserBoss.ins().sendChallengeHideBoss();
                ViewManager.ins().close(this);
            } else {
                UserTips.ins().showCenterTips(`请先退出副本后再击杀隐藏BOSS`);
            }
        }
    }
}

ViewManager.ins().reg(HideBossWin, LayerManager.UI_Popup);