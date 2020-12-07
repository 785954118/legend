/**
 * 远古BOSS
 * Created by Peach.T on 2017/10/17.
 */
class MonsterCityWarView extends BaseView {

    public bossGroup: eui.Group;
    public list: eui.List;
    public challengeBtn: eui.Button;
    public redPoint: eui.Image;
    public nameTxt: eui.Label;
    public canChallengeTxt: eui.Label;
    public rewardList: eui.List;
    public leftText: eui.Label;
    public bossName: eui.Label;
    public stateImage: eui.Image;
    public killProgressBar: eui.ProgressBar;
    private bossImage: MovieClip;
    private bossEffect: MovieClip;
    private isInit: boolean;
    public nextTime:eui.Label;

    public constructor() {
        super();
        // this.skinName = `CityBossSkin`;
    }

    protected childrenCreated(){
        this.init();
    }

    public open(): void {
        this.addCustomEvent();
        this.initView();
    }

    private init(): void {
        if (!this.isInit) {
            this.list.itemRenderer = BossListRender;
            this.rewardList.itemRenderer = ItemBase;
            this.canChallengeTxt.text = `未刷新`;

            this.bossEffect = new MovieClip;
            this.bossEffect.scaleX = -1;
            this.bossEffect.scaleY = 1;
            this.bossEffect.x = 78;
            this.bossEffect.y = 160;
            this.bossGroup.addChild(this.bossEffect);

            this.bossImage = new MovieClip;
            this.bossImage.scaleX = -1;
            this.bossImage.scaleY = 1;
            this.bossImage.x = 78;
            this.bossImage.y = 160;
            this.bossGroup.addChild(this.bossImage);
            this.isInit = true;
        }
    }

    private addCustomEvent(): void {
        this.observe(CityCC.ins().postBossInfo, this.checkState);//刷新BOSS击杀进度
        this.observe(CityCC.ins().postCityBossId, this.checkState);//刷新BOSS击杀进度
        this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onListChange, this);
        this.addTouchEvent(this.challengeBtn, this.onChallenge);
        this.bossName.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openBossWin, this);
    }

    private openBossWin(e: TouchEvent): void {
        let bossId: number = this.list.dataProvider.getItemAt(this.list.selectedIndex);
        let cityBoss: CityBossConfig = CityCC.ins().getCityBossConfig(bossId);
        let killBossId: number = cityBoss.killBossId;
        ViewManager.ins().open(BossWin, 1, killBossId);
    }

    private initView(): void {
        this.list.dataProvider = CityCC.ins().getBossList();
        let index: number = this.getBossIndex();
        this.list.selectedIndex = index;
        this.updateView(index);
    }

    private getBossIndex(): number {
        let bossId: number = CityCC.ins().getShowBossId();
        let index: number = 0;
        if (bossId > 0) {
            let count: number = this.list.dataProvider.length;
            for (let i: number = 0; i < count; i++) {
                if (bossId == this.list.dataProvider.getItemAt(i)) {
                    index = i;
                    break;
                }
            }
        }
        return index;
    }

    private onChallenge(e: egret.TouchEvent): void {
        if (CityCC.ins().enterCD > 0) {
            UserTips.ins().showTips(`冷却中，${CityCC.ins().enterCD}秒后可进入主城`);
        }
        else {
            if (CityCC.ins().isCity) {
                TimerManager.ins().doNext(() => {
                    let win: BossBelongPanel = ViewManager.ins().getView(BossBelongPanel) as BossBelongPanel;
                    win.attrBoss();
                }, this);
            }
            else {
                CityCC.ins().isChallenge = true;
                CityCC.ins().sendEnter();
            }
        }
        ViewManager.ins().close(this);
    }

    private checkState(): void {
        this.list.dataProvider = CityCC.ins().getBossList();//进度刷新更新BOSS按钮列表
        this.updateView(this.list.selectedIndex);
    }

    private onListChange(e: eui.ItemTapEvent): void {
        this.updateView(e.itemIndex);
    }

    private updateView(index: number): void {
        let bossId: number = this.list.dataProvider.getItemAt(index);
        let monster: MonstersConfig = GlobalConfig.MonstersConfig[bossId];
        let cityBoss: CityBossConfig = CityCC.ins().getCityBossConfig(bossId);
        let killNum: number = CityCC.ins().getKillBossNum(bossId);
        let maxKillNum = CityCC.ins().getNeedKillBossNum(bossId);
        let isOpen: boolean = killNum >= maxKillNum;
        let effectPath: string = GlobalConfig.EffectConfig[monster.effect].fileName;
        this.bossName.textFlow = (new egret.HtmlTextParser).parser(`<a href="event:"><u>${GlobalConfig.MonstersConfig[cityBoss.killBossId].name}</u></a>`);
        this.bossName.touchEnabled = true;

        let time: string= CityCC.ins().getRefreshTime(bossId);
        if(time && time.length > 0)
        {
            this.nextTime.text = "最快将于" + CityCC.ins().getRefreshTime(bossId) + "刷新";
        }
        else
        {
            this.nextTime.text = "";
        }        
        this.nextTime.visible = true;
        this.nameTxt.text = `${monster.name}(${monster.level}级)`;
        this.killProgressBar.minimum = 0;
        this.killProgressBar.maximum = maxKillNum;
        this.killProgressBar.value = killNum;
        this.rewardList.dataProvider = new eui.ArrayCollection(cityBoss.showReward);
        this.bossImage.playFile(RES_DIR_MONSTER + `monster${monster.avatar}_3s`, -1);
        this.bossEffect.playFile(RES_DIR_EFF + effectPath, -1);
        this.updateState(isOpen);


    }

    private updateState(isOpen: boolean): void {
        this.canChallengeTxt.visible = !isOpen;
        this.challengeBtn.visible = isOpen;
        this.redPoint.visible = isOpen;
        this.stateImage.visible = isOpen;
        this.nextTime.visible = !isOpen;
    }
}
