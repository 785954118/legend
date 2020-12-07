/**
 * Created by Administrator on 2017/6/5.
 */
class Activationtongyong extends BaseEuiView {

	public bgClose: eui.Rect;
	public lbg: eui.Image;
	public rbg: eui.Image;
	public imgGroup: eui.Group;
	public imgAct: eui.Group;

	public bg: eui.Image;//台阶
	public title: eui.Image;
	public tielian: eui.Group;
	public titleBg: eui.Image;
	public leftBg: eui.Image;
	public buttonBg: eui.Image;
	public itemname: eui.Label;
	public okBtn: eui.Button;
	public layer: eui.Group;
	public img: eui.Image;
	public imgMc:eui.Group;
	public zlMc:eui.Group;
	public imgEff:MovieClip;
	public zlEff:MovieClip;

	private mc: MovieClip;

	private Groupeff: eui.Group;//特效定位
	private closeFunc: Function;

	//记录缩放
	private titleScale;
	private tbgScale;
	private imgScale;
	private imgMcScale;

	private tlpos;
	private lbgpos;
	private rbgpos;

	constructor() {
		super();

		this.skinName = `activationtongyong`;
		this.isTopLevel = true;
		this.bgClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.okBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
	}

	private onTap(e: egret.TouchEvent): void {

		switch (e.currentTarget) {
			case this.okBtn:
			case this.bgClose:
				ViewManager.ins().close(Activationtongyong);
				break;
		}
	}

	public open(...param: any[]): void {
		let type: number = param[0];
		let name: string = param[1];
		let source: string = param[2];
		let play: boolean = param[3];
		this.closeFunc = param[4];
		let effmc:string = param[5];
		let zlmodel:string = param[6];
		this.title.source = type ? "tongyongjihuochenggongp3" : "tongyongjihuochenggongp2";

		let rxa:RegExpExecArray = RegExpUtil.NonNumericExp.exec(name);
		if( !rxa )
			this.itemname.text = name.split("").join("\n");
		else{
			let num = "";
			let oth = "";
			
			for(let i=0;i<name.length;i++){
				if( i >= rxa.index ){
					oth += name[i];
				}else{
					num += name[i];
				}
			}
			let str = "";
			if( Number(num) / 10 >= 1 ){
				str = num + "\n";
			}else{
				str = " " + num + "\n";
			}
			this.itemname.text = str + oth.split("").join("\n");
		}
		// egret.log("this.itemname.text = "+this.itemname.text);
		this.img.source = source;
		if( effmc ){//兵魂
			if( !this.imgEff )
				this.imgEff = new MovieClip;
			if( !this.imgEff.parent )
				this.imgMc.addChild(this.imgEff);
			this.imgEff.playFile(RES_DIR_EFF + effmc,-1);
		}
		if( zlmodel ){//战灵
			if( !this.zlEff )
				this.zlEff = new MovieClip;
			if( !this.zlEff.parent )
				this.zlMc.addChild(this.zlEff);
			this.zlEff.playFile(RES_DIR_EFF + zlmodel,-1);
		}
		// egret.log("img.source = "+source);
		// egret.log("this.img.x = "+this.img.x);
		// egret.log("this.img.y = "+this.img.y);
		// this.artifactTween();//浮动
		// this.showPanel(play);
		this.playAnimaiton(play);
	}

	public close() {

		egret.Tween.removeTweens(this.title);
		egret.Tween.removeTweens(this.titleBg);
		egret.Tween.removeTweens(this.img);
		egret.Tween.removeTweens(this.imgMc);
		egret.Tween.removeTweens(this.zlMc);
		egret.Tween.removeTweens(this.tielian)

		egret.Tween.removeTweens(this.imgAct);

		if (this.closeFunc)
			this.closeFunc.apply(null);
		this.closeFunc = null;
		DisplayUtils.removeFromParent(this.zlEff);
		DisplayUtils.removeFromParent(this.imgEff);
		DisplayUtils.removeFromParent(this.mc);
		this.zlEff = null;
		this.imgEff = null;
		this.mc = null;
	}
	/**开场前动画 */
	private playAnimaiton(play: boolean) {
		//记录坐标
		let tlpos = this.tlpos = this.tlpos || [this.tielian.x, this.tielian.y];
		let lbgpos = this.lbgpos = this.lbgpos || [this.lbg.x, this.lbg.y];
		let rbgpos = this.rbgpos = this.rbgpos || [this.rbg.x, this.rbg.y];

		//记录缩放
		let titleScale = this.titleScale = this.titleScale || [this.title.scaleX, this.title.scaleY];
		let tbgScale = this.tbgScale = this.tbgScale || [this.titleBg.scaleX, this.titleBg.scaleY];
		let imgScale = this.imgScale = this.imgScale || [this.img.scaleX, this.img.scaleY];
		let imgMcScale = [0,0];
		if( this.imgEff )
			imgMcScale = this.imgMcScale = this.imgMcScale || [this.imgMc.scaleX,this.imgMc.scaleY];
		else if( this.zlEff )
			imgMcScale = this.imgMcScale = this.imgMcScale || [this.zlMc.scaleX,this.zlMc.scaleY];

		//台阶
		this.bg.visible = false;
		this.itemname.visible = false;
		this.leftBg.visible = false;
		this.buttonBg.visible = false;


		//开始前
		this.title.scaleX = 0;
		this.title.scaleY = 0;
		this.titleBg.scaleX = 0;
		this.titleBg.scaleY = 0;
		this.img.scaleX = 0;
		this.img.scaleY = 0;
		this.imgMc.scaleX = 0;
		this.imgMc.scaleY = 0;
		this.tielian.y = -this.tielian.height * 2;

		//动画开始
		let speed = 1;//播放速度
		let t1: egret.Tween = egret.Tween.get(this.tielian);
		t1.to({ "y": tlpos[1] + 50 }, 200 * speed).to({ "y": tlpos[1] }, 100 * speed).call(() => {//下拉
			this.bg.visible = true;//台阶
			let t2: egret.Tween = egret.Tween.get(this.title);
			let t3: egret.Tween = egret.Tween.get(this.titleBg);
			let t4: egret.Tween = egret.Tween.get(this.img);
			let t5: egret.Tween = egret.Tween.get(this.imgMc);
			t2.to({ scaleX: titleScale[0], scaleY: titleScale[1] }, 500 * speed);
			t3.to({ scaleX: tbgScale[0], scaleY: tbgScale[1] }, 500 * speed);
			t5.to({ scaleX: imgMcScale[0], scaleY: imgMcScale[1] }, 500 * speed);
			t4.to({ scaleX: imgScale[0], scaleY: imgScale[1] }, 500 * speed).wait(500).call(() => {
				//文字 文字背景 点击任意关闭文字
				this.itemname.visible = true;
				this.leftBg.visible = true;
				this.buttonBg.visible = true;
				//播放特效
				this.showPanel(play);
				this.artifactTween();//浮动
			});
		});
		//底边
		this.lbg.y = -this.tielian.height;
		this.rbg.y = -this.tielian.height;
		let tl: egret.Tween = egret.Tween.get(this.lbg);
		tl.to({ "y": lbgpos[1] + 50 }, 200 * speed).to({ "y": lbgpos[1] }, 100 * speed);
		let tr: egret.Tween = egret.Tween.get(this.rbg);
		tr.to({ "y": rbgpos[1] + 50 }, 200 * speed).to({ "y": rbgpos[1] }, 100 * speed);



	}
	/**动画完结后的显示 */
	private showPanel(play: boolean) {
		if (play) {
			this.mc = new MovieClip();
			this.mc.anchorOffsetX = this.Groupeff.anchorOffsetX;
			this.mc.anchorOffsetY = this.Groupeff.anchorOffsetY;
			this.Groupeff.addChild(this.mc);
			this.mc.playFile(RES_DIR_EFF + "artifacteff", -1);
		}
	}

	//道具上下浮动
	public artifactTween() {
		let t: egret.Tween = egret.Tween.get(this.imgAct, { "loop": true });
		t.to({ "y": this.imgAct.y - 20 }, 1000).to({ "y": this.imgAct.y }, 1000);
	}

	/**
	 * 显示通用激活升阶界面
	 * @param type    0激活1升阶
	 * @param name    对象名字
	 * @param source    资源名字
	 */
	static show(type: number, name: string, source: string, play: boolean = true, func: Function = null,effmc?:string,zlmodel?:string): void {
		ViewManager.ins().open(Activationtongyong, type, name, source, play, func, effmc,zlmodel);
		StageUtils.ins().setTouchChildren(true);
	}
}
ViewManager.ins().reg(Activationtongyong, LayerManager.UI_Main);