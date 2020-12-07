/**
 * 战纹
 */
class Rune extends BaseSystem {
	public static UNGET = 0;//不可领取
	public static CANGET = 1;//可领取
	public static ISNGET = 2;//已领取
	public static BoxSum = 5;//宝箱数


	public boxs: number[];//箱子领取状态 rune 50-8
	public runeCount: number;//积累次数 rune 50-8
	public hope: number;//当前祝福值
	public constructor() {
		super();
		this.sysId = PackageID.Rune;

		this.regNetMsg(1, this.doInlay);
		this.regNetMsg(2, this.doUpgrade);
		this.regNetMsg(3, this.doOneKeyDecompose);
		this.regNetMsg(5, this.postHuntRuneInfo);
		this.regNetMsg(6, this.postBestListInfo);
		this.regNetMsg(8, this.postRuneBoxGift);
		this.regNetMsg(10, this.postDelRune);

		this.boxs = [];
	}

	public static ins(): Rune {
		return super.ins() as Rune;
	}

	/**
	 * 请求镶嵌
	 * 50-1
	 * @param  {number} role
	 * @param  {number} pos
	 * @param  {number} runeid
	 * @returns void
	 */
	public sendInlay(role: number, pos: number, runeid: number): void {
		let bytes: GameByteArray = this.getBytes(1);
		bytes.writeShort(role);
		bytes.writeShort(pos);
		bytes.writeDouble(runeid);
		this.sendToServer(bytes);
	}

	/**
	 * 处理镶嵌
	 * 49-1
	 * @param  {GameByteArray} bytes
	 * @returns void
	 */
	public doInlay(bytes: GameByteArray): void {
		let isSuccess: boolean = Boolean(bytes.readShort());
		let roleID: number = 0;
		let pos: number = 0;
		let id: number = 0;
		if (isSuccess) {
			roleID = bytes.readShort();
			pos = bytes.readShort();
			id = bytes.readInt();
		}

		this.postInlayResult([isSuccess, roleID, pos, id]);
	}

	public postInlayResult(param: any[]): any[] {
		return param;
	}

	/**
	 * 请求升级
	 * 50-2
	 * @param  {number} role
	 * @param  {number} pos
	 * @returns void
	 */
	public sendUpgrade(role: number, pos: number): void {
		let bytes: GameByteArray = this.getBytes(2);
		bytes.writeShort(role);
		bytes.writeShort(pos);
		this.sendToServer(bytes);
	}

	/**
	 * 处理升级
	 * 50-2
	 * @param  {GameByteArray} bytes
	 * @returns void
	 */
	public doUpgrade(bytes: GameByteArray): void {
		let isSuccess: boolean = Boolean(bytes.readByte());
		if (isSuccess) {
			let roleID: number = bytes.readShort();
			let pos: number = bytes.readShort();
			let id: number = bytes.readInt();

			RuneDataMgr.ins().replaceRune(roleID, pos, id);

			this.postUpgradeResult([isSuccess, roleID, id, pos]);
		}
	}

	public postUpgradeResult(param: any[]): any[] {
		return param;
	}

	/**
	 * 请求一键分解
	 * 50-3
	 * @param  {number[]} uidList
	 * @returns void
	 */
	public sendOneKeyDecompose(uidList: ItemData[]): void {
		let len: number = uidList.length;

		let bytes: GameByteArray = this.getBytes(3);
		bytes.writeInt(len);
		for (let i: number = 0; i < len; i++) {
			bytes.writeInt(uidList[i].configID);
		}
		this.sendToServer(bytes);
	}

	/**
	 * 处理一键分解
	 * 50-3
	 * @param  {GameByteArray} bytes
	 * @returns void
	 */
	public doOneKeyDecompose(bytes: GameByteArray): void {
		let isSuccess: boolean = Boolean(bytes.readByte());
		let normalNum: number = bytes.readInt();

		this.postOneKeyDecomposeResult([isSuccess, normalNum]);
	}

	public postOneKeyDecomposeResult(param: any[]): any[] {
		return param;
	}

	/**
	 * 请求一键分解
	 * 50-4
	 * @param  {number[]} id
	 * @returns void
	 */
	public sendExchangeRune(id: number): void {
		let bytes: GameByteArray = this.getBytes(4);
		bytes.writeUnsignedInt(id);
		this.sendToServer(bytes);
	}

	/**
	 * 发送寻宝
	 * 50-5
	 * @param type    探宝类型
	 */
	public sendHuntRune(type) {
		let bytes: GameByteArray = this.getBytes(5);
		bytes.writeShort(type);
		this.sendToServer(bytes);
	}

	public postHuntRuneInfo(bytes: GameByteArray): void {
		let type = bytes.readUnsignedByte();
		let num = bytes.readUnsignedByte();
		let arr = [];
		for (let i = 0; i < num; i++) {
			arr[i] = [bytes.readInt(), bytes.readUnsignedByte()];
		}
		if (ViewManager.ins().isShow(HuntResultWin)) {
			Hunt.ins().postHuntResult(type, arr, 1);
		} else {
			ViewManager.ins().open(HuntResultWin, type, arr, 1);
		}
	}

	public postBestListInfo(bytes: GameByteArray): any[] {
		let num = bytes.readUnsignedByte();
		let arr = [];
		for (let i = 0; i < num; i++) {
			arr[i] = [bytes.readString(), bytes.readInt()];
		}
		arr.reverse();
		return arr;
	}

	/**
	 * 发送探宝次数领奖
	 * 50-7
	 */
	public sendRuneBoxGift(id: number) {
		let bytes: GameByteArray = this.getBytes(7);
		bytes.writeInt(id);
		this.sendToServer(bytes);
	}
	/**
	 * 战纹抽奖累计奖励信息
	 * 50-8
	 */
	public RuneRewards: number;
	public postRuneBoxGift(bytes: GameByteArray) {
		this.RuneRewards = bytes.readInt();
		this.runeCount = bytes.readInt();
		this.hope = bytes.readInt();
		let idx: number = 0;
		for (let k in GlobalConfig.FuwenTreasureRewardConfig) {
			let config: FuwenTreasureRewardConfig = GlobalConfig.FuwenTreasureRewardConfig[k];
			this.boxs[idx] = ((this.RuneRewards >> config.id) & 1) ? Rune.ISNGET : (this.runeCount >= config.needTime ? Rune.CANGET : Rune.UNGET);
			idx++;
		}

	}
	/**是否有可领取宝箱*/
	public getIsGetBox() {
		for (let i = 0; i < Rune.BoxSum; i++) {
			switch (Rune.ins().boxs[i]) {
				case Rune.UNGET:
					break;
				case Rune.CANGET:
					return true;
				case Rune.ISNGET:
					break;
			}
		}
		return false;
	}

	/**
	 * 战纹合成
	 * 50-9
	 * @param  {number} id
	 * @returns void
	 */
	public sendRuneMerge(id: number): void {
		let bytes: GameByteArray = this.getBytes(9);
		bytes.writeInt(id);
		this.sendToServer(bytes);
	}

	/**
	 * 删除已有的战纹
	*50-10
	 */
	public postDelRune(bytes: GameByteArray): void {
		let item = RuneDataMgr.ins().getRune(bytes.readInt(), bytes.readInt())
		item.init();
	}

	/** 战纹合成是否开启*/
	public isOpen(): boolean {
		let config = GlobalConfig.MergeTotal[4];
		if ((config.openZs || 0) <= UserZs.ins().lv && (config.openLv || 0) <= Actor.level) {
			return true;
		}
		return false;
	}

	/**
	* 获取战纹合成列表
	* @param type
	* @returns {{type: number, id: number}[]}
	*/
	public getRuneMergeEquipByLv(type: number) {
		let arr = [];
		let configs = GlobalConfig.RuneComposeConfig;
		for (let it in configs) {
			if (configs[it].mixId[1] == type)
				arr.push({ type: MergeType.Rune, id: configs[it].id });
		}
		return arr;
	}

	/* 战纹id是否可以合成**/
	public isRuneCanMergeByID(id: number): boolean {
		let config = GlobalConfig.RuneComposeConfig[id];
		let mat = config.material;
		let num1 = UserBag.ins().getBagGoodsCountById(UserBag.BAG_TYPE_OTHTER, config.material[0]);
		let num2 = UserBag.ins().getBagGoodsCountById(UserBag.BAG_TYPE_OTHTER, config.material[1]);
		let num3 = UserBag.ins().getBagGoodsCountById(UserBag.BAG_TYPE_OTHTER, GlobalConfig.RuneOtherConfig.goldItemId);
		if (num1 > 0 && num2 > 0 && num3 >= config.count) {
			return true;
		}
		return false;
	}

	/** 战纹type是否可以合成*/
	public isRuneCanMergeByType(type: number): boolean {
		let arr = [];
		let configs = GlobalConfig.RuneComposeConfig;
		for (let it in configs) {
			if (configs[it].mixId[1] == type && this.isRuneCanMergeByID(configs[it].id)) {
				return true;
			}
		}
		return false;
	}

	/** 战纹是否可以有合成*/
	public isRuneCanMerge(): boolean {
		let arr = [];
		let configs = GlobalConfig.RuneComposeConfig;
		for (let it in configs) {
			if (this.isRuneCanMergeByID(configs[it].id)) {
				return true;
			}
		}
		return false;
	}

	/**
	* 获取是否为合成的材料
	* @param id
	* @returns RuneComposeConfig
	*/
	public getRuneMergeByID(id: number): RuneComposeConfig {
		let arr = [];
		let configs = GlobalConfig.RuneComposeConfig;
		for (let it in configs) {
			let data = configs[it];
			for (let i in data.material) {
				if (data.material[i] == id)
					return data;
			}
		}
		return null;
	}

	/**
	* 获取是否为合成的材料
	* @param id
	* @returns boolean
	*/
	public getIsMergeByID(id: number): boolean {
		let itemCfg1: ItemConfig = GlobalConfig.ItemConfig[id];
		let tem = GlobalConfig.RuneComposeConfig;
		for (let it in tem) {
			let itemCfg: ItemConfig = GlobalConfig.ItemConfig[it];
			if (ItemConfig.getSubType(itemCfg1) == ItemConfig.getSubType(itemCfg)) {
				return true
			}
		}
		return false;
	}

	/** 战纹type是否可以合成*/
	public getMergeIndexByType(type: number, id: number): number {
		let configs = GlobalConfig.RuneComposeConfig;
		let index = 0;
		for (let it in configs) {
			if (configs[it].mixId[1] == type) {
				if (id == configs[it].id)
					return index;
				index++;
			}
		}
		return index;
	}

	/** 判断合成战纹是否有相关战纹已装备*/
	public isEquipMerge(id: number, curRole: number, pos: number): boolean {
		let mId = this.isMergeId(id)
		let configs = GlobalConfig.RuneComposeConfig[mId];
		if (!configs)
			return false;
		let itemCfg: ItemConfig = GlobalConfig.ItemConfig[id];
		let rdList: ItemData[] = RuneDataMgr.ins().getRoleRune(curRole);
		if (!rdList) return false;
		let selectedRuneData: ItemData = RuneDataMgr.ins().getRune(curRole, pos);
		let cfg: RuneBaseConfig;
		let len: number = rdList.length;
		for (let i: number = 0; i < len; i++) {
			let rd: ItemData = rdList[i];
			cfg = RuneConfigMgr.ins().getBaseCfg(rd);
			if (cfg) {
				let arr = this.getIsEquipMerge(configs.checkMaterial, mId);
				for (let j = 0; j < arr.length; j++) {
					let itemCfg1: ItemConfig = GlobalConfig.ItemConfig[arr[j]];
					if (ItemConfig.getSubType(itemCfg1) == ItemConfig.getSubType(rd.itemConfig)) {
						if (selectedRuneData) {
							if (selectedRuneData.configID <= 0) {
								if (this.getIsMergeByID(id) || this.getRoleIsHasMerge(arr, curRole))
									return true;
							}
							if (selectedRuneData.itemConfig) {
								let b = this.getCurIsType(arr, ItemConfig.getSubType(selectedRuneData.itemConfig));
								if (b) {
									if (this.getIsMergeByID(id) || this.getRoleIsHasMerge(arr, curRole))
										return true;
								}
							}
						}
					}
				}
			}
		}
		return false;
	}

	/** 角色身上是否有合成相关战纹*/
	private getRoleIsHasMerge(arr: number[], curRole: number): boolean {
		let rdList: ItemData[] = RuneDataMgr.ins().getRoleRune(curRole);
		if (!rdList) return false;
		let cfg: RuneBaseConfig;
		let len: number = rdList.length;
		for (let i: number = 0; i < len; i++) {
			let rd: ItemData = rdList[i];
			cfg = RuneConfigMgr.ins().getBaseCfg(rd);
			if (cfg && this.getIsMergeByID(cfg.id)) {
				for (let j = 0; j < arr.length; j++) {
					let itemCfg1: ItemConfig = GlobalConfig.ItemConfig[arr[j]];
					if (ItemConfig.getSubType(rd.itemConfig) == ItemConfig.getSubType(itemCfg1)) {
						return true;
					}
				}
			}
		}
		return false;
	}

	/** 判断是否为相同类型*/
	private getCurIsType(arr: number[], type: number): boolean {
		let b = true;
		for (let j = 0; j < arr.length; j++) {
			let itemCfg1: ItemConfig = GlobalConfig.ItemConfig[arr[j]];
			if (ItemConfig.getSubType(itemCfg1) == type) {
				b = false;
				break;
			}
		}
		return b;
	}

	/** 将id加入arr*/
	private getIsEquipMerge(arr: number[], id: number): number[] {
		let temArr = [];
		for (let i = 0; i < arr.length; i++) {
			temArr.push(arr[i])
		}
		temArr.push(id);
		return temArr;
	}

	/** 获取合成表的id*/
	private isMergeId(id: number): number {
		let myID = id;
		let itemCfg1: ItemConfig = GlobalConfig.ItemConfig[id];
		let arr = GlobalConfig.RuneComposeConfig;
		for (let it in arr) {
			let itemCfg: ItemConfig = GlobalConfig.ItemConfig[it];
			if (ItemConfig.getSubType(itemCfg1) == ItemConfig.getSubType(itemCfg)) {
				return parseInt(it);
			}
			for (let i in arr[it].material) {
				let itemCfg2: ItemConfig = GlobalConfig.ItemConfig[arr[it].material[i]];
				if (ItemConfig.getSubType(itemCfg1) == ItemConfig.getSubType(itemCfg2)) {
					return parseInt(it);
				}
			}
		}
		return myID;
	}

	/** 判断战纹是否可以装备*/
	public isCanEquip(id: number, curRole: number, tiId: number, posIndex: number): boolean {
		let itemCfg: ItemConfig = GlobalConfig.ItemConfig[id];
		let rdList: ItemData[] = RuneDataMgr.ins().getRoleRune(curRole);
		if (!rdList) return true;
		let cfg: RuneBaseConfig;
		let len: number = rdList.length;
		for (let i: number = 0; i < len; i++) {
			let rd: ItemData = rdList[i];
			cfg = RuneConfigMgr.ins().getBaseCfg(rd);
			if (cfg && rd.itemConfig) {
				let conf = GlobalConfig.RuneComposeConfig[cfg.id];
				if (!conf) continue;
				let arr = conf.checkMaterial;
				for (let j = 0; j < arr.length; j++) {
					let itemCfg1: ItemConfig = GlobalConfig.ItemConfig[arr[j]];
					if (ItemConfig.getSubType(itemCfg1) == ItemConfig.getSubType(itemCfg)) {
						if (tiId == 0)
							return false;
						else {
							let itemCfg2: ItemConfig = GlobalConfig.ItemConfig[tiId];
							if (ItemConfig.getSubType(itemCfg2) == ItemConfig.getSubType(itemCfg))
								return false;
						}
					}
				}

			}
		}
		return true;
	}

	/** 判断战纹弹出提示*/
	public getMergeRune(id: number, curRole: number, item: ItemData): string[] {
		let mId = this.isMergeId(id);
		let itemCfg: ItemConfig = GlobalConfig.ItemConfig[id];
		let configs = GlobalConfig.RuneComposeConfig[mId];
		let arr = [];
		if (!configs)
			return null;
		let rdList: ItemData[] = RuneDataMgr.ins().getRoleRune(curRole);
		if (!rdList) return null;
		let cfg: RuneBaseConfig;
		let len: number = rdList.length;
		for (let i: number = 0; i < len; i++) {
			let rd: ItemData = rdList[i];
			cfg = RuneConfigMgr.ins().getBaseCfg(rd);
			if (cfg) {
				let arrTem = this.getIsEquipMerge(configs.checkMaterial, mId);
				for (let j = 0; j < arrTem.length; j++) {
					let itemCfg1: ItemConfig = GlobalConfig.ItemConfig[arrTem[j]];
					if (ItemConfig.getSubType(itemCfg1) == ItemConfig.getSubType(rd.itemConfig)) {
						if (item && item.configID != cfg.id && this.getIsMergeByID(id)) {
							arr = [`更换${GlobalConfig.ItemConfig[configs.id].name}将同时脱下${GlobalConfig.ItemConfig[cfg.id].name}`, `${i}`];
							return arr;
						}
					}

				}
			}
		}
		return null;
	}

}

namespace GameSystem {
	export let rune = Rune.ins.bind(Rune);
}
