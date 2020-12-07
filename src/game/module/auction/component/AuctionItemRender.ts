/**
 * Created by wanghengshuai on 2018/3/6.
 *拍卖列表项
 */
class AuctionItemRender extends BaseItemRender {

	private STATE_SHOW: number = 0;

	private STATE_AUCTION: number = 1;

	private STATE_END: number = 2;

	public bg: eui.Image;
	public labelMy: eui.Image;
	public labelStudy: eui.Image;
	public jingjiazhong: eui.Label;
	public auctionTime: eui.Label;
	public showTime: eui.Label;
	public my: eui.Label;
	public zb1: eui.Label;
	public btn1: eui.Group;
	public yikoujia: eui.Button;
	public zb0: eui.Label;
	public btnText1: eui.Label;
	public btn2: eui.Group;
	public yikoujia0: eui.Button;
	public jingjia: eui.Label;
	public btnText2: eui.Label;
	public item: ItemBase;

	private price: number;

	private price2: number;

	private isYiKouJia: boolean;

	private state: number = 0;

	private leftTime: number = 0;

	private openedWard: boolean;

	public constructor() {
		super();
	}

	protected childrenCreated(): void {
		super.childrenCreated();
	}

	public dataChanged(): void {
		//AuctionVo
		let vo: AuctionVo = this.data;
		let cfg: AuctionItem = GlobalConfig.AuctionItem[vo.aID];
		if (!cfg)
			return;

		this.item.data = cfg.item;
		this.price = cfg.buy;
		this.price2 = cfg.bid + Math.floor(cfg.bid * vo.auctionTimes * GlobalConfig.AuctionConfig.priceIncrease / 10000);
		this.btn1.visible = cfg.buy > 0;
		this.zb0.text = this.price + "";
		this.jingjia.text = this.price2 + "";
		this.labelMy.visible = vo.owner > 0;
		this.labelMy.source = vo.owner ? (vo.owner == 1 ? `labelMy` : `labelGuild`) : "";

		this.zb1.text = (cfg.bid + Math.floor(cfg.bid * (vo.auctionTimes > 0 ? vo.auctionTimes - 1 : 0) * GlobalConfig.AuctionConfig.priceIncrease / 10000)) + "";

		if (!this.hasEventListener(egret.TouchEvent.REMOVED_FROM_STAGE))
			this.addEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.onRemove, this);

		if (!this.hasEventListener(egret.TouchEvent.TOUCH_TAP))
			this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);

		this.checkTime();

		if (this.openedWard)
			this.showWarn();
	}

	private showWarn(): void {
		WarnWin.show(`是否花费|C:${0x20cb30}&T:${this.isYiKouJia ? this.price : this.price2}|元宝${this.isYiKouJia ? `立即拍下商品` : `参与竞拍`}`, this.onAuction.bind(this), this, this.onAuction2.bind(this), this);
	}

	private checkTime(): void {
		//倒计时
		TimerManager.ins().removeAll(this);

		let vo: AuctionVo = this.data;
		let endTime: number = DateUtils.formatMiniDateTime(vo.endTime);
		let serverTime: number = GameServer.serverTime;
		let putAwayTime: number = DateUtils.formatMiniDateTime(vo.putAwayTime);
		this.leftTime = 0;
		this.showTime.textColor = 0xFF0000;
		if (serverTime >= endTime) {
			this.state = this.STATE_END;
			this.showTime.text = "00:00:00";
			Auction.ins().deleteVo(vo);
			Auction.ins().postUpdate();
		}
		else if (Math.floor((serverTime - putAwayTime) / 1000) < (vo.type ? GlobalConfig.AuctionConfig.globalShowTime : GlobalConfig.AuctionConfig.guildShowTime)) {
			this.state = this.STATE_SHOW;
			this.showTime.textColor = 0xFFD93F;
			this.leftTime = (vo.type ? GlobalConfig.AuctionConfig.globalShowTime : GlobalConfig.AuctionConfig.guildShowTime) - Math.floor((serverTime - putAwayTime) / 1000);
		}
		else {
			this.state = this.STATE_AUCTION;
			this.showTime.textColor = 0x00FF00;
			this.leftTime = Math.floor((endTime - serverTime) / 1000);
		}

		if (this.leftTime) {
			this.repeat();
			TimerManager.ins().doTimer(1000, 0, this.repeat, this);
		}

		this.jingjiazhong.visible = vo.auctionTimes > 0;
		this.jingjiazhong.textFlow = TextFlowMaker.generateTextFlow(`|C:${vo.myAuPrice ? 0xFFD93F : 0x20CB30}&T:${vo.myAuPrice ? `我的竞价` : `竞价中`}`)
	}

	private repeat(): void {
		this.showTime.text = DateUtils.getFormatBySecond(this.leftTime, DateUtils.TIME_FORMAT_12) + (this.state == this.STATE_SHOW ? `后开始` : `后结束`);
		if (this.state == this.STATE_AUCTION && this.leftTime <= GlobalConfig.AuctionConfig.rushTime && this.showTime.textColor != 0xFF0000)
			this.showTime.textColor = 0xFF0000;

		if (this.leftTime <= 0) {
			this.checkTime();
			return;
		}
		this.leftTime--;
	}

	private onRemove(): void {
		this.removeEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.onRemove, this);
		this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
		TimerManager.ins().removeAll(this);
		this.openedWard = false;
	}

	private onTouch(e: egret.TouchEvent): void {
		switch (e.target) {
			case this.yikoujia:
			case this.yikoujia0:
				if (this.state == this.STATE_END) {
					UserTips.ins().showTips(`物品拍卖结束`);
					return;
				}
				else if (this.state == this.STATE_SHOW) {
					UserTips.ins().showTips(`物品展示时间`);
					return;
				}

				this.openedWard = true;
				this.isYiKouJia = e.target == this.yikoujia;
				this.showWarn();
				break;
		}
	}

	private onAuction(): void {
		this.openedWard = false;

		if (Actor.yb < (this.isYiKouJia ? this.price : this.price2)) {
			this.noMoney();
			return;
		}

		let vo: AuctionVo = this.data;
		if (this.isYiKouJia)
			Auction.ins().sendBuy(vo.id, vo.type);
		else
			Auction.ins().sendAUction(vo.id, vo.type, vo.auctionTimes + 1);
	}

	@callDelay(150)
	private noMoney(): void {
		UserTips.ins().showTips("|C:0xf3311e&T:元宝不足|");
	}

	private onAuction2(): void {
		this.openedWard = false;
	}

}