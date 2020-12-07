/**
 * @author
 */
class GameApp extends BaseClass {

	public preload_load_count:number = 0;
	public map_load_count:number = 0;
	public loadingView:login;

	public constructor() {
		super();
	}

	static ins():GameApp{
		return super.ins() as GameApp;
	}
	
	public loadWeb() {
		/**
		 * 	这里可以添加登录后在加载
		 * 
		 */

		let groupName = "firstLoad";
		ResourceUtils.ins().loadGroup(groupName, this.complete, this.progress, this);
	}
	public load(loadingView:login) {
		/**
		 * 	这里可以添加登录后在加载
		 * 
		 */
		this.loadingView = loadingView;

		let groupName = "firstLoad";
		ResourceUtils.ins().loadGroup(groupName, this.complete, this.progress, this);
	}

	/**
	 * 资源组加载完成
	 */
	private complete(): void {

		RES.getResByUrl(`${MAP_DIR}maps.json`, (data) => {

			this.map_load_count += 1;
			if(Assert(data, `maps.json 地图数据加载失败!!加载次数：${this.map_load_count}`)) {
				if (this.map_load_count < 3) {
					this.complete();
				} else {
					alert(`地图加载失败，请检查网络重新登录`);
				}
				return;
			}

			Assert(this.map_load_count == 1, `maps.json 重新加载成功。加载次数：${this.map_load_count}`);

			ReportData.getIns().report('loaded',ReportData.LOAD);

			for (let i in GameSystem) {
				GameSystem[i]();
			}

			//移到GameSystem后的原因是用来检查GameSystem中的类初始化函数中是否有初始化配置，否则会报错提醒
			GlobalConfig.init();

			//地图网格初始化
			GameMap.init(data);
			//音乐音效处理
			// SoundManager.ins().setEffectOn(true);
			// 
			if (window['getNative']() == 'web') {
				LocationProperty.setLoadProgress(90, "(登录游戏中)");
			} else {
				this.loadingView.setProgress(90,'(登录游戏中)')
			}
			
			RoleMgr.ins().connectServer();

			eui.Label.default_fontFamily = "微软雅黑";

			RoleAI.ins().init();
			if (LocationProperty.isFirstLoad) {
				ResourceUtils.ins().loadGroup("preload",
					GameApp.ins().doPerLoadComplete,
					GameApp.ins().postPerLoadProgress, this);
			}
			// window['closeLoadProgress']()
		}, this);
	}

	/**
	 * 资源组加载进度
	 */
	private progress(itemsLoaded: number, itemsTotal: number): void {
		// 
		if (window['getNative']() == 'web') {
			LocationProperty.setLoadProgress(40 + (itemsLoaded / itemsTotal * 30), "(加载必要资源)");
		} else {
			this.loadingView.setProgress(40 + (itemsLoaded / itemsTotal * 30),'(加载必要资源)')
		}
		
	}

	public postPerLoadProgress(itemsLoaded: number, itemsTotal: number): number[] {
		return [itemsLoaded, itemsTotal];
	}

	//这里不直接用post是因为有可能组内有加载项失败
	//如果失败可以在这里处理之后在post
	public doPerLoadComplete() {
		GlobalConfig.init();
		this.postPerLoadComplete();
	}

	public postPerLoadComplete() {
		console.log('资源加载完成！！！！')
	}	

	public postLoginInit(): void {
	}

	public postZeroInit():void {
	}

}

MessageCenter.compile(GameApp);