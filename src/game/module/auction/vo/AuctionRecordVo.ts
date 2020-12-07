/**
 * Created by wanghengshuai on 2018/3/7.
 * 拍卖行记录数据
 */
class AuctionRecordVo {

	public aId: number;

	public roleName: string;

	/** 0=流拍  1=竞拍价成交  2=一口价成交 */
	public state: number;

	public price: number;

	public time: number;

	/** 0 公会 1 全服 */
	public type: number = 0;

	public constructor(bytes: GameByteArray) {
		this.parser(bytes);
	}

	public parser(bytes: GameByteArray): void {
		this.aId = bytes.readInt();
		this.roleName = bytes.readString();
		this.state = bytes.readByte();
		this.price = bytes.readInt();
		this.time = bytes.readInt();
	}

}