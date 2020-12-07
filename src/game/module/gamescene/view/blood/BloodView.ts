/**
 *  飘血显示层
 * @author
 */
class BloodView extends egret.DisplayObjectContainer {

	private offY: number = 0;
	private offsetY: number = 0;
	private _lastType: number = 0;


	private bloodNum = 50;
	private tempBloodViews: egret.DisplayObjectContainer[] = [];

	private tick: number = 0;
	private delayCount: number = 0;

	public constructor() {
		super();
		MessageCenter.addListener(GameLogic.ins().postEntityHpChange, this.showBlood, this);

		egret.startTick((): boolean => {
			this.tick++;
			return false;
		}, this);

		TimerManager.ins().doTimer(1000, 0, () => {
			let t = this.tick;
			this.tick = 0;

			if (this.delayCount <= 0) {
				this.delayCount--;
				return;
			}
			if (t >= 25) this.bloodNum = 50;
			else if (t >= 15) this.bloodNum = 10;
			else if (t >= 10) this.bloodNum = 5;
			else this.bloodNum = 0;

			if (t < 25) {
				this.delayCount = 5;
			}
		}, this);
	}

	/**
	 * 飘血显示
	 * @param target    飘血目标
	 * @param source    伤害源
	 * @param type      0不显示，1命中，2暴击
	 * @param value     伤害值
	 */
	private showBlood([target, source, type, value]: [CharMonster, CharMonster, number, number]): void {

		if (this.tempBloodViews.length >= this.bloodNum) {
			let blood = this.tempBloodViews[0];
			if (blood) {
				egret.Tween.removeTweens(blood);
				DisplayUtils.removeFromParent(blood);
				this.destroyBlood(blood);
			}
		}

		if (!target || !source) return;

		if (target.team != Team.My && source.team != Team.My)
			return;

		if (target.team == Team.My)
			type = 1;

		//威慑
		let isDeter = type & DamageTypes.Deter && source.isMy;
		let isCrit = type & DamageTypes.CRIT && !isDeter;
		let isLucky = type & DamageTypes.Lucky;
		let isHeji = type & DamageTypes.Heji;
		let isMiss = type & DamageTypes.Dodge;
		let isZhiMing = type & DamageTypes.ZhiMing;

		if (isZhiMing) isCrit = false;//致命就不显示暴击

		this.offY = EntityManager.CHAR_DEFAULT_TYPEFACE - target.typeface;
		if (this._lastType != type) this.offsetY = 0;
		this._lastType = type;

		if (value == 0 && !isMiss)
			return;

		let chartype = ``;
		if (source instanceof CharRole) {
			switch ((<Role>source.infoModel).job) {
				case JobConst.ZhanShi:
					chartype = `j${isCrit || isDeter ? 0 : 1}`;
					break;
				case JobConst.FaShi:
					chartype = `j${isCrit || isDeter ? 4 : 2}`;
					break;
				case JobConst.DaoShi:
					chartype = `j${isCrit || isDeter ? 5 : 3}`;
					break;
			}
		} else if (source instanceof CharMonster) {
			chartype = "j3";
			//烈焰戒指伤害,戒指类型怪物，用特殊伤害飘字，为止开放了怪物配置的type类型客户端读取，
			//综合评估了下配置增加的体积与功能的扩展和修改幅度，最终决定用这种方法判断... 2017-11-27 MPeter
			let monsterCfg = GlobalConfig.MonstersConfig[source.infoModel.configID];
			if (monsterCfg && monsterCfg.type == MonsterType.Ring) {
				chartype = "j9";
				isCrit = true; //走暴击途径
			}
		}
		if (isHeji || isLucky) {
			chartype = "j0";
		}
		//2为角色掉血，其它为伤害
		let numType = target.team == Team.My ? "2" : chartype;
		if (isMiss) {
			numType = "j0";
		}

		let sv = "";
		if (isMiss) {
			sv = "s";
		}
		else if (isHeji) {
			sv = value < 0 ? "+" + Math.abs(value) : "h" + (value >> 0) + "";
		} else {
			sv = value < 0 ? "+" + Math.abs(value) : (isCrit ? "b" : (isDeter ? "d" : (isLucky ? "b" : ""))) + (value >> 0) + "";
		}

		let st: string = value < 0 ? "g3" : numType; //+ (isCrit ? "b" : "");
		let offsetX: number = 3.5;//source == null ? 6 : isCrit ? 3 : 4;

		(type & DamageTypes.Fujia || type & DamageTypes.Lianji) ? this.offsetY += 25 : this.offsetY = 0;

		let offsety: number = this.offsetY;

		// let blood: egret.DisplayObjectContainer = BitmapNumber.ins().createNumPic(sv, st, offsetX, offsety);
		let blood = BloodLabel.ins().createBloodLabel(type, sv, st, offsetX, offsety, (<Role>source.infoModel).job || 1);
		blood.touchChildren = false;

		if (type & DamageTypes.Heji) {
			this.addChildAt(blood, 1000);
		} else {
			this.addChild(blood);
		}

		blood.x = target.x - blood.width / 2;
		blood.y = target.y - 50 - offsety;
		let isAddBlood = value < 0;
		if (chartype == "6") {
			//如果是毒，被施放于怪物身上，则视为加血，飘毒血为向上飘
			isAddBlood = true;
		}
		this.floatImg(blood, type, target, source, isAddBlood);

		this.tempBloodViews.push(blood);
		// let a = setTimeout(() => {
		// 	clearTimeout(a);
		// 	DisplayUtils.removeFromParent(blood);
		// 	this.destroyBlood(blood);
		// }, 1000);
	}

	private removeFloatTarget(floatTarger: egret.DisplayObjectContainer) {
		DisplayUtils.removeFromParent(floatTarger);
		this.destroyBlood(floatTarger);
	}

	/**
	 * 主角受击 - 暴击和幸运一击效果
	 * @param {egret.DisplayObject} floatTarger
	 * @param {egret.Tween} t
	 */
	private injuredCritLucky(floatTarger: egret.DisplayObjectContainer, t: egret.Tween) {
		floatTarger.scaleX = floatTarger.scaleY = BloodView.sc_s0;
		let posY1 = floatTarger.y - (EntityManager.CHAR_DEFAULT_TYPEFACE - 80) / 2;
		let posY2 = floatTarger.y - (EntityManager.CHAR_DEFAULT_TYPEFACE - 30);

		floatTarger.y = posY1;
		t.to({
			"y": posY2,
			'scaleX': BloodView.sc_s1,
			'scaleY': BloodView.sc_s1
		}, BloodView.sc_sp1, BloodView.sc_fun1)
			.wait(BloodView.sc_sp2)
			.to({
				alpha: 0,
				'scaleX': BloodView.sc_s2,
				'scaleY': BloodView.sc_s2
			}, BloodView.sc_sp3, BloodView.sc_fun2)
			.call(this.removeFloatTarget, this, [floatTarger]);
	}

	/**
	 * 主角受击 - 飘血效果
	 * @param {egret.DisplayObject} floatTarger
	 * @param {egret.Tween} t
	 */
	private injured(floatTarger: egret.DisplayObjectContainer, t: egret.Tween) {
		floatTarger.scaleX = floatTarger.scaleY = BloodView.sn_s0;
		let posY1 = floatTarger.y - (EntityManager.CHAR_DEFAULT_TYPEFACE - 80) / 2;
		let posY2 = floatTarger.y - (EntityManager.CHAR_DEFAULT_TYPEFACE - 30);

		floatTarger.y = posY1;
		t.to({
			"y": posY2,
			'scaleX': BloodView.sn_s1,
			'scaleY': BloodView.sn_s1
		}, BloodView.sn_sp1, BloodView.sn_fun1)
			.wait(BloodView.sn_sp2)
			.to({
				alpha: 0,
				'scaleX': BloodView.sn_s2,
				'scaleY': BloodView.sn_s2
			}, BloodView.sn_sp3, BloodView.sn_fun2)
			.call(this.removeFloatTarget, this, [floatTarger]);
	}

	/**
	 * 主角攻击 - 暴击或幸运一击效果
	 * @param {egret.DisplayObject} floatTarger
	 * @param {egret.Tween} t
	 */
	private atkCritLucky(floatTarger: egret.DisplayObjectContainer, t: egret.Tween) {
		let posX: number = 0;
		let posX2: number = 0;
		floatTarger.x += BloodView.c_posX1;
		posX = floatTarger.x + BloodView.c_posX2;
		posX2 = floatTarger.x + BloodView.c_posX3;
		floatTarger.scaleX = floatTarger.scaleY = BloodView.c_s0;
		floatTarger.y = floatTarger.y - BloodView.c_posY1 + this.offY;
		floatTarger.alpha = BloodView.c_alpha0;
		let endY: number = floatTarger.y - BloodView.c_posY2;
		t.to({
			"x": posX,
			"y": endY,
			scaleX: BloodView.c_s1,
			scaleY: BloodView.c_s1,
			alpha: BloodView.c_alpha1
		}, BloodView.c_sp1, BloodView.c_fun1)
			.to({
				scaleX: BloodView.c_s2,
				scaleY: BloodView.c_s2,
				alpha: BloodView.c_alpha2
			}, BloodView.c_sp2, BloodView.c_fun2)
			.to({
				scaleX: BloodView.c_s3,
				scaleY: BloodView.c_s3,
				alpha: BloodView.c_alpha3
			}, BloodView.c_sp3, BloodView.c_fun3)
			.wait(100)
			.to({
				alpha: BloodView.c_alpha4,
				y: floatTarger.y + BloodView.c_posY3,
				x: posX2,
				scaleX: BloodView.c_s4,
				scaleY: BloodView.c_s4
			}, BloodView.c_sp4, BloodView.c_fun4)
			.to({
				alpha: BloodView.c_alpha5,
				y: floatTarger.y + BloodView.c_posY4,
				scaleX: BloodView.c_s5,
				scaleY: BloodView.c_s5
			}, BloodView.c_sp5, BloodView.c_fun5)
			.call(this.removeFloatTarget, this, [floatTarger]);
	}

	/**
	 * 主角攻击 - 合击飘血效果
	 * @param {egret.DisplayObject} floatTarger
	 * @param {egret.Tween} t
	 */
	private atkHeJi(floatTarger: egret.DisplayObjectContainer, t: egret.Tween) {
		let posX: number = 0;
		let posX2: number = 0;
		let map: MapView = ViewManager.gamescene.map;
		let point: egret.Point = this.localToGlobal();
		point.x = StageUtils.ins().getWidth() / 2;
		map.globalToLocal(point.x, point.y, point);
		let ranX: number = Math.random() * 100 - 50;
		let ranY: number = Math.random() * 200 - 100;

		floatTarger.x = point.x - 100 - floatTarger.width / 2 + ranX;
		floatTarger.x += BloodView.h_posX1;
		posX = floatTarger.x + BloodView.h_posX2;
		posX2 = floatTarger.x + BloodView.h_posX3;
		floatTarger.scaleX = floatTarger.scaleY = BloodView.h_s0;
		floatTarger.y = floatTarger.y - BloodView.h_posY1 + this.offY + ranY;
		floatTarger.alpha = BloodView.h_alpha0;
		let endY: number = floatTarger.y - BloodView.h_posY2;
		t.to({
			"x": posX,
			"y": endY,
			scaleX: BloodView.h_s1,
			scaleY: BloodView.h_s1,
			alpha: BloodView.h_alpha1
		}, BloodView.h_sp1, BloodView.h_fun1)
			.to({
				scaleX: BloodView.h_s2,
				scaleY: BloodView.h_s2,
				alpha: BloodView.h_alpha2
			}, BloodView.h_sp2, BloodView.h_fun2)
			.to({
				scaleX: BloodView.h_s3,
				scaleY: BloodView.h_s3,
				alpha: BloodView.h_alpha3
			}, BloodView.h_sp3, BloodView.h_fun3)
			.wait(100)
			.to({
				alpha: BloodView.h_alpha4,
				y: floatTarger.y + BloodView.h_posY3,
				x: posX2,
				scaleX: BloodView.h_s4,
				scaleY: BloodView.h_s4
			}, BloodView.h_sp4, BloodView.h_fun4)
			.to({
				alpha: BloodView.h_alpha5,
				y: floatTarger.y + BloodView.h_posY4,
				scaleX: BloodView.h_s5,
				scaleY: BloodView.h_s5
			}, BloodView.h_sp5, BloodView.h_fun5)
			.call(this.removeFloatTarget, this, [floatTarger]);
	}

	/**
	 * 主角攻击 - 普通飘血效果
	 * @param {egret.DisplayObject} floatTarger
	 * @param {egret.Tween} t
	 */
	private atk(floatTarger: egret.DisplayObjectContainer, t: egret.Tween) {
		let posX: number = 0;
		let posX2: number = 0;

		floatTarger.x += BloodView.posX1;
		posX = floatTarger.x + BloodView.posX2;
		posX2 = floatTarger.x + BloodView.posX3;

		floatTarger.scaleX = floatTarger.scaleY = BloodView.s0;
		floatTarger.y = floatTarger.y - BloodView.posY1 + this.offY;
		floatTarger.alpha = BloodView.alpha0;
		let endY: number = floatTarger.y - BloodView.posY2;
		t.to({
			"x": posX, "y": endY, scaleX: BloodView.s1, scaleY: BloodView.s1, alpha: BloodView.alpha1
		}, BloodView.sp1, BloodView.fun1)
			.to({
				scaleX: BloodView.s2,
				scaleY: BloodView.s2,
				alpha: BloodView.alpha2
			}, BloodView.sp2, BloodView.fun2)
			.to({
				scaleX: BloodView.s3,
				scaleY: BloodView.s3,
				alpha: BloodView.alpha3
			}, BloodView.sp3, BloodView.fun3)
			.wait(100)
			.to({
				alpha: BloodView.alpha6,
				y: floatTarger.y + BloodView.posY6,
				x: floatTarger.x + BloodView.posX6,
				scaleX: BloodView.s6,
				scaleY: BloodView.s6
			}, BloodView.sp6, BloodView.fun6)
			.to({
				alpha: BloodView.alpha7,
				y: floatTarger.y + BloodView.posY7,
				x: floatTarger.x + BloodView.posX7,
				scaleX: BloodView.s7,
				scaleY: BloodView.s7
			}, BloodView.sp7, BloodView.fun7)
			.to({
				alpha: BloodView.alpha8,
				y: floatTarger.y + BloodView.posY8,
				x: floatTarger.x + BloodView.posX8,
				scaleX: BloodView.s8,
				scaleY: BloodView.s8
			}, BloodView.sp8, BloodView.fun8)
			.to({
				alpha: BloodView.alpha9,
				y: floatTarger.y + BloodView.posY9,
				x: floatTarger.x + BloodView.posX9,
				scaleX: BloodView.s9,
				scaleY: BloodView.s9
			}, BloodView.sp9, BloodView.fun9)
			.to({
				alpha: BloodView.alpha5,
				y: floatTarger.y + BloodView.posY4,
				scaleX: BloodView.s5,
				scaleY: BloodView.s5
			}, BloodView.sp5, BloodView.fun5)
			.call(this.removeFloatTarget, this, [floatTarger]);
	}

	/**
	 * 漂浮
	 * @param floatTarger  漂浮对象池
	 * @param type 漂浮对象
	 * @param target    飘血目标-
	 * @param source    伤害源
	 * @param isAddBlood  伤害源
	 */
	private floatImg(floatTarger: egret.DisplayObjectContainer,
					 type: number,
					 target: CharMonster,
					 source: CharMonster, isAddBlood?: boolean): void {
		let t: egret.Tween = egret.Tween.get(floatTarger);

		if (source == null || target['team'] == Team.My) {
			//主角是受击者
			if ((type & DamageTypes.CRIT) == DamageTypes.CRIT || (type & DamageTypes.Lucky) == DamageTypes.Lucky) {
				this.injuredCritLucky(floatTarger, t);
			} else {
				this.injured(floatTarger, t);
			}
		} else {
			let isDeter: boolean = (type & DamageTypes.Deter) == DamageTypes.Deter && source && source.isMy; // 威慑
			let showBigDater: boolean = isDeter && (type & DamageTypes.CRIT) == DamageTypes.CRIT; //显示威慑(大字)
			if (showBigDater || (type & DamageTypes.CRIT) == DamageTypes.CRIT || (type & DamageTypes.Lucky) == DamageTypes.Lucky) {
				this.atkCritLucky(floatTarger, t);
			}
			else if ((type & DamageTypes.Heji) == DamageTypes.Heji) {
				this.atkHeJi(floatTarger, t);
			}
			else {
				this.atk(floatTarger, t);
			}
		}
	}

	private destroyBlood(blood: egret.DisplayObjectContainer) {
		blood.x = 0;
		blood.y = 0;
		blood.alpha = 1;
		blood.scaleX = blood.scaleY = 1;
		blood.touchChildren = true;

		if (blood instanceof BloodContainer) {
			blood.destroy();
		} else {
			BitmapNumber.ins().desstroyNumPic(blood);
		}

		let index = this.tempBloodViews.indexOf(blood);
		if (~index) {
			this.tempBloodViews.splice(index, 1);
		}
	}

	public static sp1: number = 60;
	public static sp2: number = 80;
	public static sp3: number = 80;
	public static sp4: number = 400;
	public static sp5: number = 720;

	public static fun1: Function = egret.Ease.circInOut;
	public static fun2: Function = egret.Ease.circInOut;
	public static fun3: Function = egret.Ease.sineIn;
	public static fun4: Function = null;
	public static fun5: Function = egret.Ease.sineIn;

	public static s0: number = 1.2;
	public static s1: number = 0.4;
	public static s2: number = 0.75;
	public static s3: number = 0.6;
	public static s4: number = 0.6;
	public static s5: number = 0.6;


	public static posX6: number = -18;
	public static posX7: number = -20;
	public static posX8: number = -23;
	public static posX9: number = -30;


	public static posY6: number = 10;
	public static posY7: number = 13;
	public static posY8: number = 16;
	public static posY9: number = 20;

	public static alpha6: number = 0.6;
	public static alpha7: number = 0.5;
	public static alpha8: number = 0.4;
	public static alpha9: number = 0;

	public static sp6: number = 600;
	public static sp7: number = 200;
	public static sp8: number = 400;
	public static sp9: number = 400;

	public static fun6: Function = null;
	public static fun7: Function = null;
	public static fun8: Function = null;
	public static fun9: Function = null;


	public static s6: number = 0.6;
	public static s7: number = 0.6;
	public static s8: number = 0.6;
	public static s9: number = 0.6;

	public static posX1: number = 90;
	public static posX2: number = 0;
	public static posX3: number = 0;

	public static posY1: number = 100;
	public static posY2: number = 0;
	public static posY3: number = 0;
	public static posY4: number = 10;

	public static alpha0: number = 1;
	public static alpha1: number = 1;
	public static alpha2: number = 1;
	public static alpha3: number = 0.9;
	public static alpha4: number = 0.5;
	public static alpha5: number = 0;

	public static startX: number = 70;
	public static startY: number = 75;
	public static changeTime1: number = 300;
	public static changeTime2: number = 1000;
	public static changeY: number = 0.5;
	public static bigScale: number = 3;
	public static endScale: number = 0.6;
	public static bigAlpha: number = 1;
	public static endAlpha1: number = 1;
	public static endAlpha2: number = 0.3;
	public static endTime1: number = 600;
	public static endTime2: number = 500;

	public static c_sp1: number = 80;
	public static c_sp2: number = 200;
	public static c_sp3: number = 200;
	public static c_sp4: number = 1000;
	public static c_sp5: number = 1200;

	public static c_fun1: Function = egret.Ease.circInOut;
	public static c_fun2: Function = egret.Ease.circInOut;
	public static c_fun3: Function = egret.Ease.sineIn;
	public static c_fun4: Function = null;
	public static c_fun5: Function = egret.Ease.sineIn;

	public static c_s0: number = 0.1;
	public static c_s1: number = 0.8;
	public static c_s2: number = 0.8;
	public static c_s3: number = 0.8;
	public static c_s4: number = 0.6;
	public static c_s5: number = 0.1;


	public static c_posX1: number = 0;
	public static c_posX2: number = 100;
	public static c_posX3: number = 120;

	public static c_posY1: number = 120;
	public static c_posY2: number = 10;
	public static c_posY3: number = 10;
	public static c_posY4: number = 10;

	public static c_alpha0: number = 1;
	public static c_alpha1: number = 1;
	public static c_alpha2: number = 1;
	public static c_alpha3: number = 0.6;
	public static c_alpha4: number = 0;
	public static c_alpha5: number = 0;


	public static h_sp1: number = 80;
	public static h_sp2: number = 300;
	public static h_sp3: number = 200;
	public static h_sp4: number = 1000;
	public static h_sp5: number = 1200;

	public static h_fun1: Function = egret.Ease.circInOut;
	public static h_fun2: Function = egret.Ease.circInOut;
	public static h_fun3: Function = egret.Ease.sineIn;
	public static h_fun4: Function = null;
	public static h_fun5: Function = egret.Ease.sineIn;

	public static h_s0: number = 0.1;
	public static h_s1: number = 1.2;
	public static h_s2: number = 1.2;
	public static h_s3: number = 1.2;
	public static h_s4: number = 1.2;
	public static h_s5: number = 1.2;


	public static h_posX1: number = 0;
	public static h_posX2: number = 100;
	public static h_posX3: number = 120;

	public static h_posY1: number = 150;
	public static h_posY2: number = 10;
	public static h_posY3: number = -30;
	public static h_posY4: number = -30;

	public static h_alpha0: number = 1;
	public static h_alpha1: number = 1;
	public static h_alpha2: number = 1;
	public static h_alpha3: number = 0.6;
	public static h_alpha4: number = 0;
	public static h_alpha5: number = 0;

	public static NORMAL_SCALE_1: number = 1.1;
	public static NORMAL_SCALE_2: number = 0.95;

	public static sn_sp1: number = 600;
	public static sn_sp2: number = 200;
	public static sn_sp3: number = 200;

	public static sn_fun1: Function = null;
	public static sn_fun2: Function = null;

	public static sn_s0: number = 1.3;
	public static sn_s1: number = 1.3;
	public static sn_s2: number = 1.3;

	public static sc_sp1: number = 600;
	public static sc_sp2: number = 200;
	public static sc_sp3: number = 200;

	public static sc_fun1: Function = null;
	public static sc_fun2: Function = null;

	public static sc_s0: number = 1.5;
	public static sc_s1: number = 1.5;
	public static sc_s2: number = 1.5;


	//消失X偏移
	public static C_END_DES: number = 0;
	//初始Y偏移
	public static C_YPOS1: number = 120;
	//淡入Y偏移
	public static C_YPOS2: number = 0;
	//淡出Y偏移
	public static C_YPOS3: number = -20;
	//停留等待时间
	public static C_WAIT1: number = 200;
	//淡入时间
	public static C_SPEED1: number = 100;
	//淡出时间
	public static C_SPEED2: number = 600;
}
