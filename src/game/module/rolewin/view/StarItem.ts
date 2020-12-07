/**
 *  
 */
class StarItem extends BaseView {
	public fullStarImg: eui.Image;
	public starImg: eui.Image;

	constructor() {
		super();

		this.skinName = "StarItemSkin";

	}

	public isShow(num: number): void {
		this.starImg.source = num ? "star2" : "";
	}

	public isShowFull(num: number): void {
		this.fullStarImg.source = num ? "star1" : "";
	}
}
