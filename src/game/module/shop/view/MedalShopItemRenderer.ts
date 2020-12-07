class MedalShopItemRenderer extends BaseItemRender {
    constructor() {
        super();
        this.skinName = "FeatsShopItem";
        this.item = new ItemBase();
        this.item.x = 21;
        this.item.y = 8;
        this.item.isShowName(false);
        this.addChild(this.item);
        if (this.btnGet) {
            this.btnGet.name = "buy";
        }
    }
    public item: ItemBase;
    public itemName: eui.Label;

    private labelTimes: eui.Label;
    private labelPrice: eui.Label;
    private btnGet: eui.Button;
    public dataChanged() {
        //  super.dataChanged();
        let _data: FeatsStore = <FeatsStore>this.data;


        this.item.data = _data.goods[0];

        this.itemName.text = this.item.getText();
        this.itemName.textColor = this.item.getTextColor();

        this.labelPrice.text = "" + _data.costMoney.count;
        if (_data.daycount) {
            this.labelTimes.visible = true;
            this.labelTimes.text = "今日已兑换" + _data.exchangeCount + "/" + _data.daycount;
        } else {
            this.labelTimes.visible = false;

        }
    }
}