/**历练-成就标签页 */
class ChengjiuPanel extends BaseView {

	public tab: eui.TabBar;
	public list: eui.List;
	private _chengjiuData: ChengjiuTagItem[] = [];

	private tabArrColl: eui.ArrayCollection;
	private listArrColl: eui.ArrayCollection;

	public constructor() {
		super();
		this.skinName = "ChengjiuPanelSkin";
		this.name = `成就`;
	}

	protected createChildren(): void {
		super.createChildren();
		this.list.itemRenderer = ChengjiuItem;
		this.list.dataProvider = this.listArrColl = new eui.ArrayCollection();
		this.tab.itemRenderer = ChengjiuTagItem;
		this.tabArrColl = new eui.ArrayCollection(LiLian.ins().chengjiuMaxData());
		this.tab.dataProvider = this.tabArrColl;
		this.tab.visible = false;
	}

	public open(): void {
		this.addTouchEvent(this.list, this.onTab);
		this.addChangeEvent(this.tab, this.onTabChange);
		this.observe(UserTask.ins().postTaskChangeData, this.updateAchieve);
		this.tab.visible = true;
		this.tab.selectedIndex = 0;
		this.updateAchieve();
	}

	public close(): void {
		this.removeTouchEvent(this.list, this.onTab);
		this.removeObserve();
	}

	private onTab(e: egret.TouchEvent): void {
		if (!(e.target instanceof eui.Button)) return;
		let item: ChengjiuItem = e.target.parent as ChengjiuItem;
		switch (item.btn.labelDisplay.text) {
			case `前往`:
				GameGuider.taskGuidance(item.id, 1);
				break;
			case `领取`:
				UserTask.ins().sendGetAchieve(item.achievementId);
				break;
		}
	}

	private onTabChange(evt: egret.TouchEvent): void {
		this.listArrColl.source = UserTask.ins().getChengjiuDataByType(this.tab.selectedItem);
	}

	private updateAchieve(): void {
		this.tabArrColl.replaceAll(LiLian.ins().chengjiuMaxData());
		this.nextCanTab(this.tab.selectedItem);
		this.listArrColl.source = UserTask.ins().getChengjiuDataByType(this.tab.selectedItem);
	}

	private nextCanTab(type: number): void {
		if (!this.canReceive(type)) {
			let curTabImdex: number = this.tab.selectedIndex;
			for (let i: number = 0, tabNum: number = this.tab.numChildren; i < tabNum; i++) {
				this.tab.selectedIndex = i;
				if (this.canReceive(this.tab.selectedItem))
					return;
			}
			this.tab.selectedIndex = curTabImdex;
		}
	}

	private canReceive(type: number): boolean {
		let listData: AchievementData[] = UserTask.ins().getChengjiuDataByType(type);
		for (let i in listData) {
			if (listData[i].state == 1)
				return true;
		}
		return false;
	}
}

/**成就大项 */
class ChengjiuTagItem extends BaseItemRender {
	public nameImg: eui.Image;
	public redPoint: eui.Image;

	public constructor() {
		super();
		this.skinName = "ChengjiuTagSkin";
	}

	protected dataChanged(): void {
		super.dataChanged();
		this.nameImg.source = "task_json.name_" + this.data;
		this.redPoint.visible = UserTask.ins().getIsHaveChengjiuRewardBytype(this.data);
	}
}

/**成就子项 */
class ChengjiuItem extends BaseItemRender {

	public id: number;
	public achievementId: number;

	public titleTF: eui.Label;
	public progressTF: eui.Label;
	public btn: eui.Button;
	public list: eui.List;

	private mc: MovieClip;				   //特效
	public constructor() {
		super();
		this.skinName = `ChengjiuItemSkin`;

		this.mc = this.mc || new MovieClip;
		this.mc.x = this.btn.x + 46;
		this.mc.y = this.btn.y + 45;
		this.mc.scaleY = 0.8;
		this.mc.scaleX = 0.9;

		this.list.itemRenderer = ItemBase;
	}

	protected dataChanged(): void {
		super.dataChanged();

		let achieveConf: AchievementTaskConfig = UserTask.ins().getAchieveConfById(this.data.id);
		this.id = this.data.id;
		this.achievementId = this.data.achievementId;
		this.list.dataProvider = new eui.ArrayCollection(achieveConf.awardList);
		this.titleTF.textFlow = TextFlowMaker.generateTextFlow(achieveConf.name);
		// this.descTF.text = `成就积分：${achieveConf.score}`;
		let str: string = `进度：|C:0x35e62d&T:${CommonUtils.overLengthChange(this.data.value)}/${CommonUtils.overLengthChange(achieveConf.target)}|`;
		this.progressTF.textFlow = TextFlowMaker.generateTextFlow(str);
		this.btn.visible = true;
		if (this.mc && this.mc.parent) {
			DisplayUtils.removeFromParent(this.mc);
		}
		switch (this.data.state) {
			case 0://不能领奖
				this.btn.labelDisplay.text = `前往`;
				this.btn.enabled = true;
				if (achieveConf.control == 0) {
					this.btn.visible = false;
				}
				break;
			case 1://可以领奖
				this.btn.labelDisplay.text = `领取`;
				this.btn.enabled = true;
				if (this.mc) {
					this.mc.playFile(RES_DIR_EFF + 'normalbtn', -1);
					this.addChild(this.mc);
				}
				break;
			case 2://已完成
				this.btn.labelDisplay.text = `已完成`;
				this.btn.enabled = false;
				break;
		}
	}
}