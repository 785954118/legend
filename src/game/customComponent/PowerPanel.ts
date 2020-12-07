/**
 * 战斗力
 */
class PowerPanel extends BaseView {
	protected totalPower: egret.DisplayObjectContainer;
	private flameMC: MovieClip;
	public flameGroup: eui.Group;
	private powerImg: eui.Image;
	private bgImg: eui.Image;
	private showBg: boolean = true;
	private imgWidth: number = 72;
	/**
	 * 战斗力
	 */
	public power: number;

	constructor() {
		super();
	}

	public childrenCreated(): void {
		this.init();
	}

	public init(): void {
		this.playFlameMC();
		this.totalPower = BitmapNumber.ins().createNumPic(0, "8", 5);
		this.totalPower.x = 200;
		this.totalPower.y = 17;
		this.addChild(this.totalPower);
		this.initPos();
	}

	public setPower(value: number) {
		this.power = value;
		BitmapNumber.ins().changeNum(this.totalPower, value, "8", 5);
		this.initPos();
	}

	private initPos(): void {
		if (!this.showBg) return;
		let tempWidth = this.totalPower.width > 50 ? this.totalPower.width : 50;
		this.totalPower.x = this.width - tempWidth - 30;
		this.powerImg.x = this.totalPower.x - this.imgWidth ;
	}

	public setBgVis(bool: boolean): void {
		this.bgImg.visible = bool;
		this.flameGroup.visible = bool;
		this.showBg = bool;
	}

	public setMcVisible(bool) {
		this.flameGroup.visible = bool;
	}

	/**
	 * 播放火焰动画
	 */
	private playFlameMC() {
		if (this.flameMC) {
			this.flameMC.play(-1);
		}
		else {
			this.flameMC = new MovieClip();
			this.flameMC.x = 76;
			this.flameMC.y = 23;
			this.flameMC.playFile(RES_DIR_EFF + "zhanduolibeijing", -1);
			this.flameGroup.addChild(this.flameMC);
		}
	}

	public destructor(): void {
		DisplayUtils.removeFromParent(this);
	}
}