/**
 * 
 */
class PublicBossRank extends BaseEuiView {

	// public lvTxt: eui.Label;
	// public myTxt: eui.Label;
	// public attribution: eui.Label;
	// public nameTxt: eui.Label;
	// public head: eui.Image;
	// public bloodBar: eui.ProgressBar;

	public group: eui.Group;
	public hideBtn: eui.ToggleButton;


	constructor() {
		super();
	}

	public initUI(): void {
		super.initUI();

		this.skinName = "BossRankSkin";
	}

	public open(...param: any[]): void {
		this.addTouchEvent(this.hideBtn, this.onTap);

		this['myHarm'].text = `我的伤害：`;
		this['myRank'].text = `我的排名：`;

		// let bossID: number = param[0];
		// let monster: MonstersConfig = GlobalConfig.MonstersConfig[bossID];
		// this.bloodBar.maximum = monster.hp;
		// this.bloodBar.value = monster.hp;

		// this.nameTxt.text = monster.name;

		// this.lvTxt.text = monster.level + "";

		// this.head.source = monster.head;
	}

	// private updateInfo(): void {
	//	 this.attribution.text = `归属： ???（??万）`;
	//	 this.myTxt.text = `自己：??万`;
	//	 this.bloodBar.value;
	// }

	public close(...param: any[]): void {
		this.removeTouchEvent(this.hideBtn, this.onTap);
		this.removeObserve();
	}

	private updateRank(param:Array<any>): void {
		let id: number = param[0];
		let datas: string[][] = param[1];
		let actorID: number = Actor.actorID;
		for (let i = 0; i < 3; i++) {
			this[`rank` + i].text = i + 1;
			this[`name` + i].text = datas[i] ? datas[i][1] : "";
			if (datas[i]) {
				CommonUtils.labelIsOverLenght(this[`harm` + i], datas[i][2]);
			}
			else
				this[`harm` + i].text = "";
			if (datas[i] && datas[i][0] == actorID.toString()) {
				this['myHarm'].text = `我的伤害：${this[`harm` + i].text}`;
				this['myRank'].text = `我的排名：${this[`rank` + i].text}`;
			}
		}
	}

	private onTap(e: egret.TouchEvent): void {
		switch (e.currentTarget) {
			case this.hideBtn:
				let t: egret.Tween = egret.Tween.get(this.group);
				t.to({ x: this.hideBtn.selected ? 480 : 247 }, 500);
				break;
		}
	}
}
ViewManager.ins().reg(PublicBossRank, LayerManager.UI_Main);