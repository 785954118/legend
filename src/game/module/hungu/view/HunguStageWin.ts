/**
 * 魂骨升阶界面
 */
class HunguStageWin extends BaseEuiView {
    private nowItemIcon: ItemBase;
    private nextItemIcon: ItemBase;
    private lvUpBtn: eui.Button;
    private bgClose: eui.Rect;
    private getItemList: eui.List;
    private redPoint: eui.Image;
    private attr1Now0: eui.Label;
    private attr2Now0: eui.Label;
    private attr3Now0: eui.Label;
    private attrNow: eui.Label[];
    private attr1Now: eui.Label;
    private hunyuNow: eui.Label;
    private attr1Next0: eui.Label;
    private attr2Next0: eui.Label;
    private attr3Next0: eui.Label;
    private arrtNext: eui.Label[];
    private hunyuNext: eui.Label;
    private roleId: number;
    private pos: number;
    private closeBtn:eui.Button;
    private powerPanel0:PowerPanel;
    private powerPanel1:PowerPanel;
    public constructor() {
        super();
        this.skinName = "hunguStageSkin";
    }

    public close(...param: any[]): void {

    }

    public open(...param: any[]): void {
        this.roleId = param[0];
        this.pos = param[1];
        this.getItemList.itemRenderer = ItemBase;
        this.addTouchEvent(this.lvUpBtn,this.onTouch);
        this.addTouchEvent(this.bgClose,this.onTouch);
        this.addTouchEvent(this.closeBtn,this.onTouch);
        this.observe(Hungu.ins().postHunguItemUpgrade,this.updateUI);
        this.attrNow = [this.attr1Now0, this.attr2Now0, this.attr3Now0];
        this.arrtNext = [this.attr1Next0, this.attr2Next0, this.attr3Next0];
        this.updateUI();
    }

    private updateUI() {
        let ins = Hungu.ins();
        let curId = ins.getCurHunguId(this.roleId, this.pos);
        let nextId = ins.getNextHunguId(this.roleId, this.pos);
        let curConfig = GlobalConfig.HunGuEquip[curId];
        let nextConfig = GlobalConfig.HunGuEquip[nextId];
        for (let i in this.attrNow) {
            if( curConfig && curConfig.attrs[i] ){
                this.attrNow[i].visible = true;
                this.attrNow[i].text = this.parserStr(curConfig.attrs[i]);
            }else{
                this.attrNow[i].visible = false;
            }
            if( nextConfig && nextConfig.attrs[i] ){
                this.arrtNext[i].visible = true;
                this.arrtNext[i].text = this.parserStr(nextConfig.attrs[i]);
            }else{
                this.arrtNext[i].visible = false;
            }
        }

        let curCount  = curConfig&&curConfig.hunyuNum?curConfig.hunyuNum:0;
        let nextCount = nextConfig&&nextConfig.hunyuNum?nextConfig.hunyuNum:0;
        this.hunyuNow.text = `魂玉数量：${curCount}`;
        this.hunyuNext.text = `魂玉数量：${nextCount}`;

        this.redPoint.visible = ins.getUpgradeRedPoint(curConfig&&curConfig.id?curConfig.id:0);

        if( curConfig&&curConfig.addStageCost ){
            this.getItemList.dataProvider = new eui.ArrayCollection(curConfig.addStageCost);
            this.getItemList.validateNow();
            for( let i = 0; i < this.getItemList.numElements;i++ ){
                let render = this.getItemList.getVirtualElementAt(i) as ItemBase;
                let itemdata:{type:number,id:number,count:number} = this.getItemList.dataProvider.getItemAt(i) as {type:number,id:number,count:number};
                let color = ColorUtil.GREEN_COLOR_N;
                let itemData = UserBag.ins().getBagItemById(itemdata.id);
                let curCount = itemData?itemData.count:0;
                if( curCount < itemdata.count ){
                    color = ColorUtil.RED_COLOR_N;
                }
                render.setName(`|C:${color}&T:${curCount}/${itemdata.count}`);
            }
        }

        if( curConfig ){
            this.nowItemIcon.data = curConfig.id;
            this.nowItemIcon.isShowJob(false);
            this.nowItemIcon.showNum(false);
            //当前战力
            let power = 0;
            power += UserBag.getAttrPower(curConfig.attrs);
            let expower = curConfig.expower?curConfig.expower:0;
            power += expower;
            this.powerPanel0.setPower(power);
        }

        if( nextConfig ){
            this.nextItemIcon.data = nextConfig.id;
            this.nextItemIcon.isShowJob(false);
            this.nextItemIcon.showNum(false);
            //下一阶战力
            let power = 0;
            power += UserBag.getAttrPower(nextConfig.attrs);
            let expower = nextConfig.expower?nextConfig.expower:0;
            power += expower;
            this.powerPanel1.setPower(power);
        }

    }
    private parserStr(attr:{type:number,value:number}):string{
        return AttributeData.getAttrStrByType(attr.type) + ":" + attr.value;
    }
    private onTouch(e:egret.TouchEvent){
        switch (e.currentTarget){
            case this.lvUpBtn:
                if( this.redPoint.visible ){
                    Hungu.ins().sendHunguItemUpgrade(this.roleId,this.pos);
                }else{
                    UserTips.ins().showTips(`材料不足`);
                }
                break;
            case this.bgClose:
            case this.closeBtn:
                ViewManager.ins().close(this);
                break;
        }
    }



}
ViewManager.ins().reg(HunguStageWin, LayerManager.UI_Popup);