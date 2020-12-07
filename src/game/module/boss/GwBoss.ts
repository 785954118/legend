/**
 * Created by hrz on 2017/11/15.
 */

class GwBoss extends BaseSystem {
    //圣域
    isGwBoss:boolean = false;
    //圣域塔
    isGwTopBoss:boolean = false;

    isBossDie:boolean = false;

    constructor() {
        super();

        this.observe(GameLogic.ins().postEnterMap, ()=>{
            if (GameMap.fbType == UserFb.FB_TYPE_GOD_WEAPON || GameMap.fbType == UserFb.FB_TYPE_GOD_WEAPON_TOP) {
                this.postEnterGwBoss();
            } else if (this.isGwBoss || this.isGwTopBoss) {
                this.postEscGwBoss();
            }
        });

        this.observe(GameLogic.ins().postCreateOtherEntity, this.onCreateEntity);

        this.observe(UserBoss.ins().postRemainTime, this.onDie);
        this.observe(UserBoss.ins().postWorldBossEndTime, this.onBossDisappear);
    }

    public postEnterGwBoss() {
        this.isGwBoss = GameMap.fbType == UserFb.FB_TYPE_GOD_WEAPON;
        this.isGwTopBoss = GameMap.fbType == UserFb.FB_TYPE_GOD_WEAPON_TOP;
        this.isBossDie = false;
        // TargetListCC.ins().startOrStopTimer();
        this.showView(true);
    }

    public postEscGwBoss() {
        this.isGwBoss = false;
        this.isGwTopBoss = false;
        this.isBossDie = false;
        this.showView(false);
        ViewManager.ins().close(BossEndView);

        // TargetListCC.ins().startOrStopTimer();
        // TargetListCC.ins().closeTargetPanel();
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
        if (this.isGwBoss || this.isGwTopBoss) {
            if(model.type == EntityType.Monster && model.team == Team.Monster && !model.masterHandle) {
                UserBoss.ins().monsterID = model.configID;
                UserBoss.ins().bossHandler = model.handle;

                this.showView(true);
            }
        }
    }

    private onDie() {
        if (this.isGwBoss || this.isGwTopBoss) {
            if (this.isRoleDie()) {
                ViewManager.ins().open(WorldBossBeKillWin);
            } else {
                ViewManager.ins().close(WorldBossBeKillWin);
            }
        }
    }

    public isRoleDie():boolean {
        let isDie = false;
        if(this.isGwTopBoss) {
            let role = EntityManager.ins().getNoDieRole();
            if(!role || role.infoModel.getAtt(AttributeType.atHp) <= 0) {
                isDie = true;
            }
        }
        if (UserBoss.ins().reliveTime > 0 || isDie) {
            return true;
        } else {
            return false;
        }
    }

    private onBossDisappear() {
        if (this.isGwBoss || this.isGwTopBoss) {
            this.showView(false);

            this.isBossDie = true;
            ViewManager.ins().open(BossEndView);
        }
    }

    public canMove() {
        return !this.isBossDie;
    }

    static ins():GwBoss{
        return super.ins() as GwBoss;
    }
}

namespace GameSystem {
    export let gwboss = GwBoss.ins.bind(GwBoss);
}