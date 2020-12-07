//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//	 * Redistributions of source code must retain the above copyright
//	   notice, this list of conditions and the following disclaimer.
//	 * Redistributions in binary form must reproduce the above copyright
//	   notice, this list of conditions and the following disclaimer in the
//	   documentation and/or other materials provided with the distribution.
//	 * Neither the name of the Egret nor the
//	   names of its contributors may be used to endorse or promote products
//	   derived from this software without specific prior written permission.
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


import load = EXML.load;
class ThemeAdapter implements eui.IThemeAdapter {

	/**
	 * 解析主题
	 * @param url 待解析的主题url
	 * @param compFunc 解析完成回调函数，示例：compFunc(e:egret.Event):void;
	 * @param errorFunc 解析失败回调函数，示例：errorFunc():void;
	 * @param thisObject 回调的this引用
	 */
	public getTheme(url:string,compFunc:Function,errorFunc:Function,thisObject:any):void {
		let load_count:number = 0;
		let self = this;

		function onGetRes(e:string):void {
			compFunc.call(thisObject, e);
			RES.destroyRes(`${RES_RESOURCE}default.thm.json`);
		}
		function onError(e:RES.ResourceEvent):void {
			if(e.resItem.url == url) {
				load_count += 1;
				Assert(false, `加载 default.thm.json 失败!! 失败次数：${load_count}.`);
				if(load_count < 3) {
					RES.getResByUrl(url, onGetRes, self, RES.ResourceItem.TYPE_TEXT);
					return;
				}

				RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onError, null);
				alert(`皮肤加载失败，请检查网络重新登录`);
				// errorFunc.call(thisObject);
			}
		}
		RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onError, null);
		RES.getResByUrl(url, onGetRes, this, RES.ResourceItem.TYPE_TEXT);
	}
}