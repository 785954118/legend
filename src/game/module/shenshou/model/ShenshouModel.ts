/**
 * Created by MPeter on 2018/2/1.
 *  神兽数据模型
 */
class ShenshouModel extends BaseClass {
	public static EQUIPE_QUALITY_CN: string[] = [`平凡`, `精良`, `史诗`, `传奇`, `神话`];

	public constructor() {
		super();
	}
	public static ins(): ShenshouModel {
		return super.ins() as ShenshouModel;
	}

	/**
	 * 查找可穿戴的装备列表
	 * @param id 神兽ID
	 * @param pos 位置
	 */
	public findCanWearEquips(id: number, pos: number): ShenshouEquipData[] {
		let equips = UserBag.ins().getBagGoodsByType(ItemType.TYPE_23);
		let list: ShenshouEquipData[] = [];
		// let data = this.getDataById(id);
		// let mySocre = 0
		// if (data && data.equipIDs[pos]) mySocre = UserBag.getAttrPower(GlobalConfig.ShenShouEquip[data.equipIDs[pos]].attrs)
		let myEquipScore: number = 0;
		let data = ShenshouSys.ins().dataList[id];
		if (data && data.equipIDs[pos]) myEquipScore = UserBag.getAttrPower(GlobalConfig.ShenShouEquip[data.equipIDs[pos]].attrs)
		for (let item of equips) {
			let quality = this.getEquipQuality(item.configID);
			let socre = UserBag.getAttrPower(GlobalConfig.ShenShouEquip[item.configID].attrs);
			if (ItemConfig.getSubType(item.itemConfig) == pos - 1 &&
				GlobalConfig.ShenShouBase[id].minLevel[pos - 1] <= quality
			) {
				let dt = new ShenshouEquipData();
				dt.id = item.configID;
				dt.pos = pos;
				dt.shenshuId = id;
				let aData = GlobalConfig.ShenShouEquip[item.configID];
				dt.sortIndex = UserBag.getAttrPower(aData.attrs);
				dt.best = dt.sortIndex > myEquipScore;

				list.push(dt);
			}
		}
		list.sort(this.compareFun);
		return list;
	}
	/**检查装备的战力 */
	public checkEquipScore(id: number, tId: number): boolean {
		let mySocre = UserBag.getAttrPower(GlobalConfig.ShenShouEquip[id].attrs);
		let toSocre = UserBag.getAttrPower(GlobalConfig.ShenShouEquip[tId].attrs);
		return mySocre >= toSocre;
	}
	/**排序 */
	private compareFun(a: ShenshouEquipData, b: ShenshouEquipData): number {
		if (a.sortIndex > b.sortIndex) return -1;
		else if (a.sortIndex < b.sortIndex) return 1;
		else return 0;
	}
	/**
	 * 计算装备评分
	 */
	public calcEquipScore(id: number): number {
		let data = this.getDataById(id);
		let score: number = 0;
		if (data) {
			for (let i: number = 1; i <= data.equipIDs.length; i++) {
				let equipData = GlobalConfig.ShenShouEquip[data.equipIDs[i]];
				if (!equipData) continue;
				score += UserBag.getAttrPower(equipData.attrs);
				if (equipData.expower) score += equipData.expower;
			}
		}

		return score;
	}
	/**获取神兽数据根据ID */
	public getDataById(id: number): ShenshouData {
		let data = ShenshouSys.ins().dataList[id];
		// if (Assert(data, `获取神兽数据ID错误:${id}`)) return null;
		return data;
	}
    /**获取神兽总指定类型总属性值
	 * @param id 神兽ID
	 * @param attrType 属性类型
	 */
	public getAttrValue(id: number, attrType: number): number {
		let data = this.getDataById(id);
		if (data) {
			let value: number = 0;
			for (let pos in data.equipIDs) {
				if (!pos) continue;
				let equip = GlobalConfig.ShenShouEquip[data.equipIDs[pos]];
				if (!equip) continue;
				for (let attr of equip.attrs) {
					if (attrType == attr.type) value += attr.value;
				}
			}
			return value;
		}
		return 0;
	}
	/**是否激活 */
	public getCurStatus(id: number): number {
		let data = this.getDataById(id);
		if (data) {
			return data.state
		}
		return ShenshouState.State_No;
	}
	/**获取当前出战数 */
	public getCurBattle(): number {
		let count: number = 0;
		for (let id in ShenshouSys.ins().dataList) {
			if (ShenshouSys.ins().dataList[id].state == ShenshouState.State_Has) count++;
		}
		return count;
	}
	/**获取总出战个数 */
	public getCountBattle(): number {
		return GlobalConfig.ShenShouConfig.minCount + ShenshouSys.ins().maxLimit;
	}
	/**可出战 */
	public isCanBattle(): boolean {
		return this.getCurBattle() < this.getCountBattle();
	}
	/**获取当前属性 */
	public getNowAttr(equip: ShenShouEquip): AttributeData[] {
		let nowAttrList = [];
		for (let index: number = 0; index < equip.attrs.length; index++) {
			let newAttr = new AttributeData(equip.attrs[index].type, equip.attrs[index].value - equip.starattrs[index].value);
			nowAttrList.push(newAttr);
		}
		return nowAttrList;
	}
	/**获取装备等级 */
	public getEquipLv(id: number): number {
		return parseInt((id + "").slice(4, 7));
	}
	/**获取装备品质 */
	public getEquipQuality(id: number): number {
		return parseInt((id + "").slice(2, 4));
	}
	/**获取装备的基础iD */
	public getEquipBaseId(id: number): number {
		return (id / 1000 >> 0) * 1000 + 1;
	}
	/**是否开启 */
	public checkOpen(): boolean {
		return UserZs.ins().lv >= GlobalConfig.ShenShouConfig.openzhuanshenglv &&
			GameServer.serverOpenDay + 1 >= GlobalConfig.ShenShouConfig.openserverday
	}


}
