/**特效经验条组件 */
class ProgressBarEff extends egret.DisplayObjectContainer {
	public constructor() {
		super();
		this.iniUi();

	}
	/**是否第一次*/
	private isFisrt: boolean = true;
	/**最大值 */
	private maxValue = 0;
	/**当前值 */
	private value = 0;
	/**是否播放提升特效 */
	private isPlayMc: boolean = true;
	/**值特效容器 */
	private group = new eui.Group();
	/**值特效 */
	private bgmc: MovieClip = new MovieClip();
	/**尾巴特效 */
	private xianmc: MovieClip = new MovieClip();
	/**背景框特效 */
	private bordermc: MovieClip = new MovieClip();
	/**值table */
	private lbvalue: eui.Label = new eui.Label;

	private offSetX: number = 23;

	private mcWidth: number = 460;

	private bgWidth: number = 525;

	private static DEFAULT_WIDTH: number = 525;

	private static DEFAULT_MC_WIDTH: number = 460;

	private bgimg = new eui.Image;
	private iniUi(): void {
		this.touchEnabled = this.touchChildren = false;

		this.group.x = 50;
		this.group.y = 22;
		this.group.width = 0;
		this.group.height = 50;
		this.group.scrollEnabled = true;
		// this.bgmc.x = this.bgmc.y = 0;
		this.bgmc.playFile(RES_DIR_EFF + "jindutiaoeff", -1);
		this.group.addChild(this.bgmc);
		this.addChild(this.group);

		this.xianmc.playFile(RES_DIR_EFF + "jindutiaotoueff", -1);
		this.xianmc.x = this.group.x + this.group.width - this.offSetX;
		this.xianmc.y = 10;
		this.xianmc.scrollRect = new egret.Rectangle(0, 0, 24, 39);
		this.addChild(this.xianmc);

		this.bgimg.x = 14;
		this.bgimg.y = 13;
		this.bgimg.source = "jingyantiao1";
		this.bgimg.scale9Grid = new egret.Rectangle(54, 0, 13, 37);
		this.bgimg.width = this.bgWidth;
		this.addChild(this.bgimg);

		this.lbvalue.x = this.bgimg.x + (this.bgimg.width - 200) / 2;
		this.lbvalue.y = 22;
		this.lbvalue.size = 16;
		this.lbvalue.width = 200;
		this.lbvalue.textAlign = "center";
		this.lbvalue.textColor = 0xffebc8;
		this.lbvalue.fontFamily = "黑体";
		this.addChild(this.lbvalue);
	}

	public setData(value: number, maxValue: number): void {
		this.value = value;
		this.maxValue = maxValue;

		this.setui();
	}

	public testbtn1(): void {
		this.xianmc.visible = false
		this.bgmc.visible = true
	}
	public testbtn2(): void {
		this.xianmc.visible = true
		this.bgmc.visible = false
	}


	public setWidth(value: number): void {
		
		this.bgWidth = value;
		this.bgimg.width = this.bgWidth;
		this.lbvalue.x = this.bgimg.x + (this.bgimg.width - 200) / 2;
		let scale: number = value / ProgressBarEff.DEFAULT_WIDTH;
		this.bgmc.scaleX = scale;
		this.mcWidth = ProgressBarEff.DEFAULT_MC_WIDTH * scale;
	}

	public setValue(value: number): void {
		this.value = value;
		this.setui();
	}
	public getValue(): number {
		return this.value;
	}
	public getMaxValue(): number {
		return this.maxValue;
	}
	/**重置 */
	public reset() {
		this.isFisrt = true;
		this.oldValue = this.oldMaxValue = this.value = this.maxValue = 0;
	}
	/**设置最大值 */
	public setMaxValue(maxValue: number): void {
		this.maxValue = maxValue;
		this.setui();
	}
	private oldMaxValue: number = 0;
	private oldValue: number = 0;
	private setui(): void {
		egret.Tween.removeTweens(this.group);
		// if (this.value > 0) {
		// 	this.xianmc.visible = true;
		// }
		// egret.log("vvvvv" + this.value + "mmmmm:" + this.maxValue);
		let t = this;
		if (this.maxValue == 0) {
			this.value = 100;
			this.maxValue = 100;
			this.lbvalue.visible = false;

		} else {
			this.lbvalue.visible = true;
		}
		if ((this.maxValue > this.oldMaxValue && this.oldMaxValue != 0 || this.maxValue == 0 || this.value < this.oldValue) && !this.isFisrt) {
			let w = (this.oldMaxValue / this.oldMaxValue * this.mcWidth);
			let w2 = (this.value / this.oldMaxValue * this.mcWidth);
			let timer = 30;
			let curX: number = this.group.x;
			let curCurWidth: number = this.group.width;
			let t1: egret.Tween = egret.Tween.get(this.group, {
				onChange: () => {
					// if (this.value == 0) {
					// 	this.xianmc.visible = false;
					// }
					if (this.group.width >= this.mcWidth - 3 || this.group.width < 3) {
						this.xianmc.visible = false;
					} else {
						this.xianmc.visible = true;
					}
					this.xianmc.x = curX + curCurWidth - this.offSetX;
				}
			});
			t1.to({
				width: w
			}, 150 + timer).call(() => {
				let t2: egret.Tween = egret.Tween.get(this.group);
				let w1 = (this.value / this.maxValue * this.mcWidth);
				this.group.width = 0;
				this.oldValue = this.value;
				this.oldMaxValue = this.maxValue;
				t2.to({
					width: w1
				}, 150 + timer).call(() => {
					this.xianmc.x = this.group.x + w1 - this.offSetX;
				});
			})
		} else {
			this.oldValue = this.value;
			let width = 0;
			if (this.value <= 0) {
				width = 0;
			}
			else {
				let newVal = this.value > this.maxValue ? this.maxValue : this.value;
				width = (newVal / this.maxValue * this.mcWidth);
			}
			let t1: egret.Tween = egret.Tween.get(this.group, {
				onChange: () => {
					if (this.group.width >= this.mcWidth - 3 || this.group.width < 3) {
						this.xianmc.visible = false;
					} else {
						this.xianmc.visible = true;
					}
					this.xianmc.x = this.group.x + this.group.width - this.offSetX;

				}
			});
			t1.to({
				width: width
			}, 200).call(() => {
				this.oldMaxValue = this.maxValue;
			});
		}

		this.lbvalue.text = this.value + "/" + this.maxValue;
		if (this.isFisrt) {
			this.isFisrt = false;
			return;
		}

		// if (this.isPlayMc) {
		// 	this.isPlayMc = false;
		// 	let t = this;
		// 	this.bordermc.playFile(AssetMgr.getEffname("jdtbk"), 1, () => {
		// 		t.isPlayMc = true;
		// 	});
		// 	this.addChild(this.bordermc);
		// }
	}

	public max(): void {
		this.maxValue = 0;
		this.setui();
		this.lbvalue.visible = true;
		this.lbvalue.text = "";
	}

	public setLbValueText(text) {
		this.setui();
		this.lbvalue.visible = true;
		this.lbvalue.text = text;
	}
}