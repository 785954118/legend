/**
 * BOSS列表按钮渲染
 * Created by Peach.T on 2017/10/17.
 */
class BossListRender extends BaseItemRender {

    public nameTxt: eui.Label;
    public redPoint: eui.Image;

    constructor() {
        super();
        this.skinName = "CityBossItemSkin";
    }

    public dataChanged(): void {
        let bossId: number = this.data;
        let monster: MonstersConfig = GlobalConfig.MonstersConfig[bossId];
        this.nameTxt.text = monster.name;
        let isOpen: boolean = CityCC.ins().getKillBossNum(bossId) >= CityCC.ins().getNeedKillBossNum(bossId);
        this.redPoint.visible = isOpen;
    }
}