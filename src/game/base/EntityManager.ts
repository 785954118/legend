/**
 * 实体管理器
 */
class EntityManager extends BaseClass {

    public static CHAR_DEFAULT_HEIGHT = 118;
    public static CHAR_DEFAULT_TYPEFACE = 110;

    public static ins(): EntityManager {
        return super.ins() as EntityManager;
    }

    constructor() {
        super();
        this.listCount = [];
    }

    private entityList: any = {};
    private transferList: any = {};//传送点
    private mineList: any = {};//矿工

    private _masterList: any = {};

    private listCount: number[];

    public getAllEntity() {
        return this.entityList;
    }

    public resetRole(): void {
        let len: number = SubRoles.ins().subRolesLen;
        for (let i: number = 0; i < len; i++) {
            let model: Role = SubRoles.ins().getSubRoleByIndex(i);
            model.name = Actor.myName;
            if (!this.getEntityByHandle(model.handle)) {
                model.setPos(DropHelp.tempDropPoint.x * GameMap.CELL_SIZE, DropHelp.tempDropPoint.y * GameMap.CELL_SIZE);
                debug.log("--------------所有角色重置----------------");
                model.setAtt(AttributeType.atHp, model.getAtt(AttributeType.atMaxHp));
                model.setAtt(AttributeType.atMp, model.getAtt(AttributeType.atMaxMp));
                GameLogic.ins().createEntityByModel(model, Team.My);
            } else {
                let char = this.getEntityByHandle(model.handle);
                char.infoModel.setAtt(AttributeType.atHp, model.getAtt(AttributeType.atMaxHp));
                char.infoModel.setAtt(AttributeType.atMp, model.getAtt(AttributeType.atMaxMp));
                char.updateBlood(true);
            }
        }
    }

    private addList(char): void {
        if (!char.infoModel.handle)
            char.infoModel.handle = char.hashCode;
        if (this.entityList[char.infoModel.handle] == char) {
            return;
        }
        this.entityList[char.infoModel.handle] = char;

        if (char.infoModel.masterHandle) {
            let msth = char.infoModel.masterHandle;
            if (!this._masterList[msth])
                this._masterList[msth] = [];
            this._masterList[msth].push(char);
        }
        if (char.infoModel.type == EntityType.Mine) {
            this.mineList[char.infoModel.index] = char;
        }

        let count: number = this.listCount[char.team] || 0;
        this.listCount[char.team] = ++count;
    }

    private addTransfer(char: CharTransfer) {
        this.transferList[char.infoModel.configID] = char;
        SkillEffPlayer.bottomLayer.addChild(char);
    }

    public removeTransferById(configID) {
        let char = this.transferList[configID];
        if (char) {
            delete this.transferList[configID];
            DisplayUtils.removeFromParent(char);
        }
    }

    public getTransferById(configID) {
        return this.transferList[configID];
    }

    //获取矿工
    public getMineByIndex(index) {
        return this.mineList[index];
    }

    //移除矿工
    public removeMineByIndex(index) {
        let char: CharMiner = this.mineList[index];
        if (char) {
            delete this.mineList[index];
            if (char.infoModel) {
                this.removeByHandle(char.infoModel.handle);
            }
        }
    }

    public createEntity(model: any, param?: any): egret.DisplayObject {
        switch (model.type) {
            case EntityType.Role:
            case EntityType.LadderPlayer: {
                let roleModel: Role = model;
                if (param && param[0] != null) {
                    roleModel.team = param[0];
                } else {
                    if (model.masterHandle && model.masterHandle == Actor.handle)
                        roleModel.team = Team.My;
                    else
                        roleModel.team = Team.WillEntity;
                }

                let role: CharRole = ObjectPool.pop('CharRole');
                role.reset();
                if (roleModel.masterHandle == Actor.handle) {
                    let index: number;
                    let len: number = SubRoles.ins().subRolesLen;
                    for (let i: number = 0; i < len; i++) {
                        if (i == roleModel.configID) {
                            index = i;
                            break;
                        }
                    }
                    //把属性数据合拼到子角色信息里
                    if (SubRoles.ins().getSubRoleByIndex(index)) {
                        roleModel = SubRoles.ins().getSubRoleByIndex(index).mergeData(roleModel);
                    }
                }

                role.infoModel = roleModel;
                role.x = roleModel.x;
                role.y = roleModel.y;

                this.addList(role);
                //	debug.log("创建人型怪----" + model.handle);
                if (RoleAI.ins().canAddToAi()) RoleAI.ins().add(role);

                let isShowBody: boolean = true;
                //隐藏
                if (roleModel.team != Team.My) {
                    if (!EntityShowMgr.ins().checkShowHandle(roleModel.masterHandle)) {
                        role.hideBodyContainer();
                        role.updateModel();
                        return null;
                    }

                    isShowBody = EntityHideBody.ins().checkIsShowBody(roleModel.masterHandle);
                }
                isShowBody ? role.showBodyContainer() : role.hideBodyContainer();
                role.updateModel();

                return role;
            }

            case EntityType.Monster:
            case EntityType.CollectionMonst: {

                if (param && param[0] != null) {
                    model.team = param[0];
                } else {
                    if (model.masterHandle && model.masterHandle != 0) {
                        if (model.isMy)
                            model.team = Team.My;
                        else
                            model.team = Team.WillEntity;
                    }
                    else
                        model.team = Team.Monster;
                }

                //取对象池里的缓存
                let monster: CharMonster = ObjectPool.pop("CharMonster");
                //重置缓存
                monster.reset();
                //设置model数据
                monster.infoModel = model;
                monster.x = model.x;
                monster.y = model.y;

                this.addList(monster);

                if (RoleAI.ins().canAddToAi()) RoleAI.ins().add(monster);

                let isShowBody: boolean = true;

                //假如主人已经屏蔽，则宠物也屏蔽
                if (monster.team != Team.My && model.masterHandle) {

                    let rootMasterHandle = this.getRootMasterHandle(model.masterHandle);
                    let masters = this.getMasterList(rootMasterHandle);
                    if (masters) {
                        for (let master of masters) {
                            if (monster != master && !master.parent) {
                                monster.hideBodyContainer();
                                monster.updateModel();
                                return null;
                            }
                        }
                    }

                    if (model.team == Team.WillEntity) {
                        // if (GameMap.fbType == UserFb.FB_TYPE_NEW_WORLD_BOSS) {//GameMap.fbType == UserFb.FB_TYPE_CITY
                        //     isShowBody = false;
                        // }

                        isShowBody = EntityHideBody.ins().checkIsShowBody(model.masterHandle);
                    }
                }

                isShowBody ? monster.showBodyContainer() : monster.hideBodyContainer();
                monster.updateModel();
                
                return monster;
            }

            case EntityType.DropItem: {
                //取对象池里的缓存
                let charItem: CharItem2 = ObjectPool.pop("CharItem2");
                //重置缓存
                charItem.setData(model.itemData);
                charItem.x = model.x;
                charItem.y = model.y;
                charItem.infoModel = model;
                this.addList(charItem);
                charItem.addRoatEffect();
                charItem.addFloatEffect();
                return charItem;
            }

            case EntityType.Transfer: {
                let transfer: CharTransfer = ObjectPool.pop("CharTransfer");
                transfer.infoModel = model;
                this.addTransfer(transfer);
                transfer.updateModel();
                return transfer;
            }

            case EntityType.Npc: {
                let npc: CharNpc = ObjectPool.pop("CharNpc");
                npc.infoModel = model;
                this.addList(npc);
                npc.updateModel();
                return npc;
            }
            case EntityType.Mine: {
                let miner: CharMiner = ObjectPool.pop("CharMiner");
                miner.infoModel = model;
                this.addList(miner);
                miner.updateModel();
                return miner;
            }
        }

        return null;
    }

    public removeAll(): void {
        for (let i in this.entityList) {
            this.removeByHandle(i);
        }

        for (let i in this.transferList) {
            this.removeTransferById(i);
        }

        EncounterFight.ins().stop();

        this.entityList = {};
        this._masterList = {};
        this.transferList = {};

        this.listCount = [];
    }

    private isHideOther: boolean;

    public hideOtherEntity(b: boolean): void {
        this.isHideOther = b;
        for (let i in this.entityList) {
            if (this.entityList[i].team != Team.WillEntity)
                continue;
            if (b)
                DisplayUtils.removeFromParent(this.entityList[i]);
            else
                GameLogic.ins().addEntity(this.entityList[i]);
        }
    }

    //获取handle方的所有实体 包括角色与召唤兽
    public getEntityRelationHandle(handle: number) {
        let masterHandle = this.getRootMasterHandle(handle);
        let masters = this.getMasterList(masterHandle); //3个角色
        let list = [].concat(masters || []);
        for (let char of list) {
            let model = char.infoModel;
            if (!model) continue;
            if ((<Role>model).job == JobConst.DaoShi) {
                let l = this.getMasterList(model.handle); //道士召唤兽
                if (l) {
                    list = list.concat(l);
                }
                break;
            }
        }
        return list;
    }

    public removeByHandle(handle: any, removeDisplay: boolean = true, expEffect: boolean = false): CharMonster {
        // return;
        let entity = this.entityList[handle];
        if (!entity)
            return;

        let isRole: boolean = (entity instanceof CharRole);
        //debug.log("删除----" + handle);

        let msth = entity.infoModel.masterHandle;
        if (msth) {
            let arr = this._masterList[msth];
            for (let i = 0; arr && i < arr.length; i++) {
                if (arr[i] == entity) {
                    arr.splice(i, 1);
                    break;
                }
            }
            if (arr && arr.length == 0) delete this._masterList[msth];
        }

        delete this.entityList[handle];

        for (let i in this.entityList) {
            if (this.entityList[i].infoModel.masterHandle &&
                this.entityList[i].infoModel.masterHandle == handle)
                this.removeByHandle(this.entityList[i].infoModel.handle);
        }

        let count: number = this.listCount[entity.team] || 0;
        this.listCount[entity.team] = --count;

        if (entity instanceof CharMonster) {
            entity.stopMove();//修复在野外寻怪走路过程中切换场景 场景镜头显示位置不对的bug
            entity.removeAllFilters();
        }
        egret.Tween.removeTweens(entity);

        if (removeDisplay) {
            DisplayUtils.removeFromParent(entity);

            if (entity instanceof CharMonster && !(entity instanceof CharRole)) {
                entity.destroy();
            }
        }


        RoleAI.ins().remove(entity);

        DropHelp.tempDropPoint.x = Math.floor(entity.x / GameMap.CELL_SIZE);
        DropHelp.tempDropPoint.y = Math.floor(entity.y / GameMap.CELL_SIZE);


        if ((GameMap.sceneInMain() || GameMap.fbType == UserFb.FB_TYPE_EXP) && entity.infoModel.type == EntityType.Monster && expEffect) {
            GameLogic.ins().postExpMc(entity);
        }

        if (entity.infoModel.type == EntityType.Mine) {
            delete this.mineList[(entity.infoModel as MineModel).index];
            (entity as CharMiner).destruct();
        }
        return entity;
    }

    public getEntityByHandle(handle) {
        return this.entityList[handle];
    }

    public getMasterList(masterHandle) {
        return this._masterList[masterHandle];
    }

    public get masterList() {
        return this._masterList
    }


    /**获取最顶层的ActorHandle */
    public getRootMasterHandle(handle) {
        let target: CharRole = EntityManager.ins().getEntityByHandle(handle) as CharRole;
        if (target && target.infoModel && target.infoModel.masterHandle > 0 && target.infoModel.masterHandle != handle) {
            return this.getRootMasterHandle(target.infoModel.masterHandle);
        }
        else {
            return handle;
        }
    }

    public getMainRole(index: number): CharRole {
        return this.getEntityByHandle(SubRoles.ins().getSubRoleByIndex(index).handle);
    }

    public getJobMainRole(index: number): CharRole {
        let i: number = 0;
        let role;
        for (let k in SubRoles.ins().jobDic) {
            if (i == index) {
                role = SubRoles.ins().jobDic[k];
                break
            }
            i++
        }
        return this.getEntityByHandle(role.handle);
    }

    public getNoDieRoleIndex(): number {
        let len: number = SubRoles.ins().subRolesLen;
        let role: CharRole;
        for (let k: number = 0; k < len; k++) {
            role = EntityManager.ins().getJobMainRole(k);
            if (role && role.getHP() > 0 && role.visible)
                return k;
        }
        return -1;
    }

    public getNoDieRole(): CharRole {
        let len: number = SubRoles.ins().subRolesLen;
        let role: CharRole;
        for (let k: number = 0; k < len; k++) {
            role = EntityManager.ins().getJobMainRole(k);
            if (role && role.getHP() > 0 && role.visible) {
                return role;
            }
        }
        return null;
    }

    public getMyOtherRolePos() {
        let selfMaster = this.getNoDieRole();
        let mylist = this.getEntityByTeam(Team.My);
        let poxIndex = 0;
        let pos = {};
        for (let i in mylist) {
            let selfTarget = mylist[i];
            if (selfTarget == selfMaster) {
                continue;
            }
            let count = mylist.length;
            let dirs = [1, -1];
            if (count == 2) {
                dirs = [0];
            }
            let p = DirUtil.getGridByDir(selfMaster.dir + dirs[poxIndex] != null ? dirs[poxIndex] : 0);
            poxIndex += 1;

            pos[selfTarget.infoModel.handle] = {x: selfMaster.x + p.x, y: selfMaster.y + p.y};
        }
        pos[selfMaster.infoModel.handle] = {x: selfMaster.x, y: selfMaster.y};
        return pos;
    }

    private sortSubRole(a: CharRole, b: CharRole): number {
        return Algorithm.sortAsc((a.infoModel as Role).job, (b.infoModel as Role).job);
    }

    public getTeamCount(t: Team): number {
        if (MineFight.ins().isFighting || Encounter.ins().isEncounter())
            return RoleAI.ins().getTeamCount(t);

        return this.listCount[t] || 0;
    }

    public checkCount(target: CharMonster, range: number, count: number = 1, sameTeam: boolean = false): boolean {
        let total: number = 0;
        for (let i in this.entityList) {
            let element: CharMonster = this.entityList[i];
            if (((!sameTeam && element.team != target.team) || (sameTeam && element.team == target.team)) &&
                MathUtils.getDistanceX2ByObject(target, element) <= Math.pow(range * GameMap.CELL_SIZE, 2)) {
                total++;
                if (total >= count)
                    break;
            }
        }
        return total >= count;
    }

    public checkCanAddBlood(t: Team): boolean {
        let isCan: boolean = false;
        for (let j in this.entityList) {
            if (this.entityList[j].team == t && this.entityList[j].isCanAddBlood) {
                isCan = true;
            }
        }
        return isCan;
    }

    private distances: { priority: number, target: CharMonster }[] = [];




    public getEntityBymasterhHandle(handle: number): egret.DisplayObject {
        for (let i in this.entityList) {
            if (this.entityList[i].infoModel &&
                this.entityList[i].infoModel.masterHandle &&
                this.entityList[i].infoModel.masterHandle == handle) {
                if (this.entityList[i].infoModel.type != EntityType.Monster)
                    return this.entityList[i];
            }
        }
        return null;
    }

    public getEntitysBymasterhHandle(handle: number, type: number = -1): any[] {
        let list: any[] = [];
        for (let i in this.entityList) {
            if (list.length >= 3) return list;
            if (this.entityList[i].infoModel &&
                this.entityList[i].infoModel.masterHandle &&
                this.entityList[i].infoModel.masterHandle == handle) {
                if (type == -1 || type == this.entityList[i].infoModel.type)
                    list.push(this.entityList[i]);
            }
        }
        return list;
    }

    public getEntityByTeam(team: Team = Team.My): any[] {
        let list = [];
        for (let i in this.entityList) {
            if (this.entityList[i].infoModel && this.entityList[i].infoModel.team == team) {
                list.push(this.entityList[i]);
            }
        }
        return list;
    }

    public getEntityByMonsterId(monsterId) {
        let list = [];
        for (let i in this.entityList) {
            if (this.entityList[i].infoModel && this.entityList[i].infoModel.configID == monsterId) {
                list.push(this.entityList[i]);
            }
        }
        return list;
    }

    /**
     * 通过伤害范围ID获取怪物列表
     * @param selfTarget
     * @param target
     * @param maxNum
     * @param areaId
     * @returns {CharMonster[]}
     */
    public screeningTargetByMap(selfTarget: CharMonster, target: CharMonster, maxNum: number, areaId: number): CharMonster[] {
        let areaConfig;
        if (ErrorLog.Assert(areaConfig, "SkillCastRangeConf no such areaId:" + areaId)) {
            return this.screeningTargetByPos(selfTarget, false, maxNum, Number.MAX_VALUE);
        }
        let position = GameMap.getTargetIndex(selfTarget, target, areaConfig.width, areaConfig.height);
        let hId = areaConfig.range[position];
        let hAreaConfig;
        if (!hAreaConfig) {
            return this.screeningTargetByPos(selfTarget, false, maxNum, Number.MAX_VALUE);
        }
        let points: egret.Point[] = [];
        for (let i = 0; i < hAreaConfig.range.length; i++) {
            let point: egret.Point = GameMap.getPoint(hAreaConfig.range[i], hAreaConfig.width, hAreaConfig.height);
            points.push(point);
        }
        points.push(new egret.Point(0, 0));
        let list = GameMap.getIncludeElement(selfTarget, points, this.entityList);
        return this.screeningTargetByPos(selfTarget, false, maxNum, Number.MAX_VALUE, list);
    }

    public screeningTargetByPos(selfTarget: CharMonster, sameTeam: boolean = false, maxNum: number = 0, range: number = Number.MAX_VALUE, list = this.entityList): CharMonster[] {

        let disFun: Function = MathUtils.getDistanceX2ByObject;//优化算法，只算距离的平方值，不开方。所以不用 MathUtils.getDistance;

        let range2: number = range;
        if (range != Number.MAX_VALUE) {
            //索敌范围的平方
            range2 = (range * GameMap.CELL_SIZE) * (range * GameMap.CELL_SIZE);
        }

        this.distances.length = 0;

        let tempValue: number;
        for (let i in list) {
            let element: CharMonster = list[i];

            if (sameTeam && element.team != selfTarget.team)
                continue;

            if (!sameTeam && element.team == selfTarget.team)
                continue;

            //不打假人
            if (selfTarget.team == Team.My && element.team == Team.Faker)
                continue;
            if (selfTarget.team == Team.Faker && element.team != Team.Monster && element.team != Team.Faker)
                continue;

            //是怪物，而且是召唤怪，不做目标
            if (!(element instanceof CharRole) && element.team != Team.Monster && element.team != Team.WillBoss)
                continue;

            if (element.AI_STATE == AI_State.Die)
                continue;

            if (Encounter.ins().isEncounter()) {
                if (Team.My == selfTarget.team) {
                    if (Team.WillEntity == element.team && !sameTeam) {
                        if (!Encounter.ins().checkIsEncounter(EncounterFight.ins().encounterIndex, element.infoModel))
                            continue;
                    } else if (Team.My == element.team && sameTeam) {
                        //治愈术之类的自己队伍加buff的技能
                    } else {
                        continue;
                    }
                } else if (Team.WillEntity == selfTarget.team) {
                    if (sameTeam && Team.WillEntity == element.team) {
                        //自己队伍加buff
                    } else if (!sameTeam && EncounterFight.ins().willEntityFightTeam == element.team) {
                        //遭遇战的角色只能打玩家的子角色
                    } else {
                        continue;
                    }
                } else {
                    // continue; //怪物也会攻击遭遇战玩家
                }
            }

            tempValue = disFun(selfTarget, element);

            if (tempValue > range2)
                continue;

            this.distances.push({
                priority: tempValue,
                target: element
            });
        }
        this.distances.sort(this.sortFunc);

        let tempArr: CharMonster[] = [];
        let len: number = 0;

        if (maxNum)
            len = Math.min(this.distances.length, maxNum);
        else
            len = this.distances.length;

        for (let j = 0; j < len; j++) {
            tempArr[j] = this.distances[j].target;
        }

        return tempArr;
    }

    private sortFunc(a: { priority: number, target: egret.DisplayObject }, b: { priority: number, target: egret.DisplayObject }): number {
        if (a.priority > b.priority)
            return 1;
        if (a.priority < b.priority)
            return -1;
        return 0;
    }
}