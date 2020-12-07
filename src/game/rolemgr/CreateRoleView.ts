/**
 *
 * @author
 *
 */
class CreateRoleView extends BaseEuiView {

	private jobChoose1: eui.RadioButton;
	private jobChoose2: eui.RadioButton;
	private jobChoose3: eui.RadioButton;

	private man: eui.RadioButton;
	private woman: eui.RadioButton;

	private role0: eui.Image;
	private role1: eui.Image;
	private role2: eui.Image;
	private role3: eui.Image;
	private role4: eui.Image;
	private role5: eui.Image;


	private daoshiTitle: eui.Image;
	private fashiTitle: eui.Image;
	private zhanshiTitle: eui.Image;

	private bg: eui.Image;
	private desc:eui.Label;

	private roleImage: eui.Image[];
	private RadioBtns: eui.RadioButton[];
	// private jobImage: eui.Image[];
	private nameInput: eui.TextInput;

	private createBtn: eui.Button;
	private diceBtn: eui.Button;

	private _selectJob: number = 0;

	private groupSpark: eui.Group;
	private list: eui.List;
	private scroller: eui.Scroller;
	private listH: number;
	private imgA: eui.Image;

	public enterGroup: eui.Group;
	public loadText: eui.Label;
	public timeLab: eui.Label;

	private sex: number = 1;
	private openTime: number;
	private isAutoEnter: boolean = false;
	private btnMc: MovieClip;
	public constructor() {
		super();

		this.skinName = "CreateRole1Skin";

		this.roleImage = [this.role0, this.role1, this.role2, this.role3, this.role4, this.role5];
		this.RadioBtns = [this.jobChoose1, this.jobChoose2, this.jobChoose3,  this.woman,this.man];

		this.jobChoose1.groupName = "Group1";
		this.jobChoose2.groupName = "Group1";
		this.jobChoose3.groupName = "Group1";
		this.jobChoose1.selected = true

		this.man.groupName = "Group2";
		this.woman.groupName = "Group2";
		this.woman.selected = true

		this.desc.lineSpacing = 5


		this.updateRole()
		this.enterGroup.visible = false;	
		this.groupSpark = new eui.Group();
		this.addChild(this.groupSpark);
		this.groupSpark.touchChildren = false;
		this.groupSpark.touchEnabled = false;
		this.list.itemRenderer = CreateRoleViewItem;

		let arrName: string[] = ["", "", "", ""];
		let addName = ["紫廖渔歌", "半瓶矿泉水", "暖风", "繁华过后", "念迩成习", "逆丶美丽",
			"握不住的美", "隔岸觀火", "残喘的笑", "何时苏醒", "湮丶燃尽了", "年少无知≈", "卸不掉的盔甲", "″温瞳渐远≈",
			"男人/吥乖", "走遍四方", "我已无力说爱", "繁华沧桑", "卡尺", "往事随风", "剑胆琴心", "心如止水", "风伤依旧",
			"一直很低调", "遥忘而立", "忧郁的萨克斯", "哥比彩钻还炫", "烈日追风", "本人、已昏", "全橙相伴", "残月孤生"];
		for (let i = 0; i < 3; i++) {
			arrName = arrName.concat(addName);
		}
		this.list.dataProvider = new eui.ArrayCollection(arrName);
		this.scroller.touchChildren = false;
		this.scroller.touchEnabled = false;
	}

	public open(...param: any[]): void {

		this.selectJob = 0;
		for (let i = 0; i < this.RadioBtns.length; i++) {
			this.RadioBtns[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		}
		this.createBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.diceBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);

		let str: string = LocationProperty.nickName;
		if (str == "null" || str == "") {
			RoleMgr.ins().sendRandomName(this.sex);
		}
		else
			this.setName(str);

		this.sparkTween();
		this.listH = this.list.height - 200;
		this.scroller.viewport.scrollV = 0;
		let t = egret.Tween.get(this.scroller.viewport);
		t.to({ scrollV: this.listH }, 40 * this.listH).call(this.loopT, this);
		// this.loopT2();

		this.observe(GameApp.ins().postPerLoadProgress, this.perloadProgress);
		this.observe(RoleMgr.ins().postCreateRole, this.createRuselt);

		this.openTime = egret.getTimer() + 15 * 1000;
		// TimerManager.ins().doTimer(1000, 0, this.updateTiem, this);
		this.timeLab.text = ``;

		this.nameInput.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.setBtnEff();

	}
	private setBtnEff() {
		if (!this.btnMc) {
			this.btnMc = new MovieClip;
			this.btnMc.x = this.createBtn.x + this.createBtn.width/2 +15;
			this.btnMc.y = this.createBtn.y + this.createBtn.height/2 -2;
			this.createBtn.parent.addChild(this.btnMc);
		}
		this.btnMc.playFile(RES_DIR_EFF + "chuangjuebtn", -1);

	}
	private updateTiem(): void {
		let s = Math.ceil((this.openTime - egret.getTimer()) / 1000);
		this.timeLab.text = `剩余${Math.max(s, 0)}秒`;

		if (s <= 0) {
			this.isAutoEnter = true;
			this.sendCreateRole();
		}
	}

	private createRuselt(result: number): void {
		this.enterGroup.visible = false;
		//角色名重复
		if (Math.abs(result) == 6) {
			RoleMgr.ins().sendRandomName(this.sex);
		}
	}

	private perloadProgress(arr: number[]): void {
		let [loaded, total] = arr;
		this.loadText.text = `正在进入游戏（${Math.ceil((loaded / total) * 100)}%）`;
	}

	private loopT() {
		this.scroller.viewport.scrollV = 200;
		let t = egret.Tween.get(this.scroller.viewport);
		t.to({ scrollV: this.listH }, 40 * this.listH).call(this.loopT, this);
	}

	private loopT2() {
		let t1 = egret.Tween.get(this.imgA);
		t1.to({ horizontalCenter: -100 }, 1000).to({ horizontalCenter: -115 }, 1000).call(this.loopT2, this);
	}

	public close(...param: any[]): void {
		// for (let i = 0; i < this.jobImage.length; i++) {
		// 	this.jobImage[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		// }
		this.createBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.diceBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.closeTween();
		TimerManager.ins().removeAll(this);
		DisplayUtils.removeFromParent(this.btnMc);
		this.btnMc = null;
	}

	private sendCreateRole(): void {
		RoleMgr.ins().sendCreateRole(
			this.nameInput.text,		//角色名字
			this.curSex(),				//性别
			this.curJob(),				//职业
			0,							//头像
			0,							//阵营
			""							// 平台
		);

		TimerManager.ins().removeAll(this);
	}

	private onClick(e: egret.TouchEvent): void {
		switch (e.currentTarget) {
			case this.createBtn:
				ReportData.getIns().report("clickstart", ReportData.LOAD);
				this.sendCreateRole();
				this.enterGroup.visible = true;
				break;
			case this.diceBtn:
				RoleMgr.ins().sendRandomName(this.sex);
			case this.nameInput:
				TimerManager.ins().remove(this.updateTiem, this);
				this.timeLab.text = ``;
				break;
			default:
				let showRoleIndex: number = this.RadioBtns.indexOf(e.currentTarget);
				if (showRoleIndex != -1) {
					this.selectJob = showRoleIndex;
				}

				break;
		}
		SoundManager.ins().touchBg();
	}

	private set selectJob(jobIndex: number) {
		if (jobIndex > 2) {
			this.sex = jobIndex % 2   // 0代表女的
		} else {
			this._selectJob = jobIndex;
		}
		this.updateRole()
	}

	private updateRole(): void {
		for (let i = 0; i < this.roleImage.length; i++) {
			this.roleImage[i].visible = false
		}
		this.zhanshiTitle.visible = false
		this.fashiTitle.visible = false
		this.daoshiTitle.visible = false
		switch (this._selectJob) {
			case 0:
				this.zhanshiTitle.visible = true
				if (this.sex == 1) {
					this.roleImage[1].visible = true
				} else {
					this.roleImage[0].visible = true
				}

				break;
			case 1:
				this.fashiTitle.visible = true
				if (this.sex == 1) {
					this.roleImage[3].visible = true
				} else {
					this.roleImage[2].visible = true
				}

				break;
			case 2:
				this.daoshiTitle.visible = true
				if (this.sex == 1) {
					this.roleImage[5].visible = true
				} else {
					this.roleImage[4].visible = true
				}

				break
		}
	}

	public setName(str: string): void {
		this.nameInput.text = str;

		if (this.isAutoEnter)
			this.sendCreateRole();
	}

	private curJob(): number {
		return this._selectJob + 1;
	}

	private curSex(): number {
		return this.sex;
	}

	private sparkTween(): void {
		for (let i = 0; i < 15; i++) {
			TimerManager.ins().doTimer(Math.random() * 1000 + 1500, 1, () => {
				this.randomSpark();
			}, this);
		}
		TimerManager.ins().doTimer(1500, 1, () => {
			this.sparkTween();
		}, this);
	}

	private randomSpark() {
		let image: eui.Image = ObjectPool.pop("eui.Image");
		image.source = "cr_3";
		image.x = Math.random() * 300 + 500;
		image.rotation = Math.random() * 180;
		image.touchEnabled = false;
		this.groupSpark.addChild(image);
		let scale = MathUtils.limit(0.7, 1);
		image.scaleX = image.scaleY = scale;
		image.y = MathUtils.limit(-50, 250) + 700;
		let t = egret.Tween.get(image);
		t.to({ "x": Math.random() * 480, "y": Math.random() * 500 }, 3500).call(() => {
			image.parent.removeChild(image);
			egret.Tween.removeTweens(image);
			ObjectPool.push(image);
		});
	}

	private closeTween(): void {
		let len = this.groupSpark.numChildren;
		for (let i = 0; i < len; i++) {
			let obj = this.groupSpark.getChildAt(i);
			egret.Tween.removeTweens(obj);
		}
		egret.Tween.removeTweens(this.imgA);
		egret.Tween.removeTweens(this.scroller.viewport);
	}
}
ViewManager.ins().reg(CreateRoleView, LayerManager.UI_Main);