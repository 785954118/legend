/**
 * @author 游戏开始界面（调试用）
 */
class StartGameView extends BaseEuiView {

	/** 开始按钮 */
	public start: eui.Button;
	/** 游戏版本号 */
	private ver: eui.Label;
	/** 当前选择的服务器 */
	private curServer: eui.Label;
	/** 选择服务器 */
	private selectServer: eui.Label;
	/** 账号输入 */
	private account: eui.TextInput;
	/** 显示ip列表 */
	private select: euiextension.DropDownList;

	public callbackFun: Function;

	constructor() {
		super();
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}

	private onAddToStage(event: egret.Event) {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);

		//配置文件加载
		ResourceUtils.ins().addConfig("startgame/default.res.json", "startgame/");
		ResourceUtils.ins().loadConfig(this.onConfigComplete, this);
	}

	/**
	 * 配置文件加载完成
	 */
	private onConfigComplete(): void {
		//加载皮肤
		EXML.load("startgame/StartGameSkin.exml", this.onLoaded, this);
	}

	/**
	 * 皮肤加载完成
	 */
	private onLoaded(clazz: any, url: string): void {

		this.skinName = clazz;

		this.selectServer.textFlow = new egret.HtmlTextParser().parser('<u>' + this.curServer.text + '</u>');

		this.account.text = egret.localStorage.getItem("account");

		this.curServer.text = "版署服务器";

		this.selectServer.visible = false;

		this.start.skinName = `<?xml version='1.0' encoding='utf-8'?>
								<e:Skin class="Btn0Skin" states="up,down,disabled" minHeight="25" minWidth="25" xmlns:e="http://ns.egret.com/eui" xmlns:w="http://ns.egret.com/wing">
								<w:Config id="1586b67282f"/>
								<e:Image id="iconDisplay" width="100%" height="100%" alpha.disabled="0.5"
								source="" x.down="0" y.down="0"  scaleX.down="0.95" scaleY.down="0.95" pixelHitTest="true"/>
								</e:Skin>`;
		//显示ip列表
		this.showIPListView();
		this.open();
	}

	/** 显示ip列表 */
	private showIPListView(): void {
		this.select = new euiextension.DropDownList();
		//设置服务器ip地址
		let arr1: string[] = window['serverList'];
		this.select.setDataIP(arr1);
		//设置资源地址
		let arr2: string[] = window['resList'];
		this.select.setDataRES(arr2);
		this.addChild(this.select);
	}

	public open(...param: any[]): void {
		this.addTouchEvent(this.start, this.onClick);
		this.addTouchEvent(this.selectServer, this.onClick);
	}

	public close(...param: any[]): void {
		this.removeTouchEvent(this.start, this.onClick);
		this.removeTouchEvent(this.selectServer, this.onClick);
		this.select.destructor();
	}

	private onClick(e: egret.TouchEvent): void {
		switch (e.currentTarget) {
			case this.start:
				this.callbackFun();
				break;
			case this.selectServer:
				ViewManager.ins().open(SelectServerView);
				break;
		}
	}

	/** 游戏资源加载完成，登陆游戏socket */
	public gameResComplete(): void {
		LocationProperty.openID = this.account.text;
		egret.localStorage.setItem("account", this.account.text);
	}

}
ViewManager.ins().reg(StartGameView, LayerManager.UI_Main);
