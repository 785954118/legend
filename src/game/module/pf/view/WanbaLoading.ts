/**
 * Created by Administrator on 2016/6/26.
 */
class WanbaLoading extends LoadingView {

	private bg: eui.Image;

	private progress: eui.Image;

	private icon: eui.Image;

	constructor() {
		super();
	}

	protected init(): void {
		this.bg = new eui.Image;
		this.bg.source = RES.getRes("wbbg_jpg");
		this.addChildAt(this.bg, 0);

		this.progress = new eui.Image;
		this.progress.width = 0.1;
		this.progress.source = RES.getRes("wbProgress_png");
		this.progress.scale9Grid = new egret.Rectangle(5, 2, 3, 1);
		this.progress.x = 110;
		this.progress.y = 583;
		this.addChild(this.progress);

		this.icon = new eui.Image;
		this.icon.source = RES.getRes("wbIcon_png");
		this.icon.anchorOffsetX = 21 >> 1;
		this.icon.anchorOffsetY = 11;
		this.icon.x = this.progress.x + this.progress.width;
		this.icon.y = this.progress.y + (this.progress.height >> 1);
		this.addChild(this.icon);
	}

	open(...param: any[]): void {
		egret.startTick(this.iconRotation, this);
	}

	close(...param: any[]): void {
		egret.stopTick(this.iconRotation, this);
	}

	private iconRotation(time: number): boolean {
		this.icon.rotation += 5;
		return false;
	}

	public setProgress(current: number, total: number): void {
		let p: number = current / total;

		this.progress.width = 257 * p;

		this.icon.x = this.progress.x + this.progress.width;
		this.icon.y = this.progress.y + (this.progress.height >> 1);
	}
}