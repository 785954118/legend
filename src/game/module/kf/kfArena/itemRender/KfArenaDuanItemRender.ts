class KfArenaDuanItemRender extends BaseItemRender {
	public dwName: eui.Label;
	private reward: eui.List;
	private dwImg: eui.Image;

	public constructor() {
		super();
		this.skinName = "KfArenaDuanItemSkin";
	}

	public childrenCreated(): void {
		super.childrenCreated();
		this.reward.itemRenderer = ItemBase;
	}

	public dataChanged(): void {
		if (!this.data) return;
		let itemData = this.data as KfArenaFinalAwards
		this.dwImg.source = `${itemData.mail.head}`;
		this.dwName.text = `${itemData.mail.context}`;
		this.reward.dataProvider = new eui.ArrayCollection(itemData.mail.tAwardList);
	}
}