/**
 * 神兽守护技能
 * @author MPeter
 */
class ShenshouSkillTip extends BaseEuiView {
	public bgClose: eui.Rect;
	public anigroup: eui.Group;
	public background: eui.Image;
	public quali: eui.Image;
	public equipIcon: BaseComponent;
	public nameTxt: eui.Label;
	public targetTxt: eui.Label;
	public targetTxt0: eui.Label;

	public constructor() {
		super();
		this.skinName = `shenshouSkillTips`;
	}
	public open(...args): void {
		this.addTouchEvent(this.bgClose, this.onTouch);

		let skillDp: ShenShouSkill = args[0];
		this.quali.source = skillDp.quality ? `quali${skillDp.quality}` : ``;
		this.equipIcon[`skillQuality`].source = `quality${skillDp.quality}`;
		this.equipIcon[`skillImg`].source = skillDp.icon;
		this.equipIcon[`skillName`].text = ``;
		this.nameTxt.text = skillDp.name;

		this.targetTxt.text = skillDp.target == 1 ? `所有出战神兽生效` : `仅本体出战神兽生效`;
		this.targetTxt0.textFlow = TextFlowMaker.generateTextFlow1(skillDp.desc);

	}
	public close(...args): void {

	}
	private onTouch(e: egret.TouchEvent): void {
		switch (e.target) {
			case this.bgClose:
				ViewManager.ins().close(this);
				break;
		}
	}
}
ViewManager.ins().reg(ShenshouSkillTip, LayerManager.UI_Tips);