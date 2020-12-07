/**锻造相关 */
class UserForge extends BaseSystem {
	public constructor() {
		super();

		this.sysId = PackageID.strongthen;
		this.regNetMsg(2, this.doForgeUpdata);
		this.regNetMsg(5, this.postMeltItem);

		//这些消息监听都要改.
		this.observe(UserBag.ins().postItemAdd, this.delaySeekItem);//道具添加
		this.observe(UserBag.ins().postItemDel, this.delaySeekItem);//道具删除
		this.observe(UserBag.ins().postItemChange, this.delaySeekItem);//道具变更
		this.observe(Actor.ins().postSoulChange, this.delaySeekItem);//魂值变更
	}

	static get CONDITION_ZHUZAO() {
		return GlobalConfig.StoneOpenConfig[0].openLv;
	}

	public static ins(): UserForge {
		return super.ins() as UserForge;
	}

	public doForgeUpdata(bytes: GameByteArray): void {
		let roleId: number = bytes.readShort();
		let index: number = SubRoles.ins().getSubRoleByIndex(roleId).parseForgeChange(bytes, this.sysId);
		this.postForgeUpdate(this.sysId, index);
		// this.seekForgeItem();
	}

	/**派发锻造数据变更 */
	public postForgeUpdate(sysid: number, index: number = 0): number[] {
		return [sysid, index];
	}

	/**派发锻造提示 */
	public postForgeTips(b: boolean): number {
		return b ? 1 : 0;
	}

	/**
	 * 提升请求
	 * @param roleId 角色
	 * @param pos 部位
	 */
	public sendUpGrade(roleId: number, pos: number): void {
		let bytes: GameByteArray = this.getBytes(2);
		bytes.writeShort(roleId);
		bytes.writeShort(pos);
		this.sendToServer(bytes);
	}

	private delaySeekItem() {
		if (!TimerManager.ins().isExists(this.seekForgeItem, this)) TimerManager.ins().doTimer(60, 1, this.seekForgeItem, this);
	}


	private seekForgeItem(): void {
		let isReturn: boolean = false;
		let len: number = UserBag.ins().getBagItemNum(0);
		for (let i: number = 0; i < len; i++) {
			let item: ItemData = UserBag.ins().getBagGoodsByIndex(0, i);
			switch (item.itemConfig.id) {
				case 200002://强化石
					isReturn = this.forgeHint(0, item.count);
					break;
				case 200003://
					isReturn = this.forgeHint(ForgeWin.Page_Select_ZhuLing, item.count);
					break;
			}
			if (isReturn) break;
		}

		if (!isReturn) {//精炼石
			isReturn = this.forgeHint(ForgeWin.Page_Select_Gem, Actor.soul);
		}

		if( !isReturn ) {//兵魂
			for (let roleIndex: number = 0; roleIndex < SubRoles.ins().subRolesLen; roleIndex++) {
				isReturn = Weapons.ins().checkRedPoint(roleIndex)
				if( isReturn )
					break;
			}
		}
		this.postForgeTips(isReturn);
	}

	//----------------------------------------------------
	/**
	 * 通过部位等级 获取锻造相关配置  0 强化配置 1注灵配置  2 宝石配置 3 突破配置
	 * @param pos 部位
	 * @param lv  等级
	 * @param configType 配置类型
	 */
	public getForgeConfigByPos(pos: number, lv: number, configType: number):
		EnhanceAttrConfig
		| StoneLevelConfig
		| ZhulingAttrConfig
		| TupoAttrConfig {
		let config = this.getForgeConfig(configType);
		return config[pos] && config[pos][lv];
	}

	//key1:posId key2:level
	private forgeConfigDic:{[key:number]:any};
	private getForgeConfig(configType) {
		this.forgeConfigDic = this.forgeConfigDic || {};

		if (!this.forgeConfigDic[configType]) {
			let list: EnhanceAttrConfig[] | StoneLevelConfig[] | ZhulingAttrConfig[] | TupoAttrConfig[];
			switch (configType) {
				case ForgeWin.Page_Select_Boost:
					list = GlobalConfig.EnhanceAttrConfig;
					break;
				case ForgeWin.Page_Select_ZhuLing:
					list = GlobalConfig.ZhulingAttrConfig;
					break;
				case ForgeWin.Page_Select_Gem:
					list = GlobalConfig.StoneLevelConfig;
					break;
				case 3:
					// list = GlobalConfig.TupoAttrConfig;
					break;
			}

			let config = this.forgeConfigDic[configType] = {} as any;
			for (let index in list) {
				let conf = list[index];
				if (!config[conf.posId]) {
					config[conf.posId] = {};
				}
				config[conf.posId][conf.level] = list[index];
			}
		}
		return this.forgeConfigDic[configType];
	}

	/**
	 * 通过等级获取强化消耗配置
	 * @param lv 等级
	 */
	public getEnhanceCostConfigByLv(lv: number): EnhanceCostConfig {
		let list: EnhanceCostConfig[] = GlobalConfig.EnhanceCostConfig;
		return list[lv];
		// let index: any;
		// for (index in list) {
		// 	let config: EnhanceCostConfig = list[index];
		// 	if (config.level == lv)
		// 		return config;
		// }
		// return null;
	}

	/**
	 * 通过等级获取宝石消耗配置
	 * @param lv 等级
	 */
	public getStoneLevelCostConfigByLv(lv: number): StoneLevelCostConfig {
		let list: StoneLevelCostConfig[] = GlobalConfig.StoneLevelCostConfig;
		let index: any;
		for (index in list) {
			let config: StoneLevelCostConfig = list[index];
			if (config.level == lv)
				return config;
		}
		return null;
	}

	/**
	 * 通过等级获取注灵消耗配置
	 * @param lv 等级
	 */
	public getZhulingCostConfigByLv(lv: number): ZhulingCostConfig {
		let list: ZhulingCostConfig[] = GlobalConfig.ZhulingCostConfig;
		let index: any;
		for (index in list) {
			let config: ZhulingCostConfig = list[index];
			if (config.level == lv)
				return config;
		}
		return null;
	}

	/**
	 * 判断精炼是否可以提升
	 */
	public jingLianCanUp(): boolean {
		let len: number = SubRoles.ins().subRolesLen;
		let b: boolean = false;
		for (let roleIndex: number = 0; roleIndex < len; roleIndex++) {
			let role: Role = SubRoles.ins().getSubRoleByIndex(roleIndex);
			let index: number = role.getMinEquipIndexByType(1);
			let lv: number = role.getEquipByIndex(index).zhuling;
			let costNum: number = UserForge.ins().getZhulingCostConfigByLv(lv + 1).count;
			if (costNum) {
				let goodId: number = UserForge.ins().getZhulingCostConfigByLv(lv + 1).itemId;
				let goodsNum: number = UserBag.ins().getBagGoodsCountById(0, goodId);
				if (goodsNum >= costNum) {
					b = true;
					break;
				}
			}
		}
		return b;
	}

	/**
	 * 通过等级获取突破消耗配置
	 * @param lv 等级
	 */
	public getTupoCostConfigByLv(lv: number): TupoCostConfig {
		// let list: TupoCostConfig[] = GlobalConfig.TupoCostConfig;
		// let index: any;
		// for (index in list) {
		// 	let config: TupoCostConfig = list[index];
		// 	if (config.level == lv)
		// 		return config;
		// }
		return null;
	}

	//	public getForgeIsBoost(num:number):boolean{
	//		let config: EnhanceCostConfig = this.getEnhanceCostConfigByLv(LogicManager.ins().rolesModel[]);
	//		return;
	//	}

	//----------------------------------锻造提示

	public forgeHint(type: number, itemNum: number): boolean {
		let len: number = SubRoles.ins().subRolesLen;
		for (let i: number = 0; i < len; i++) {
			let role: Role = SubRoles.ins().getSubRoleByIndex(i);
			let index: number = role.getMinEquipIndexByType(type);
			let lv: number = this.getForgeLv(type, role, index);
			let costNum: number = this.getForgeCount(type, lv);
			if (costNum) {
				if (itemNum >= costNum) {
					if (type != ForgeWin.Page_Select_Gem) {
						UserForge.ins().postForgeTips(true);
						return true;
					} else {
						//锻造额外条件 >=25
						if (Actor.level >= UserForge.CONDITION_ZHUZAO) {
							UserForge.ins().postForgeTips(true);
							return true;
						}
					}
				}
			}
		}
		UserForge.ins().postForgeTips(false);
		return false;
	}


	private getForgeLv(type: number, role: Role, index: number): number {
		switch (type) {
			case ForgeWin.Page_Select_Boost:
				return role.getEquipByIndex(index).strengthen;
			case ForgeWin.Page_Select_ZhuLing:
				return role.getEquipByIndex(index).zhuling;
			case ForgeWin.Page_Select_Gem:
				return role.getEquipByIndex(index).gem;
			case 3:
				return role.getEquipByIndex(index).tupo;
		}
	}

	private getForgeCount(type: number, lv: number): number {
		switch (type) {
			case ForgeWin.Page_Select_Boost:
				let boostConfig: EnhanceCostConfig = this.getEnhanceCostConfigByLv(lv + 1);
				if (boostConfig)
					return boostConfig.stoneNum;
				break;
			case ForgeWin.Page_Select_ZhuLing:
				let zhulingConfig: ZhulingCostConfig = this.getZhulingCostConfigByLv(lv + 1);
				if (zhulingConfig)
					return zhulingConfig.count;
				break;
			case ForgeWin.Page_Select_Gem:
				let gemConfig: StoneLevelCostConfig = this.getStoneLevelCostConfigByLv(lv + 1);
				if (gemConfig)
					return gemConfig.soulNum;
				break;
			case 3:
				let tupoConfig: TupoCostConfig = this.getTupoCostConfigByLv(lv + 1);
				if (tupoConfig)
					return tupoConfig.count;
				break;
		}
		return 0;
	}

	public countAllBoostAttr(roleId: number, type: number, pos: number = 0, next = false): AttributeData[] {
		let attrList: AttributeData[] = [];
		let roleData: Role = SubRoles.ins().getSubRoleByIndex(roleId);
		for (let i: number = 0; i < UserEquip.FOEGE_MAX; i++) {
			let cfg: EnhanceAttrConfig | StoneLevelConfig | ZhulingAttrConfig | TupoAttrConfig = null;
			let level: number = this.getForgeLv(type, roleData, i);//equipData[i].strengthen;
			if (next && pos == i) {
				level += 1;
			}
			cfg = UserForge.ins().getForgeConfigByPos(i, level, type);
			if (cfg && cfg.attr) {
				attrList = UserForge.AttrAddition(cfg.attr, attrList);
			}
		}
		return attrList;
	}
	public isMaxForge(role:Role,index:number){
		for( let i = 0;i < 8;i++ ){
			let level: number = this.getForgeLv(index,role,index);
			let nextConfig = UserForge.ins().getForgeConfigByPos(index, level + 1, index);
			if( !nextConfig )
				return false;
		}
		return true;

	}

	//把第一个数组压到第二个数组
	static AttrAddition(attr1: AttributeData[], attr2: AttributeData[]): AttributeData[] {
		let len1: number = attr1.length;
		let len2: number = attr2.length;
		let attrList: AttributeData[] = [];
		let attr: AttributeData;
		for (let i: number = 0; i < len1; i++) {
			attr = AttributeData.copyAttrbute(attr1[i]);
			attrList.push(attr);
		}
		for (let k: number = 0; k < len2; k++) {
			let flag: boolean = false;
			for (let i: number = 0; i < attrList.length; i++) {
				if (attr2[k].type == attrList[i].type) {
					attrList[i].value = attrList[i].value + attr2[k].value;
					flag = true;
				}
			}
			if (!flag) {
				attr = AttributeData.copyAttrbute(attr2[k]);
				attrList.push(attr);
			}
		}
		return attrList;
	}
	/**
	 * 熔炼道具
	 * 7-5
	 *  @param array 道具列表
	 * */
	public sendMeltItem(arr:ItemData[]){
		let bytes: GameByteArray = this.getBytes(5);
		bytes.writeShort(arr.length);
		for( let i in arr ){
			bytes.writeInt(arr[i].configID);
			bytes.writeInt(arr[i].count);//目前发道具全数 以后有需求要改成非全数这里要做调整
		}
		this.sendToServer(bytes);
	}
	/**
	 * 熔炼道具
	 * (有返回代表熔炼成功)
	 * 7-5
	 * */
	public postMeltItem(){
		//派发给客户端各个系统刷新熔炉链表
	}
	//--------------------------------------
}

namespace GameSystem {
	export let userforge = UserForge.ins.bind(UserForge);
}