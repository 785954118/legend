/**
 * 跨服系统-切换服务器处理
 * @author MPeter
 */
class KFServerSys extends BaseSystem {
	/** 跨服登陆服务器ID*/
	private kfSrvid: number;
	/** 跨服服务器IP*/
	private kfIp: string;//
	/** 跨服服务器端口*/
	private kfPort: number;
	/** 跨服登陆KEY*/
	private kfLoginKey: string;


	/**是否正在连接跨服中 */
	public isLinkingKF: boolean = false;
	/**当前服务器类型 */
	public curServerType: ServerType = ServerType.bsCommSrv;

	public constructor() {
		super();
		this.sysId = PackageID.Login;

		this.regNetMsg(9, this.doSwitchServer);
	}

	public static ins(): KFServerSys {
		return super.ins() as KFServerSys;
	}

	/**连接跨服状态 */
	public linkingKFState(value: boolean): void {
		this.isLinkingKF = value;
		//处理些连接过程中的表现....
		if (value) {
			ViewManager.ins().open(ServerSwitchIngWin);
		}
		else {
			ViewManager.ins().close(ServerSwitchIngWin);
		}
	}


	/**
	 * 接收切换服务器
	 * 255-9
	 * @param bytes
	 */
	private doSwitchServer(bytes: GameByteArray): void {
		
		//登陆服务器ID
		this.kfSrvid = bytes.readInt();
		//服务器IP
		this.kfIp = bytes.readString();
		//服务器端口
		this.kfPort = bytes.readInt();
		//登陆KEY
		this.kfLoginKey = bytes.readString();
		//登陆服务器类型 
		this.curServerType = bytes.readInt();

		// console.log("跳转连接跨服服务器！ip:" + this.kfIp + " port:" + this.kfPort + "type:" + this.curServerType);

		//开启连接跨服状态
		this.linkingKFState(true);

		//沙城服务器做跨服，收到跨服，立马连接跨服，人多会有问题，所以做延迟2秒再连接
		TimerManager.ins().doTimer(500, 1, () => {
			//连接跨服服务器
			this.connectKFServer();
		}, this);
	}


	/**
	 * 开始处理跨服登录
	 * 255-9
	 */
	public sendKFLogin(): void {
		let bytes: GameByteArray = this.getBytes(9);
		bytes.writeInt(Actor.actorID);
		bytes.writeString(this.kfLoginKey);
		bytes.writeString(LocationProperty.pf);
		this.sendToServer(bytes);
	}

	/**是否为跨服*/
	public get isKF(): boolean {
		return this.curServerType > ServerType.bsCommSrv;
	}

	/**
	 * 连接跨服服务器
	 */
	private connectKFServer(): void {
		//先断开服务器
		GameSocket.ins().close();
		GameSocket.ins().newSocket();
		//重新连接服务器
		if (!GameSocket.ins().getSocket().connected) {
			debug.log(`kf connect to ${this.kfIp} ,port: ${this.kfPort}`);
			GameSocket.ins().connect(this.kfIp, this.kfPort);
		} else {
			this.sendKFLogin();
		}

		//通知开始跨服
		WJBattlefieldSys.postSwitchServer();

	}

	/**通知关闭socket*/
	public closeSocket(): void {
		//重置回本服
		this.curServerType = ServerType.bsCommSrv;
		this.kfSrvid = LocationProperty.srvid;

	}

	/**假如在跨服战场场景中*/
	public checkIsKFBattle(tips?: string): boolean {
		if (this.isKF && tips) UserTips.ins().showTips(tips);
		return this.isKF;
	}
}


/////////////////////////////////////////////////////////
/**服务器类型 */
enum ServerType {
	/**普通服 */
	bsCommSrv = 0,
		/**战斗服 */
	bsBattleSrv = 1,
		/**主战斗服 */
	bsMainBattleSrv = 2,
		/**连服 */
	bsLianFuSrv = 3
}