/**
 * Created by MPeter on 2017/12/21.
 * 跨服副本-巅峰赛季-赛季奖励
 */
class PeakAwardPanel extends BaseView {
	/**当前服奖励列表 */
	private curServList: eui.List;
	/**跨服奖励列表 */
	private kfServList: eui.List;

	private _listDt1: eui.ArrayCollection;
	private _listDt2: eui.ArrayCollection;
	public constructor() {
		super();
	}
	protected childrenCreated(): void {
		this.curServList.itemRenderer = PeakAwardItemRender;
		this.kfServList.itemRenderer = PeakAwardItemRender;
		this._listDt1 = new eui.ArrayCollection;
		this._listDt2 = new eui.ArrayCollection;
		this.curServList.dataProvider = this._listDt1;
		this.kfServList.dataProvider = this._listDt2;
	}
	public open(...param): void {
		let bfAwardDtList: PeakRaceTime[] = [];
		for (let key in GlobalConfig.PeakRaceTime) {
			let dp = GlobalConfig.PeakRaceTime[key]
			if (dp.loseMail) bfAwardDtList.push(dp);
		}
		let first: PeakRaceTime = new PeakRaceTime();
		first.loseMail = GlobalConfig.PeakRaceBase.winMail;
		first.status = BF_PeakStatus.Over;
		bfAwardDtList.push(first);
		bfAwardDtList.reverse();
		this._listDt1.replaceAll(bfAwardDtList);

		bfAwardDtList = [];
		for (let key in GlobalConfig.PeakRaceCrossTime) {
			let dp = GlobalConfig.PeakRaceCrossTime[key]
			if (dp.loseMail) bfAwardDtList.push(dp);
		}

		let KFfirst: PeakRaceCrossTime = new PeakRaceCrossTime();
		KFfirst.loseMail = GlobalConfig.PeakRaceBase.crossWinMail;
		KFfirst.status = KF_PeakStatus.Over;
		bfAwardDtList.push(KFfirst);
		bfAwardDtList.reverse();
		this._listDt2.replaceAll(bfAwardDtList);
	}
	public close(...param): void {

	}

}