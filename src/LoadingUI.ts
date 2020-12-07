//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class LoadingUI extends egret.DisplayObjectContainer {

	public constructor() {
		super();
		// this.createView();
	}

	private textField: egret.TextField;
	private loadingBg: egret.Bitmap;
	private bgUrl = "resource/image/bg/bg.png";
	// private loadingurl = "resource/image/bg/loadingbg.png";

	public createView(): void {
		/**加载页背景 */
		var urlLoader: egret.URLLoader = new egret.URLLoader();
		urlLoader.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
		urlLoader.dataFormat = egret.URLLoaderDataFormat.TEXTURE;
		urlLoader.load(new egret.URLRequest(this.bgUrl));
		this.loadingBg = new egret.Bitmap();
		// this.loadingBg.fillMode = egret.BitmapFillMode.REPEAT;
		// 580*930
		this.loadingBg.width =580 * (this.height/930) 
		this.loadingBg.height = this.height
		this.addChildAt(this.loadingBg, 0);

		this.textField = new egret.TextField();
		this.addChild(this.textField);
		this.textField.y = this.height - 50;
		this.textField.width = 480;
		this.textField.height = 100;
		this.textField.size = 25;
		this.textField.textAlign = "center";

		this.textField.text = `我是进度条！！！`;
	}


	private onComplete(e: egret.Event): void {
		var urlLoader: egret.URLLoader = <egret.URLLoader>e.target;
		var texture = urlLoader.data;
		if (urlLoader._request.url == this.bgUrl) {
			this.loadingBg.texture = texture;

		}
	}

	// public login(): void {
	// 	GameApp.ins().load(this);
	// 	this.textField.visible = true
	// }
	public hideLoadingTrp() {
		this.textField.visible = false
	}

	// public loginBtn() {
	// 	var button = new eui.Button();
	// 	button.width = 200;
	// 	button.height = 80;
	// 	// button.x = this.width/2
	// 	// button.y = this.height/2
	// 	// button.bottom = 200
	// 	button.y = this.height* 0.8
	// 	button.x = this.width/2 - button.width/2

	// 	button.label = "登录";
	// 	button.skinName = "resource/eui_skins/btn/Btn11Skin.exml";
	// 	this.addChild(button);
	// 	button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.btnTouchHandler, this);
	// 	this.textField.visible = false

	// }
	// private btnTouchHandler(event: egret.TouchEvent): void {
	// 	console.log("button touched");
	// 	GameApp.ins().load(this);
	// 	this.textField.visible = true
	// 	event.target.visible = false
	// }
	public testLoginLoading(){
		this.loadingBg = new egret.Bitmap();
		// this.loadingBg.fillMode = egret.BitmapFillMode.REPEAT;

		this.loadingBg.width = this.width
		this.loadingBg.height = this.height
		this.addChildAt(this.loadingBg, 0);
	}




	public setProgress(progress: number, txt: string): void {
		// this.textField.text = txt + "进度" + progress + "%";
		this.textField.text = txt + '...';
	}
	public onProgress(current: number, total: number): void {
		this.textField.text = `Loading...${current}/${total}`;
	}
}

