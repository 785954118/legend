

class Pay extends BaseClass {

    canNoSend: boolean = false;
    timeStar: boolean = true;
    sendNum: number = 0;
	/**
	 * 构造函数
	 */
    public constructor() {
        super();
    }

    public static ins(): Pay {
        return super.ins() as Pay;
    }

    public sendPayStyte(money: number, type: number, yuanbao: number,activityid:number,_url:string) {
        let self = this
        if(!activityid){
            activityid = 0
        }
        if (!yuanbao) return
        if (!type) type = 1
        if (self.sendNum == 3) {
            UserTips.ins().showTips(`请求过于频繁，请过段时间在试试`);
            return
        } else {
            if (this.timeStar) {
                this.timeStar = false
                TimerManager.ins().doTimer(20000, 1, () => {
                    // this.show(part, step - 1);
                    self.timeStar = true
                    self.sendNum = 0
                }, this);
            }
        }
        // let url = 'http://ezz25.com/gm/index.php?m=Payment&a=Placeorder'
        let url = _url
        if (!url) {
            WarnWin.show("请求地址出错，请重新点击购买按钮", function () { }, this);
            return
        }

        url += '&user_id=' + LocationProperty.userID;
        url += '&role_name=' + LocationProperty.userName;
        url += '&role_id=' + LocationProperty.roleID;
        url += '&pay_type=' + type;
        url += '&amount=' + money;
        url += '&gold=' + yuanbao;
        url += '&serverid=' + LocationProperty.serverID;
        url += '&activityid=' + activityid;

        Http.ins().send(url, true, true, function (event: egret.Event) {
            self.sendNum++
            var request = <egret.HttpRequest>event.currentTarget;
            let data = JSON.parse(request.response)


            if (data.status == 1) {
                if (data.data) {
                    if (data.data.url) {
                        let url = data.data.url;
                        if (url) {
                            ViewManager.ins().close(WarnWin);
                            if (type == 1) {
                                url = url.replace(/&amp;/g, "&")
                            } else {
                                url = decodeURIComponent(url)
                            }
                            if (window['getNative']() == 'web') {
                                window.open(url)
                            } else {
                                egret.ExternalInterface.call("openURL", url);
                            }

                        }
                    } else {
                        alert('获取地址失败，请重新请求')
                    }
                } else {
                    alert('获取地址失败，请重新请求')
                }

            } else {
                alert(data.info)
            }
            // {"status":1,"info":"\u6dfb\u52a0\u6210\u529f","data":{"order_no":"YYCQ-2019112005-346635","user_id":"111","Payment_return":"{\"code\":98157,\"msg\":\"\\u52a0\\u5bc6\\u9519\\u8bef\"}"},"api_version":1}
        })


    }


}

