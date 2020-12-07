//时装类型
enum DressType {
	ROLE = 1,
	ARM = 2,
	WING = 3,
}
enum DressTypeName{
	"",
	"角色",
	"武器",
	"翅膀",
}
class Dress extends BaseSystem {
	public timeInfo: {[id:number] : DressTimeInfo} = {};//拥有的装扮数据
	public posInfo: DressPosInfo[] = [];//穿戴的装扮信息

	public constructor() {
		super();
		this.sysId = PackageID.Dress;
		this.regNetMsg(1, this.doDressInfo);//装扮返回信息
		this.regNetMsg(2, this.doDressActivationRes);//激活装扮返回信息
		this.regNetMsg(3, this.doDressUserRes);//使用装扮返回信息
		this.regNetMsg(4, this.doUnDressUserRes);//脱装扮返回信息
		this.regNetMsg(5, this.doDressTimeEnd);//装扮失效
		this.regNetMsg(6, this.postLevelUp);//装扮升级返回
		this.regNetMsg(7, this.postAddTime);//续期返回
	}

	static ins():Dress {
		return super.ins() as Dress;
	}

	/**
	 * 请求装扮信息
	 * 44-1
	 */
	public sendDressInfoReq(): void {
		this.sendBaseProto(1);
	}

	private doDressInfo(bytes: GameByteArray): void {
		this.parser(bytes);
		Dress.ins().postDressInfo();
	}

	/**
	 * 请求激活装扮
	 * 44-2
	 */
	public sendDressActivationReq(dressid: number): void {
		let bytes: GameByteArray = this.getBytes(2);
		bytes.writeInt(dressid);
		this.sendToServer(bytes);
	}

	private doDressActivationRes(bytes: GameByteArray): void {
		this.parserAct(bytes);
		Dress.ins().postJiHuo();
		UserTips.ins().showTips("|C:0xffffff&T:激活装扮形象成功|");
	}

	/**
	 * 请求穿戴
	 * 44-3
	 */
	public sendDressUserReq(roid: number, dressid: number): void {
		let bytes: GameByteArray = this.getBytes(3);
		bytes.writeByte(roid);
		bytes.writeInt(dressid);
		this.sendToServer(bytes);
	}

	private doDressUserRes(bytes: GameByteArray): void {
		this.parserDress(bytes);
		Dress.ins().postDressInfo();
		UserTips.ins().showTips("|C:0xffffff&T:幻化形象成功|");
	}

	/**
	 * 请求脱下
	 * 44-4
	 */
	public sendUnDressUserReq(roid: number, dressid: number): void {
		let bytes: GameByteArray = this.getBytes(4);
		bytes.writeByte(roid);
		bytes.writeInt(dressid);
		this.sendToServer(bytes);
	}

	private doUnDressUserRes(bytes: GameByteArray): void {
		this.parserDress(bytes);
		Dress.ins().postDressInfo();
		UserTips.ins().showTips("|C:0xffffff&T:取消幻化形象成功|");
	}

	private doDressTimeEnd(bytes: GameByteArray): void {
		this.parserDel(bytes);
		Dress.ins().postDressInfo();
	}

	//玩家装扮信息
	parser(bytes: GameByteArray): void {
		let num: number = bytes.readInt();
		this.timeInfo = {};
		for (let i: number = 0; i < num; i++) {
			let time: DressTimeInfo = new DressTimeInfo();
			time.dressId = bytes.readInt();
			time.invalidtime = bytes.readInt();
			time.lv = bytes.readInt();
			this.timeInfo[time.dressId] = time;
		}
		num = bytes.readByte();
		this.posInfo = [];
		for (let i = 0; i < num; i++) {
			let pos: DressPosInfo = new DressPosInfo();
			for (let k: number = 0; k < 3; k++) {
				pos.posAry[k] = bytes.readInt();
			}
			this.posInfo.push(pos);
		}
	}

	//激活装扮信息
	parserAct(bytes: GameByteArray): void {
		let info: DressTimeInfo = new DressTimeInfo();
		info.dressId = bytes.readInt();
		info.invalidtime = bytes.readInt();
		info.lv = bytes.readInt();
		this.timeInfo[info.dressId] = info;
	}

	//装扮更改返回
	public parserDress(bytes: GameByteArray): void {
		let index = bytes.readByte();
		let posinfo: DressPosInfo = this.posInfo[index];
		let pos: number = bytes.readByte();
		let item: number = bytes.readInt();
		if (posinfo) {
			posinfo.posAry[pos - 1] = item;
		}

		let role = SubRoles.ins().getSubRoleByIndex(index);
		role.zhuangbei[pos - 1] = item;
		if (pos == 1 || pos == 2)
			UserEquip.ins().postEquipChange();
		else
			Dress.ins().postChangeWing();

		let mainRole = EntityManager.ins().getEntityByHandle(role.handle);
		//换装备的时候可能子角色 已死亡
		if (mainRole)
			mainRole.updateModel();
	}

	//装扮时间到了
	public parserDel(bytes: GameByteArray): void {
		let id: number = bytes.readInt();
		delete this.timeInfo[id];

		for (let i = 0; i < this.posInfo.length; i++) {
			let pos: DressPosInfo = this.posInfo[i];
			for (let k: number = 0; k < 3; k++) {
				if (pos.posAry[k] == id) {
					pos.posAry[k] = 0;
					// pos.posAry.splice(k, 1);
					let role = SubRoles.ins().getSubRoleByIndex(i);
					role.zhuangbei[k] = 0;
					if (k == 0 || k == 1)
						UserEquip.ins().postEquipChange();
					else
						Dress.ins().postChangeWing();
					let mainRole = EntityManager.ins().getEntityByHandle(role.handle);
					//换装备的时候可能子角色 已死亡
					if (mainRole)
						mainRole.updateModel();
					break;
				}
			}
		}
	}

	public getModelPosId(curRole: number): DressPosInfo {
		return this.posInfo[curRole];
	}

	//是否显示红点
	public redPoint(): boolean {
		return this.careerRedPoint();
	}

	//各个职业是否有可以激活的时装
	public careerRedPoint(): boolean {
		for (let i: number = 0; i < SubRoles.ins().subRolesLen; i++) {
			let career: number = SubRoles.ins().getSubRoleByIndex(i).job;
			let zbs = this.getIdByCareer(career);
			for (let pos in zbs) {
				let zhuangban = zbs[pos];
				for (let element of zhuangban) {
					if (this.redPointDress(element.id)) {
						return true;
					}
				}
			}
		}
		return false;
	}

	// 某个职业是否有可以激活的时装
	public curRoleRedPoint(roleId: number): boolean {
		return this.roleRedPoint()[roleId];
	}

	public roleRedPoint(): boolean[] {
		let boolList: boolean[] = [false, false, false];
		let length: number = SubRoles.ins().subRolesLen
		for (let i: number = 0; i < length; i++) {
			let career: number = SubRoles.ins().getSubRoleByIndex(i).job;
			let zbs = this.getIdByCareer(career);
			for (let pos in zbs) {
				let zhuangban = zbs[pos];
				for (let element of zhuangban) {
					if (this.redPointDress(element.id)) {
						boolList[i] = true;
						break;
					}
				}
				if(boolList[i]) break;
			}
		}
		return boolList;
	}

	/**
	 * 获得是否可激活时装
	 * @job 职业
	 * @pos 时装类型
	 */
	public canDress(job: number, pos: DressType): boolean {
		if (pos == DressType.WING && Actor.level <= 16)
			return false;

		let arrZB = this.getIdByCareer(job)[pos];
		for (let k in arrZB) {
			if (this.redPointDress(arrZB[k].id)) {
				return true;
			}
		}

		return false;
	}

	//部位有可以激活的时装
	public posRedPoint(): boolean[] {
		let ret: boolean[] = [false, false, false];
		let length: number = SubRoles.ins().subRolesLen
		for (let j: number = 0; j < length; j++) {
			let career: number = SubRoles.ins().getSubRoleByIndex(j).job;
			let zbs = this.getIdByCareer(career);
			for (let i = 0; i < 3; i++) {
				if(ret[i]) continue;

				let configs = zbs[i+1];
				for (let conf of configs) {
					if(this.redPointDress(conf.id)) {
						ret[i] = true;
						break;
					}
				}
			}
		}
		return ret;
	}

	private careerDic:{[career:number]:{[pos:number]:ZhuangBanId[]}} = {};
	private itemIdDic:{[itemId:number]:ZhuangBanId[]} = {};

	private getIdByCareer(career:number):{[pos:number]:ZhuangBanId[]} {
		if(this.careerDic[career]) return this.careerDic[career];
		this.initConfig();
		return this.careerDic[career];
	}

	private getIdByItemId(itemId):ZhuangBanId[] {
		if (this.itemIdDic[itemId]) return this.itemIdDic[itemId];
		this.initConfig();
		return this.itemIdDic[itemId];
	}

	private initConfig() {
		if(Object.keys(this.itemIdDic).length) return;

		let ZBConfig = GlobalConfig.ZhuangBanId;
		for (let k in ZBConfig) {
			let config = ZBConfig[k];
			let roleType = config.roletype;
			let pos = config.pos;
			this.careerDic[roleType] = this.careerDic[roleType] || {};
			this.careerDic[roleType][pos] = this.careerDic[roleType][pos] || [];
			this.careerDic[roleType][pos].push(config);

			let itemId = config.cost.itemId;
			this.itemIdDic[itemId] = this.itemIdDic[itemId] || [];
			this.itemIdDic[itemId].push(config);
		}
	}

	//当前时装是否显示红点
	public redPointDress(id:number) {
		let config = GlobalConfig.ZhuangBanId[id];
		if (config.pos == DressType.WING && Actor.level <= 16)
			return false;

		let itemId = config.cost.itemId;
		let num = UserBag.ins().getBagGoodsCountById(0, itemId);
		if (num == 0) return false;

		if (!this.timeInfo[id]) {
			if (num >= config.cost.num)
				return true;
		} else {
			let arrIds = this.getIdByItemId(itemId);
			for (let conf of arrIds) {
				if (conf.id != id) {
					//有一个需要当前道具激活的，但该时装未激活则不显示红点
					if(!this.timeInfo[conf.id])
						return false;
				}
			}

			let nextlv = this.timeInfo[id].lv + 1;
			let zblu = GlobalConfig.ZhuangBanLevelUp[id];
			if (zblu && zblu[nextlv] && zblu[nextlv].cost.num <= num) {
				return true; //可升级
			}
		}
		return false;
	}
	public getIdZhuangBanId(itemId: number): number{
		let allData = GlobalConfig.ZhuangBanId;
		for (let key in allData) {
			let element = allData[key];
			if(element.cost.itemId == itemId){
				return itemId;
			}
		}
		return 0;
	}


	//请求升级
	//44-6
	public sendLevelUp(id:number) {
		let bytes = this.getBytes(6);
		bytes.writeInt(id);
		this.sendToServer(bytes);
	}

	//升级返回
	//44-6
	public postLevelUp(bytes:GameByteArray) {
		let id = bytes.readInt();
		let time = bytes.readInt();
		let lv = bytes.readInt();

		let info = this.timeInfo[id]
		info.invalidtime = time;
		info.lv = lv;

		this.postDressInfo();
	}

	//请求续期
	//44-7
	public sendAddTime(id:number) {
		let bytes = this.getBytes(7);
		bytes.writeInt(id);
		this.sendToServer(bytes);
	}

	//续期返回
	//44-7
	public postAddTime(bytes:GameByteArray) {
		let id = bytes.readInt();
		let time = bytes.readInt();
		let lv = bytes.readInt();

		let info = this.timeInfo[id] || new DressTimeInfo()
		info.invalidtime = time;
		info.lv = lv;
		info.dressId = id;

		this.timeInfo[id] = info;
	}

	///////////////////////////////////////////////////派发消息/////////////////////////////////////////////////////
	/*派发时装变更信息*/
	public postDressInfo(): void {
	}

	/*派发时装激活*/
	public postJiHuo(): void {
	}

	/*派发翅膀改变*/
	public postChangeWing(): void {
	}

}
namespace GameSystem {
	export let dress = Dress.ins.bind(Dress);
}