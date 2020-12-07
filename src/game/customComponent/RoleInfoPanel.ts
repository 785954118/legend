/**
 *
 * @author
 *
 */
class RoleInfoPanel extends BaseView {
    /**神装 */
    public orange: eui.Button;
    public orangeRedPoint: eui.Image;
    public fashionPoint: eui.Image;
    /**传世 */
    public heirloom: eui.Button;
    public heirloomRedPoint: eui.Image;
    /** 一件换装 */
    public oneKeyChange: eui.Button;
    public shuzhuang: eui.Button;

    /** 装备列表 */
    protected equips: RoleItem[];
    protected groupRole: eui.Group;
    protected groupRoleNext: eui.Group;
    protected nextWingImg: eui.Image;
    protected nextWeaponImg: eui.Image;
    protected nextBodyImg: eui.Image;
    protected wingImg: eui.Image;
    protected weaponImg: eui.Image;
    protected bodyImg: eui.Image;
    protected suitImg: eui.Image;
    protected suitImg1: eui.Image;
    protected soulEff: eui.Group;
    protected nsoulEff: eui.Group;

    protected roleInfoItem0: RoleInfoItem;
    protected roleInfoItem1: RoleInfoItem;

    public bodyEff: eui.Group;
    public bodyEffect0: eui.Image;
    public bodyEffect1: eui.Image;
    public nbodyEff: eui.Group;
    public nbodyEffect0: eui.Image;
    public nbodyEffect1: eui.Image;

    protected powerPanel: PowerPanel;

    //称号
    protected rune: eui.Image;

    public shenlu: eui.Button;
    private redPointShenlu: eui.Image;

    /** 当前选择的角色 */
    public curRole: number;

    protected bless1: eui.Button;
    protected bless0: eui.Button;

    protected juesexiangxi: eui.Button;

    public ringRedPoint: eui.Image;
    public zwRedPoint: eui.Image;

    public beforeIndex: number = -1;
    private eff: MovieClip;
    private effGroup: eui.Group;
    protected suitEff: MovieClip;//当前齐鸣
    protected suitEff2: MovieClip;//当前兵魂
    protected suitEff3: MovieClip;//下一个人物齐鸣
    protected suitEff4: MovieClip;//下一个人物兵魂

    protected suitEff5: MovieClip; //当前武器模型男
    protected suitEff6: MovieClip; //下一个武器模型男
    protected suitEff7: MovieClip; //当前神装特效
    protected suitEff8: MovieClip; //下一个神装特效

    protected suitEff9: MovieClip; //当前武器模型女
    protected suitEff10: MovieClip; //下一个武器模型女

    constructor() {
        super();

        this.name = "角色";
    }

    public childrenCreated(): void {
        this.init();
        // this.setSkinPart("powerPanel", new PowerPanel());
    }

    public init(): void {
        this.touchEnabled = false;
        this.touchChildren = true;
        this.groupRole.touchEnabled = false;
        this.groupRoleNext.touchEnabled = false;
        this.groupRole.touchChildren = false;
        this.groupRoleNext.touchChildren = false;
        this.equips = [];
        for (let i = 0; i < EquipPos.MAX; i++) {
            this.equips[i] = this['item' + i];
            this.equips[i].touchEnabled = true;
            this.equips[i].isShowJob(false);
            this.equips[i].isShowTips(false);
            (<eui.Image>this["redPoint" + i]).touchEnabled = false;
        }

        this.eff = new MovieClip;
        this.eff.x = this.oneKeyChange.width / 2;
        this.eff.y = this.oneKeyChange.height / 2;
        this.eff.scaleX = 0.85;
        this.eff.scaleY = 0.85;
        this.eff.touchEnabled = false;

        this.suitEff = new MovieClip;
        this.suitEff.x = this.suitImg.x;
        this.suitEff.y = this.suitImg.y;

        this.suitEff3 = new MovieClip;
        this.suitEff3.x = this.suitImg1.x;
        this.suitEff3.y = this.suitImg1.y;

        this.suitEff2 = new MovieClip;
        this.suitEff4 = new MovieClip;
        this.suitEff5 = new MovieClip();
        this.suitEff6 = new MovieClip();
        this.suitEff7 = new MovieClip();
        this.suitEff8 = new MovieClip();
        this.suitEff9 = new MovieClip();
        this.suitEff10 = new MovieClip();

        // this.suitEff2.x = this.soulEff.x;
        // this.suitEff2.y = this.soulEff.y;

    }

    public clear() {
        this.beforeIndex = -1;
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.shuzhuang, this.onClick);
        this.addTouchEvent(this.bless0, this.onClick);
        this.addTouchEvent(this.bless1, this.onClick);
        this.addTouchEvent(this.oneKeyChange, this.onClick);
        this.addTouchEvent(this.roleInfoItem0, this.onClick);
        this.addTouchEvent(this.roleInfoItem1, this.onClick);
        this.addTouchEvent(this.shenlu, this.onClick);
        this.addTouchEvent(this.orange, this.onClick);
        this.addTouchEvent(this.heirloom, this.onClick);
        this.addTouchEvent(this.rune, this.onClick);
        this.addTouchEvent(this.juesexiangxi, this.onClick);
        this.observe(UserEquip.ins().postEquipChange, this.updataEquip);
        this.observe(UserEquip.ins().postAddSpirit, this.updataEquip);
        this.observe(UserEquip.ins().postAddSoul, this.updataEquip);
        this.observe(SpecialRing.ins().postRingUpdate, this.updateRing);
        this.observe(UserForge.ins().postForgeTips, this.delayRedPoint);
        this.observe(GameLogic.ins().postRuneExchange, this.delayRedPoint);
        this.observe(GameLogic.ins().postRuneShatter, this.delayRedPoint);
        this.observe(Rune.ins().postInlayResult, this.delayRedPoint);
        this.observe(UserBag.ins().postHuntStore, this.delayRedPoint);
        this.observe(Dress.ins().postChangeWing, this.setWing);
        this.observe(LongHun.ins().postDateUpdate, this.updateLoongSoul);
        this.observe(LongHun.ins().postStageActive, this.updateLoongSoul);
        this.observe(ShenshouRedpoint.ins().postRedPoint, this.updateLoongSoul);
        this.observe(Dress.ins().postDressInfo, this.setFashionRetPoint);
        this.observe(SpecialRing.ins().postActiveRing, this.delayRedPoint);
        this.observe(UserFb.ins().postFbRingInfo, this.delayRedPoint);
        this.observe(Heirloom.ins().postHeirloomInfo, this.setRoleEff);
        this.observe(Weapons.ins().postWeaponsUse, this.setRoleEff);
        this.observe(UserBag.ins().postItemAdd, this.delayRedPoint);//道具添加
        this.observe(UserBag.ins().postItemDel, this.delayRedPoint);//道具
        this.observe(UserBag.ins().postItemChange, this.delayRedPoint);//道具变更
        this.observe(UserBag.ins().postItemCountChange, this.delayRedPoint);//道具
        this.observe(UserFb.ins().postFbRingInfo, this.delayRedPoint);//道具
        this.observe(Actor.ins().postLevelChange, this.delayRedPoint);
        this.observe(JadeNew.ins().postJadeData, this.delayRedPoint); //玉佩信息
        this.observe(LyMark.ins().postMarkData, this.delayRedPoint);


        this.updateRing();
        this.updateLoongSoul();
        this.setRetPoint();
        this.updataEquip(false);
        this.setFashionRetPoint();
        this.clearChangeEff();
        if (this.beforeIndex != -1) {
            this.roleChange(this.beforeIndex, this.curRole);
        } else {
            this.setRole(this.curRole, this.bodyImg, this.weaponImg);
            this.setSuit(this.curRole, this.suitImg, this.suitEff);//齐鸣
            this.setWeaponsSuit(this.curRole, "sef", this.soulEff, this.suitEff2);
            this.setWeaponEffect(this.curRole, "wsef", this.soulEff, this.suitEff5);
            this.setWeaponEffect(this.curRole, "bodyEffect", this.bodyEff, this.suitEff7, 2);
            this.setWing();
        }
        this.beforeIndex = this.curRole;

        this.setSuitEquips();
    }

    public close(): void {
        DisplayUtils.removeFromParent(this.eff);
        DisplayUtils.removeFromParent(this.suitEff);
        DisplayUtils.removeFromParent(this.suitEff2);
        DisplayUtils.removeFromParent(this.suitEff3);
        DisplayUtils.removeFromParent(this.suitEff4);
        DisplayUtils.removeFromParent(this.suitEff5);
        DisplayUtils.removeFromParent(this.suitEff6);
        DisplayUtils.removeFromParent(this.suitEff7);
        DisplayUtils.removeFromParent(this.suitEff8);
        DisplayUtils.removeFromParent(this.suitEff9);
        DisplayUtils.removeFromParent(this.suitEff10);
        this.roleInfoItem0.destory();
        this.roleInfoItem1.destory();
    }

    public clearChangeEff() {
        egret.Tween.removeTweens(this.groupRole);
        egret.Tween.removeTweens(this.groupRoleNext);
        this.groupRole.x = 0;
        this.groupRoleNext.x = 580;
        this.groupRole.alpha = 1;
        this.groupRoleNext.alpha = 0;
        this.groupRoleNext.visible = false;
        this.setRole(this.curRole, this.bodyImg, this.weaponImg);
        this.setWing(this.curRole, this.wingImg);
        this.setSuit(this.curRole, this.suitImg, this.suitEff);//齐鸣
        this.setWeaponsSuit(this.curRole, "sef", this.soulEff, this.suitEff2);

        // DisplayUtils.removeFromParent(this.suitEff5);
        //DisplayUtils.removeFromParent(this.suitEff6);
        //this.setWeaponEffect(this.curRole, "wsef", this.soulEff, this._wEffChange ? this._wEffChange : this.suitEff5);
        this.setWeaponEffect(this.curRole, "wsef", this.soulEff, this.suitEff5);

        this.setWeaponEffect(this.curRole, "bodyEffect", this.bodyEff, this.suitEff7, 2);
    }

    /** 角色切换特效 */
    public roleChange(beforeIndex: number, nextIndex: number) {
        if (beforeIndex == nextIndex) {
            this.clearChangeEff();
            return;
        }
        this.groupRoleNext.visible = true;
        this.setWing(beforeIndex, this.wingImg);
        this.setWing(nextIndex, this.nextWingImg);
        this.setRole(beforeIndex, this.bodyImg, this.weaponImg);
        this.setRole(nextIndex, this.nextBodyImg, this.nextWeaponImg);
        this.setSuit(beforeIndex, this.suitImg, this.suitEff);
        this.setSuit(nextIndex, this.suitImg1, this.suitEff3);
        this.setWeaponsSuit(beforeIndex, "sef", this.soulEff, this.suitEff2);
        this.setWeaponsSuit(nextIndex, "nsef", this.nsoulEff, this.suitEff4);
        this.setWeaponEffect(beforeIndex, "wsef", this.soulEff, this.suitEff5);
        this.setWeaponEffect(nextIndex, "nwsef", this.nsoulEff, this.suitEff6);
        this.setWeaponEffect(beforeIndex, "bodyEffect", this.bodyEff, this.suitEff7, 2);
        this.setWeaponEffect(nextIndex, "nbodyEffect", this.nbodyEff, this.suitEff8, 2);
        let t = egret.Tween.get(this.groupRole);
        let t2 = egret.Tween.get(this.groupRoleNext);

        if (beforeIndex < nextIndex) {
            this.groupRoleNext.x = 580;
            t.to({ x: -580, alpha: 0 }, 600);
            t2.to({ x: 0, alpha: 1 }, 600).call(this.clearChangeEff, this);
        } else {
            this.groupRoleNext.x = -580;
            t.to({ x: 580, alpha: 0 }, 600);
            t2.to({ x: 0, alpha: 1 }, 600).call(this.clearChangeEff, this);
        }

    }

    protected updateLoongSoul(): void {
        this.redPointShenlu.visible = LongHun.ins().canShowRedPointInAll() || JadeNew.ins().checkRed() || ShenshouRedpoint.ins().redpoint;
    }

    protected updateRing(): void {
        let ringModel: number[] = SubRoles.ins().getSubRoleByIndex(this.curRole).exRingsData;
        if (ringModel[0] > 0) {
            this.roleInfoItem0.setImgSource(0, 1);
            this.roleInfoItem0.setLv(0);
            this.roleInfoItem0.setNameTxt("麻痹戒指");
            this.roleInfoItem0.setBgValue(`quality4`);
            this.roleInfoItem0.setRedPointVisibel(false);
        }
        else {
            this.roleInfoItem0.setImgSource(0, 0);
            this.roleInfoItem0.setLv(0);
            this.roleInfoItem0.setNameTxt("麻痹戒指");
            this.roleInfoItem0.setBgValue(`quality0`);
        }
        if (ringModel[1] > 0) {
            this.roleInfoItem1.setImgSource(1, 1);
            this.roleInfoItem1.setLv(0);
            this.roleInfoItem1.setNameTxt("护身戒指");
            this.roleInfoItem1.setBgValue(`quality4`);
            this.roleInfoItem1.setRedPointVisibel(false);
        }
        else {
            this.roleInfoItem1.setImgSource(1, 0);
            this.roleInfoItem1.setLv(0);
            this.roleInfoItem1.setNameTxt("护身戒指");
            this.roleInfoItem1.setBgValue(`quality0`);
        }
    }

    @callLater
    protected updataEquip(delay: boolean = true): void {
        let model: Role = SubRoles.ins().getSubRoleByIndex(this.curRole);
        this.setEquip(model);

        //向控制器拿数据更新界面
        if (delay) {
            TimerManager.ins().doTimer(300, 1, this.onDelayReflash, this);
        } else {
            this.onDelayReflash();
        }
        this.setSuitEquips();
    }

    private onDelayReflash(): void {
        UserRole.ins().setCanChange();
    }

    /** 设置装备 */
    protected setEquip(role: Role): void {
        if (!role)
            return;
        let len: number = role.getEquipLen();

        this.weaponImg.source = "";
        for (let i = 0; i < len; i++) {
            let element: EquipsData = role.getEquipByIndex(i);
            this.equips[i].setModel(role);
            this.equips[i].setCurRole(this.curRole);
            this.equips[i].setIndex(i);
            this.equips[i].data = element.item;
            if (element.item.configID == 0) {
                this.equips[i].setItemImg(i > EquipPos.MAX ? '' : `xb_1${ForgeConst.EQUIP_POS_TO_SUB[i]}`);
                this.equips[i].isShowTips(false);
                this.addTouchEvent(this.equips[i], this.onClick);
            } else {
                this.equips[i].isShowTips(true);
                this.removeTouchEvent(this.equips[i], this.onClick);
            }

        }
        this.powerPanel.setPower(role.power);
        this.setRole(this.curRole, this.bodyImg, this.weaponImg);
        this.setSuit(this.curRole, this.suitImg, this.suitEff);//齐鸣
        this.setWeaponsSuit(this.curRole, "sef", this.soulEff, this.suitEff2);
        this.setWeaponEffect(this.curRole, "wsef", this.soulEff, this.suitEff5);
        this.setWeaponEffect(this.curRole, "bodyEffect", this.bodyEff, this.suitEff7, 2);
    }

    private setRole(index: number, imgBody: eui.Image, imgWeapon: eui.Image) {
        imgBody.source = null;
        imgWeapon.source = null;
        let role: Role = SubRoles.ins().getSubRoleByIndex(index);
        let id: number = role.getEquipByIndex(0).item.configID;
        let zb: number[] = role.zhuangbei;
        let isHaveBody: boolean;
        let bodyId: number = zb[0];
        let weaponId: number = zb[1];
        let weaponConf: EquipsData = role.getEquipByIndex(0);
        let weaponConfId: number = weaponConf.item.configID;
        let bodyConf: EquipsData = role.getEquipByIndex(2);
        let bodyConfId: number = bodyConf.item.configID;
        if (weaponConfId > 0) {
            let fileName: string = GlobalConfig.EquipConfig[weaponConfId].appearance;
            if (fileName && fileName.indexOf("[job]") > -1)
                fileName = fileName.replace("[job]", role.job + "");
            imgWeapon.source = !GlobalConfig.EquipWithEffConfig[id + "_" + role.sex] ? fileName + "_" + role.sex + "_c_png" : null;

        }
        if (bodyConfId > 0) {
            let fileName: string = GlobalConfig.EquipConfig[bodyConfId].appearance;
            if (fileName && fileName.indexOf("[job]") > -1)
                fileName = fileName.replace("[job]", role.job + "");
            imgBody.source = fileName + "_" + role.sex + "_c_png";
            isHaveBody = true;
        }

        if (!isHaveBody)
            imgBody.source = `body000_${role.sex}_c_png`;
        if (weaponId > 0)
            imgWeapon.source = this.getZhuangbanById(weaponId).res + "_" + role.sex + "_c_png";
        if (bodyId > 0)
            imgBody.source = this.getZhuangbanById(bodyId).res + "_" + role.sex + "_c_png";
    }

    public setRoleEff() {
        this.setSuit(this.curRole, this.suitImg, this.suitEff);//齐鸣
        this.setWeaponsSuit(this.curRole, "sef", this.soulEff, this.suitEff2)//兵魂
        this.setWeaponEffect(this.curRole, "wsef", this.soulEff, this.suitEff5);
        this.setWeaponEffect(this.curRole, "bodyEffect", this.bodyEff, this.suitEff7, 2);
    }

    public setSuit(roleId: number, suitImg: eui.Image, suitEff: MovieClip) {
        DisplayUtils.removeFromParent(suitEff);
        let role: Role = SubRoles.ins().getSubRoleByIndex(roleId)
        let cfg: HeirloomEquipSetConfig = role.heirloom.getSuitConfig(role);
        if (cfg) {
            if (!suitEff.parent)
                suitImg.parent.addChildAt(suitEff, suitImg.parent.getChildIndex(suitImg));
            let suitConfig: HeirloomEquipSetConfig = GlobalConfig.HeirloomEquipSetConfig[cfg.lv];
            suitEff.playFile(RES_DIR_EFF + suitConfig.neff, -1);
        }
    }

    public setWeaponsSuit(roleId: number, jobImage: string, soulEffGroup: eui.Group, suitEff: MovieClip) {
        let role: Role = SubRoles.ins().getSubRoleByIndex(roleId);
        suitEff.x = this[jobImage + role.job].x;//"sef"  suitEff2
        suitEff.y = this[jobImage + role.job].y;
        suitEff.rotation = this[jobImage + role.job].rotation;
        DisplayUtils.removeFromParent(suitEff);
        let wid: number = role.weapons.weaponsId;
        let hideWeapons: boolean = role.hideWeapons();  //是否隐藏兵魂特效

        if (!hideWeapons && wid) {
            if (!suitEff.parent)
                soulEffGroup.addChild(suitEff);
            let suitConfig: WeaponSoulConfig = GlobalConfig.WeaponSoulConfig[wid];
            suitEff.playFile(RES_DIR_EFF + suitConfig.inside[role.job - 1], -1);
        }
    }

    /** 设置武器模型和服装特效 */
    private setWeaponEffect(roleId: number, jobImage: string, soulEffGroup: eui.Group, suitEff: MovieClip, pos: number = 0): void {
        let role: Role = SubRoles.ins().getSubRoleByIndex(roleId);
        let id: number = role.getEquipByIndex(pos).item.configID;
        let cfg: EquipWithEffConfig = GlobalConfig.EquipWithEffConfig[id + "_" + role.sex];
        DisplayUtils.removeFromParent(suitEff);

        let zb: number[] = role.zhuangbei;
        let eff: MovieClip = suitEff;
        if (eff == this.suitEff5) {
            if (role.sex == 0)
                DisplayUtils.removeFromParent(this.suitEff9);
            else
                eff = this.suitEff9;
        }
        else if (eff == this.suitEff6) {
            if (role.sex == 0)
                DisplayUtils.removeFromParent(this.suitEff10);
            else
                eff = this.suitEff10;
        }

        if (cfg && ((pos == 0 && zb[1] <= 0) || (pos == 2 && zb[0] <= 0))) {
            eff.x = this[jobImage + role.sex].x + cfg.offX;
            eff.y = this[jobImage + role.sex].y + cfg.offY;
            eff.rotation = this[jobImage + role.sex].rotation;
            eff.scaleX = eff.scaleY = cfg.scaling;
            eff.playFile(RES_DIR_EFF + cfg.inShowEff, -1);
            soulEffGroup.addChild(eff);
        }
        else
            DisplayUtils.removeFromParent(eff);
    }

    private getZhuangbanById(id: number): ZhuangBanId {
        for (let k in GlobalConfig.ZhuangBanId) {
            if (GlobalConfig.ZhuangBanId[k].id == id)
                return GlobalConfig.ZhuangBanId[k];
        }
        return null;
    }

    private setFashionRetPoint(): void {
        if (this.fashionPoint) {
            this.fashionPoint.visible = Dress.ins().redPoint();
        }
    }

    protected onClick(e: egret.TouchEvent): void {
        switch (e.currentTarget) {
            case this.juesexiangxi:
                // ViewManager.ins().close(RoleWin);
                ViewManager.ins().open(RoleAttrWin, this.curRole);
                break;
            case this.oneKeyChange:
                UserRole.ins().checkHaveCan(true, this.curRole);
                this.setCanChange();
                SoundUtil.ins().playEffect(SoundUtil.EQUIP);
                SoundUtil.ins().playEffect(SoundUtil.EQUIP);
                break;

            case this.roleInfoItem0:
                // ViewManager.ins().close(RoleWin);
                ViewManager.ins().open(SpecialRingWin, 0, this.curRole);
                break;
            case this.roleInfoItem1:
                // ViewManager.ins().close(RoleWin);
                ViewManager.ins().open(SpecialRingWin, 1, this.curRole);
                break;
            case this.shuzhuang:
                // ViewManager.ins().close(RoleWin);
                ViewManager.ins().open(DressWin, this.curRole);
                break;
            case this.shenlu:
                // ViewManager.ins().open(LongHunWin, this.curRole);
                // ViewManager.ins().close(RoleWin);
                ViewManager.ins().open(TreasureWin, 0, this.curRole);
                break;
            case this.orange:
                // ViewManager.ins().close(RoleWin);
                ViewManager.ins().open(AdvanEquipWin, 0, 0);//this.curRole);//默认打开第一个
                this.setRetPoint();
                break;
            case this.heirloom:
                // ViewManager.ins().close(RoleWin);
                ViewManager.ins().open(HeirloomWin, this.curRole);
                break;
            case this.rune:
                // ViewManager.ins().close(RoleWin);
                ViewManager.ins().open(RuneWin, this.curRole);
                break;
            case this.bless0:
                //egret.log("特戒");
                if (SpecialRing.ins().isFireRingFuse()) {
                    // ViewManager.ins().close(RoleWin);
                    ViewManager.ins().open(FireRingWin);
                }
                else if (SpecialRing.ins().checkRingOpen()) {
                    // ViewManager.ins().close(RoleWin);
                    ViewManager.ins().open(RingInfoView);
                }
                else {
                    UserTips.ins().showTips(`激活神器 神龙之戒 后开启`);
                }
                break;
            case this.bless1:

                break;
            default:
                let index = this.equips.indexOf(e.currentTarget);
                if (index >= 0) {
                    if (index > 8) {
                        //if(this.equips[index].data)ViewManager.ins().open(RoleChooseEquipWin, this.curRole, index);
                    }
                    else {
                        // ViewManager.ins().close(RoleWin);
                        ViewManager.ins().open(RoleChooseEquipWin, this.curRole, index);
                    }
                }
                break;
        }
    }

    protected setWing(index: number = this.curRole, wingImg: eui.Image = this.wingImg): void {
        wingImg.source = null;
        let wingdata: WingsData = SubRoles.ins().getSubRoleByIndex(index).wingsData;
        let id: number = SubRoles.ins().getSubRoleByIndex(index).zhuangbei[2];
        if (id > 0)
            wingImg.source = GlobalConfig.ZhuangBanId[id].res + "_png";
        else if (wingdata.openStatus) {
            wingImg.source = GlobalConfig.WingLevelConfig[wingdata.lv].appearance + "_png";
        } else {
            wingImg.source = "";
        }

    }

    private delayRedPoint() {
        if (!TimerManager.ins().isExists(this.setRetPoint, this)) TimerManager.ins().doTimer(60, 1, this.setRetPoint, this);
    }

    private setRetPoint(): void {
        for (let i: number = 0; i < 2; i++) {
            let role: Role = SubRoles.ins().getSubRoleByIndex(this.curRole);
            let flag: boolean = UserRole.ins().roleHintCheck(role, i);
            (this["roleInfoItem" + i] as RoleInfoItem).setRedPointVisibel(flag);
        }

        let bool: boolean = false;
        let len: number = SubRoles.ins().subRolesLen;
        for (let a: number = 0; a < len; a++) {
            let model: Role = SubRoles.ins().getSubRoleByIndex(a);
            for (let i = 0; i < 8; i++) {
                bool = UserEquip.ins().setOrangeEquipItemState(i, model);
                if (!bool && i < 2)
                    bool = UserEquip.ins().setLegendEquipItemState(i > 0 ? 2 : 0, model);
                if (bool) {
                    let b = UserBag.ins().checkEqRedPoint(i, model);
                    bool = b != null ? b : bool;
                }
                if (bool)
                    break;
            }
            if (bool)
                break;
        }
        // if (!bool)
        // 	bool = UserEquip.ins().checkRedPoint(4);
        if (!bool)
            bool = UserEquip.ins().checkRedPointEx(5, this.curRole);//UserEquip.ins().checkRedPoint(5, this.curRole);
        if (!bool)
            bool = UserBag.ins().getLegendHasResolve();
        if (!bool) {
            let itemData: ItemData[] = UserBag.ins().getLegendOutEquips();
            bool = itemData.length > 0;
        }
        if (!bool) {
            bool = Boolean(UserBag.ins().getHuntGoods(0).length);
        }
        if (!bool) {
            bool = ExtremeEquipModel.ins().getRedPoint();
        }

        this.orangeRedPoint.visible = bool;

        this.heirloomRedPoint.visible = Heirloom.ins().checkRedPoint();

        this.updateLoongSoul();

        this.ringRedPoint.visible = OpenSystem.ins().checkSysOpen(SystemType.RING) && (SpecialRing.ins().checkHaveUpRing() || SpecialRing.ins().isCanStudySkill() || SpecialRing.ins().isCanUpgradeSkill() || SpecialRing.ins().fireRingRedPoint() || LyMark.ins().checkRed());

        this.zwRedPoint.visible = RuneRedPointMgr.ins().checkAllSituation(false);

        // this.setSamsaraRedPoint();
        this.setCanChange();
    }

    private setSamsaraRedPoint(): void {
        if (SamsaraModel.ins().isOpen()) {
            for (let i = EquipPos.HAT; i < EquipPos.MAX; i++) {
                let img: eui.Image = <eui.Image>this["redPoint" + i];
                let role: Role = SubRoles.ins().getSubRoleByIndex(this.curRole);
                let data: EquipsData = role.getEquipByIndex(i);
                if (data.soulLv > 0) {
                    (this[`item${i}`] as ItemBase).setSoul(true);
                }
                else {
                    (this[`item${i}`] as ItemBase).setSoul(false);
                }
                if (!img.visible) img.visible = SamsaraModel.ins().checkEquipPosCanAddSpirit(role, i) || SamsaraModel.ins().checkUpgradeSoul(role, i);
            }
        }
        for (let i = 9; i < 13; i++) {
            this["item" + i].visible = SamsaraModel.ins().isOpen();
        }
    }

    public setCanChange(data?: boolean[][]): void {
        // if (!data) return;
        let d: boolean[] = data ? (data[this.curRole] ? data[this.curRole] : []) : UserRole.ins().canChangeEquips[this.curRole];
        let h: boolean = false;
        let n: number = this.equips.length;
        DisplayUtils.removeFromParent(this.eff);
        for (let i = 0; i < n; i++) {
            (<eui.Image>this["redPoint" + i]).visible = d[i] ? d[i] : false;
            if (!h) h = d[i] ? d[i] : false;
        }
        this.updateOneKey(h);
        this.setSamsaraRedPoint();
    }
    private updateOneKey(v: boolean) {
        if (!OpenSystem.ins().checkSysOpen(SystemType.ONEKEY)) {
            this.oneKeyChange.visible = false;
            return;
        }
        this.oneKeyChange.visible = v;

        //if (h && Actor.level < 50) {
        if (this.oneKeyChange.visible) {
            this.eff.playFile(RES_DIR_EFF + "chargeff1", -1);
            if (!this.eff.parent) this.effGroup.addChild(this.eff);
        } else {
            DisplayUtils.removeFromParent(this.eff);
        }
    }

    public getEquipItem(pos: EquipPos): RoleItem {
        return this.equips[pos];
    }

    private setSuitEquips() {
        let role: Role = SubRoles.ins().getSubRoleByIndex(this.curRole);
        for (let i = 0; i < UserEquip.FOEGE_MAX; i++) {
            let eq = this.equips[i];
            let info: HeirloomInfo = role.heirloom.getInfoBySolt(i);
            if (eq && info.lv > 0) {
                // eq.setItemImg(info.icon.toString() + "_png");
                eq.setItemHeirloomBgImg(true, info.image);
            } else {
                eq.setItemHeirloomBgImg(false);
            }
        }
    }
}

