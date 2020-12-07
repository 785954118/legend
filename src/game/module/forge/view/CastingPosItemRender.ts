/**
 * Created by Administrator on 2017/3/8.
 */
class CastingPosItemRender extends BaseView {

	private statuList: string[] = ["open", "select", "dark"];

	public constructor() {
		super();
		this.skinName = "castingpositemrenderskin";
	}

	public setShowStatu(statu: number): void {
		this.currentState = this.statuList[statu];
	}
}
