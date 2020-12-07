/**
 * 魂骨
 */
class Hungu extends BaseSystem {
    private _hunguData: HunguData[];

    /** 魂兽副本剩余挑战次数 */
    public hunShouFBTimes: number = 0;

    /** 魂兽副本通关ID */
    public hunShouFBPassID: number = 0;

    /** 魂兽副本结束时间戳 */
    private _hunShouFBEndTime: number;

    public constructor() {
        super();
        this.sysId = PackageID.Hungu;
        //
        this.regNetMsg(1, this.postHunguInfo);
        this.regNetMsg(2, this.postHunguItems);
        this.regNetMsg(3, this.postHunyu);
        this.regNetMsg(4, this.postHunguItemUpgrade);
        this.regNetMsg(6, this.postSweepHunShouFB);
        this.regNetMsg(7, this.postHunShouFBInfo);
        this.regNetMsg(8, this.postHunShouFBEndTime);
    }

    public static ins(): Hungu {
        return super.ins() as Hungu;
    }

    public get hunguData() {
        if (!this._hunguData)
            this._hunguData = [];
        return this._hunguData;
    }

    /**魂骨开启条件*/
    public checkOpen() {
        if (GameServer.serverOpenDay < (GlobalConfig.HunGuConf.openserverday - 1)) {//第N天开
            return false;
        }
        if (UserZs.ins().lv < GlobalConfig.HunGuConf.openzhuanshenglv) {

            return false;
        }

        return true;
    }
    /**魂骨出现条件*/
    public checkShowOpen(){
        if (GameServer.serverOpenDay < (GlobalConfig.HunGuConf.openserverday - 1)) {//第N天开
            return false;
        }
        if (UserZs.ins().lv < GlobalConfig.HunGuConf.showzhuanshenglv) {

            return false;
        }

        return true;
    }

    /**获取魂骨装备部位索引*/
    public getHunguItemsPos(itemid: number) {
        let pos = -1;
        let config: ItemConfig = GlobalConfig.ItemConfig[itemid];
        if (config) {
            pos = ItemConfig.getSubType(config);
        }
        return pos;
    }

    /**
     * 获取当前背包部位所拥有的列表 从好到坏排列
     * @param 魂骨装备部位索引
     * @return 返回当前背包拥有的所有该部位的魂骨装备
     * */
    public getHunguItemsList(pos: number) {
        let items: ItemData[] = [];
        let TotalItems = UserBag.ins().getBagGoodsByType(ItemType.TYPE_24);
        for (let i = 0; i < TotalItems.length; i++) {
            if (this.getHunguItemsPos(TotalItems[i].itemConfig.id) == pos)
                items.push(TotalItems[i]);
        }
        items.sort((a: ItemData, b: ItemData) => {
            let aconfig = GlobalConfig.HunGuEquip[a.configID];
            let bconfig = GlobalConfig.HunGuEquip[b.configID];
            if (aconfig.stage > bconfig.stage)
                return -1
            else
                return 1;
        });
        return items;
    }

    /**
     * 获取当前某个部位的魂玉红点情况
     * @param 人物id
     * @param 魂骨装备索引 索引从0开始
     * @return 是否有红点
     * */
    public getHunyuRedPoint(roleId: number, pos: number) {
        if (!this.hunguData[roleId])return false;
        // let config = GlobalConfig.ItemConfig[this.hunguData[roleId].items[pos].itemId];
        for (let i = 0; i < this.hunguData[roleId].items[pos].hunyu.length; i++) {
            let b = this.getHunyuKongRedPoint(roleId, pos, i);
            if (b)
                return true;
        }
        return false;
    }

    /**
     * 获取当前装备每个孔的魂玉红点情况
     * @param 人物id
     * @param 魂骨装备索引 索引从0开始
     * @param 魂玉索引 索引从1开始
     * @return 是否有红点
     * */
    public getHunyuKongRedPoint(roleId: number, pos: number, hyPos: number) {
        if (!this.hunguData[roleId])return false;
        //需要知道当前装备是几孔 这样只判定当前装备所开启孔的情况
        // 例如:已穿戴过开启3孔 换成只有1孔的装备 后面已开启的两孔是× 但却是有数据 只是不显示
        if (!this.hunguData[roleId].items[pos].itemId || hyPos + 1 > GlobalConfig.HunGuEquip[this.hunguData[roleId].items[pos].itemId].hunyuNum)
            return false;
        let hyType = GlobalConfig.HunGuConf.hunyuType[pos][hyPos];
        let level = this.hunguData[roleId].items[pos].hunyu[hyPos];//未激活level=0
        let hyequip = GlobalConfig.HunYuEquip[hyType][level + 1];
        if (!hyequip)//满级或者
            return false;
        //未开启孔
        if (!hyequip.cost) {
            //通过消耗元宝来开启 获取开孔所需元宝数量
            let costYb = GlobalConfig.HunGuConf.unlockCost[hyPos + 1];
            if (Actor.yb >= costYb)
                return true;
        } else {
            //已开启孔
            let itemData: ItemData = UserBag.ins().getBagItemById(hyequip.cost.id);
            if (itemData && itemData.count >= hyequip.cost.count)
                return true;
        }
        return false;
    }

    /**
     * 某个部位上的魂玉战力(跟所穿戴的装备有关 主要是开孔数)
     * @param 魂骨装备部位 索引从0开始
     * */
    public getHunguPosHyPower(roleId: number, pos: number) {
        let power = 0;
        if (!this.hunguData[roleId] || !this.hunguData[roleId].items[pos].itemId)return power;
        //只获取装备开启孔的魂玉情况 多出来的不管
        let hgequip: HunGuEquip = GlobalConfig.HunGuEquip[this.hunguData[roleId].items[pos].itemId];
        if (!hgequip) return power;
        let kong = hgequip.hunyuNum;
        for (let i = 0; i < kong; i++) {
            let hyType = GlobalConfig.HunGuConf.hunyuType[pos][i];//部位对应每个孔的类型
            let lv = this.hunguData[roleId].items[pos].hunyu[i];
            let hyequip: HunYuEquip = GlobalConfig.HunYuEquip[hyType][lv];
            if (hyequip) {
                power += UserBag.getAttrPower(hyequip.attrs, SubRoles.ins().getSubRoleByIndex(roleId));
                let expower = hyequip.expower ? hyequip.expower : 0;
                power += expower;
            }
        }
        return power;
    }

    /**计算某个魂骨装备战力*/
    public getHunguItemPower(itemId: number) {
        let power = 0;
        let hgequip: HunGuEquip = GlobalConfig.HunGuEquip[itemId];
        if (hgequip) {
            power += UserBag.getAttrPower(hgequip.attrs);
            let expower = hgequip.expower ? hgequip.expower : 0;
            power += expower;
        }
        return power;
    }

    /**
     * 计算某个部位当前战力(包括装备 魂玉)
     * @param 角色id
     * @param 魂骨装备部位 索引从0开始
     * @param 套装数据 {id(共鸣id):{ N件套:{count:满足条件的道具数组,stage:阶级}，... } }
     * @param 魂玉
     * */
    public getHunguPosPower(roleId: number, pos: number, suit?:any, hy?:boolean) {
        let power = 0;
        if (!this.hunguData[roleId])return power;
        let hypower = 0;
        if (hy) {//是否计算魂玉战力
            hypower += this.getHunguPosHyPower(roleId, pos);
        }
        let jcattrs: AttributeData[] = [];
        let itemId = this.hunguData[roleId].items[pos].itemId;
        let hgequip: HunGuEquip = GlobalConfig.HunGuEquip[itemId];
        if (hgequip) {
            power += UserBag.getAttrPower(hgequip.attrs, SubRoles.ins().getSubRoleByIndex(roleId));
            let expower = hgequip.expower ? hgequip.expower : 0;
            power += expower;
            //为了计算套装加成记录属性
            if( suit ){
                for (let j = 0; j < hgequip.attrs.length; j++) {
                    let ishave = false;
                    for (let z = 0; z < jcattrs.length; z++) {
                        if (jcattrs[z].type == hgequip.attrs[j].type) {
                            jcattrs[z].value += hgequip.attrs[j].value;
                            ishave = true;
                            break;
                        }
                    }
                    if (!ishave) {
                        jcattrs.push(new AttributeData(hgequip.attrs[j].type, hgequip.attrs[j].value))
                    }
                }
            }
        }

        //套装加成
        let jcattrsEx = [];
        if( suit ){
            let percent = [];//万分比加成
            for (let i in suit) {
                for (let j in suit[i]) {
                    if (suit[i][j].count.length >= (+j)) {
                        let stage = suit[i][j].stage;
                        let hgsuit: HunGuSuit = GlobalConfig.HunGuSuit[i][j][stage];
                        if (hgsuit && hgsuit.specialAttrs) {
                            percent.push(hgsuit.specialAttrs / 10000);
                        }
                    }
                }
            }
            //没有加成相当于0加成
            if( !percent.length )
                percent.push(0);

            //属性加成
            for (let i = 0; i < percent.length; i++) {
                for (let j = 0; j < jcattrs.length; j++) {
                    if( !jcattrsEx[j] )
                        jcattrsEx[j] = new AttributeData(jcattrs[j].type,0);
                    jcattrsEx[j].value += jcattrs[j].value * percent[i];
                }
            }
        }
        power += hypower + UserBag.getAttrPower(jcattrsEx);
        return power;
    }

    /**
     * 计算魂骨共鸣战力
     * @param 人物id
     * */
    public getResonancePower(roleId: number) {
        let power = 0;
        if (!this.hunguData[roleId])return power;
        let suit = this.getSuitData(roleId);
        for (let i in suit) {//获取共鸣id
            for (let j in suit[i]) {//获取N件套
                let stage = suit[i][j].stage;
                if (!stage)continue;
                let count = suit[i][j].count;
                if (count.length < (+j))continue;//没有达到套装所需要求
                let hgsuit: HunGuSuit = GlobalConfig.HunGuSuit[i][j][stage];
                if (hgsuit.attrs)
                    power += UserBag.getAttrPower(hgsuit.attrs, SubRoles.ins().getSubRoleByIndex(roleId));
                let expower = hgsuit.expower ? hgsuit.expower : 0;
                power += expower;
            }
        }
        return power;
    }

    /**
     * 获取共鸣套装数据
     * @param 角色id
     * @return {id(共鸣id):{ N件套:{count:满足条件的道具数组,stage:阶级}，... } }
     * */
    public getSuitData(roleId: number) {
        let suit = {};
        if (!this.hunguData[roleId])return suit;
        let posItemGroup = [];//0索引是占位 索引是共鸣id
        //筛选最好的N套件来获取最低阶级
        for (let k in GlobalConfig.HunGuConf.suit) {
            if (!GlobalConfig.HunGuSuit[k])continue;
            posItemGroup[+k] = [];
            //每个共鸣关联的部位索引
            for (let i in GlobalConfig.HunGuConf.suit[k]) {
                //记录身上与之共鸣的部位索引组装备
                let iPos = GlobalConfig.HunGuConf.suit[k][i];
                let itemId = this.hunguData[roleId].items[iPos].itemId;
                if (itemId) {
                    posItemGroup[+k].push(GlobalConfig.HunGuEquip[itemId]);//每个共鸣装备数量
                }
            }
            //按阶级从高到低排序
            posItemGroup[+k].sort((a: HunGuEquip, b: HunGuEquip) => {
                if (a.stage > b.stage)
                    return -1;
                else
                    return 1;
            });
        }
        //去对应共鸣的套件数数据 从好到坏取相应数量
        for (let i in GlobalConfig.HunGuSuit) {
            suit[i] = {};
            for (let j in GlobalConfig.HunGuSuit[i]) {
                suit[i][j] = {};
                suit[i][j].count = [];
                suit[i][j].stage = 0;//最小等级
                //套件数
                for (let z = 0; z < (+j); z++) {
                    if (!posItemGroup[+i][z])break;
                    suit[i][j].count.push(posItemGroup[+i][z].id);//用于外部根据id获取部位
                    //所穿戴套件数至少达到指定套件数才触发套装属性效果
                    if (!suit[i][j].stage)
                        suit[i][j].stage = posItemGroup[+i][z].stage;
                    if (suit[i][j].stage > posItemGroup[+i][z].stage)
                        suit[i][j].stage = posItemGroup[+i][z].stage;
                }
            }
        }

        return suit;
    }

    /**获取魂骨部位名字*/
    public getHunguPosName(pos: number) {
        // let str = "";
        // switch (pos) {
        //     case HGPOS.ITEM0:
        //         str = "躯干魂骨";
        //         break;
        //     case HGPOS.ITEM1:
        //         str = "头部魂骨";
        //         break;
        //     case HGPOS.ITEM2:
        //         str = "腰椎";
        //         break;
        //     case HGPOS.ITEM3:
        //         str = "颈椎";
        //         break;
        //     case HGPOS.ITEM4:
        //         str = "左手";
        //         break;
        //     case HGPOS.ITEM5:
        //         str = "右手";
        //         break;
        //     case HGPOS.ITEM6:
        //         str = "左腿";
        //         break;
        //     case HGPOS.ITEM7:
        //         str = "右腿";
        //         break;
        // }
        return GlobalConfig.HunGuConf.hunguName[pos];
    }

    /**获取品阶名(通过魂骨装备 或直接获取 )*/
    public getHunguItemQualityName(itemId: number, stage?: number) {
        let str = "";
        let quality = stage;
        if (!quality){
            if( !GlobalConfig.HunGuEquip[itemId] )
                quality = 1;//两个都没有就是没激活
            else
                quality = GlobalConfig.HunGuEquip[itemId].stage;
        }
        switch (quality) {
            case 1:
                str = "凡品";
                break;
            case 2:
                str = "中品";
                break;
            case 3:
                str = "上品";
                break;
            case 4:
                str = "极品";
                break;
            case 5:
                str = "神品";
                break;
        }
        return str;
    }

    /**计算详情属性*/
    public calcHunguTotalValue(roleId: number) {
        let attrs: AttributeData[] = [];
        let hunguData = this.hunguData[roleId]
        if (!hunguData)return attrs;
        let jcattrs: AttributeData[] = [];
        for (let i = 0; i < hunguData.items.length; i++) {
            //装备属性
            let itemId = hunguData.items[i].itemId;
            let hgequip: HunGuEquip = GlobalConfig.HunGuEquip[itemId];
            if( !hgequip )continue;
            for (let j = 0; j < hgequip.attrs.length; j++) {
                let ishave = false;
                for (let z = 0; z < jcattrs.length; z++) {
                    if (jcattrs[z].type == hgequip.attrs[j].type) {
                        jcattrs[z].value += hgequip.attrs[j].value;
                        ishave = true;
                        break;
                    }
                }
                if (!ishave) {
                    jcattrs.push(new AttributeData(hgequip.attrs[j].type, hgequip.attrs[j].value))
                }
            }
            //魂玉属性
            for (let j = 0; j < hunguData.items[i].hunyu.length; j++) {
                if (hunguData.items[i].hunyu[j]) {
                    let hunyuType = GlobalConfig.HunGuConf.hunyuType[i][j];
                    let level = hunguData.items[i].hunyu[j];
                    let hyequip: HunYuEquip = GlobalConfig.HunYuEquip[hunyuType][level];
                    for (let k = 0; k < hyequip.attrs.length; k++) {
                        let ishave = false;
                        for (let z = 0; z < attrs.length; z++) {
                            if (attrs[z].type == hyequip.attrs[k].type) {
                                attrs[z].value += hyequip.attrs[k].value;
                                ishave = true;
                                break;
                            }
                        }
                        if (!ishave) {
                            attrs.push(new AttributeData(hyequip.attrs[k].type, hyequip.attrs[k].value))
                        }
                    }
                }
            }
        }
        //共鸣属性
        let suit = this.getSuitData(roleId);
        let percent = [];//万分比加成
        for (let i in suit) {
            for (let j in suit[i]) {
                if (suit[i][j].count.length >= (+j)) {
                    let stage = suit[i][j].stage;
                    let hgsuit: HunGuSuit = GlobalConfig.HunGuSuit[i][j][stage];
                    if (hgsuit && hgsuit.attrs) {
                        for (let k = 0; k < hgsuit.attrs.length; k++) {
                            let ishave = false;
                            for (let z = 0; z < attrs.length; z++) {
                                if (attrs[z].type == hgsuit.attrs[k].type) {
                                    attrs[z].value += hgsuit.attrs[k].value;
                                    ishave = true;
                                    break;
                                }
                            }
                            if (!ishave) {
                                attrs.push(new AttributeData(hgsuit.attrs[k].type, hgsuit.attrs[k].value))
                            }
                        }
                    }
                    if (hgsuit && hgsuit.specialAttrs) {
                        percent.push(hgsuit.specialAttrs / 10000);
                    }
                }
            }
        }
        //属性加成
        for (let i = 0; i < percent.length; i++) {
            for (let j = 0; j < jcattrs.length; j++) {
                jcattrs[j].value *= (1 + percent[i]);
            }
        }
        //加总
        for (let k = 0; k < jcattrs.length; k++) {
            let ishave = false;
            for (let z = 0; z < attrs.length; z++) {
                if (attrs[z].type == jcattrs[k].type) {
                    attrs[z].value += jcattrs[k].value;
                    attrs[z].value = Math.floor(attrs[z].value);
                    ishave = true;
                    break;
                }
            }
            if (!ishave) {
                attrs.push(new AttributeData(jcattrs[k].type, Math.floor(jcattrs[k].value)));
            }
        }

        return attrs;
    }

    /**
     * 获取所属属性名
     * @param 属性类型
     * */
    public getAttrStrByType(type: number): string {
        let str: string = "";
        // str = AttributeData.getAttrStrByType(type);
        switch (type) {
            case AttributeType.atMaxHp:
                str = `生       命`;
                break;
            case AttributeType.atAttack:
                str = `攻       击`;
                break;
            case AttributeType.atDef:
                str = `物       防`;
                break;
            case AttributeType.atRes:
                str = `魔       防`;
                break;
        }
        return str;
    }

    /**
     * 返回当前身穿魂骨id
     * @param roleId
     * @param pos
     * @return itemId
     * */
    public getCurHunguId(roleId:number,pos:number):number {
        let ins = Hungu.ins();
        let hgData = ins.hunguData[roleId];
        if( !hgData ) return 0;
        let hgItem = hgData.items[pos];
        if( !hgItem )return 0;
        return  hgItem.itemId;
    }
    /**
     * 返回当前身穿魂骨装备下一阶id
     * @param roleId
     * @param pos
     * @return nextitemId
     * */
    public getNextHunguId(roleId:number,pos:number):number {
        let ins = Hungu.ins();
        let hgData = ins.hunguData[roleId];
        if( !hgData ) return 0;
        let hgItem = hgData.items[pos];
        if( !hgItem )return 0;
        return  GlobalConfig.HunGuEquip[hgItem.itemId].nextId;
    }
    /**获取魂玉下一级配置*/
    public getNextHunyuLvConfig(roleId:number,pos:number,kong:number){
        if( !this.hunguData[roleId] ) return null;
        let hyType = GlobalConfig.HunGuConf.hunyuType[pos][kong];
        let lv = this.hunguData[roleId].items[pos].hunyu[kong];
        return GlobalConfig.HunYuEquip[hyType][lv+1];
    }

    /**
     * 魂骨装备升阶红点
     * @param itemId
     * @return boolean
     * */
    public getUpgradeRedPoint(itemId:number){
        let hgequip = GlobalConfig.HunGuEquip[itemId];
        if( !hgequip || !hgequip.addStageCost )return false;
        let ins = UserBag.ins();
        for( let i in hgequip.addStageCost ){
            let itemData = ins.getBagItemById(hgequip.addStageCost[i].id);
            if( !itemData || itemData.count < hgequip.addStageCost[i].count )
                return false;
        }
        return true;
    }

    //客户端请求服务器处理
    //============================================================================================
    /**
     * 请求穿戴魂骨装备数据
     * 74-2
     * */
    public sendHunguItems(roleId: number, pos: number, itemId: number) {
        let bytes: GameByteArray = this.getBytes(2);
        bytes.writeByte(roleId);
        bytes.writeByte(pos);
        bytes.writeInt(itemId);
        this.sendToServer(bytes);
    }

    /**
     * 发送魂玉升级
     * 74-3
     * */
    public sendHunyu(roleId: number, pos: number, hypos: number) {
        let bytes: GameByteArray = this.getBytes(3);
        bytes.writeByte(roleId);
        bytes.writeByte(pos);//0~7
        bytes.writeByte(hypos);//1~5
        this.sendToServer(bytes);
    }

    /**
     * 发送魂玉升级
     * 74-4
     * */
    public sendHunguItemUpgrade(roleId: number, pos: number) {
        let bytes: GameByteArray = this.getBytes(4);
        bytes.writeByte(roleId);
        bytes.writeByte(pos);
        this.sendToServer(bytes);
    }

    //服务器数据下发处理
    //============================================================================================
    /**
     * 下发魂骨数据
     * 74-1
     * */
    public postHunguInfo(bytes: GameByteArray): void {
        let roleSum = bytes.readByte();
        for (let i = 0; i < roleSum; i++) {
            let roleId = bytes.readByte();
            let len = bytes.readByte();
            let hgd: HunguData;
            if (this.hunguData[roleId])
                hgd = this.hunguData[roleId]
            else
                hgd = new HunguData();
            for (let j = 0; j < len; j++) {
                hgd.items[j].itemId = bytes.readInt();
                let hys = bytes.readByte();
                for (let z = 0; z < hys; z++) {
                    hgd.items[j].hunyu[z] = bytes.readInt();
                }
            }
            this.hunguData[roleId] = hgd;
        }
    }

    /**
     * 下发魂骨穿戴数据返回
     * 74-2
     * */
    public postHunguItems(bytes: GameByteArray) {
        let roleId = bytes.readByte();
        let pos = bytes.readByte();
        let itemId = bytes.readInt();
        if (!this.hunguData[roleId])
            this.hunguData[roleId] = new HunguData();
        let hunguData = this.hunguData[roleId];
        let olditemId = hunguData.items[pos].itemId;
        if (hunguData)
            hunguData.items[pos].itemId = itemId;
        if( olditemId == 0 && itemId != 0 ){
            this.postNothing2Wear(1,pos);
        }
        if( itemId == 0 && olditemId != 0 ){
            this.postWear2Noting(0,pos);
        }
    }
    /**
     * 从没装备到有装备的穿戴需要播特效
     * @param control 1:穿戴装备 0:卸下装备
     * @param 部位索引0~7
     * */
    public postNothing2Wear(control:number,pos:number){
        return [control,pos];
    }
    /**从有装备到无装备的穿戴需要取消播特效*/
    public postWear2Noting(control:number,pos:number){
        return [control,pos];
    }

    /**
     * 魂玉升级返回
     * 74-3
     * */
    public postHunyu(bytes: GameByteArray) {
        let roleId = bytes.readByte();
        let pos = bytes.readByte();//0~7
        let hypos = bytes.readByte();//1~5
        let level = bytes.readInt();
        if (this.hunguData[roleId])
            this.hunguData[roleId].items[pos].hunyu[hypos - 1] = level;
    }

    /**
     * 魂骨装备升阶返回
     * 74-4
     * */
    public postHunguItemUpgrade(bytes: GameByteArray) {
        let roleId = bytes.readByte();
        let pos = bytes.readByte();
        let itemId = bytes.readInt();
        if (this.hunguData[roleId])
            this.hunguData[roleId].items[pos].itemId = itemId;
        this.postNothing2Wear(1,pos);
    }

    /**
     * 74 - 5
     * 进入魂兽副本
     */
    public enterHunShouFB(): void {
        this.sendBaseProto(5);
    }

    /**
     * 74 - 6
     * 扫荡魂兽副本
     */
    public sweepHunShouFB(): void {
        this.sendBaseProto(6);
    }

    /**
     * 74-6
     * 扫荡结果
     */
    public postSweepHunShouFB(bytes: GameByteArray): void {
        let id: number = bytes.readInt();
        this.hunShouFBTimes = bytes.readInt();
        let len: number = bytes.readInt();
        let rewards: RewardData[] = [];
        let reward: RewardData;
        for (let i: number = 0; i < len; i++) {
            reward = new RewardData();
            reward.type = bytes.readInt();
            reward.id = bytes.readInt();
            reward.count = bytes.readInt();
            rewards.push(reward);
        }

        ViewManager.ins().open(HunShouSweepWin, id, rewards);
    }

    /**
     * 74 - 7
     * 当前魂兽副本信息
     */
    public postHunShouFBInfo(bytes: GameByteArray): void {
        this.hunShouFBPassID = bytes.readInt();
        this.hunShouFBTimes = GlobalConfig.HunGuConf.dayRewardCount - bytes.readInt();
    }

    /**
     * 74 - 8
     * 魂兽副本结束时间戳
     */
    public postHunShouFBEndTime(bytes: GameByteArray): void {
        this._hunShouFBEndTime = bytes.readInt();
    }

    /** 魂兽副本剩余时间 */
    public getHunShouFbLeftTime(): number {
        return Math.floor((this._hunShouFBEndTime * 1000 + DateUtils.SECOND_2010 * 1000 - GameServer.serverTime) / 1000);
    }

    /** 魂兽副本是否开启 */
    public isHunShouFBOpen(): boolean {
        return UserZs.ins().lv >= GlobalConfig.HunGuConf.needZsLv && (GameServer.serverOpenDay + 1) >= GlobalConfig.HunGuConf.fbOpenDay;
    }

    /** 魂兽副本是否提前显示 */
    public showHunShouFB():boolean
    {
        return UserZs.ins().lv >= GlobalConfig.HunGuConf.showZsLv && (GameServer.serverOpenDay + 1) >= GlobalConfig.HunGuConf.fbOpenDay;
    }

    /** 魂兽红点 */
    public showHunShouRed(): boolean {
        if (!this.isHunShouFBOpen())
            return false;

        return this.hunShouFBTimes > 0;
    }
}

namespace GameSystem {
    export let hungu = Hungu.ins.bind(Hungu);
}