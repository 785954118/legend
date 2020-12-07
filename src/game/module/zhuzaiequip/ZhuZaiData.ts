/**
 * Created by Administrator on 2016/7/28.
 */
class ZhuZaiData {

	public id: number;

	public rank: number;

	public growupID: number;

	// 最终于成长id = (rank * 10000) + growUpId

	public parser(bytes: GameByteArray): void {

		this.id = bytes.readInt();

		this.rank = bytes.readShort();

		this.growupID = bytes.readInt();
	}

	public get lv(): number {
		return this.rank * GlobalConfig.EquipPointConstConfig.rankGrowUp + this.growupID;
	}

	public isMaxLevel(): boolean {
		let nextConfig: EquipPointGrowUpConfig = GlobalConfig.EquipPointGrowUpConfig[this.id][this.lv + 1];
		return nextConfig ? false : true;
	}


	public canLevelup(): boolean {
		let config: EquipPointGrowUpConfig = GlobalConfig.EquipPointGrowUpConfig[this.id][this.lv];
		let itemID: number = config.growUpItem.id;
		let needZs: number = config.needLevel / 1000 >> 0;
		let needLv: number = config.needLevel % 1000;

		if (this.isMaxLevel() || (needZs && UserZs.ins().lv < needZs) || (Actor.level < needLv)) {
			return false;
		}

		if (UserBag.ins().getBagGoodsCountById(0, itemID) < config.growUpItem.count) {
			return false;
		}
		return true;
	}

	public canAdvance(): boolean {
		let config: EquipPointRankConfig = GlobalConfig.EquipPointRankConfig[this.id][this.rank];
		if (!this.lv || !config)
			return false;
		let itemID: number = config.rankUpItem.id;
		if (UserBag.ins().getBagGoodsCountById(0, itemID) < config.rankUpItem.count) {
			return false;
		}
		return true;
	}
}