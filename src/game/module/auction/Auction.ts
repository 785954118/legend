/**
 * Created by wanghengshuai on 2018/3/5.
 *    拍卖行数据
 */
class Auction extends BaseSystem {

	/** 公会拍卖数据 */
	private auGuildDatas: AuctionVo[];

	/** 全服拍卖数据 */
	private auServerDatas: AuctionVo[];

	public constructor() {
		super();

		this.sysId = PackageID.Auction;
		this.regNetMsg(1, this.postListData);
		this.regNetMsg(2, this.onOpenSuccess);
		this.regNetMsg(4, this.postAuctionResult);
		this.regNetMsg(5, this.postBuyResult);
		this.regNetMsg(6, this.postRecord);
		this.regNetMsg(7, this.noLimit);
	}

	public static ins(): Auction {
		return super.ins() as Auction;
	}

	protected initLogin(): void {
		this.sendGetList(0);
		this.sendGetList(1);
	}

	/** 获取物品列表
	 * 76 - 1
	 * @type 0 公会 1 全服
	 * */
	public sendGetList(type: number): void {
		let bytes: GameByteArray = this.getBytes(1);
		bytes.writeByte(type);
		this.sendToServer(bytes);
	}

	/**
	 * 获得物品列表
	 * 76 - 1
	 * */
	public postListData(bytes: GameByteArray): void {
		let type: number = bytes.readByte();
		let len: number = bytes.readInt();
		let list: AuctionVo[] = [];
		for (let i: number = 0; i < len; i++) {
			list.push(new AuctionVo(bytes));
		}

		if (list.length >= 2)
			list.sort(this.sort);

		if (type == 0)
			this.auGuildDatas = list;
		else
			this.auServerDatas = list;
	}

	private sort(a: AuctionVo, b: AuctionVo): number {
		if (a.putAwayTime > b.putAwayTime)
			return -1;

		if (a.putAwayTime < b.putAwayTime)
			return 1;

		return 0;
	}

	private sortByAuTime(a: AuctionRecordVo, b: AuctionRecordVo): number {
		if (a.time > b.time)
			return -1;

		if (a.time < b.time)
			return 1;

		return 0;
	}

	/**
	 * 请求打开拍卖盒
	 * 76-2
	 * */
	public sendOpenAuBox(id: number): void {
		let bytes: GameByteArray = this.getBytes(2);
		bytes.writeInt(id);
		this.sendToServer(bytes);
	}

	/**
	 * 成功打开拍卖盒
	 * 76-2
	 * @return { itemID: number, auID: number }
	 * */
	private onOpenSuccess(bytes: GameByteArray): void {
		ViewManager.ins().open(AuctionItemChoiceWin, bytes.readInt(), bytes.readInt());
	}

	/**
	 * 请求使用拍卖盒
	 * 76-3
	 * */
	public sendUseAuBox(type: number, id: number): void {
		let bytes: GameByteArray = this.getBytes(3);
		bytes.writeByte(type);
		bytes.writeInt(id);
		this.sendToServer(bytes);
	}

	/**
	 * 请求竞拍
	 * 76-4
	 * @param id 序列号, type 类型，auctionTimes 竞拍次数
	 * */
	public sendAUction(id: number, type: number, auctionTimes: number): void {
		let bytes: GameByteArray = this.getBytes(4);
		bytes.writeInt(id);
		bytes.writeByte(type);
		bytes.writeByte(auctionTimes);
		this.sendToServer(bytes);
	}

	/**
	 * 竞拍结果
	 * 76-4
	 * */
	public postAuctionResult(bytes: GameByteArray): void {
		let result: number = bytes.readByte();
		switch (result) {
			//成功
			case 0:
			case 1:
			case 2:
				let vo: AuctionVo = new AuctionVo(bytes);
				let itemVo: AuctionVo = this.getVoByID(vo.id);
				if (result == 1) {
					this.deleteVo(itemVo);
					UserTips.ins().showTips(`物品不存在`);
				}
				else {
					this.dateChanged(itemVo, vo);
					UserTips.ins().showTips(result == 0 ? `竞拍成功` : `商品信息已改变`);
				}
				break;
			case 3:
				UserTips.ins().showTips(`还在展示时间`);
				break;
			case 4:
				UserTips.ins().showTips(`活跃额度不足`);
				break;
		}


	}

	public deleteVo(itemVo: AuctionVo): void {
		if (this.auGuildDatas) {
			let index: number = this.auGuildDatas.indexOf(itemVo);
			if (index >= 0) {
				this.auGuildDatas.splice(index, 1);
				return;
			}
		}

		if (this.auServerDatas) {
			let index: number = this.auServerDatas.indexOf(itemVo);
			if (index >= 0)
				this.auServerDatas.splice(index, 1);
		}
	}

	/** 手动刷新数据(前端自己维护列表时用到) */
	public postUpdate(): void {

	}

	/**
	 * 根据序列号获得拍卖品
	 * @param id 序列号
	 * @return AuctionVo
	 * */
	public getVoByID(id: number): AuctionVo {
		return this.getVo(id, this.auGuildDatas) || this.getVo(id, this.auServerDatas);
	}

	private getVo(id: number, list: AuctionVo[]): AuctionVo {
		if (!list || list.length <= 0)
			return null;

		let len: number = list.length;
		for (let i: number = 0; i < len; i++) {
			if (list[i].id == id)
				return list[i];
		}

		return null;
	}

	/**
	 * 一口价
	 * 76-5
	 * */
	public sendBuy(id: number, type: number): void {
		let bytes: GameByteArray = this.getBytes(5);
		bytes.writeInt(id);
		bytes.writeByte(type);
		this.sendToServer(bytes);
	}

	/**
	 * 购买成功
	 * 76-5
	 * */
	public postBuyResult(bytes: GameByteArray): void {
		let result: number = bytes.readByte();
		switch (result) {
			//成功
			case 0:
			case 1:
			case 2:
				let vo: AuctionVo = new AuctionVo(bytes);
				let itemVo: AuctionVo = this.getVoByID(vo.id);
				if (result != 2) {
					this.deleteVo(itemVo);
					UserTips.ins().showTips(result == 1 ? `物品不存在` : `购买成功`);
				}
				else {
					this.dateChanged(itemVo, vo);
					UserTips.ins().showTips(`商品信息已改变`);
				}
				break;
			case 3:
				UserTips.ins().showTips(`还在展示时间`);
				break;
			case 4:
				UserTips.ins().showTips(`活跃额度不足`);
				break;
		}
	}

	private dateChanged(oldData: AuctionVo, newData: AuctionVo): void {
		if (oldData.type != newData.type) {
			this.deleteVo(oldData);
			if (newData.type == 0) {
				this.auGuildDatas.push(newData);
				if (this.auGuildDatas.length >= 2)
					this.auGuildDatas.sort(this.sort);
			}
			else {
				this.auServerDatas.push(newData);
				if (this.auServerDatas.length >= 2)
					this.auServerDatas.sort(this.sort);
			}
		}
		else {
			oldData.putAwayTime = newData.putAwayTime;
			oldData.endTime = newData.endTime;
			oldData.myAuPrice = newData.myAuPrice;
			oldData.auctionTimes = newData.auctionTimes;
			oldData.aID = newData.aID;
		}

	}

	/** 根据类型获得最大页数
	 * @type 0 公会 1 全服
	 * @count 每页数量
	 * */
	public getMaxPageByType(type: number, count: number): number {
		let datas: AuctionVo[] = type ? this.auServerDatas : this.auGuildDatas;
		if (!datas || !datas.length)
			return 1;

		return Math.ceil(datas.length / count);
	}

	/**
	 * 根据页数获得每页数据
	 * @type 0 公会 1 全服
	 *@page
	 * @count 每页数量
	 * */
	public getDataByPage(type: number, page, count: number): AuctionVo[] {
		let datas: AuctionVo[] = type ? this.auServerDatas : this.auGuildDatas;
		if (!datas || !datas.length)
			return null;

		let index: number = (page - 1) * count;
		return datas.slice(index, index + count);
	}

	/** 拍卖行是否开启 */
	public isAuctionOpen(): boolean {
		return UserZs.ins().lv >= GlobalConfig.AuctionConfig.openzhuanshenglv && (GameServer.serverOpenDay + 1) >= GlobalConfig.AuctionConfig.openserverday;
	}

	/**
	 * 获得拍卖纪录
	 *76-6
	 * @type 0 公会 1 全服
	 * */
	public sendRecord(type: number): void {
		let bytes: GameByteArray = this.getBytes(6);
		bytes.writeByte(type);
		this.sendToServer(bytes);
	}

	/**
	 * 拍卖纪录
	 * 76-6
	 * @return { type: number, list: AuctionRecordVo[] }
	 * */
	public postRecord(bytes: GameByteArray): { type: number, list: AuctionRecordVo[] } {
		let type: number = bytes.readByte();
		let len: number = bytes.readShort();
		let list: AuctionRecordVo[] = [];
		let vo: AuctionRecordVo;
		for (let i: number = 0; i < len; i++) {
			vo = new AuctionRecordVo(bytes);
			vo.type = type;
			list.push(vo);
		}

		if (list.length > 1)
			list.sort(this.sortByAuTime);

		return {type: type, list: list};
	}

	/**
	 * 额度不足
	 * 76 - 7
	 * */
	private noLimit(bytes: GameByteArray): void {
		ViewManager.ins().open(AuctionQuotaTipWin, bytes.readInt(), bytes.readInt());
	}

	/**
	 * 拍卖行红点
	 * */
	public checkRed(): boolean {
		return this.checkRedByType(0) || this.checkRedByType(1);
	}

	/**
	 * 根据类型显示红点
	 * 0公会 1 全服
	 * */
	public checkRedByType(type: number): boolean {
		let list: AuctionVo[] = type ? this.auServerDatas : this.auGuildDatas;
		return list && list.length > 0;
	}

}

namespace GameSystem {
	export let auction = Auction.ins.bind(Auction);
}