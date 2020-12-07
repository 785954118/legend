/**
 * Created by MPeter on 2017/12/21.
 * 跨服副本-巅峰赛季-赛季奖励列表
 */
class PeakAwardItemRender extends BaseItemRender {
	public typeLabel: eui.Label;
	public awardslist: eui.List;

	public constructor() {
		super();
	}
	protected childrenCreated(): void {
		this.awardslist.itemRenderer = ItemBase;
	}
	protected dataChanged(): void {
		if (this.data instanceof PeakRaceTime) {
			this.typeLabel.text = PeakedData.STATE_TYPE_AWARD_CN[this.data.status];
		}
		else if (this.data instanceof PeakRaceCrossTime) {
			this.typeLabel.text = PeakedData.STATE_KF_TYPE_AWARD_CN[this.data.status];
		}
		let mailConfig = GlobalConfig.MailIdConfig[this.data.loseMail]
		this.awardslist.dataProvider = new eui.ArrayCollection(mailConfig.attachment);

	}
}