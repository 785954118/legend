/**
 * Created by hrz on 2018/3/7.
 */

class EntityShowMgr extends BaseClass {
    static ins():EntityShowMgr{
        return super.ins() as EntityShowMgr;
    }
    private MAX_SHOW_NUM = 3;
    private MAX_EFFECT_NUM = 3;

    private isOpen:boolean = false;

    public changeScene() {

        this.isOpen = !EntityHideBody.ins().isOpen;

        if (GameMap.fbType == UserFb.FB_TYPE_NEW_WORLD_BOSS) {
            this.MAX_SHOW_NUM = 5;
        } else {
            this.MAX_SHOW_NUM = 3;
        }
    }

    //屏蔽我屏幕外的玩家
    private hideFurtherOtherRole() {
        if (this.countShowNum() < this.MAX_SHOW_NUM) {
            return;
        }
        let role = EntityManager.ins().getNoDieRole();
        if (!role) return;
        let dis: number = 0;
        let handle: number;
        let maxDis = StageUtils.ins().getHeight() >> 1;
        let maxDis2 = maxDis * maxDis;

        let entityList = EntityManager.ins().getAllEntity();

        for (let i in entityList) {
            let entity = entityList[i];
            if (entity.parent && entity.infoModel && entity.team != Team.My && entity.infoModel.type == EntityType.Role) {
                let d = MathUtils.getDistanceX2ByObject(role, entity);
                if (d > maxDis2) {
                    handle = entity.infoModel.handle;
                    break;
                } else if (d > dis) {
                    dis = d;
                    handle = entity.infoModel.handle;
                }
            }
        }

        this.hideByHandle(handle);
    }

    public showNearSomeOne() {
        if (!this.isOpen) return;

        if (this.countShowNum() >= this.MAX_SHOW_NUM) {
            return;
        }
        let role = EntityManager.ins().getNoDieRole();
        if (!role) return;
        let dis: number = Number.MAX_VALUE;
        let handle: number;
        let maxDis = StageUtils.ins().getWidth() >> 1;
        let maxDis2 = maxDis * maxDis;
        let entityList = EntityManager.ins().getAllEntity();

        for (let i in entityList) {
            let entity = entityList[i];
            if (!entity.parent && entity.infoModel && entity.team != Team.My && entity.infoModel.type == EntityType.Role) {
                let d = MathUtils.getDistanceX2ByObject(role, entity);
                if (d < maxDis2) {
                    handle = entity.infoModel.handle;
                    break;
                } else if (d < dis) {
                    dis = d;
                    handle = entity.infoModel.handle;
                }
            }
        }
        this.showByHandle(handle);
    }

    //显示隐藏的列表
    public showHideSomeOne(handle: number): void {
        if (!this.isOpen) return;
        //隐藏一个距离远的玩家
        this.hideFurtherOtherRole();

        this.showByHandle(handle);
    }

    private hideByHandle(handle: number): void {
        if (GameLogic.ins().currAttackHandle == handle || this.countShowNum() < this.MAX_SHOW_NUM) {
            return;
        }
        let list = EntityManager.ins().getEntityRelationHandle(handle);
        for (let char of list) {
            DisplayUtils.removeFromParent(char);
            char.hideBodyContainer();
        }
    }

    private showByHandle(handle): void {
        if (!this.isOpen) return;

        if (this.countShowNum() >= this.MAX_SHOW_NUM) {
            return;
        }
        let list = EntityManager.ins().getEntityRelationHandle(handle);

        for (let char of list) {
            GameLogic.ins().addEntity(char);
            char.showBodyContainer();
        }
    }

    //是否显示技能效果
    public checkShowSkillEffect(): boolean {
        if (this.countShowNum() < this.MAX_EFFECT_NUM) {
            return true;
        }
        return false;
    }

    public checkShowHandle(handle: number) {
        if (!this.isOpen) return true;

        let ins = EntityManager.ins();
        let masterHandle = ins.getRootMasterHandle(handle);
        if (!masterHandle) return true;
        if (this.countShowNum() >= this.MAX_SHOW_NUM) {
            if (ins.masterList[masterHandle] && ins.masterList[masterHandle].length && ins.masterList[masterHandle][0].parent) {
                return true;
            }
            return false;
        }
        return true;
    }

    private countShowNum(): number {
        let showNum: number = 0;
        if (EntityHideBody.ins().isOpen) {
            return showNum;
        }
        let masterList = EntityManager.ins().masterList;
        for (let k in masterList) {
            let masters = masterList[k];
            if (masters && masters.length) {
                //只有是已添加到舞台的非我方玩家才算
                if (masters[0].parent && masters[0].team != Team.My && masters[0].infoModel && masters[0].infoModel.type == EntityType.Role) {
                    showNum += 1;
                }
            }
        }
        return showNum;
    }
}