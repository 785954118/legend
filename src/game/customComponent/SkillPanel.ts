/**
 *
 * @author hepeiye
 *
 */
class SkillPanel extends BaseView {

	private skillItem5: eui.Component;
	private skillItem4: eui.Component;
	private skillItem3: eui.Component;
	private skillItem2: eui.Component;
	private skillItem1: eui.Component;

	public curRole: number = 0;
	private curIndex: number = 0;
	private all: eui.Button;
	private mc: MovieClip;
	constructor() {
		super();
		// this.skinName = "SkillSkin";
	}

	public init(): void {
		this.curRole = 0;
	}

	public open(...param: any[]): void {
		this.addTouchEvent(this.all, this.onAllUpgrade);
		for (let i = 0; i < 5; i++) {
			let skillItem = this["skillItem" + (i + 1)];
			this.addTouchEvent(skillItem, this.onSelect);
			this.addTouchEvent(skillItem["grewUpAllBtn"], this.onSingleUpgrade);
		}
		this.observe(UserSkill.ins().postSkillUpgradeAll, this.grewupAllSkillCB);
		this.updateAllSkillItemAndDesc();
	}

	public close(...param: any[]): void {
		this.removeTouchEvent(this.all, this.onAllUpgrade);

		for (let i = 0; i < 5; i++) {
			let skillItem = this["skillItem" + (i + 1)];
			this.removeTouchEvent(skillItem, this.onSelect);
			this.removeTouchEvent(skillItem["grewUpAllBtn"], this.onSingleUpgrade);
		}
		this.removeObserve();
		DisplayUtils.removeFromParent(this.mc);
		this.mc = null;
	}

	private showHint(): void {
		let str: string;
		if (Actor.level >= 80) {
			str = "|C:0xf3311e&T:技能等级达到上限，请提高转生|";
		} else {
			str = "|C:0xf3311e&T:技能等级不能超过人物等级|";
		}
		UserTips.ins().showTips(str);
	}

	private onSelect(e: egret.TouchEvent): void {
		let level: number = UserSkill.ins().getSkillLimitLevel();
		switch (e.currentTarget) {
			case this.skillItem1:
				if (level < GlobalConfig.SkillsOpenConfig[1].level)
					return;
				this.curIndex = 0;
				break;
			case this.skillItem2:
				if (level < GlobalConfig.SkillsOpenConfig[2].level)
					return;
				this.curIndex = 1;
				break;
			case this.skillItem3:
				if (level < GlobalConfig.SkillsOpenConfig[3].level)
					return;
				this.curIndex = 2;
				break;
			case this.skillItem4:
				if (level < GlobalConfig.SkillsOpenConfig[4].level)
					return;
				this.curIndex = 3;
				break;
			case this.skillItem5:
				if (level < GlobalConfig.SkillsOpenConfig[5].level)
					return;
				this.curIndex = 4;
				break;
		}
		this.setSkillItem();
	}

	private onSingleUpgrade(e: egret.TouchEvent) {
		switch (e.currentTarget.parent) {
			case this.skillItem1:
				this.onSendUpgrade(0);
				this.curIndex = 0;
				break;
			case this.skillItem2:
				this.onSendUpgrade(1);
				this.curIndex = 1;
				break;
			case this.skillItem3:
				this.onSendUpgrade(2);
				this.curIndex = 2;
				break;
			case this.skillItem4:
				this.onSendUpgrade(3);
				this.curIndex = 3;
				break;
			case this.skillItem5:
				this.onSendUpgrade(4);
				this.curIndex = 4;
				break;
		}
		SoundUtil.ins().playEffect(SoundUtil.SKILL_UP);
		this.setSkillItem();
	}

	private onAllUpgrade(e: egret.TouchEvent) {
		this.onSendUpgrade(0, true);
		SoundUtil.ins().playEffect(SoundUtil.SKILL_UP);
		this.setSkillItem();
	}

	private onSendUpgrade(skillIndex: number, isAll: boolean = false) {
		UserSkill.ins().sendGrewUpAllSkill(this.curRole, isAll, skillIndex);
	}

	private updateAllSkillItemAndDesc() {
		// if (Actor.level < 40) {
		// 	this.all.visible = false;
		// }
		DisplayUtils.removeFromParent(this.mc);
		this.mc = null;
		this.updateAllSkillItem();
		this.setSkillItem();
	}
	public isUpGrade:boolean;
	private updateAllSkillItem() {
		this.isUpGrade = false;
		for (let i = 0; i < 5; i++) {
			let skillItem: eui.Component = this["skillItem" + (i + 1)];
			let role: Role = SubRoles.ins().getSubRoleByIndex(this.curRole);
			if(!role) return;

			let skillLevel = role.skillsData[i];

			if (skillLevel.lv <= 0) {
				if (UserSkill.ins().getSkillLimitLevel() >= GlobalConfig.SkillsOpenConfig[i + 1].level) {
					skillItem['lock'].textColor = 0X00FD61;
					skillItem['lock'].text = "开启";
				} else {
					skillItem['lock'].textColor = 0XFD000A;
					skillItem['lock'].text = GlobalConfig.SkillsOpenConfig[i + 1].level + "级开启";
				}
				skillItem['lock'].visible = true;
				skillItem["lv"].text = "";
				skillItem["costAll"].visible = false;
				skillItem["coinIcon1"].visible = false;
				skillItem["grewUpAllBtn"].visible = false;
			} else {
				skillItem['lock'].visible = false;
				skillItem["lv"].text = "Lv." + skillLevel.lv + "";
				skillItem["costAll"].visible = true;
				skillItem["coinIcon1"].visible = true;
				skillItem["grewUpAllBtn"].visible = true;
				this.setCost(skillItem, i, skillLevel.lv);
			}

			skillItem["icon"].source = skillLevel.icon;
			skillItem["skillName"].text = skillLevel.name + "";
			skillItem["skillDesc"].textFlow = TextFlowMaker.generateTextFlow1(skillLevel.desc + "");
		}
		if( this.all.visible && this.isUpGrade ){
			if( !this.mc ){
				this.mc = new MovieClip;
				this.mc.x = this.all.width/2;
				this.mc.y = this.all.height/2;
				this.all.addChild(this.mc);
				this.mc.playFile(RES_DIR_EFF + "chargeff1",-1);
			}

		}
	}

	public setCost(item: eui.Component, index: number, lv: number): void {
		let costNum: number = GlobalConfig.SkillsUpgradeConfig[lv].cost;
		let roleLevel: number = Actor.level;
		let coin: number = Actor.gold;
		item["costAll"].visible = item["coinIcon1"].visible = true;
		if (lv >= UserSkill.ins().getSkillLimitLevel()) {

			item["grewUpAllBtn"].enabled = false;

			let skillLevel = SubRoles.ins().getSubRoleByIndex(this.curRole).skillsData[this.curIndex];
			if (skillLevel.lv >= UserSkill.MAX_LEVEL) {
				item["grewUpAllBtn"].labelDisplay.text = "已满级";
				item["costAll"].visible = item["coinIcon1"].visible = false
			} else {
				let ins: UserZs = UserZs.ins();
				if (lv >= 80) {
					item["grewUpAllBtn"].labelDisplay.text = (ins.lv + 1) + "转可升";
				} else {
					item["grewUpAllBtn"].labelDisplay.text = (roleLevel + 1) + "级可升";
				}
			}

			if (costNum <= coin) {
				item["costAll"].textColor = 0x35e62d;
				item["costAll"].text = costNum;
			}
			else {
				item["costAll"].textColor = 0XFD000A;
				item["costAll"].text = costNum;
			}
		}
		else {
			//当前未满，显示一键升级消耗
			let costAllNum = UserSkill.ins().getSingleSkillGrewUpCost(this.curRole, index);
			item["grewUpAllBtn"].labelDisplay.text = "一键升级";
			if (costAllNum > 0) {
				this.isUpGrade = true;
				item["costAll"].textColor = 0x35e62d;
				item["costAll"].text = costAllNum;
				item["grewUpAllBtn"].enabled = true;
			}
			else {
				item["costAll"].textColor = 0XFD000A;
				item["costAll"].text = costNum;
				item["grewUpAllBtn"].enabled = false;
			}
		}


	}

	private setSkillItem(): void {
		for (let i = 0; i < 5; i++) {
			let skillItem: eui.Component = this["skillItem" + (i + 1)];
			skillItem["select"].visible = i == this.curIndex;
		}
	}

	public setRoleId(id: number) {
		this.curRole = id;
		this.updateAllSkillItemAndDesc();
	}

	private grewupAllSkillCB(upData:[SkillData[],number]) {
		let old: SkillData[] = upData[0];
		if (upData[1] != this.curRole) return;//解决在网络不佳情况下切换其他角色报错bug
		let role: Role = SubRoles.ins().getSubRoleByIndex(this.curRole);
		for (let i = 0; i < old.length; i++) {
			if (old[i].lv && old[i].lv < role.skillsData[i].lv) {
				this.grewupTip(old[i], role.skillsData[i], i);
			}
		}
		this.updateAllSkillItemAndDesc();
		DisplayUtils.removeFromParent(this.mc);
		this.mc = null;
	}

	private grewupTip(skillold: SkillData, skill: SkillData, compIndex: number) {
		let str: string = "";
		let label: eui.Label = new eui.Label;
		label.size = 20;
		label.textColor = 0x20cb30;
		let addAttack: number;
		if (skill.args) {
			if(skillold.args){
				addAttack = skill.args.b - skillold.args.b;
				str = `${skill.name}增加${addAttack}点伤害`;
			} else {
				Assert(false, `SkillPanel.grewupTip() skillold.args is null!!新技能：id(${skill.id}),lv(${skill.lv}) 旧技能：id(${skillold.id}),lv(${skillold.lv})`);
			}
		} else {
			if (skillold.tarEff && skill.tarEff) {
				let effectsCfg = GlobalConfig.EffectsConfig[skillold.tarEff[0]];
				let nextEffectsCfg = GlobalConfig.EffectsConfig[skill.tarEff[0]];
				let sId: number = Math.floor(skill.id / 1000);
				switch (sId) {
					case SHORT_SKILLID.MAGIC:
						addAttack = Math.ceil((nextEffectsCfg.args.d - effectsCfg.args.d) * 1000) / 10;
						str = `${skill.name}伤害减免增加${addAttack}%`;
						break;
					case SHORT_SKILLID.CURE:
						addAttack = nextEffectsCfg.args.c - effectsCfg.args.c;
						str = `${skill.name}增加${addAttack}点治疗量`;
						break;
					case SHORT_SKILLID.POISONING:
						addAttack = nextEffectsCfg.args.c - effectsCfg.args.c;
						str = `${skill.name}每秒失去${addAttack}点生命`;
						break;
					case SHORT_SKILLID.ARMOR:
						addAttack = nextEffectsCfg.args.c - effectsCfg.args.c;
						str = `${skill.name}增加${addAttack}点物防和魔防`;
						break;
					case SHORT_SKILLID.SUMMON:
						addAttack = nextEffectsCfg.args.a - effectsCfg.args.a;
						str = `神兽等级增加${addAttack}`;
						break;
				}
				addAttack = nextEffectsCfg.args.d - effectsCfg.args.d
			}  else if(skill.tarEff) {
				Assert(false, `SkillPanel.grewupTip() skillold.tarEff is null!!新技能：id(${skill.id}),lv(${skill.lv}) 旧技能：id(${skillold.id}),lv(${skillold.lv})`);
			}
		}

		let skillItem = this['skillItem' + (compIndex + 1)];
		label.text = str;
		let x = skillItem.x + skillItem.width / 2 - label.textWidth / 2;
		let y = skillItem.y + skillItem.height / 4;
		label.x = x;
		label.y = y;
		this.addChild(label);

		let mc = new MovieClip;
		mc.x = 65;
		mc.y = y + 20;
		mc.playFile(RES_DIR_EFF + "forgeSuccess", 1);
		this.addChild(mc);

		let t: egret.Tween = egret.Tween.get(label);
		t.to({"y": label.y - 45}, 600).wait(1000).call(() => {
			this.removeChild(label);
		}, this);
	}

}
