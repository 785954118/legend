/**
 * 神兽守护数据结构体
 * @author MPeter
 */
class ShenshouData {
	/**神兽ID */
	public id: number;
	/**装备ID */
	public equipIDs: number[] = [];
	/**出站状态 0不出战 1出战 */
	public state: number = 0;
	public constructor(bytes?: GameByteArray) {
		//初始化装备孔列表
		for (let i: number = 1; i <= 5; i++) {
			this.equipIDs[i] = 0;
		}
		if (bytes) this.readData(bytes);
	}
	public readData(bytes: GameByteArray): void {
		this.id = bytes.readByte();
		this.equipIDs = [];
		let len: number = bytes.readByte();
		for (let i: number = 0; i < len; i++) {
			this.equipIDs[i + 1] = bytes.readInt();
		}

		this.state = bytes.readByte();
		//没满时未激活
		if (this.equipIDs.indexOf(0) > -1 && this.state != ShenshouState.State_Has)
			this.state = ShenshouState.State_No;
	}
	public checkState(): void {
		if (this.state == ShenshouState.State_Has) return;
		if (this.equipIDs.indexOf(0) > -1) this.state = ShenshouState.State_No;
		else this.state = ShenshouState.State_Can;


	}
}
/**
 * 神兽装备数据
 * @author MPeter
 */
class ShenshouEquipData {
	/**兽神装备ID */
	public id: number;
	/**兽神装备位 */
	public pos: number;
	/**兽神ID */
	public shenshuId: number;
	/**排序值 */
	public sortIndex: number;
	/**是否最合适 */
	public best: boolean;
	public constructor() {

	}
}
/**
 * 神兽守护状态枚举
 * @author MPeter
 */
enum ShenshouState {
	/**未激活 2*/
	State_No = 2,
	/**可出站0 */
	State_Can = 0,
	/**已出站 1*/
	State_Has = 1,
}