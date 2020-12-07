/**
 * Created by hrz on 2018/2/26.
 *
 * 监听函数将显示与红点分开来，当未显示时候，则无需监听红点
 *
 * 执行顺序： 监听显示事件--》若显示--》创建入口--》监听红点事件--》红点显示
 */

class RuleIconBase extends egret.HashObject {

    static updateShow: Function;
    static update: Function;

    /** 显示功能入口监听函数 */
    showMessage: any[];

    /** 红点监听函数 */
    updateMessage: any[];

    /** 功能按钮 */
    tar: egret.DisplayObjectContainer;
    /** 功能id */
    id: number;

    /** 特效位置（checkShowEff中赋值） */
    effX: number;
    effY: number;

    /** 是否显示 */
    isShow: boolean = false;

    private isDelayUpdateShow: boolean = false;
    private isDelayUpdate: boolean = false;

    constructor(id: number, tar: egret.DisplayObjectContainer = null) {
        super();
        this.id = id;
        this.tar = tar;
    }

    getTar() {
        if (this.tar) return this.tar;
        return this.createTar();
    }

    protected createTar(): egret.DisplayObjectContainer {
        let config = GlobalConfig.PlayFunConfig[this.id];

        let cls = config.iconCls == "eui.Button" ? eui.Button : egret.getDefinitionByName(config.iconCls);

        let tar = new cls();
        if (config.iconSkin) tar.skinName = config.iconSkin;
        if (config.icon) tar.icon = config.icon;
        if (config.iconParam) {
            for (let key in config.iconParam)
                tar[key] = config.iconParam[key];
        }

        this.tar = tar;
        return tar;
    }

    getConfig() {
        return GlobalConfig.PlayFunConfig[this.id];
    }

    private delayUpdateShow() {
        if (!this.isDelayUpdateShow) {
            this.isDelayUpdateShow = true;
            TimerManager.ins().doTimer(100, 1, this.updateShow, this);
        }
    }

    protected updateShow() {
        this.isDelayUpdateShow = false;
        RuleIconBase.updateShow(this);
    }

    private delayUpdate() {
        if (!this.isDelayUpdate) {
            this.isDelayUpdate = true;
            TimerManager.ins().doTimer(100, 1, this.update, this);
        }
    }

    protected update() {
        this.isDelayUpdate = false;
        RuleIconBase.update(this);
    }

    checkShowIcon(): boolean {
        return true;
    }

    checkShowRedPoint(): number {
        return 0;
    }

    getEffName(redPointNum: number): string {
        return null;
    }

    /** 执行 */
    tapExecute(): void {

    }

    addShowEvents() {
        if (!this.showMessage) return;

        for (let fun of this.showMessage) {
            MessageCenter.addListener(fun, this.delayUpdateShow, this);
        }
    }

    addRedEvents() {
        if (!this.updateMessage) return;

        for (let fun of this.updateMessage) {
            MessageCenter.addListener(fun, this.delayUpdate, this);
        }
    }

    removeRedEvents() {
        if (!this.updateMessage) return;

        for (let fun of this.updateMessage) {
            MessageCenter.ins().removeListener(fun.funcallname, this.delayUpdate, this);
        }
    }

    removeEvents() {
        MessageCenter.ins().removeAll(this);
    }
}