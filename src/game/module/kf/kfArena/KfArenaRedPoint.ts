/**
 * Created by MPeter on 2018/3/12.
 * 跨服3v3竞技场 - 红点逻辑类
 */
class KfArenaRedPoint extends BaseSystem {
	/**总红点 */
	public redpoint: number;
	/**匹配红点 */
	public redpoint_1: number= 0;
	/**参与红点 */
	public redpoint_2: number = 0;
	/**段位红点 */
	public redpoint_3: number = 0;

	public constructor() {
		super();
		this.associated(this.postRedPoint,
			KfArenaSys.ins().postJoinRewards,
			KfArenaSys.ins().postPlayerInfo
		);
	}

	public postRedPoint(): number {
		this.redpoint_1 = this.redpoint_2 = this.redpoint_3 = this.redpoint = 0;
		let ins:KfArenaSys = KfArenaSys.ins();
		if (!ins.isOpen()) return 0;
		this.redpoint_1 = ins.times;
		this.redpoint_2 = ins.getJoinRedPoint();
		this.redpoint_3 = ins.getDuanRedPoint();
		this.redpoint = this.redpoint_1 + this.redpoint_2 + this.redpoint_3;
		return this.redpoint;
	}

	public static ins(): KfArenaRedPoint {
		return super.ins() as KfArenaRedPoint;
	}

}
namespace GameSystem {
	export let kfArenaRedPoint = KfArenaRedPoint.ins.bind(KfArenaRedPoint);
}
