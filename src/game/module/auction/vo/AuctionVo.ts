/**
 * Created by wanghengshuai on 2018/3/5.
 *    拍卖行物品信息
 */
class AuctionVo {
	/**  0=公会拍卖 1=全服拍卖 */
	public type: number;

	public endTime: number;

	public id: number;

	public putAwayTime: number;

	/** 拍卖ID */
	public aID: number;

	/** 竞拍次数 */
	public auctionTimes: number;

	/** 我的竞价 0否  1是*/
	public myAuPrice: number;

	/** 0无  1我的  2公会 */
	public owner: number;

	constructor(bytes: GameByteArray) {
		this.parser(bytes);
	}

	public parser(bytes: GameByteArray): void {
		this.type = bytes.readByte();
		this.endTime = bytes.readInt();
		this.id = bytes.readInt();
		this.putAwayTime = bytes.readInt();
		this.aID = bytes.readInt();
		this.auctionTimes = bytes.readByte();
		this.myAuPrice = bytes.readByte();
		this.owner = bytes.readByte();
	}
}