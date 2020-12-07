/**
 * Created by MPeter on 2018/2/1.
 * 神兽守护系统
 */
class ShenshouSys extends BaseSystem {
	/**最大出战次数 */
	public maxLimit: number = 0;
	/**数据列表 */
	public dataList: Map<ShenshouData> = {};
	/**当前兽神经验 */
	public exp: number = 0;
	public constructor() {
		super();

		this.sysId = PackageID.Shenshou;
		this.regNetMsg(1, this.postInfo);
		this.regNetMsg(2, this.postWearEquip);
		this.regNetMsg(4, this.postBattleState);
		this.regNetMsg(5, this.postBattleMaxLimit);
		this.regNetMsg(6, this.postUpdateExp);
		this.regNetMsg(7, this.postUpEquip);
		this.regNetMsg(8, this.postDepartEquip);
	}

	public static ins(): ShenshouSys {
		return super.ins() as ShenshouSys;
	}

    /**
	 * 神兽信息
	 *  流水号：73-1
	 */
	public postInfo(bytes: GameByteArray): void {
		let len: number = bytes.readByte();
		for (let i: number = 0; i < len; i++) {
			let dt = new ShenshouData(bytes);
			this.dataList[dt.id] = dt;
		}
		this.maxLimit = bytes.readByte();
		this.exp = bytes.readInt();
	}

	/**
	 * 穿戴
	 *  流水号：73-2
	 */
	public postWearEquip(bytes: GameByteArray): void {
		let id: number = bytes.readByte();
		let pos: number = bytes.readByte();
		let equipId: number = bytes.readInt();


		// if (Assert(this.dataList[id], `没有找到神兽数据${id}`)) retun;
		if (this.dataList[id]) {
			this.dataList[id].equipIDs[pos] = equipId;
		}
		else {
			let dt = new ShenshouData();
			dt.equipIDs[pos] = equipId;
			dt.id = id;
			this.dataList[id] = dt;
		}

		this.dataList[id].checkState();

		// if (equipId) UserTips.ins().showCenterTips(`穿戴成功！`);

		ViewManager.ins().close(ShenshouWearEquipWin);
	}

	/**
	 * 出战状态
	 *  流水号：73-3
	 */
	public postBattleState(bytes: GameByteArray): void {
		this.dataList[bytes.readByte()].state = bytes.readByte();
	}

	/**
	 * 出战最大限制
	 * 流水号：73-4
	 */
	public postBattleMaxLimit(bytes: GameByteArray): void {
		this.maxLimit = bytes.readByte();

		ViewManager.ins().close(ShenshouDanUseWin);
	}
	/**
	 * 更新神兽经验
	 * 流水号：73-6
	 */
	public postUpdateExp(bytes: GameByteArray): void {
		let oldExp: number = this.exp;
		this.exp = bytes.readInt();

		if (this.exp - oldExp > 0) {
			UserTips.ins().showTips(`|C:0xffd93f&T:兽神精魄  +${this.exp - oldExp}|`);
		}
	}

	/**
	 * 装备提升
	 * 流水号：73-7
	 */
	public postUpEquip(bytes: GameByteArray): number {
		let id: number = bytes.readByte();
		let pos: number = bytes.readByte();
		let equipId: number = bytes.readInt();
		this.dataList[id].equipIDs[pos] = equipId;
		return equipId;
	}
	/**
	 * 装备熔炼
	 * 流水号：73-8
	 */
	public postDepartEquip(bytes: GameByteArray): void {

	}


	////////////////////////////////////////////////////////////////////////
	/**
	 * 穿戴装备
	 * @param id 神兽编号
	 * @param pos 装备部位
	 * @param equipId 装备ID 
	 * 流水号：73-2
	 */
	public sendWearEquip(id: number, pos: number, equipId: number): void {
		let bytes: GameByteArray = this.getBytes(2);
		bytes.writeByte(id);
		bytes.writeByte(pos);
		bytes.writeInt(equipId);
		this.sendToServer(bytes);
	}
	/**
	 * 合成装备
	 * @param equipIds 装备ID 
	 * 流水号：73-3
	 */
	public sendComposeEquip(equipIds: number[]): void {
		let bytes: GameByteArray = this.getBytes(3);
		let len = equipIds.length;
		while (--len > 0) {
			bytes.writeInt(equipIds[len]);
		}
		this.sendToServer(bytes);
	}
	/**
	 * 请求出战
	 * @param id 神兽ID 
	 * 流水号：73-4
	 */
	public sendBattle(id: number): void {
		let bytes: GameByteArray = this.getBytes(4);
		bytes.writeByte(id);
		this.sendToServer(bytes);
	}
	/**
	 * 提升神兽总数上限
	 * 流水号：73-5
	 */
	public sendUpLimitMax(): void {
		this.sendBaseProto(5);
	}
	/**
	 * 请求升级装备
	 * @param id 神兽ID 
	 * 流水号：73-7
	 */
	public sendUpEquip(id: number, pos: number): void {
		let bytes: GameByteArray = this.getBytes(7);
		bytes.writeByte(id);
		bytes.writeByte(pos);
		this.sendToServer(bytes);
	}

	/**
	 * 请求装备熔炼
	 * @param id 神兽ID 
	 * 流水号：73-8
	 */
	public sendDepartEquip(equips: number[]): void {
		let bytes: GameByteArray = this.getBytes(8);
		let count: number = equips.length;
		bytes.writeByte(count);
		for (let i: number = 0; i < count; i++) {
			bytes.writeInt(equips[i]);
		}
		this.sendToServer(bytes);
	}

}
namespace GameSystem {
	export let shenshouSys = ShenshouSys.ins.bind(ShenshouSys);
}
