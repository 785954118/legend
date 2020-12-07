/**
 * Created by wanghengshuai on 2018/3/6.
 *    拍卖行记录子项
 */
class AuctionRecordItemRender extends BaseItemRender {

	public bg: eui.Image;
	public text2: eui.Label;
	public text1: eui.Label;
	public successTime: eui.Label;
	public playerName: eui.Label;
	public price: eui.Label;
	public item: ItemBase;

	public constructor() {
		super();
	}

	protected childrenCreated(): void {
		super.childrenCreated();
	}

	public dataChanged(): void {
		//AuctionRecordVo
		let vo: AuctionRecordVo = this.data;
		let cfg: AuctionItem = GlobalConfig.AuctionItem[vo.aId];
		this.item.data = cfg.item;
		this.playerName.text = vo.roleName;
		this.price.text = vo.price + "";
		this.successTime.text = DateUtils.getFormatBySecond(Math.floor(DateUtils.formatMiniDateTime(vo.time) / 1000), DateUtils.TIME_FORMAT_15);
		this.text1.text = vo.state ? (vo.state == 1 ? `竞拍价成交` : `一口价成交`) : (vo.type == 0 ? `流拍到全服` : `流拍`);
	}
}