/**
 * PubBossRemindItem
 */
class PubBossRemindItem extends BaseItemRender {

	private txt: eui.Label;
	public checkBoxs: eui.CheckBox;
	private bossName: eui.Label;
	private levelShow: eui.Label;

	constructor() {
		super();
	}

	protected childrenCreated(){
		this.checkBoxs.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin1, this);
	}

	private _move:boolean = false;
	private _lastSelect:boolean;
	private _lastX:number = 0;
	private _lastY:number = 0;
	private onTouchBegin1(e:egret.TouchEvent) {
		this._lastX = e.stageX;
		this._lastY = e.stageY;
		this._lastSelect = this.checkBoxs.selected;
		this._move = false;
		if (this.$stage) {
			this.$stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove1, this);
			this.$stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd1, this);
		}
	}

	private onTouchMove1(e:egret.TouchEvent) {
		if (MathUtils.getDistance(this._lastX, this._lastY, e.stageX, e.stageY) > 20) {
			this._move = true;
		}
	}

	private onTouchEnd1(){
		if (this._move) {
			this.checkBoxs.selected = this._lastSelect;
			this._move = false;
		}

		if (this.$stage) {
			this.$stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove1, this);
			this.$stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd1, this);
		}
	}

	public dataChanged(): void {
		let model: WorldBossItemData = this.data;
		let config: WorldBossConfig = GlobalConfig.WorldBossConfig[model.id];
		let canChallenge = UserBoss.isCanChallenge(config);
		let desc;
		if (config.samsaraLv > 0) {
			desc = config.showName;
		}
		else {
			if (config.zsLevel > 0) {
				desc = `${config.zsLevel}转`;
			} else {
				desc = `${config.level}级`;
			}
		}
		this.checkBoxs.visible = canChallenge;
		if (canChallenge) {
			this.checkBoxs.selected = UserBoss.ins().getBossRemindByIndex(model.id);
		}
		this.txt.visible = !canChallenge;
		this.checkBoxs.name = model.id + "";

		let boss: MonstersConfig = GlobalConfig.MonstersConfig[config.bossId];
		this.bossName.text = boss.name;
		this.levelShow.text = desc;
	}
}