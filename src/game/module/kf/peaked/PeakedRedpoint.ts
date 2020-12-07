/**
 * Created by MPeter on 2017/12/21.
 * 跨服副本-巅峰赛季-红点系统
 */
class PeakedRedpoint extends BaseSystem {
	/**满足报名红点 */
	public redpoint1: number = 0;
	/**点赞红点 */
	public redpoint2: number = 0;
	/**可膜拜红点 */
	public redpoint3: number = 0;


	public redpoint: number = 0;

	public constructor() {
		super();

		//报名红点
		this.associated(this.postRedPoint,
			PeakedSys.ins().postSignUp,
			PeakedSys.ins().postState,
			PeakedSys.ins().postWorship,
			PeakedSys.ins().postKFInfoList,
			UserZs.ins().postZsLv
		);


	}

	public static ins(): PeakedRedpoint {
		return super.ins() as PeakedRedpoint;
	}

	public postRedPoint(): number {
		this.redpoint1 = 0;
		this.redpoint2 = 0;
		this.redpoint3 = 0;
		this.redpoint = 0;
		if (!PeakedSys.ins().isOpen()) {
			return this.redpoint;
		}
		if (UserZs.ins().lv < GlobalConfig.PeakRaceBase.needZsLv) return this.redpoint;
		//报名阶段，且未参加
		if (PeakedSys.ins().bfStatus == BF_PeakStatus.SignUp && PeakedSys.ins().isSignUp == 0 && PeakedSys.ins().canSignUp()) {
			this.redpoint1 = 1;
		}

		if (PeakedSys.ins().isKf() && PeakedHelp.canSupport()) {
			if (PeakedSys.ins().kfStatus > KF_PeakStatus.Knockout || (PeakedSys.ins().kfStatus == KF_PeakStatus.Knockout && PeakedSys.ins().kfStatusIsEnd)) {
				this.redpoint2 = GlobalConfig.PeakRaceBase.likeCount - PeakedSys.ins().kideNum;
			}
		}
		else {
			if ((PeakedSys.ins().bfStatus > BF_PeakStatus.Knockout || (PeakedSys.ins().bfStatus == BF_PeakStatus.Knockout && PeakedSys.ins().bfStatusIsEnd)) && PeakedSys.ins().bfStatus < BF_PeakStatus.Over && PeakedHelp.canSupport()) {
				this.redpoint2 = GlobalConfig.PeakRaceBase.likeCount - PeakedSys.ins().kideNum;
			}
		}

		this.redpoint3 = PeakedSys.ins().worshipNum < GlobalConfig.PeakRaceBase.mobaiNum && PeakedSys.ins().kfPlayer2Data && PeakedSys.ins().kfPlayer2Data.winId && PeakedSys.ins().kfStatus >= KF_PeakStatus.Knockout && PeakedSys.ins().kfStatusIsEnd ? 1 : 0;


		this.redpoint = this.redpoint1 + this.redpoint2 + this.redpoint3;
		return this.redpoint;
	}


}
namespace GameSystem {
	export let peakedRedpoint = PeakedRedpoint.ins.bind(PeakedRedpoint);
}