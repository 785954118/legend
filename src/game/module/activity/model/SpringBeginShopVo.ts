/**
 *立春活动VO
 * @author wanghengshuai
 */
class SpringBeginShopVo {

	public id: number;

	public itemID: number;

	public itemCount: number;

	public price: number;

	public discount: number = 0;

	//1已被购买过，0未被购买过
	public state: number;

	public score: number;

	public buyCount: number;

	public buyMax: number;

	public materialNum: number;

	public constructor() {
	}

	public parser(bytes: GameByteArray): void {
		this.id = bytes.readInt();
		this.itemID = bytes.readInt();
		this.itemCount = bytes.readShort();
		this.price = bytes.readInt();
		this.discount = bytes.readByte();
		this.state = bytes.readByte();
		// this.buyCount = bytes.readByte();
		// this.buyMax = bytes.readByte();
		// this.materialNum = bytes.readShort();
	}

	/**
	 * 积分
	 */
	public parser2(bytes: GameByteArray): void {
		this.id = bytes.readInt();
		this.itemID = bytes.readInt();
		this.itemCount = bytes.readShort();
		this.score = bytes.readInt();
	}

	/**
	 * 限制商品
	 */
	public parser3(bytes: GameByteArray): void {
		this.itemID = bytes.readInt();
		this.buyCount = bytes.readByte();
		this.buyMax = bytes.readByte();
	}

}