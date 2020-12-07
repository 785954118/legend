class GuanQiaWorldBigMapItem extends BaseView {

    public nameTxt: eui.Label;
    public chapterCount: eui.Label;
    public roleHeadGroup: eui.Group;
    public redPointBox: eui.Image;
    private chapterBig: number = 0;
    private rolelocation: eui.Image;
    public constructor() {
        super();
        this.skinName = "CheckBigItemSkin";
        this.observe(UserFb.ins().postZhangJieAwardChange, this.reflashChapter);
        this.observe(UserFb.ins().postGuanqiaWroldReward, this.reflashChapter);
        this.addTouchEvent(this, this.onClick);

        let role = SubRoles.ins().getSubRoleByIndex(0);
        this.rolelocation.source = `head_${role.job}${role.sex}`
    }


    private onClick(e: egret.TouchEvent): void {
        let win: GuanQiaWordMapWin = ViewManager.ins().getView(GuanQiaWordMapWin) as GuanQiaWordMapWin;
        win.changeMap(MapType.chapterMap, this.chapterBig);
    }

    public close(): void {
        this.removeObserve();
        this.removeTouchEvent(this, this.onClick)
        egret.Tween.removeTweens(this.roleHeadGroup);
    }
    private reflashChapter(): void {
        this.update(this.chapterBig);
    }
    public update(chapter: number): void {
        this.chapterBig = chapter;
        /** 关卡开始数 */
        let start: number = 1;
        let last: number;
        let allcfg: AllWorldConfig = GlobalConfig.AllWorldConfig[chapter];
        let allLastcfg: AllWorldConfig = GlobalConfig.AllWorldConfig[chapter - 1];
        let len: number = allcfg.mapGroup.length;
        let lastCfg: WorldRewardConfig = GlobalConfig.WorldRewardConfig[allcfg.mapGroup[len - 1]];
        let cfg: WorldRewardConfig;
        last = lastCfg.needLevel;
        if (allLastcfg) {
            len = allLastcfg.mapGroup.length;
            cfg = GlobalConfig.WorldRewardConfig[allLastcfg.mapGroup[len - 1]];
            start = cfg.needLevel + 1;
        }
        this.nameTxt.text = allcfg ? `${allcfg.id}.${allcfg.name}` : "";
        this.chapterCount.text = `${start}-${last}关`;
        let groupY: number = this.roleHeadGroup.y
        let offY: number = groupY - 10;
        egret.Tween.removeTweens(this.roleHeadGroup);
        if (UserFb.ins().groupID == allcfg.id) {
            this.roleHeadGroup.visible = true;
            egret.Tween.get(this.roleHeadGroup, { loop: true }).to({ y: offY }, 1000).to({ y: groupY }, 1000);
        } else {
            this.roleHeadGroup.visible = false;
        }
        let b: boolean = false;
        if (UserFb.ins().guanqiaID < start)
            b = false;
        else {
            for (let i: number = 0; i < allcfg.mapGroup.length; i++) {
                cfg = GlobalConfig.WorldRewardConfig[allcfg.mapGroup[i]];
                if (UserFb.ins().guanqiaID > cfg.needLevel && !UserFb.ins().isGetReceiveBox(allcfg.mapGroup[i])) {
                    b = true;
                    break;
                }
            }
        }
        this.redPointBox.visible = b;
    }
}