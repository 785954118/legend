class PunchSkillItemRender extends BaseComponent {
	public imgBg: eui.Image;
	public icon: eui.Image;
	public iconBG: eui.Image;

	public constructor() {
		super();
		this.skinName = "PunchSkillItem";
	}

	public setData(config: SkillData) {
		this.iconBG.source = `${config.id}_png`;
	}
}