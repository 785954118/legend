/**
 * Created by hrz on 2018/2/1.
 *
 * 秘境boss 主列表按钮
 */

class WorldBossItemMain extends BaseItemRender {
    private title:eui.Image;
    private list:eui.List;
    private redPoint:eui.Image;
    private listData:eui.ArrayCollection;
    constructor() {
        super();
    }

    protected childrenCreated(){
        super.childrenCreated();

        this.list.itemRenderer = WorldBossItem;
        this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTap, this);
        this.listData = new eui.ArrayCollection();
        this.list.dataProvider = this.listData;
    }

    private onTap(e:eui.ItemTapEvent) {
        let data = this.listData.getItemAt(e.itemIndex);
        this.data.clickCall(data);
    }

    dataChanged() {
        super.dataChanged();
        let data = this.data as {type:number,arr:any[],selectIndex:number,clickCall:Function};
        this.listData.source = data.arr;
        this.list.selectedIndex = data.selectIndex;

        if (data.type == UserBoss.BOSS_SUBTYPE_WORLDBOSS)
            this.title.source = `title_mijingboss`;
        else if (data.type == UserBoss.BOSS_SUBTYPE_DARKBOSS)
            this.title.source = `title_anzhimijingboss`

        let redPoint:boolean = false;
        if (UserBoss.ins().worldBossLeftTime[data.type]) {
            // for (let d of data.arr) {
            //     if (d.canChallenge) {
            //         redPoint = true;
            //         break;
            //     }
            // }
            redPoint = UserBoss.ins().checkWorldBossRedPoint(data.type);
        }
        this.redPoint.visible = redPoint;
    }
}
