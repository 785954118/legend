/**
 * Ai工具
 */
class AIUtil extends BaseClass {


	public static ins(...args: any[]): AIUtil {
		return super.ins(args) as AIUtil;
	}

	/**
	 * 使用技能
	 * @param self 技能使用者
	 * @param enemy 技能作用者
	 * @param skill 使用的技能
	 * @return 是否造成伤害
	 */
	userSkill(self: CharMonster, enemy: CharMonster, skill: SkillData, hitFun: (probability?: number) => void = null): boolean {
		if (self != enemy) {
			//计算方向
			self.dir = DirUtil.get8DirBy2Point(self, enemy);
		}

		if (!skill)
			return false;
		//播放技能特效
		GameLogic.ins().playSkillEff(skill, self, [enemy], hitFun);

		if (!SoundUtil.WINDOW_OPEN && skill.sound && self.team == Team.My) {
			SoundUtil.ins().playEffect(skill.sound);
		}
		return true;
	}

	/**
	 * 伤害
	 * @self 伤害源
	 * @enemy 伤害目标
	 * @type 暴击类型
	 * @damage 伤害值
	 */
	hram(self: CharMonster, enemy: CharMonster, type: DamageTypes, damage: number = 0) {

		//显示对象血条扣血
		enemy.hram(damage);
		//飘血
		GameLogic.ins().postEntityHpChange(enemy, self, type, damage);
		//死亡
		if (enemy.getHP() <= 0) {
			if (this.relive(enemy)) {
				return;
			}
		}
	}

	relive(enemy: CharMonster): boolean {
		if (enemy instanceof CharRole && !enemy.hasBuff(52001)) {
			let stunp: number = (<Role>enemy.infoModel).attributeExData[ExAttributeType.eatGodBlessProbability];
			let r: number = Math.random();
			if (r < stunp / 10000) {
				//复活
				enemy.reset();
				enemy.removeAllBuff();
				r = enemy.infoModel.getAtt(AttributeType.atMaxHp) * (<Role>enemy.infoModel).attributeExData[ExAttributeType.eatGodBlessRate] / 10000;
				enemy.hram(r);
				return true;
			}
		}
		return false;
	}

	public static dead(target: CharMonster, callback: Function = null): void {
		target.AI_STATE = AI_State.Die;
		let em: EntityManager = EntityManager.ins();
		em.removeByHandle(target.infoModel.handle, false, GameMap.fbType == UserFb.FB_TYPE_EXP);
		// target.onDead();
		/**用计时器回收对象 */
		TimerManager.ins().doTimer(5000, 1, () => {
			DisplayUtils.removeFromParent(target);
			if (callback) {
				callback();
			}
		}, this)
	}
}