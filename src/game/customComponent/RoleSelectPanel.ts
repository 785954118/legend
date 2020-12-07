/**
 * 三角色选择面板
 */
class RoleSelectPanel extends BaseView {

	public roles: eui.ToggleButton[];
	public role0: eui.ToggleButton;
	public role1: eui.ToggleButton;
	public role2: eui.ToggleButton;

	private roleMovie: MovieClip[];

	/** 当前选择的角色 */
	private _curRole: number = 0;

	private lastX: number = 0;
	private isTouchBegin: boolean = false;

	public goldTxt: eui.Label;

	public ybTxt: eui.Label;

	public recharge: eui.Button;
	public recharge0: eui.Button;
	public rolesLength: number = 1;

	private headGroup: eui.Group;

	public stageImg: eui.Image;
	private leftImg: eui.Image;
	private rightImg: eui.Image;
	private bgImg: eui.Image;

	constructor() {
		super();
		this.initMc();
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAdd, this);
	}

	$onRemoveFromStage() {
		super.$onRemoveFromStage();
		this.destructor();
	}

	public childrenCreated(): void {
		this.init();
	}

	private initMc() {
		this.roleMovie = [];
		for (let i = 0; i < 2; i++) {
			let mc: MovieClip = new MovieClip;
			mc.x = 44;
			mc.y = 44;
			mc.touchEnabled = false;
			this.roleMovie.push(mc);
		}
	}

	public hideTop(): void {
		this.leftImg.visible = false;
		this.rightImg.visible = false;
		this.bgImg.visible = false;
	}

	public init(): void {
		this.roles = [this.role0, this.role1, this.role2];
		for (let i = 0; i < 2; i++) {
			let mc = this.roleMovie[i];
			this.roles[i + 1].addChild(mc);
		}

	}

	private onAdd() {
		this.destructor();
		this.parent.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onMove, this);
		this.parent.addEventListener(egret.TouchEvent.TOUCH_END, this.onMove, this);
		this.addTouchEvent(this.recharge, this.onBtnClick);
		this.addTouchEvent(this.recharge0, this.onBtnClick);

		this.addTouchEvent(this, this.onClick);

		this.observe(GameLogic.ins().postSubRoleChange, this.updateRole);
		this.observe(Actor.ins().postLevelChange, this.updateRole);
		this.observe(UserVip.ins().postUpdateVipData, this.updateRole);
		this.observe(UserZs.ins().postZsData, this.updateRole);
		this.observe(Actor.ins().postGoldChange, this.initData);
		this.observe(Actor.ins().postYbChange, this.initData);

		this.setCurRole(this._curRole);
		this.updateRole();
		this.initData();
	}

	public initData(): void {
		CommonUtils.labelIsOverLenght(this.goldTxt, Actor.gold);
		CommonUtils.labelIsOverLenght(this.ybTxt, Actor.yb);
	}

	public getCurRole(): number {
		return this._curRole;
	}

	public setCurRole(value: number) {
		this._curRole = value;
		for (let i = 0; i < this.roles.length; i++) {
			let element: eui.ToggleButton = this.roles[i];
			element.selected = i == value;
		}
		this.dispatchEventWith(egret.Event.CHANGE, false, this._curRole);
		// this.updateRole()
	}

	private onBtnClick(e: egret.TouchEvent): void {
		switch (e.currentTarget) {
			case this.recharge0:
				let rdata: RechargeData = Recharge.ins().getRechargeData(0);
				if (!rdata || rdata.num != 2) {
					ViewManager.ins().open(Recharge1Win);
				} else {
					ViewManager.ins().open(ChargeFirstWin);
				}
				break;
			case this.recharge:
				// if (GameServer.serverOpenDay < 2) {
				// 	UserTips.ins().showTips("|C:0xf3311e&T:开服第三天开启摇钱树|");
				// 	return;
				// }
				// ViewManager.ins().open(FuliWin);
				Shop.openBuyGoldWin();
				break;
		}
	}

	private onClick(e: egret.TouchEvent): void {
		let index: number = this.roles.indexOf(e.target);
		if (index > -1)
			this.changeRole(index);
		
	}

	private onMove(e: egret.TouchEvent) {
		if (!this.headGroup.visible || !this.parent || !this.parent.touchEnabled) return;
		if (this.isPass()) return;
		switch (e.type) {
			case egret.TouchEvent.TOUCH_BEGIN:
				this.lastX = e.stageX;
				this.isTouchBegin = true;
				break;
			case egret.TouchEvent.TOUCH_END:
				if (!this.isTouchBegin) break;
				this.isTouchBegin = false;
				let Index: number = this._curRole;
				if (this.lastX - e.stageX >= 100) {
					Index++;
					if (Index > this.rolesLength) Index = 0;
					this.changeRole(Index);
				} else if (this.lastX - e.stageX <= -100) {
					Index--;
					if (Index < 0) Index = this.rolesLength;
					this.changeRole(Index);
				}
				break;
		}
	}

	private isPass(): boolean {
		let forgwin: ForgeWin = ViewManager.ins().getView(ForgeWin) as ForgeWin;
		if (forgwin && forgwin.isNotMove)
			return true;
		let advanequipwin: AdvanEquipWin = ViewManager.ins().getView(AdvanEquipWin) as AdvanEquipWin;
		if (advanequipwin && advanequipwin.isNotMove)
			return true;
		return false;
	}

	private changeRole(value: number): void {
		let model: Role = SubRoles.ins().getSubRoleByIndex(value);
		if (model) {
			this.setCurRole(value);
		} else {
			// ViewManager.ins().close(RoleWin);
			ViewManager.ins().open(NewRoleWin);
			if (!Assert(this.roles[value], `RoleSelectPanel changeRole value:${value}`)) {
				this.roles[value].selected = false;
			}
		}
	}

	public updateRole(): void {
		let role: eui.ToggleButton;
		let roleData: Role;
		let len: number = this.roles.length;
		this.rolesLength = SubRoles.ins().subRolesLen - 1;
		for (let i = 0; i < len; i++) {
			role = this.roles[i];
			roleData = SubRoles.ins().getSubRoleByIndex(i);
			if (roleData) {
				role['jobImg'].visible = true;
				switch (roleData.job) {
					case 1:
						role['jobImg'].source = `new_duanzao_tubiao_zhanshi`;
						break;
					case 2:
						role['jobImg'].source = `new_duanzao_tubiao_fashi`;
						break;
					case 3:
						role['jobImg'].source = `new_duanzao_tubiao_daoshi`;
						break
				}
				// role['jobImg'].source = `job${roleData.job}Item`;


				role['stageImg'].visible = false;
				role['stageImg'].source = "";
				role.icon = `yuanhead${roleData.job}${roleData.sex}`;
				if (this.roleMovie[i - 1])
					DisplayUtils.removeFromParent(this.roleMovie[i - 1]);
			}
			else {
				let config: NewRoleConfig = GlobalConfig.NewRoleConfig[i];
				if (!config) {
					let parName = egret.getQualifiedClassName(this.parent);
					Assert(false, `角色索引${i}不存在，出错类：${parName}`);
					continue;
				}
				role['jobImg'].visible = false;
				role['stageImg'].visible = true;
				if (config.zsLevel) {
					if (UserZs.ins().lv < config.zsLevel) {
						role['stageImg'].source = `toujiesuo${config.zsLevel}`;
					}
					else {
						role['stageImg'].source = "toujiesuo";
					}
				}
				else {
					if (Actor.level < config.level) {
						role['stageImg'].source = `toujiesuo${config.level}`;
					}

					else {
						role['stageImg'].source = "toujiesuo";
					}
				}
				if (config.vip && UserVip.ins().lv >= config.vip) {
					role['stageImg'].source = "toujiesuo";
				}
				role.icon = "";
			}
			if (this.roleMovie[i - 1] && role['stageImg'].source == "toujiesuo" && role['stageImg'].visible) {
				this.roleMovie[i - 1].playFile(RES_DIR_EFF + 'juesejiesuo', -1);
				this.showRedPoint(i, true);
			}
		}
	}

	showRedPoint(index: number, b: boolean) {
		if (this.roles == null) return;

		this.roles[index]['redPoint'].visible = b;
	}

	clearRedPoint() {
		for (let i = 0; i < this.roles.length; i++) {
			this.roles[i]['redPoint'].visible = false;
		}
	}

	openRole() {
		this.headGroup.visible = true;
	}

	hideRole() {
		this.headGroup.visible = false;
	}

	private destructor(): void {
		if (this.parent) {
			this.parent.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onMove, this);
			this.parent.removeEventListener(egret.TouchEvent.TOUCH_END, this.onMove, this);
		}
	}
}