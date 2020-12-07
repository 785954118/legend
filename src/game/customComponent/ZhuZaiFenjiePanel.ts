/**
 * Created by Administrator on 2016/7/29.
 */
class ZhuZaiFenjiePanel extends BaseComponent {

    public btn: eui.Button;
    public list: eui.List;
    public countTxt: eui.Label;
    public useTxt0: eui.Label;

    private inited: boolean;

    constructor() {
        super();
    }

    public childrenCreated(): void{
	}

    public initUI(): void {

        this.list.dataProvider = new eui.ArrayCollection([]);

        this.useTxt0.text = "";
        this.countTxt.text = "";

        this.inited = true;
    }

    public open(...param: any[]): void {
        if (!this.inited)
            this.initUI();

        this.startSetBagData();

        this.addTouchEvent(this.btn, this.onTap);
        this.observe(UserBag.ins().postItemDel, this.startSetBagData);//道具删除
    }

    public close(...param: any[]): void {
        this.removeTouchEvent(this.btn, this.onTap);
        this.removeObserve();
    }

    private startSetBagData(): void {
        TimerManager.ins().doTimer(100, 1, this.setBagData, this);
    }

    private setBagData(): void {
        let result: ItemData[] = [];

        let config: EquipPointResolveConfig[] = GlobalConfig.EquipPointResolveConfig;

        let item: ItemData;
        let sum: number = 0;
        let i;
        for (i in config) {
            item = UserBag.ins().getBagItemById(config[i].itemId);
            if (item) {
                result.push(item);
                sum += item.count * config[i].materials[0].count;
            }
        }

        this.countTxt.text = "可得" + GlobalConfig.ItemConfig[config[i].materials[0].id].name + "：";
        this.useTxt0.text = sum + "";
        this.list.dataProvider = new eui.ArrayCollection(result);
    }

    private onTap(): void {
        ZhuzaiEquip.ins().sendFenjie();
    }
}