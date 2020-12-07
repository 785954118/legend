/**
 * ItemConfig
 */
class ItemConfig {

	/* 物品id(10开头的是装备) */
	public id: number;

	descIndex: number;
	/**
	 * 图标
	 */
	public icon: number;
	/**
	 * 限制等级
	 */
	public level: number;
	/**
	 * 限制转生等级
	 */
	public zsLevel: number;
	/**
	 * 物品名称
	 */
	public name: string;
	/**
	 * 物品描述
	 */
	public desc: string;
	/**
	 * 物品使用类型
	 */
	public useType: number;

	public useCond: number;

	public needyuanbao: number;
	/**
	 * 寻宝仓库类型 0装备 1战纹 2传世 DepotType.Equip, DepotType.Rune, DepotType.Heirloom
	 * @type {number}
	 */
	public bagType: number = 0;

	/**
	 * 1：物品不合并
	 */
	public split: number;


	/** 计算普通装备的评分 */
	static calculateBagItemScore(item: ItemData): number {
		let transfrom = {
			'hp': 2,
			'atk': 4,
			'def': 5,
			'res': 6
		}
		let equipConfig: EquipConfig = GlobalConfig.EquipConfig[item.itemConfig.id];
		let powerConfig: AttrPowerConfig[] = GlobalConfig.AttrPowerConfig;
		let allPower = 0;

		let attr: AttributeData[] = item.att;
		let value: number = 0;
		if (attr) {
			for (let k in transfrom) {
				value = 0;
				if (!equipConfig[k])
					continue;
				for (let index = 0; index < attr.length; index++) {
					if (attr[index].type == transfrom[k]) {
						value = equipConfig[k] + attr[index].value;
						break;
					}
				}
				allPower += (value == undefined ? 0 : value) * powerConfig[transfrom[k]].power;
			}
		} else {
			for (let j in transfrom) {
				value = equipConfig[j];
				if (!value) continue;
				let type = Role.getAttrTypeByName(j);
				allPower += value * powerConfig[type].power;
			}
		}

		let expower: number = 0;
		if (equipConfig.baseAttr1) {
			expower += UserBag.getAttrPower([equipConfig.baseAttr1]);
		}

		if (equipConfig.baseAttr2) {
			expower += UserBag.getAttrPower([equipConfig.baseAttr2]);
		}

		if (equipConfig.exPower) {
			expower += equipConfig.exPower;
		}

		return Math.floor(allPower / 100) + Math.floor(expower);
	}

	static itemPoints: { [key: number]: number } = {};
	/** 计算神装&传奇装的评分 */
	static pointCalNumber(item: ItemConfig): number {

		let itemId = item.id;
		if (ItemConfig.itemPoints[itemId] != undefined) {
			return ItemConfig.itemPoints[itemId];
		}

		let transfrom = {
			'hp': 2,
			'atk': 4,
			'def': 5,
			'res': 6
		}

		let equipConfig: EquipConfig = GlobalConfig.EquipConfig[itemId];
		let powerConfig: AttrPowerConfig[] = GlobalConfig.AttrPowerConfig;
		let allPower = 0;
		for (let i in transfrom) {
			let _type = transfrom[i];
			let value = equipConfig[i];
			if (value) {
				let conf = powerConfig[_type];
				allPower += (value + Math.floor(value * ItemBase.additionRange / 100)) * conf.power;
			}
		}

		ItemConfig.itemPoints[itemId] = Math.floor(allPower / 100);
		return ItemConfig.itemPoints[itemId];
	}

	static getBaseAttrData(item: ItemConfig) {
		let equipConfig: EquipConfig = GlobalConfig.EquipConfig[item.id];

		let transfrom = {
			'hp': 2,
			'atk': 4,
			'def': 5,
			'res': 6
		}
		let otherBaseType: number[] = [AttributeType.atHolyDamege];

		let baseAttr: AttributeData[] = [];


		for (let i in transfrom) {
			if (equipConfig[i]) {
				baseAttr.push(new AttributeData(transfrom[i], equipConfig[i]));
			}
		}
		if (equipConfig.baseAttr1) {
			if (otherBaseType.indexOf(equipConfig.baseAttr1.type) >= 0)
				baseAttr.push(new AttributeData(equipConfig.baseAttr1.type, equipConfig.baseAttr1.value));
		}
		if (equipConfig.baseAttr2) {
			if (otherBaseType.indexOf(equipConfig.baseAttr2.type) >= 0)
				baseAttr.push(new AttributeData(equipConfig.baseAttr2.type, equipConfig.baseAttr2.value));
		}
		return baseAttr;
	}

	//计算关联属性战力
	static calculateRelatePower(attrs: AttributeData[], role: EntityModel) {
		let totalPower: number = 0;
		if (!attrs || !role)
			return totalPower;

		for (let attr of attrs) {
			totalPower += ItemConfig.relatePower(attr, role);
		}
		return totalPower;
	}

	//关联属性战力计算公式
	static relatePower(attr: AttributeData, role: EntityModel) {
		let totalPower = 0;
		let powerConfig: AttrPowerConfig[] = GlobalConfig.AttrPowerConfig;
		let config = powerConfig[attr.type];
		if (config && config.relate_type) {
			let value = role.getAtt(config.relate_type);
			let ex_type = AttributeData.exRelate[config.relate_type];
			if (ex_type) {
				let ex_value = role.getAtt(ex_type);
				if (ex_value) {
					value = Math.floor(value / (1 + ex_value / 10000));
				}
			}
			// let config2 = powerConfig[config.relate_type];
			totalPower += Math.floor(attr.value * value * config.relate_power / 100);
		}
		return totalPower;
	}

	static getQuality(config: ItemConfig): number {
		if (!config)
			return 0;
		if (GlobalConfig.ItemDescConfig[config.descIndex])
			return GlobalConfig.ItemDescConfig[config.descIndex].quality;
		return 0;
	}

	static getQualityColor(config: ItemConfig): number {
		return ItemBase.QUALITY_COLOR[this.getQuality(config)];
	}

	static getType(config: ItemConfig): number {
		if (!config)
			return 0;
		if (GlobalConfig.ItemDescConfig[config.descIndex])
			return GlobalConfig.ItemDescConfig[config.descIndex].type;
		return 0;
	}

	static getSubType(config: ItemConfig): number {
		if (!config)
			return 0;
		if (GlobalConfig.ItemDescConfig[config.descIndex])
			return GlobalConfig.ItemDescConfig[config.descIndex].subType;
		return 0;
	}

	static getJob(config: ItemConfig): number {
		if (!config)
			return 0;
		if (GlobalConfig.ItemDescConfig[config.descIndex])
			return GlobalConfig.ItemDescConfig[config.descIndex].job;
		return 0;
	}
	/**是否为装备 */
	static isEquip(config: ItemConfig): boolean {
		let type = this.getType(config);
		switch (type) {
			case ItemType.TYPE_0:
			case ItemType.TYPE_4:
			case ItemType.TYPE_11:
				return true;
		}
		return false;
	}
}