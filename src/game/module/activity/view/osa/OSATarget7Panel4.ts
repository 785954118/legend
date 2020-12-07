// TypeScript file

class OSATarget7Panel4 extends BaseView {
    private turnBossBtn:eui.Button;
    private numLbl:eui.BitmapLabel;
    private list:eui.List;
    private actTime1:eui.Label;
    private actInfo1:eui.Label;
    private arrowUp:eui.Image;
    private arrowDown:eui.Image;

    public activityID:number;

    constructor() {
        super();

        this.skinName = `CDSnowManSkin`;
    }

    public childrenCreated():void
	{
		super.childrenCreated();
		this.list.itemRenderer = ChritmasSnowMainItem;
	}

    open() {
        this.addTouchEvent(this.turnBossBtn, this.onTap);
        this.addTouchEvent(this.arrowUp, this.onTap);
        this.addTouchEvent(this.arrowDown, this.onTap);
        TimerManager.ins().doTimer(1000, 0, this.updateTime, this);

        this.initData();
    }

    private initData() {
        this.actInfo1.text = GlobalConfig.ActivityConfig[this.activityID].desc;

        let config = GlobalConfig.ActivityType7Config[this.activityID];
        let listConfig = [];
        for (let i in config) {
            listConfig.push(config[i]);
        }

        listConfig.sort((a:ActivityType7Config, b:ActivityType7Config)=>{
            if(a.index < b.index)
                return -1;
            return 1;
        });

        this.list.dataProvider = new eui.ArrayCollection(listConfig);

        this.updateTime();
        this.updateData();
    }

    private updateTime(){
        let act = Activity.ins().getActivityDataById(this.activityID) as ActivityType7Data;
        let sec = act.getLeftTime();
        this.actTime1.text = DateUtils.getFormatBySecond(sec, DateUtils.TIME_FORMAT_5, 3);
    }

    public updateData() {
        let data:ActivityType7Data = Activity.ins().getActivityDataById(this.activityID) as ActivityType7Data;
        this.numLbl.text = `${data.bossScore}`;

        let sources = this.list.dataProvider as eui.ArrayCollection;
        for (let source of sources.source) {
            sources.itemUpdated(source);
        }
    }

    private onTap(e:egret.TouchEvent) {
        let tar = e.currentTarget;
        switch (tar) {
            case this.turnBossBtn:
                ViewManager.ins().open(BossWin, 1);
                break;
            case this.arrowUp:
                this.arrowTo(-1);
                break;
            case this.arrowDown:
                this.arrowTo(1);
                break;
        }
    }

    private arrowTo(dir:number) {
        let sv = this.list.scrollV + dir * 130;
        if (sv < 0) {
            sv = 0;
        } else if ( sv > this.list.contentHeight - this.list.parent.height) {
            sv = this.list.contentHeight - this.list.parent.height;
        }
        this.list.scrollV = sv;
    }

    close() {
        this.removeTouchEvent(this.turnBossBtn, this.onTap);
        this.removeTouchEvent(this.arrowUp, this.onTap);
        this.removeTouchEvent(this.arrowDown, this.onTap);
        TimerManager.ins().remove(this.updateTime, this);
    }
}