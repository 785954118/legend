/**
 * 客户端特殊技能AI逻辑类
 * @author MPeter
 */
class ExSkillAiLogic extends BaseClass {
	//////////////////////////效果枚举//////////////////////////
	/**战灵-战神附体 天赋技能 */
	private ZL_SKILL_DEVIL: number = 0;
	/**战灵-遗言 天赋技能 描述：己方单位死亡后，给友方其他单位施加回血BUFF：每秒恢复X%生命值，持续3秒*/
	private ZL_SKILL_EXPLOSION: number = 1;
	/**战灵-杀意 天赋技能 描述：击杀1个敌方单位后，友方单位造成的伤害提高X%，持续5秒 却时间60秒*/
	private ZL_SKILL_KILL: number = 2;
	/**战灵-死亡献祭 天赋技能 描述：友方战士死亡后，对周围3*3格子范围内敌人造成自身血量X%的伤害，冷却时间60秒*/
	private ZL_SKILL_SACRIFICE: number = 3;
	/**战灵-援护 天赋技能 描述：道士生命高于50%时，已方其他单位受到的伤害X%几率由道士来承受，冷却时间3秒（合击伤害无法转移）*/
	private ZL_SKILL_RELIEF: number = 4;
	/**战灵-怒意 天赋技能 描述：友方法师死亡后，友方其他单位提高基于法师攻击力X%的攻击力，持续5秒，冷却时间 60秒*/
	private ZL_SKILL_ANGER: number = 5;
	/**战灵-余威 天赋技能 描述：释放合击后，己方所有单位提高X%攻击力，持续10秒 */
	private ZL_H_SKILL_DETER: number = 6;
	/**战灵-蓄势 天赋技能 描述：释放合击后，X%几率减少多少秒CD*/
	private ZL_H_SKILL_ANTICIPATI: number = 7;
	/**战灵-回春 天赋技能 描述：战灵出现时，回复友方单位X生命值*/
	private ZL_SKILL_REMEDY: number = 8;
	/**战灵-刃甲 基础技能 描述：战灵出现时，回复友方单位X生命值*/
	private ZL_SKILL_RENJIA: number = 9;


	private MAX: number = 10;


	/**检测间隔时间 */
	private triggerInterval: any = {};
	public constructor() {
		super();
	}

	/**
	 * 单例
	 * @returns NinjutsuLogic
	 */
	public static ins(): ExSkillAiLogic {
		return super.ins() as ExSkillAiLogic;
	}

	/**检测战灵出现触发*/
	public checkWarSpiritBubbleTrigger(): void {
		//战灵相关技能
		if (ZhanLingModel.ins().ZhanLingOpen()) {
			for (let key in GlobalConfig.ZhanLingBase) {
				let base = GlobalConfig.ZhanLingBase[key];
				let zlData = ZhanLingModel.ins().getZhanLingDataById(base.id);
				if (!zlData) continue;

				switch (base.talent) {
					case this.ZL_SKILL_DEVIL:
						if (!GlobalConfig.ZhanLingLevel[base.id][zlData.level]) break;
						let talentLv: number = GlobalConfig.ZhanLingLevel[base.id][zlData.level].talentLevel;
						let dp = GlobalConfig.ZhanLingTalent[base.talent][talentLv];
						if (dp) {
							if (GameLogic.triggerValue(dp.rate)) {
								UserSkill.ins().postShowSkillWord(dp.showWords);
								for (let i: number = 0; i < SubRoles.ins().subRolesLen; i++) {
									let myChar: CharRole = EntityManager.ins().getMainRole(i);
									if (myChar) {
										let buff = EntityBuff.createBuff(dp.effId, myChar);
										myChar.addBuff(buff);
									}
								}
							}
						}
						break;
					case this.ZL_SKILL_REMEDY:
						talentLv = ZhanLingModel.ins().getZhanLingDataByTalentLv(base.id);
						dp = GlobalConfig.ZhanLingTalent[base.talent][talentLv];
						if (GameLogic.triggerValue(dp.rate)) {
							for (let i: number = 0; i < SubRoles.ins().subRolesLen; i++) {
								let myChar: CharRole = EntityManager.ins().getMainRole(i);
								if (myChar) {
									let buff = EntityBuff.createBuff(dp.effId, myChar);
									myChar.addBuff(buff);
								}
							}
						}
						break;
				}
			}
		}

	}



	/**检测合击触发*/
	public checkHJTrigger(source: CharMonster, targets: CharMonster[]): void {
		//战灵相关技能
		if (ZhanLingModel.ins().ZhanLingOpen()) {
			if (!source || !targets[0]) return;
			let hp = source.getHP();
			let maxHp = source.infoModel.getAtt(AttributeType.atMaxHp);
			let isTrigger: boolean = false;
			let isAttacck: boolean = source.infoModel.team == Team.My && source instanceof CharRole;

			for (let key in GlobalConfig.ZhanLingBase) {
				let base = GlobalConfig.ZhanLingBase[key];
				let zlData = ZhanLingModel.ins().getZhanLingDataById(base.id);
				if (!zlData) continue;
				switch (base.talent) {
					case this.ZL_H_SKILL_DETER:
						if (isAttacck) {
							let talentLv = ZhanLingModel.ins().getZhanLingDataByTalentLv(base.id);
							let dp = GlobalConfig.ZhanLingTalent[base.talent][talentLv];
							if (!dp) break;
							//给队友添加造成伤害提升buff
							for (let i: number = 0; i < SubRoles.ins().subRolesLen; i++) {
								let myChar: CharRole = EntityManager.ins().getMainRole(i);
								if (myChar) {
									for (let passive of dp.passive) {
										if (!passive.type || passive.type == (<Role>myChar.infoModel).job) {
											let skillDp = new SkillData(passive.id);
											this.intervalDoFun(source.infoModel.handle + passive.id + base.talent, skillDp.cd, () => {
												RoleAI.ins().tryUseWarSpiritSkill(source, passive.id, true);
											})
										}
									}
								}
							}
						}
						break;
					case this.ZL_H_SKILL_ANTICIPATI:
						let dp = GlobalConfig.ZhanLingTalent[base.talent][1]
						if (GameLogic.triggerValue(dp.rate)) {
							//减少多少秒CD时间

						}
						break;

				}
			}
		}
	}

	/**检测死亡触发*/
	public checkDieTrigger(source: CharMonster, targets: CharMonster[]): void {
		//战灵相关技能
		if (ZhanLingModel.ins().ZhanLingOpen()) {
			if (!source || !targets[0]) return;
			let hp = source.getHP();
			let maxHp = source.infoModel.getAtt(AttributeType.atMaxHp);
			let isTrigger: boolean = false;
			let isAttacck: boolean = source.infoModel.team == Team.My && source instanceof CharRole;

			for (let key in GlobalConfig.ZhanLingBase) {
				let base = GlobalConfig.ZhanLingBase[key];
				let zlData = ZhanLingModel.ins().getZhanLingDataById(base.id);
				if (!zlData) continue;

				let talentLv = ZhanLingModel.ins().getZhanLingDataByTalentLv(base.id);
				let dp = GlobalConfig.ZhanLingTalent[base.talent][talentLv];
				if (!dp) continue;
				switch (base.talent) {
					case this.ZL_SKILL_KILL:
						if (isAttacck) {
							//给队友添加造成伤害提升buff
							for (let i: number = 0; i < SubRoles.ins().subRolesLen; i++) {
								let myChar: CharRole = EntityManager.ins().getMainRole(i);
								if (myChar && myChar.infoModel.handle != source.infoModel.handle) {
									for (let passive of dp.passive) {
										if (!passive.type || passive.type == (<Role>myChar.infoModel).job) {
											let skillDp = new SkillData(passive.id);
											this.intervalDoFun(source.infoModel.handle + passive.id + base.id, skillDp.cd, () => {
												RoleAI.ins().tryUseWarSpiritSkill(source, passive.id, true);
											})
										}
									}
								}
							}
						}
						break;
					case this.ZL_SKILL_EXPLOSION:
						if (!isAttacck && targets[0] && targets[0].infoModel.team == Team.My) {
							for (let passive of dp.passive) {
								if (!passive.type || (<Role>targets[0].infoModel).job == passive.type) {
									let skillDp = new SkillData(passive.id);
									//给队友添加造成伤害提升buff
									for (let i: number = 0; i < SubRoles.ins().subRolesLen; i++) {
										let myChar: CharRole = EntityManager.ins().getMainRole(i);
										if (!myChar || myChar.infoModel.handle == targets[0].infoModel.handle) break;
										let skillDp = new SkillData(passive.id);
										if (skillDp.tarEff && skillDp.tarEff.length>0) {
											for (let effid of skillDp.tarEff) {
												let buff = EntityBuff.createBuff(effid, myChar);
												myChar.addBuff(buff)
											}
										}
									}
								}
							}

						}
						break;
					case this.ZL_SKILL_SACRIFICE:
						if (!isAttacck && targets[0] && targets[0].infoModel.team == Team.My && (<Role>targets[0].infoModel).job == JobConst.ZhanShi) {
							for (let passive of dp.passive) {
								if (!passive.type || passive.type == (<Role>source.infoModel).job) {
									let skillDp = new SkillData(passive.id);
									this.intervalDoFun(source.infoModel.handle + passive.id + base.id, skillDp.cd, () => {
										RoleAI.ins().tryUseWarSpiritSkill(source, passive.id, true);
									})
								}
							}
						}
						break;
					case this.ZL_SKILL_ANGER:
						if (!isAttacck && targets[0] && targets[0].infoModel.team == Team.My && (<Role>targets[0].infoModel).job == JobConst.FaShi) {
							for (let passive of dp.passive) {
								if (!passive.type || passive.type == (<Role>source.infoModel).job) {
									let skillDp = new SkillData(passive.id);
									this.intervalDoFun(source.infoModel.handle + passive.id + base.id, skillDp.cd, () => {
										RoleAI.ins().tryUseWarSpiritSkill(source, passive.id, true);
									})
								}
							}
						}
						break;


				}

			}

		}

	}

	/**检测血量触发*/
	public checkHPTrigger(target: CharMonster, sourceTarget: CharMonster): void {
		//战灵相关技能
		if (ZhanLingModel.ins().ZhanLingOpen()) {
			if (!target || !sourceTarget) return;
			let hp = target.getHP();
			let maxHp = target.infoModel.getAtt(AttributeType.atMaxHp);
			let isTrigger: boolean = false;
			let isAttacck: boolean = target.infoModel.team == Team.My && target instanceof CharRole;

			for (let key in GlobalConfig.ZhanLingBase) {
				let base = GlobalConfig.ZhanLingBase[key];
				let zlData = ZhanLingModel.ins().getZhanLingDataById(base.id);
				if (!zlData) continue;
				switch (base.talent) {
					case this.ZL_SKILL_RELIEF:
						// let zlData = ZhanLingModel.ins().getZhanLingDataById(id);
						// if (!zlData) continue;

						break;
					case this.ZL_SKILL_RENJIA:
						//基础战灵技能
						if (isAttacck) {
							let id: number = 0;
							let skillList = ZhanLingModel.ins().getZhanLingDataBySkill(id);
							let zlDt = ZhanLingModel.ins().getZhanLingDataById(id);
							let passiveId: number = 0;
							for (let k in skillList) {
								if (zlDt.level >= skillList[k].open) {
									if (skillList[k].id == 1)//刃甲
									{
										passiveId = GlobalConfig.ZhanLingSkill[skillList[k].id].passive;
									}
									else if (skillList[k].id == 4)//称霸
									{
										passiveId = GlobalConfig.ZhanLingSkill[skillList[k].id].passivePlus;
									}
								}
							}

							if (passiveId > 0) {
								let skillDp = new SkillData(passiveId);
								if (hp / maxHp < skillDp.config.passive.p1 / 10000) {
									this.intervalDoFun(target.infoModel.handle + passiveId + id, skillDp.cd, () => {
										RoleAI.ins().tryUseWarSpiritSkill(target, passiveId, true);
									})
								}
							}
						}

						break;

				}
			}


		}

	}

	/**间隔执行方法 */
	private intervalDoFun(indx: number, cd: number, fun: Function): void {
		//间隔计算
		if (this.triggerInterval[indx] == undefined)
			this.triggerInterval[indx] = egret.getTimer();
		if (egret.getTimer() - this.triggerInterval[indx] >= 0) {
			fun();
		}
		this.triggerInterval[indx] = egret.getTimer() + cd;
	}
}