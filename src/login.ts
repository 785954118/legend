class login extends eui.Component {

    private account: eui.EditableText;

    private password: eui.EditableText;
    private roomName: eui.Label;
    private loginBtn: eui.Group;
    private roomChoose: eui.Group;
    private accountTrp: eui.Label;
    private passwordTrp: eui.Label;

    private roomClose: eui.Image;
    private loginpb: eui.Group;
    private roompb: eui.Group;

    private lastServerName: eui.Group;
    private serverList: eui.Group;
    private lastServerBtn: eui.Button;


    private scrollerGroup: eui.Group;

    private _updateRoomList: Boolean = false;
    public loginView: LoadingUI;

    private blackBg: eui.Group;
    private trpInfo: eui.Label;


    private zhuceInfo: eui.Group;
    private dengluInfo: eui.Group;
    private zhuceBtn: eui.Button;
    private closeZhuce: eui.Image;
    private zhuceLabel: eui.Label;

    private warnGroup: eui.Group;
    private sureBtn0: eui.Button;
    private notBtn0: eui.Button;
    private resUrl: null;

    private notice: eui.Button;
    private gonggaoClose: eui.Button;
    private gonggao: eui.Group;
    private scrollerGroup0: eui.Group;
    // private content:String = '欢迎来到优优传奇世界！';

    private loadingbar: eui.ProgressBar;
    private loadingLabel: eui.Label;
    private testLabel: eui.Label;
    private loadingpb: eui.Group;

    private trp1: eui.Label;
    private trp2: eui.Label;

    private checkxieyi: eui.CheckBox;
    private xieyibtn: eui.Label;


    public constructor() {
        super();

        this.skinName = "loginWin";
        this.password.displayAsPassword = true;
        // this.password.addEventListener(egret.Event.CHANGE, this.onPasswordChange, this);
        // this.account.addEventListener(egret.Event.CHANGE, this.onAccountChange, this);
        this.loginBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.lastServerBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.roomChoose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.roomClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);

        this.zhuceLabel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.closeZhuce.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.zhuceBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);

        this.notBtn0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.sureBtn0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);

        this.notice.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.gonggaoClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);

        this.xieyibtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);

        // console.log(this.loadingbar)
        this.initGonggao()


        this.trp1.strokeColor = 0x000000;
        this.trp1.stroke = 2;

        this.trp2.strokeColor = 0x000000;
        this.trp2.stroke = 2;
        this.blackBg.visible = true
        this.zhuceLabel.visible = false
        this.dengluInfo.visible = true
        this.zhuceInfo.visible = false
        let self = this
        egret.ExternalInterface.call("getChannel", '');
        egret.ExternalInterface.addCallback("backChannel", function (msg) {
            // var msg = 'lx';
            if (msg) {
                window['setChannel'](msg)
                window['statistics']() // 统计
                let url = window['get_AppInfo_address']()
                url += '&channel=' + msg;
                Http.ins().send(url, true, true, function (event: egret.Event) {
                    var request = <egret.HttpRequest>event.currentTarget;
                    let data = JSON.parse(request.response)
                    if (data.code == 0) {
                        var info = data.data;
                        if (info.appVer != Version.AppVersion) {
                            self.resUrl = info.resUrl;
                            self.warnGroup.visible = true
                        } else {
                            self.getRoomList();
                            self.trpInfo.text = '获取服务器列表中...'
                        }
                    } else {
                        alert('获取版本号失败，请重启游戏')
                    }

                })
            }
            if (msg != 'lx') {
                self.zhuceLabel.visible = true
            }
        })
    }

	/*
	 	 存：egret.localStorage.setItem('test', JSON.stringify(data));
		 取：var data = JSON.parse(<string>egret.localStorage.getItem('test'));
		 删：egret.localStorage.removeItem('test');
		 清空所有:egret.localStorage.clear();

	 */
    private initGonggao() {
        let self = this
        let url = window['get_gonggao_address']();
        // egret.localStorage.getItem('serverid', JSON.stringify(roomList[i].id));
        var gonggaoVer = JSON.parse(<string>egret.localStorage.getItem('gonggaoVer'));
        Http.ins().send(url, true, true, function (event: egret.Event) {
            var request = <egret.HttpRequest>event.currentTarget;
            let data = JSON.parse(request.response)
            if (data.code == 0) {
                if (data.data.content) {
                    var txt = '';
                    if (data.data.content) {
                        txt = data.data.content
                    }
                    var tx: egret.TextField = new egret.TextField;
                    // 注意_container是事先建立好的一个显示容器，即 egret.DisplayObjectContainer，并且已经添加到显示列表中
                    tx.width = this.scrollerGroup0.width - 20;
                    tx.textFlow = (new egret.HtmlTextParser).parser(
                        txt
                    );
                    tx.x = 10;
                    tx.y = 10;
                    this.testLabel.height = tx.height;
                    this.scrollerGroup0.addChild(tx);
                }

                if (gonggaoVer) {
                    if (gonggaoVer != data.data.appVer) {
                        egret.localStorage.setItem('gonggaoVer', JSON.stringify(data.data.appVer));
                        self.gonggao.visible = true
                    }
                } else {
                    egret.localStorage.setItem('gonggaoVer', JSON.stringify(data.data.appVer));
                    self.gonggao.visible = true
                }

            }
        })




    }
    private getRoomList() {
        let self = this;
        let url = window['get_roomList_address']()
        Http.ins().send(url, true, true, function (event: egret.Event) {
            var request = <egret.HttpRequest>event.currentTarget;
            let data = JSON.parse(request.response)
            let list = data.data
            let roomListData = []
            // console.log(list)
            for (let i = 0; i < list.length; i++) {
                if (list[i].is_test == 2) {
                    // 正式服
                    let listData = {
                        id: list[i].server_id,
                        name: list[i].server_name,
                        port: list[i].server_port,
                        address: list[i].database_host,
                        isNew: false,
                        number: list.length - i,
                        serverStatic:list[i].server_state,
                    }
                    if (list[i].server_state == 4) {
                        listData.isNew = true
                    } else {
                        listData.isNew = false
                    }
                    roomListData.push(listData)
                }
            }

            egret.localStorage.setItem('id', JSON.stringify(roomListData[roomListData.length - 1].number));
            egret.localStorage.setItem('serverid', JSON.stringify(roomListData[roomListData.length - 1].id));
            egret.localStorage.setItem('serverPort', JSON.stringify(roomListData[roomListData.length - 1].port));
            egret.localStorage.setItem('serverAddress', JSON.stringify(roomListData[roomListData.length - 1].address));
            window['setRoomList'](roomListData)
            self.updateRoomName()
            self.blackBg.visible = false
        })
    }


    public setProgress(number, txt): void {
        this.loadingLabel.text = txt;
        let self = this;
        TimerManager.ins().doTimer(1000, 0, function () {
            if (self.loadingbar.value >= number) {
                if (self.loadingbar.value >= 99) {
                    return
                }
                self.loadingbar.value += 1
                self.loadingbar['guang']['x'] += 4.3;
            } else {
                self.loadingbar.value = number
                self.loadingbar['guang']['x'] = number * 4.3;
            }
        }, this);
        this.loadingbar.value = number
        this.loadingbar['guang']['x'] = number * 4.3;
    }

    private updateRoomName() {
        let roomList = window['getRoomList']()
        var data = JSON.parse(<string>egret.localStorage.getItem('id'));
        var _account = egret.localStorage.getItem('account');
        var _password = egret.localStorage.getItem('password');

        if (_account) {
            this.account.text = _account
        }
        if (_password) {
            this.password.text = _password
        }


        if (data) {
            for (let i = 0; i < roomList.length; i++) {
                if (roomList[i].number == data) {
                    this.roomName.text = roomList[i].name
                }
            }
        } else {
            this.roomName.text = roomList[roomList.length - 1].name
        }

    }

    private onAccountChange(e: egret.Event) {
        egret.log(e.target.text);
        var reg = /^\w{6,10}$/;
        if (reg.test(e.target.text)) {
            //通过，增加ok样式
            this.accountTrp.textColor = 0xFFFFFF;
        } else {
            //不通过，增加error样式
            this.accountTrp.textColor = 0xFF0202;
        }
    }

    private onPasswordChange(e: egret.Event) {
        egret.log(e.target.text);
        var reg = /^\w{8,20}$/;
        if (reg.test(e.target.text)) {
            //通过，增加ok样式
            this.passwordTrp.textColor = 0xFFFFFF;
        } else {
            //不通过，增加error样式
            this.passwordTrp.textColor = 0xFF0202;
        }
    }

    public close(...param: any[]): void {
        this.loginBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.lastServerBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.roomChoose.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.roomClose.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);


        this.zhuceLabel.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.zhuceBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.closeZhuce.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);

        this.notBtn0.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.sureBtn0.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);

        this.notice.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.gonggaoClose.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);

        this.xieyibtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);

    }

    private onTap(e: egret.TouchEvent): void {
        switch (e.currentTarget) {
            case this.roomChoose:
                this.loginpb.visible = false
                this.roompb.visible = true
                this.updateRoomList()
                break;
            case this.notBtn0:
                console.log('danji quxiao ')
                break;
            case this.gonggaoClose:
                this.gonggao.visible = false
                break;
            case this.xieyibtn:
                egret.ExternalInterface.call("openURL", 'http://cq.scmyxs.com/xieyi.html');
                break;
            case this.notice:
                this.gonggao.visible = true
                break;
            case this.sureBtn0:
                egret.ExternalInterface.call("openURL", this.resUrl);
                break;
            case this.loginBtn:
                this.loginHandle(1)
                break;
            case this.roomClose:
                // this.loginHandle()   
                this.loginpb.visible = true
                this.roompb.visible = false

                break;
            case this.zhuceBtn:
                if(this.checkxieyi.selected){
                    this.loginHandle(2)
                }else{
                    alert('请先勾选同意用户协议')
                }
                
                break;
            case this.zhuceLabel:
                this.dengluInfo.visible = false
                this.zhuceInfo.visible = true

                break;
            case this.closeZhuce:
                this.dengluInfo.visible = true
                this.zhuceInfo.visible = false
                break;
            case this.lastServerBtn:
                if(e.target.currentState == 'disable')return;
                let roomList = window['getRoomList']()
                for (let i = 0; i < roomList.length; i++) {
                    if (roomList[i].name == this.lastServerBtn.label) {
                        egret.localStorage.setItem('id', JSON.stringify(roomList[i].number));
                        egret.localStorage.setItem('serverid', JSON.stringify(roomList[i].id));
                        egret.localStorage.setItem('serverPort', JSON.stringify(roomList[i].port));
                        egret.localStorage.setItem('serverAddress', JSON.stringify(roomList[i].address));
                    }
                }

                this.loginpb.visible = true
                this.roompb.visible = false
                this.updateRoomName()
                break;
        }
    }

    // public initLoginInfo(loginView) {
    //     this.loginView = loginView
    // }
    private loginHandle(number) {

        // if (StageUtils.ins().getStage().$children[3]) {
        //     StageUtils.ins().getStage().removeChild(StageUtils.ins().getStage().$children[3])
        // }
        // this.loginView.login()
        // return
        // var reg = /^\w{6,10}$/;
        // var reg2 = /^\w{8,20}$/;
        // if (!reg.test(this.accountTrp.text) || !reg2.test(this.passwordTrp.text)) {
        //     alert('格式错误，请重新输入')
        //     return
        // }
        if (this.account.text.length == 0) {
            alert('账号不能为空')
            return
        }
        if (this.password.text.length == 0) {
            alert('密码不能为空')
            return
        }
        let self = this
        let name = this.account.text;
        let password = md5.hex_md5(this.password.text);
        let serverid = JSON.parse(<string>egret.localStorage.getItem('serverid'));
        let port = JSON.parse(<string>egret.localStorage.getItem('serverPort'));
        let address = JSON.parse(<string>egret.localStorage.getItem('serverAddress'));

        if (!serverid) {
            alert('请选择服务器')
            return
        }

        // egret.ExternalInterface.call("getChannel", '');
        // egret.ExternalInterface.addCallback("backChannel", function (msg) {
        let msg = window['getChannel']() || 'zhousi'

        let channel = msg;
        if (channel == 'lx') {
            password = self.password.text
        }
        let url = ''
        if (number == 1) {
            url = window['get_login_address']()
            url += '&name=' + name;
            url += '&password=' + password;
            url += '&serverid=' + serverid;
            url += '&channel=' + channel;

            self.blackBg.visible = true
            self.trpInfo.text = '登录中...'
        } else {
            url = window['get_register_address']()
            url += '&name=' + name;
            url += '&password=' + password;
            url += '&serverid=' + serverid;
            url += '&channel=' + channel;
        }



        if (url) {
            Http.ins().send(url, true, true, function (event: egret.Event) {
                var request = <egret.HttpRequest>event.currentTarget;
                let data = JSON.parse(request.response)
                self.blackBg.visible = false
                if (data.status == 1) {
                    // 保存信息

                    egret.localStorage.setItem("account", self.account.text)
                    egret.localStorage.setItem("password", self.password.text)

                    if (number == 1) {
                        //登录
                        egret.ExternalInterface.call("loginStatistics", JSON.stringify(msg));
                    } else {
                        //注册
                        egret.ExternalInterface.call("registerStatistics", JSON.stringify(msg));
                    }

                    if (channel == 'lx') {
                        password = md5.hex_md5(self.password.text)
                    }else{
                        channel = 'CQ'
                    }
                    let info = {
                        srvid: serverid,
                        user: channel + '_' + name,
                        serverid: serverid,
                        spverify: password,
                        srvaddr: address,
                        srvport: port
                    }
                    window['setLoginInfo'](info)

                    //  资源加载完成，删除加载界面
                    if (StageUtils.ins().getStage().$children[2]) {
                        StageUtils.ins().getStage().removeChild(StageUtils.ins().getStage().$children[2])
                    }
                    // self.loginView.login()
                    self.loadingpb.visible = true
                    self.setProgress(0, '资源加载中...')
                    LocationProperty.init()
                    GameApp.ins().load(self);

                } else {
                    alert(data.info)
                }

            })
        }


        // });




    }


    // ---------------------
    private updateRoomList() {
        let roomList = window['getRoomList']()
        var data = JSON.parse(<string>egret.localStorage.getItem('id'));
        if (data) {
            this.serverList.y = 170;
            this.lastServerName.visible = true;
        } else {
            this.serverList.y = 100;
            this.lastServerName.visible = false;
        }
        for (let i = 0; i < roomList.length; i++) {
            if (roomList[i].number == data) {
                this.lastServerBtn.label = roomList[i].name
                if(roomList[i].serverStatic == 1){
                    this.lastServerBtn.currentState = 'disable'
                }
            }
        }

        if (this._updateRoomList) {
            this.updateRoomListIcon()
            return
        }
        this._updateRoomList = true

        for (let i = 0; i < roomList.length; i++) {
            let btn = this.getBtn(roomList[i].name)
            btn.y = 40 * i;
            btn.x = 0;
            if (roomList[i].number == data) {
                btn.currentState = "up"
            }
            if (roomList[i].isNew) {
                btn['icon_new'].visible = true
            } else {
                btn['icon_hot'].visible = true
            }
            if(roomList[i].serverStatic == 1){
                btn.currentState = "disable"
            }
            this.scrollerGroup.addChild(btn)
        }
    }


    private getBtn(name) {
        var btn = new eui.Button();
        btn.skinName = 'loginList';
        btn.label = name;
        btn.labelDisplay.text = name;
        // btn.currentState = "down";
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnTouch, this);
        return btn;
    }

    private onBtnTouch(event) {
        if( event.target.currentState == 'disable'){
            return;
        }
        for (let i = 0; i < this.scrollerGroup.$children.length; i++) {
            this.scrollerGroup.$children[i]['currentState'] = 'normal'
        }
        event.target.currentState = 'up'
        let roomList = window['getRoomList']()
        for (let i = 0; i < roomList.length; i++) {
            if (roomList[i].name == event.target.label) {
                egret.localStorage.setItem('id', JSON.stringify(roomList[i].number));
                egret.localStorage.setItem('serverid', JSON.stringify(roomList[i].id));
                egret.localStorage.setItem('serverPort', JSON.stringify(roomList[i].port));
                egret.localStorage.setItem('serverAddress', JSON.stringify(roomList[i].address));
            }
        }

        this.loginpb.visible = true
        this.roompb.visible = false
        this.updateRoomListIcon()
        this.updateRoomName()
    }

    private updateRoomListIcon() {
        let roomList = window['getRoomList']()
        var data = JSON.parse(<string>egret.localStorage.getItem('id'));
        for (let i = 0; i < roomList.length; i++) {
            if (roomList[i].number == data) {
                this.scrollerGroup.$children[i]['currentState'] = "up"
            } else {
                this.scrollerGroup.$children[i]['currentState'] = "normal"
            }
            if (roomList[i].isNew) {
                this.scrollerGroup.$children[i]['icon_new'].visible = true
                this.scrollerGroup.$children[i]['icon_hot'].visible = false
            } else {
                this.scrollerGroup.$children[i]['icon_hot'].visible = true
                this.scrollerGroup.$children[i]['icon_new'].visible = false
            }
        }
    }


}