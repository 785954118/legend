/**
 * 跨服竞技场排行
 */
class KfArenaRankPanel extends BaseEuiView {
	/**我的排名*/
	public selfPos0: eui.Label;
	/**我的排名三个角色*/
	public rank1: RoleItemRenderer;
	public rank2: RoleItemRenderer;
	public rank0: RoleItemRenderer;
	/**排名列表*/
	public list: eui.List;
	/**暂无人上榜*/
	public state: eui.Label;

	////////////第一名相关组件////////////////////////////
	public firstGroup: eui.Group;
	public reward0: ItemBase;
	public serverId0: eui.Label;
	public vip0: eui.Image;
	public firstNameTxt0: eui.Label;
	public score0: eui.Label;
	public seasonTitle0: eui.Label;

	/**排行数据*/
	private rankDatas: eui.ArrayCollection;

	constructor() {
		super();
		this.name = `排行`;
	}

	protected childrenCreated() {
		this.list.itemRenderer = KfArenaRankItemRender;
		this.rankDatas = new eui.ArrayCollection();
		this.list.dataProvider = this.rankDatas;

		this.rank0.index = 0;
		this.rank1.index = 1;
		this.rank2.index = 2;

		this.firstGroup.visible = false;
		this.state.visible = true;

		this.serverId0.text = ``;
		this.vip0.visible = false;
		this.firstNameTxt0.text = "";
		this.score0.text = "";
		this.seasonTitle0.text = "";

	}

	public open(...args): void {
		this.observe(KfArenaSys.ins().postRank, this.upData);
		this.observe(UserReadPlayer.ins().postPlayerResult, this.openOtherPlayer);
		KfArenaSys.ins().sendRank();
	}


	private upData(): void {
		let firstData: KfArenaRankData = KfArenaSys.ins().rankDataList.shift();
		this.rankDatas.replaceAll(KfArenaSys.ins().rankDataList);
		this.selfPos0.text = KfArenaSys.ins().ownRank;

		if (!firstData)return;
		//第一名数据
		this.firstGroup.visible = true;
		this.state.visible = false;
		this.reward0.data = GlobalConfig.CrossArenaBase.rankAward[firstData.rank].mail.tAwardList[0];
		let serverName = window['getServerName'](firstData.servId)
		this.serverId0.text = `[${serverName}]`;
		this.vip0.visible = firstData.vip > 0;
		this.firstNameTxt0.text = firstData.playerName;
		this.score0.text = firstData.score + "";
		this.seasonTitle0.text = KfArenaSys.ins().duanName[firstData.dan];

		UserReadPlayer.ins().sendFindPlayer(firstData.playerId, firstData.servId);
	}

	private openOtherPlayer(otherPlayerData: OtherPlayerData): void {
		this.rank0.data = {otherPlayerData: otherPlayerData};
		this.rank1.data = {otherPlayerData: otherPlayerData};
		this.rank2.data = {otherPlayerData: otherPlayerData};
	}

}
