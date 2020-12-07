/**
 * 称号窗口
 */
class TitleWin extends BaseEuiView {
	public closeBtn0: eui.Button;
	public closeBtn: eui.Button;
	public list: eui.DataGroup;
	public roleSelect: RoleSelectPanel;

	public initUI(): void {

		super.initUI();

		this.skinName = "TitleSkin";

		this.list.itemRenderer = TitleItem;
		this.isTopLevel = true;
	}

	// public open(...param: any[]): void {
	// 	MessageCenter.ins().addListener(Title.TITLE_WIN_REFLASH_PANEL, (obj, param) => {
	// 		if (obj.itemIndex == Title.ins().list.length - 1) {
	// 			let itemHeight: number = Title.EXPAND_HEIGHT - Title.SIMLPE_HEIGHT
	// 			if (param == "expand") {
	// 				this.list.scrollV = this.list.contentHeight - this.list.height + itemHeight;
	// 			} else {
	// 				this.list.scrollV = this.list.contentHeight - this.list.height - itemHeight;
	// 			}
	// 			this.list.validateNow();
	// 		}
	// 	}, this);
	// 	this.observe(Title.ins().postListUpdate, this.updateList);
	// 	this.observe(Title.ins().postTitleShow, this.updateShow);
	// 	this.observe(Title.ins().postUseTitle, this.useTitle);

	// 	this.addTouchEvent(this.closeBtn, this.onTap);
	// 	this.addTouchEvent(this.closeBtn0, this.onTap);

	// 	this.roleSelect.setCurRole(param[0] || 0);
	// 	if (Title.ins().list == null)
	// 		Title.ins().sendGetList();
	// 	else
	// 		this.updateList();
	// }

	// public close(...param: any[]): void {
	// 	this.removeTouchEvent(this.closeBtn, this.onTap);
	// 	this.removeTouchEvent(this.closeBtn0, this.onTap);
	// 	this.removeObserve();

	// 	this.list.dataProvider = null;
	// }

	// private onTap(e: egret.TouchEvent): void {
	// 	//关闭
	// 	ViewManager.ins().close(TitleWin);
	// }

	// /**
	//  * 请求带上或卸下称号
	//  */
	// private useTitle(info: TitleInfo): void {
	// 	//带上
	// 	if (info.config.Id != Title.ins().showID) {
	// 		//检查职业
	// 		if (!info.config.job || info.config.job == SubRoles.ins().getSubRoleByIndex(this.roleSelect.getCurRole()).job)
	// 			Title.ins().setTitle(this.roleSelect.getCurRole(), info.config.Id);
	// 		else
	// 			UserTips.ins().showTips('职业不符');
	// 	}
	// 	//卸下
	// 	else {
	// 		Title.ins().setTitle(Title.ins().useRole, 0);
	// 	}
	// }

	// /**
	//  * 更新列表
	//  */
	// private updateList(): void {
	// 	this.list.dataProvider = Title.ins().list;
	// }

	// /**
	//  * 更新设置的称号
	//  */
	// private updateShow(param: Array<any>): void {
	// 	let roleIndex: number, titleID: number, lastID: number;
	// 	roleIndex = param[0];
	// 	titleID = param[1];
	// 	lastID = param[2];
	// 	if (roleIndex != Title.ins().useRole)
	// 		return;
	// 	//更换，只刷新两个项
	// 	if (titleID > 0 == lastID > 0) {
	// 		this.updateItemByID(lastID);
	// 		this.updateItemByID(titleID);
	// 	}
	// 	//带上、卸下，刷新所有已得到的称号
	// 	else {
	// 		for (let id in Title.ins().timeDict) {
	// 			this.updateItemByID(Number(id));
	// 		}
	// 	}
	// }

	// /**
	//  * 更新指定称号的列表项
	//  */
	// private updateItemByID(titleID: number): void {
	// 	if (!(titleID in Title.ins().infoDict))
	// 		return;
	// 	let info: TitleInfo = Title.ins().infoDict[titleID];
	// 	Title.ins().list.itemUpdated(info);
	// }
}

ViewManager.ins().reg(TitleWin, LayerManager.UI_Main);
