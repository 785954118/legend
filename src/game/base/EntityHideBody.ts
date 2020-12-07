/**
 * Created by hrz on 2018/3/6.
 */

class EntityHideBody extends BaseSystem {
    static ins(): EntityHideBody {
        return super.ins() as EntityHideBody;
    }

    //当前场景是否开启隐藏功能
    isOpen: boolean = false;

    //是否显示人物模型
    isShow:boolean = false;

    //当前显示人物模型的masterHandle
    private showHandles: number[] = [];

    private showNum: number = 3;

    private storageKey = "hide_fbtype_";

    //上次攻击的目标
    private lastAtkHandle:number = 0;

    private lastFbID:number = 0;

    constructor() {
        super();

        this.observe(GameLogic.ins().postRemoveEntity, this.onRemoveEntity);
        this.observe(GameLogic.ins().postAtkTarget, this.onChangeTarget);

        this.observe(UserBoss.ins().postRemainTime, this.onRoleDie);
        this.observe(CityCC.ins().postRemainTime, this.onRoleDie);
        this.observe(DevildomSys.ins().postRevive, this.onRoleDie);
        this.observe(KFBossSys.ins().postRevive, this.onRoleDie);
    }

    public changeScene() {
        if (this.lastFbID != GameMap.fubenID) {
            this.lastFbID = GameMap.fubenID;
            this.isOpen = this.getIsOpen();
            this.showHandles.length = 0;
            this.lastAtkHandle = 0;
            if (this.isOpen) {
                this.isShow = !SysSetting.ins().getBool(this.storageKey+GameMap.fbType);
            }

            this.isOpen ? ViewManager.ins().open(ShieldWin) : ViewManager.ins().close(ShieldWin);
        }
    }

    public onCreateEntity(model: EntityModel) {
        if (!this.isOpen) return;
        if (model.isMy || model.type != EntityType.Role) return;
        if (this.updateShowHandles(model.masterHandle, true)) {
            this.sendHandlesToServer();
        }
    }

    public setShowState(isShow:boolean) {
        this.isShow = isShow;
        this.showOrHideEntitys(this.isShow);
        this.sendHandlesToServer();

        SysSetting.ins().setBool(this.storageKey+GameMap.fbType, !isShow);
    }

    public checkIsShowBody(handle:number):boolean {
        if (!this.isOpen) return true;
        if (!this.isShow) return false;
        let masterHandle = EntityManager.ins().getRootMasterHandle(handle);
        if (!masterHandle) return true;
        return this.showHandles.indexOf(masterHandle) >= 0;
    }

    private onRemoveEntity([handle, entity]: [number, CharMonster]) {
        if (!this.isOpen) return;
        if (entity.isMy || !(entity instanceof CharRole)) return;
        if (this.updateShowHandles(entity.infoModel.masterHandle, false) ) {
            this.sendHandlesToServer();
            this.searchNewHandle();
        }
    }

    private updateShowHandles(masterHandle: number, isAdd: boolean): boolean {
        if (isAdd && this.showHandles.length >= this.showNum) return false;
        let index = this.showHandles.indexOf(masterHandle);
        if (isAdd) {
            if (index == -1) {
                this.showHandles.push(masterHandle);
                return true;
            }
        } else {
            if (index >= 0) {
                this.showHandles.splice(index, 1);
                return true;
            }
        }
        return false;
    }

    private onChangeTarget() {
        if(!this.isOpen) return;
        if (GameLogic.ins().currAttackHandle == this.lastAtkHandle) return;
        let ms = GameLogic.ins().currAttackHandle;
        let old = this.lastAtkHandle;
        this.lastAtkHandle = ms;
        //如果已经屏蔽了所有人
        if (!this.isShow) {
            if (old) this.hideEntity(old);
            if (ms) this.showEntity(ms);
            this.sendHandlesToServer();
        }

        if (!ms) return;

        if (this.showHandles.indexOf(ms) >= 0) return;

        if (this.showHandles.length >= this.showNum) {
            let masterHandle = this.showHandles.shift();
            this.hideEntity(masterHandle);
        }
        this.showHandles.push(ms);
        this.showEntity(ms);

        this.sendHandlesToServer();
    }

    private onRoleDie() {
        if(!this.isOpen) return;
        let old = this.lastAtkHandle;
        this.lastAtkHandle = 0;
        //如果已经屏蔽了所有人
        if (!this.isShow) {
            if (old) {
                this.hideEntity(old);
                this.sendHandlesToServer();
            }
        }
    }

    private searchNewHandle() {
        let entityList = EntityManager.ins().getAllEntity();
        for (let i in entityList) {
            let info = entityList[i].infoModel;
            if (info && !info.isMy && info.type == EntityType.Role) {
                if (this.updateShowHandles(info.masterHandle, true)) {
                    this.showEntity(info.masterHandle);
                    break;
                }
            }
        }
    }

    private showOrHideEntitys(isShow:boolean) {
        let msList = this.showHandles;
        for (let ms of msList) {
            isShow ? this.showEntity(ms) : this.hideEntity(ms);
        }
    }

    private showEntity(masterHandle:number) {
        let list = EntityManager.ins().getEntityRelationHandle(masterHandle);
        for (let char of list) {
            char.showBodyContainer();
        }
    }

    private hideEntity(masterHandle:number) {
        let list = EntityManager.ins().getEntityRelationHandle(masterHandle);
        for (let char of list) {
            char.hideBodyContainer();
        }
    }

    @callDelay(200)
    private sendHandlesToServer() {
        let msList = this.isShow ? this.showHandles : (this.lastAtkHandle ? [this.lastAtkHandle] : []);
        GameLogic.ins().sendGetOtherAttr(msList);
    }

    private getIsOpen(): boolean {
        return !!GlobalConfig.ScenesConfig[GameMap.mapID].hideBodyEff;
    }

}