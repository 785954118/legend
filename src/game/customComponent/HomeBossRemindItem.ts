/**
 * HomeBossRemindItem
 */
class HomeBossRemindItem extends BaseItemRender {

	private txt: eui.Label;
	public checkBoxs: eui.CheckBox;
	private bossName: eui.Label;
	private levelShow: eui.Label;
	private _move:boolean = false;
	private _lastSelect:boolean;

	constructor() {
		super();
	}

	protected childrenCreated(){
		this.checkBoxs.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin1, this);
	}

	private onTouchBegin1(e:egret.TouchEvent) {
		this._lastSelect = this.checkBoxs.selected;
		this._move = false;
		if (this.$stage) {
			this.$stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove1, this);
			this.$stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd1, this);
		}
	}

	private onTouchMove1() {
		this._move = true;
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

		let levelConfig: BossHomeConfig;
		for (let k in GlobalConfig.BossHomeConfig) {
			if (GlobalConfig.BossHomeConfig[k].boss.lastIndexOf(model.id) != -1) {
				levelConfig = GlobalConfig.BossHomeConfig[k];
				break;
			}
		}
		let canChallenge: boolean = false;
		if (levelConfig && UserVip.ins().lv >= levelConfig.vip) {
			if (config.zsLevel > 0) {
				canChallenge = UserZs.ins().lv >= config.zsLevel;
			} else {
				canChallenge = Actor.level >= config.level;
			}
			if (!canChallenge) this.txt.text = "未满足挑战等级";
			this.levelShow.text = config.zsLevel > 0 ? config.zsLevel + "转" : config.level + "级";
		} else {
			canChallenge = false;
			this.levelShow.text = "";
			this.txt.text = "未满足挑战VIP等级";
		}

		this.checkBoxs.visible = canChallenge;
		if (canChallenge) {
			this.checkBoxs.selected = UserBoss.ins().getBossRemindByIndex(model.id);
		}

		this.txt.visible = !this.checkBoxs.visible;
		this.checkBoxs.name = model.id + "";

		let boss: MonstersConfig = GlobalConfig.MonstersConfig[config.bossId];
		this.bossName.text = boss.name;


	}
}