class ZhuzaiEquip extends BaseSystem {

	public constructor() {
		super();

		this.sysId = PackageID.ZhuZaiEquip;
		this.regNetMsg(1, this.postZhuZaiData);
		this.regNetMsg(3, this.postShengjie);
		this.regNetMsg(4, this.postShengjie);
	}

	public static ins(): ZhuzaiEquip {
		return super.ins() as ZhuzaiEquip;
	}

	/**
	 * 处理主宰装备数据
	 * 31-1
	 * @param bytes
	 */
	public postZhuZaiData(bytes: GameByteArray): void {
		let count: number = bytes.readShort();
		let index: number;
		for (let i: number = 0; i < count; i++) {
			index = bytes.readByte();//角色索引
			let len: number = bytes.readShort();//主宰装备数量
			for (let j: number = 0; j < len; j++) {
				let data: ZhuZaiData = new ZhuZaiData;
				data.parser(bytes);
				SubRoles.ins().getSubRoleByIndex(index).setZhuZaiData(data.id - 1, data);
			}
		}
	}

	/**
	 * 发送升阶
	 * 13-3
	 */
	public sendShengjie(roleID: number, id: number): void {
		let bytes: GameByteArray = this.getBytes(3);
		bytes.writeByte(roleID);
		bytes.writeInt(id);
		this.sendToServer(bytes);
	}

	public postShengjie(bytes: GameByteArray): boolean {
		return bytes.readBoolean();
	}

	/**
	 * 发送成长
	 * 13-4
	 */
	public sendGrow(roleID: number, id: number): void {
		let bytes: GameByteArray = this.getBytes(4);
		bytes.writeByte(roleID);
		bytes.writeInt(id);
		this.sendToServer(bytes);
	}

	/**
	 * 发送分解材料
	 * 13-5
	 */
	public sendFenjie(): void {
		this.sendBaseProto(5);
	}

	public canFengjie(): boolean {
		return false;
	}

	public canAllLevelup(): boolean {
		let len:number = SubRoles.ins().subRolesLen;
		for (let i: number = 0; i < len; i++) {
			if (this.canLevelup(i))
				return true;
		}
		return false;
	}

	public canLevelup(roleIndex: number): boolean {
		let config: EquipPointBasicConfig[] = GlobalConfig.EquipPointBasicConfig;
		let b: boolean = false;
		for (let i in config) {
			let role:Role = SubRoles.ins().getSubRoleByIndex(roleIndex);
        	let zhuzaiData:ZhuZaiData = role.getZhuZaiDataByIndex(parseInt(i) - 1);
			b = zhuzaiData && zhuzaiData.canLevelup();
			if (b)
				return true;
		}
		return false;
	}

	public canAllAdvance(): boolean {
		let len:number = SubRoles.ins().subRolesLen;
		for (let i: number = 0; i < len; i++) {
			if (this.canAdvance(i))
				return true;
		}
		return false;
	}

	public canAdvance(roleIndex: number): boolean {
		let config: EquipPointBasicConfig[] = GlobalConfig.EquipPointBasicConfig;
		let b: boolean = false;
		for (let i in config) {
			let role:Role = SubRoles.ins().getSubRoleByIndex(roleIndex);
        	let zhuzaiData:ZhuZaiData = role.getZhuZaiDataByIndex(parseInt(i) - 1);
			b = zhuzaiData && zhuzaiData.canAdvance();
			if (b)
				return true;
		}
		return false;
	}
}

namespace GameSystem {
	export let zhuzaiEquip = ZhuzaiEquip.ins.bind(ZhuzaiEquip);
}
