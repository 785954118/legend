class payWin extends BaseEuiView {

	private moneyNum: eui.Label;
	private yuanbaoNum: eui.Label;

	private money: number = 0;
	private yuanbao: number = 0;
	private payType: number = 1;
	private activityid: number = 0;
	// public list: eui.List;
	public tab: eui.TabBar;
	// private checkZFB: eui.RadioButton;
	// private checkDQ: eui.RadioButton;

	// private radioButtonGroup: eui.Group;

	private payBtn: eui.Image;
	private jihuoBtn: eui.Button;
	public input: eui.TextInput;


	private bgClose: eui.Image;
	private closeBtn: eui.Button;
	private selectType: number = 0;
	private serverInfo: any = {};


	public constructor() {
		super();
		this.isTopLevel = true;
		this.skinName = "paySkin";
		this.input.maxChars = 20;
		this.input.textColor = 0x000000;
		this.tab.itemRenderer = payItemRenderer;
	}
	// 传进来的数据！
	public open(...param: any[]): void {
		this.money = param[0].money
		this.yuanbao = param[0].yuanbao
		this.moneyNum.text = this.money + '元'
		this.yuanbaoNum.text = this.yuanbao + '元宝'
		this.activityid = param[0].activityid

		// this.addTouchEvent(this.checkZFB, this.onTap)
		// this.addTouchEvent(this.checkDQ, this.onTap)

		this.addTouchEvent(this.tab, this.onTap)

		this.addTouchEvent(this.jihuoBtn, this.onTap)


		this.addTouchEvent(this.payBtn, this.sendPay);
		this.addTouchEvent(this.bgClose, this.onTap);
		this.addTouchEvent(this.closeBtn, this.onTap);


		this.getPayInfo()
	}

	public getPayInfo() {
		let self = this
		let url = window['get_pay_info']() + this.money
		Http.ins().send(url, true, true, function (event: egret.Event) {
			var request = <egret.HttpRequest>event.currentTarget;
			let data = JSON.parse(request.response)
			if (data.status == 1) {
				self.serverInfo = data.data;
				self.tab.dataProvider = new eui.ArrayCollection(data.data);
				payDate.ins().payType =  self.serverInfo[0].type
				payDate.ins()._url = self.serverInfo[0].url
				// self.tab.selectedIndex = 0;
			} else {
				alert(data.info)
			}
		})
	}


	public close(...param: any[]): void {
		// this.removeTouchEvent(this.WXbtn, this.onTap);
		// this.removeTouchEvent(this.ZFBbtn, this.onTap);
		this.removeTouchEvent(this.payBtn, this.sendPay);
		this.removeTouchEvent(this.bgClose, this.onTap);
		this.removeTouchEvent(this.jihuoBtn, this.onTap)
		this.removeTouchEvent(this.tab, this.onTap)
		this.removeTouchEvent(this.closeBtn, this.onTap)


		// this.removeTouchEvent(this.checkZFB, this.onTap)
		// this.removeTouchEvent(this.checkDQ, this.onTap)
		egret.Tween.removeTweens(this);
		WatcherUtil.removeFromArrayCollection(this.tab.dataProvider as eui.ArrayCollection);
		this.removeObserve()
	}

	public handleRadioButton(event) {

	}

	private sendPay(): void {

		if (payDate.ins().payType == '3') {
			if (window['getNative']() == 'web') {
                window.open(payDate.ins()._url)
            } else {
                egret.ExternalInterface.call("openURL", payDate.ins()._url);
            }
			
		} else {
			WarnWin.show("正在拉起支付,请稍等...\n如果获取失败，或者页面没有二维码，请重新再次拉起支付 \n\n(如果有提示，请放心支付。如果有疑问，请点击左下角客服按钮与我们联系）", function () { }, this, function () { }, this, 'sure');
			Pay.ins().sendPayStyte(this.money, parseInt(payDate.ins().payType), this.yuanbao, this.activityid, payDate.ins()._url)
			ViewManager.ins().close(payWin)
	}

		
	}
	private onTap(e: egret.TouchEvent): void {
		switch (e.currentTarget) {
			case this.tab:
				this.selectType = this.tab.selectedIndex
				payDate.ins().payType =  this.serverInfo[this.selectType].type
				payDate.ins()._url = this.serverInfo[this.selectType].url
				break;
			case this.closeBtn:
			case this.bgClose:
				ViewManager.ins().close(payWin);
				break;
			case this.jihuoBtn:
				if (!this.input.text) {
					WarnWin.show("请输入激活码！", function () { }, this);
					return
				}
				let url = window['get_dianquan_Address']()
				if (!url) {
					alert('获取不到地址')
					return
				}

				url += '&user_id=' + LocationProperty.userID;
				url += '&role_name=' + LocationProperty.userName;
				url += '&actorid=' + LocationProperty.roleID;
				// url += '&pay_type=' + type;
				url += '&amount=' + this.money;
				url += '&channel=' + window['getChannel']();
				url += '&serverid=' + LocationProperty.serverID;
				url += '&point_code=' + this.input.text;

				Http.ins().send(url, true, true, function (event: egret.Event) {
					// {
					// 	"code": 0,
					// 		"data": null,
					// 			"msg": "支付成功"
					// }
					var request = <egret.HttpRequest>event.currentTarget;
					let data = JSON.parse(request.response)
					console.log(data)
					WarnWin.show(data.msg, function () { }, this, function () { }, this, 'sure');
				})
				break
		}
	}

}
ViewManager.ins().reg(payWin, LayerManager.UI_Popup);