/**
 * Created by Administrator on 2017/3/8.
 */
class Castingposlist extends BaseView {
	public line_0: eui.Image;
	public line_1: eui.Image;
	public line_2: eui.Image;
	public line_4: eui.Image;
	public line_3: eui.Image;
	public line_6: eui.Image;
	public line_5: eui.Image;
	public item0: CastingPosItemRender;
	public item5: CastingPosItemRender;
	public item1: CastingPosItemRender;
	public item2: CastingPosItemRender;
	public item3: CastingPosItemRender;
	public item4: CastingPosItemRender;
	public item7: CastingPosItemRender;
	public item6: CastingPosItemRender;

	public constructor() {
		super();
		this.skinName = "castingposlistskin";
	}

	public setShow(pos: number, level: number, isMax: boolean): void {
		this.currentState = `pos_` + pos;
		let index: number = isMax ? UserGem.ROLL_NUM : level % UserGem.ROLL_NUM;
		for (let i: number = 0; i < UserGem.ROLL_NUM; i++) {
			let statu: number = 0;
			if (index > i) {
				statu = 0;
			} else if (index == i) {
				statu = 1;
			} else {
				statu = 2;
			}
			(this["item" + i] as CastingPosItemRender).setShowStatu(statu);
			if (this["line_" + i]) {
				// let line: number =
				this["line_" + i].source = statu == 0 ? "zhuzaoxian" : "zhuzaoxianbg";
			}
		}
	}
}
