/**
 * Created by hrz on 2017/8/8.
 *
 * 简单实体 仅仅包含特效（可包含武器翅膀等），头顶层
 */


class CharEffect extends egret.DisplayObjectContainer {
	/** 形象主体 */
	protected _body: MovieClip;
	/** 中间容器 */
	protected _bodyContainer: egret.DisplayObjectContainer;

	protected titleCantainer: egret.DisplayObjectContainer;

	public myHeight: number = EntityManager.CHAR_DEFAULT_HEIGHT;
	public typeface: number = EntityManager.CHAR_DEFAULT_TYPEFACE;

	//显示对象数组,包括身体,武器,翅膀和影子
	protected _disOrder: { [key: number]: egret.DisplayObject };
	//特效名字表
	protected _mcFileName: { [key: number]: string };

	/** 方向（默认向下） */
	protected _dir: number = 4;
	/** 状态（默认stand） */
	protected _state: EntityAction = EntityAction.STAND;

	protected _infoModel: EffectModel;

	protected playComplete: () => void;

	protected shadow:eui.Image;

	/**不同方向的身体显示对象显示顺序 */
	public static FRAME_ODER: number[][] = [
		[CharMcOrder.WEAPON, CharMcOrder.SOUL, CharMcOrder.BODY, CharMcOrder.WING, CharMcOrder.ZHANLING],//上
		[CharMcOrder.BODY, CharMcOrder.WEAPON, CharMcOrder.SOUL, CharMcOrder.WING, CharMcOrder.ZHANLING],//右上
		[CharMcOrder.WING, CharMcOrder.BODY, CharMcOrder.WEAPON, CharMcOrder.SOUL, CharMcOrder.ZHANLING],//右
		[CharMcOrder.WING, CharMcOrder.BODY, CharMcOrder.WEAPON, CharMcOrder.SOUL, CharMcOrder.ZHANLING],//右下
		[CharMcOrder.WING, CharMcOrder.BODY, CharMcOrder.WEAPON, CharMcOrder.SOUL, CharMcOrder.ZHANLING],//下
		[CharMcOrder.WING, CharMcOrder.BODY, CharMcOrder.WEAPON, CharMcOrder.SOUL, CharMcOrder.ZHANLING],//左下
		[CharMcOrder.WING, CharMcOrder.BODY, CharMcOrder.WEAPON, CharMcOrder.SOUL, CharMcOrder.ZHANLING],//左
		[CharMcOrder.BODY, CharMcOrder.WEAPON, CharMcOrder.SOUL, CharMcOrder.WING, CharMcOrder.ZHANLING],//左上
	];

	public static ACTION_ODER: { [id: number]: EntityAction[] } = {
		8: [EntityAction.STAND, EntityAction.RUN, EntityAction.ATTACK],
	}

	/** 有方向的特效*/
	public hasDir: CharMcOrder[] = [CharMcOrder.BODY, CharMcOrder.WEAPON, CharMcOrder.WING, CharMcOrder.SOUL, CharMcOrder.ZHANLING];

	public constructor() {
		super();

		this._disOrder = {};
		this._mcFileName = {};

		this._bodyContainer = new egret.DisplayObjectContainer();
		this.addChild(this._bodyContainer);

		this._body = ObjectPool.pop(`MovieClip`);
		this._bodyContainer.addChild(this._body);

		this._disOrder[CharMcOrder.BODY] = this._body;

		this.titleCantainer = new egret.DisplayObjectContainer;
		this.titleCantainer.anchorOffsetY = this.myHeight;
		this.addChild(this.titleCantainer);
	}

	public setBodyScale(value: number): void {
		this._bodyContainer.scaleX = this._bodyContainer.scaleY = value;
		this.myHeight = this.myHeight * value;
		this.typeface *= value;
		this.titleCantainer.anchorOffsetY = Math.floor(this.myHeight);
	}

	set infoModel(model: EffectModel) {
		this._infoModel = model;
	}

	get infoModel(): EffectModel {
		return this._infoModel;
	}

	public setConfig(avatar: string) {
		let config: MonstershpConfig = GlobalConfig.MonstershpConfig[avatar];
		if (config) {
			this.myHeight = config.hp;
			this.typeface = config.hp;
		} else {
			this.myHeight = EntityManager.CHAR_DEFAULT_HEIGHT;
			this.typeface = EntityManager.CHAR_DEFAULT_TYPEFACE;
		}
		this.titleCantainer.anchorOffsetY = Math.floor(this.myHeight);
	}

	public updateModel() {

	}

	public get dir(): number {
		return this._dir;
	}

	public set dir(value: number) {
		if (this._dir == value)
			return;
		this._dir = value;
		this.loadBody();
	}

	public getResDir(mcType: CharMcOrder): number {
		let td: number = 2 * (this._dir - 4);
		if (td < 0) td = 0;
		return this._dir - td;
	}

	/**
	 * 播放动作
	 * @action    动作常量EntityAction.ts
	 */
	public playAction(action: EntityAction, callBack?: () => void): void {
		this._state = action;
		this.playComplete = callBack;
		this._body.clearComFun();
		this.loadBody();
	}

	//加载身体模型
	protected loadBody(): void {
		this._body.stop();
		this._body.addEventListener(egret.Event.CHANGE, this.playBody, this);

		if (this.hasDir.indexOf(CharMcOrder.BODY) >= 0) {
			this.loadFile(this._body, this.getFileName(CharMcOrder.BODY), CharMcOrder.BODY);
		} else {
			this.playFile(this._body, this.getFileName(CharMcOrder.BODY));
		}
	}

	//加载其他模型 如武器翅膀
	protected loadOther(mcType: CharMcOrder): void {
		let mc = this.getMc(mcType) as MovieClip;
		if (!mc) return;
		mc.stop();
		mc.addEventListener(egret.Event.CHANGE, this.syncFrame, this);
		this.loadFile(mc, this.getFileName(mcType), mcType);
	}

	protected loadNoDir(mcType:CharMcOrder) {
		let mc = this.getMc(mcType) as MovieClip;
		this.playFile(mc, this.getFileName(mcType));
	}

	protected getFileName(mcType: CharMcOrder): string {
		return this._mcFileName[mcType];
	}

	protected playFile(mc: MovieClip, fileName: string) {
		mc.playFile(fileName, -1, null, false);
	}

	protected loadFile(mc: MovieClip, fileName: string, mcType: CharMcOrder): void {
		if (!fileName) return;

		if (CharEffect.ACTION_ODER[mcType] && CharEffect.ACTION_ODER[mcType].indexOf(this._state) < 0)
			return;

		let dir = this.getResDir(mcType);

		mc.scaleX = this._dir > 4 ? -1 : 1;

		let s: string = fileName + "_" + dir + this._state;

		mc.playFile(s, this.playCount(), mc == this._body ? this.playComplete : null, false);
	}

	protected playBody(e: egret.Event): void {
		let firstFrame: number = 1;
		this._body.gotoAndPlay(firstFrame, this.playCount());
		this.removeBodyEvent(this._body);

		for (let mcType in this._disOrder) {
			let mc = this._disOrder[mcType];
			if (mc != this._body) {
				if (this.hasDir.indexOf(+(mcType)) >= 0 && mc instanceof MovieClip) {
					this.loadOther(+(mcType));
				}
			}
		}
		this.sortEffect();
	}

	protected syncFrame(e: egret.Event): void {
		this.removeMcEvent(e.currentTarget);
		e.currentTarget.gotoAndPlay(this._body.currentFrame, this.playCount());
	}

	protected removeBodyEvent(mc:MovieClip) {
		mc.removeEventListener(egret.Event.CHANGE, this.playBody, this);
	}

	protected removeMcEvent(mc: MovieClip) {
		mc.removeEventListener(egret.Event.CHANGE, this.syncFrame, this);
	}

	protected onImgLoaded(e: egret.Event) {
		let img: eui.Image = e.currentTarget;
		img.removeEventListener(egret.Event.COMPLETE, this.onImgLoaded, this);
		img.anchorOffsetX = img.width / 2;
		img.anchorOffsetY = img.height / 2;
	}

	protected playCount(): number {
		return -1;
	}

	public addMc(mcType: CharMcOrder, fileName: string, disType: number = 0): MovieClip | eui.Image {
		if (this._mcFileName[mcType] == fileName) return;
		this._mcFileName[mcType] = fileName;
		let mc = this._disOrder[mcType];
		if (!mc) {
			if (disType == 0) {
				mc = ObjectPool.pop(`MovieClip`);
			} else {
				mc = new eui.Image();
			}
			this._bodyContainer.addChild(mc);
			this._disOrder[mcType] = mc;
		}
		if (mc instanceof MovieClip) {
			if (this.hasDir.indexOf(mcType) >= 0) {
				if (mc == this._body) {
					this.loadBody();
				} else {
					this.loadOther(mcType);
				}
			} else {
				this.loadNoDir(mcType);
			}
		} else {
			(<eui.Image>mc).addEventListener(egret.Event.COMPLETE, this.onImgLoaded, this);
			(<eui.Image>mc).source = fileName;
		}
		this.sortEffect();
		return mc as any;
	}

	public removeMc(mcType: CharMcOrder) {
		if (mcType == CharMcOrder.BODY) return;
		let mc = this._disOrder[mcType];
		if (mc) {
			if (mc instanceof MovieClip) {
				this.removeMcEvent(mc);
				mc.destroy();
			} else {
				DisplayUtils.removeFromParent(mc);
			}
			delete this._mcFileName[mcType];
			delete this._disOrder[mcType];
		}
	}

	public getMc(mcType: CharMcOrder): MovieClip | eui.Image {
		return this._disOrder[mcType] as any;
	}

	public removeAll() {
		for (let mcType in this._disOrder) {
			let mc = this._disOrder[mcType];
			if (mc != this._body) {
				if (mc instanceof MovieClip) {
					this.removeMcEvent(mc);
					mc.destroy();
				} else {
					DisplayUtils.removeFromParent(mc);
				}
				delete this._mcFileName[mcType];
				delete this._disOrder[mcType];
			}
		}
		this._body.dispose();
		this.removeBodyEvent(this._body);
		delete this._mcFileName[CharMcOrder.BODY];
	}

	protected addShadow() {
		if (!this.shadow) {
			this.shadow = new eui.Image(RES_DIR + "yingzi.png");
			this.addChildAt(this.shadow, 0);
			this.shadow.anchorOffsetX = 57 >> 1;
			this.shadow.anchorOffsetY = 37 >> 1;
		}
	}

	protected removeShadow() {
		if (this.shadow) {
			this.shadow.parent.removeChild(this.shadow);
			this.shadow = null;
		}
	}

	protected sortEffect() {
		let order: number[] = CharEffect.FRAME_ODER[this._dir];
		let len: number = order.length;
		let childIndex: number = 0;
		for (let i: number = 0; i < len; i++) {
			let index: number = order[i];
			if (this._disOrder[index] && this._disOrder[index].parent) {
				this._bodyContainer.addChildAt(this._disOrder[index], childIndex);
				childIndex += 1;
			}
		}
	}

	//层级优化
	public get weight() {
		return this.y;
	}

	public get team() {
		return this.infoModel.team;
	}

	public destroy() {
		this.removeAll();
	}
}