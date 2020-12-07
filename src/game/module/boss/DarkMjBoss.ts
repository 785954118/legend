/**
 * Created by hrz on 2018/2/1.
 *
 * 暗之秘境boss
 */

class DarkMjBoss extends BaseSystem {
    isDarkBoss:boolean = false;

    isBossDie:boolean = false;

    constructor(){
        super();

        this.observe(GameLogic.ins().postEnterMap, ()=>{
            if (GameMap.fbType == UserFb.FB_TYPE_DARK_BOSS) {
                this.postEnterGwBoss();
            } else if (this.isDarkBoss) {
                this.postEscGwBoss();
            }

            this.checkIsShowBtn();
        });

        this.observe(GameLogic.ins().postCreateOtherEntity, this.onCreateEntity);

        this.observe(UserBoss.ins().postRemainTime, this.onDie);
        this.observe(UserBoss.ins().postWorldBossEndTime, this.onBossDisappear);
        this.observe(UserBoss.ins().postBaseHideBossInfo, this.onHideBossAppear);
    }

    public postEnterGwBoss() {
        this.isDarkBoss = GameMap.fbType == UserFb.FB_TYPE_DARK_BOSS;
        this.isBossDie = false;
        // TargetListCC.ins().startOrStopTimer();
        this.showView(true);
    }

    public postEscGwBoss() {
        this.isDarkBoss = false;
        this.isBossDie = false;
        this.showView(false);
        ViewManager.ins().close(BossEndView);
    }

    private showView(show) {
        if(show) {
            if (!ViewManager.ins().isShow(BossBelongPanel)) {
                ViewManager.ins().open(BossBelongPanel);
            }
            if (!ViewManager.ins().isShow(BossBloodPanel)) {
                ViewManager.ins().open(BossBloodPanel);
            }
            if (!ViewManager.ins().isShow(TargetListPanel)) {
                ViewManager.ins().open(TargetListPanel);
            }
        } else {
            ViewManager.ins().close(BossBelongPanel);
            ViewManager.ins().close(BossBloodPanel);
            ViewManager.ins().close(TargetListPanel);
        }
    }

    private onCreateEntity(model:EntityModel) {
        if(!model) return;
        if (this.isDarkBoss) {
            if(model.type == EntityType.Monster && model.team == Team.Monster && !model.masterHandle) {
                UserBoss.ins().monsterID = model.configID;
                UserBoss.ins().bossHandler = model.handle;

                this.showView(true);
            }
        }
    }

    private onDie() {
        if (this.isDarkBoss) {
            if (this.isRoleDie()) {
                ViewManager.ins().open(WorldBossBeKillWin);
            } else {
                ViewManager.ins().close(WorldBossBeKillWin);
            }
        }
    }

    public isRoleDie():boolean {
        if (UserBoss.ins().reliveTime > 0) {
            return true;
        } else {
            return false;
        }
    }

    private onBossDisappear() {
        if (this.isDarkBoss) {
            this.showView(false);

            this.isBossDie = true;
            ViewManager.ins().open(BossEndView);
        }
    }

    private checkIsShowBtn() {
        if (this.checkCanShow() && GameMap.sceneInMain()) {
            if (!ViewManager.ins().isShow(HideBossBtnWin))
            ViewManager.ins().open(HideBossBtnWin);
        } else {
            ViewManager.ins().close(HideBossBtnWin);
        }
    }

    private checkCanShow():boolean {
        let endTime = UserBoss.ins().hideBossData.endTime;
        return UserBoss.ins().hideBossData.id && endTime && (DateUtils.formatMiniDateTime(endTime) > GameServer.serverTime);
    }

    private onHideBossAppear() {
        if (this.checkCanShow()) {
            if (this.isDarkBoss) {
                let entity = EntityManager.ins().getEntityByHandle(UserBoss.ins().bossHandler);
                if (entity && entity.parent) {
                    let mc:MovieClip = ObjectPool.pop("MovieClip");
                    let callFunc = ()=> {
                        if (!ViewManager.ins().isShow(HideBossBtnWin))
                            ViewManager.ins().open(HideBossBtnWin, 1);
                        mc.removeEventListener(egret.Event.REMOVED_FROM_STAGE,callFunc,this);
                        mc.destroy();
                    };
                    mc.playFile(`${RES_DIR_EFF}luckyboss_dragon_up`, 1 ,()=>{
                        callFunc();
                    });
                    mc.x = entity.x;
                    mc.y = entity.y;
                    mc.addEventListener(egret.Event.REMOVED_FROM_STAGE,callFunc,this);
                    entity.parent.addChild(mc);
                } else {
                    ViewManager.ins().open(HideBossBtnWin, 1);
                }
            } else {
                ViewManager.ins().open(HideBossBtnWin);
            }
        } else {
            ViewManager.ins().close(HideBossBtnWin);
        }
    }

    public canMove() {
        return !this.isBossDie;
    }

    static ins():DarkMjBoss {
        return super.ins() as DarkMjBoss;
    }
}

namespace GameSystem {
    export let darkMjBoss = DarkMjBoss.ins.bind(DarkMjBoss);
}