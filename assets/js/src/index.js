

var paraUrl = location.href;
var urlParam = {};
paramInit(paraUrl);
urlParam['egretWidth'] = '600';
urlParam['egretHeight'] = '1204';



var isTokenLogin = false
var url = decodeURI(window.location.search); //获取url中"?"符后的字串
var theRequest = new Object();
if (url.indexOf("?") != -1) {
    var str = url.substr(1);
    strs = str.split("&");
    for (var i = 0; i < strs.length; i++) {
        if (strs[i].split("=")[0] == 'key') {
            isTokenLogin = true
        }
        theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
    }
}

var channel = theRequest['channel']
var token = theRequest['key']
var getLogin = theRequest['getLogin']

if (!channel) {
    channel = 'lx'
}


function openUrl(url) {
    var a = document.createElement('a');
    var e = document.createEvent('MouseEvents');
    e.initEvent('click', true, true);
    a.href = url;
    a.target = "_blank";
    a.dispatchEvent(e);
}


function paramInit(str) {
    var whIndex = str.indexOf("?");
    if (whIndex != -1) {
        var param = str.slice(whIndex + 1).split("&");
        var strArr;
        for (var i = 0; i < param.length; i++) {
            strArr = param[i].split("=");
            urlParam[strArr[0]] = strArr[1];
        }
    }
}
window.addEventListener("message", function (event) {
    if (event.data.id != "eE")
        return;
    this.loginData = event.data.loginData
    start(event.data.urlParam);
});

function getChannel() {
    return channel;
}

function localLogin(info) {
    this.loginData = info.loginData
    start(info.urlParam);
}


function start(param) {


    if (param) {
        paramInit(param);
        paraUrl = param;
    }
    var pIframe = document.getElementById("paramIframe");
    if (pIframe)
        document.body.removeChild(pIframe);
    document.body.style.backgroundImage = "url('./resource" + urlParam.ver_res + "/bg.png')";
    document.body.innerHTML += '' +
        '<div id = "testId" style="margin: auto;width: 100%;height: 100%;" ' +
        'class="egret-player" ' +
        'data-entry-class="Main" ' +
        'data-scale-mode="' + urlParam['scaleMode'] + '" ' +
        'data-orientation="' + urlParam['orientation'] + '" ' +
        //			'data-frame-rate="' + urlParam['frameRate'] + '" ' +
        'data-frame-rate="60" ' +
        'data-content-width="' + urlParam['egretWidth'] + '" ' +
        'data-content-height="' + urlParam['egretHeight'] + '" ' +
        'data-show-paint-rect="false" ' +
        'data-multi-fingered="2" ' +
        'data-show-fps="' + urlParam['fps'] + '" ' +
        'data-show-log="true" ' +
        'data-show-fps-style="x:0,y:0,size:12,textColor:0xffffff,bgAlpha:0.3">' +
        '<div style="text-align:center; vertical-align:middel;height:30px;"> <input id="progress" type="text" size="4" value=""   style="margin-left:100px;margin-top:500px;width:640px;background-color:transparent;border:none;color:#00ff00"></input></div>';
    egret.runEgret({ renderMode: urlParam['renderMode'] });
    egret.MainContext.instance.stage.dirtyRegionPolicy = urlParam['dirty'];
}

function GetRequest() {
    var url = decodeURI(window.location.search); //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
function showLoadProgress(progress, txt) {
    document.getElementById("progress").value = txt + "进度" + progress + "%";
}

function closeLoadProgress() {
    document.getElementById("progress").style.display = "none";
}

function showGame() {

}
function getServerName(id) {
    if (this.loginData) {
        for (var i = 0; i < this.loginData.length; i++) {
            if (this.loginData[i].serverId == id) {
                return this.loginData[i].serverName
            }
        }
    }
    return ''
}

function stop() {
    return false;
}
document.oncontextmenu = stop;

window.onorientationchange = function (e) {
    var d = document.getElementById("screenHint");
    if (d) {
        d.style.display = "none";
    }
}
function isSafari() {
    if (/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)) {
        return true
    } else {
        return false
    }
    // var ua = navigator.userAgent;
    // console.log(ua)
    // console.log(ua.indexOf("Safari"))
    // console.log(ua.indexOf("Chrome"))
    // console.log(!!ua.match(/iphone/i))
    // console.log(ua.match(/Ipad/i))
    // if (!!ua.match(/iphone/i) || ua.match(/Ipad/i)) {
    //     if (ua.indexOf("Safari") > -1 && ua.indexOf("Chrome") == -1) {
    //         console.log('是')
    //         return true;
    //     } else {
    //         return false
    //     }
    // } else {
    //     return false
    // }


}
function sdkInit(appid) {
}
function isFullScree() {
    return document.isFullScreen || document.mozIsFullScreen || document.webkitIsFullScreen
}
function FullScree() {
    var el = document.documentElement;
    var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
    if (typeof rfs != "undefined" && rfs) {
        rfs.call(el);
    };
}

function getChargeUrl() {
    var url = decodeURI(window.location.search); //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            if (strs[i].split("=")[0] == 'key') {
                isTokenLogin = true
            }
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }

    var channel = theRequest['channel'];
    if (!channel) {
        channel = 'lx'
    }
    return info.payUrl1 + channel;
}

function getChargeUrl_2() {
    var url = decodeURI(window.location.search); //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            if (strs[i].split("=")[0] == 'key') {
                isTokenLogin = true
            }
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }

    var channel = theRequest['channel'];
    if (!channel) {
        channel = 'lx'
    }
    return info.payUrl2 + channel;
}

function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}


function getChatControlUrl() {
    return info.chat_control_address;
}
function getkefuUrl() {
    return info.kefu_address;
}


function createIframe(url) {
    var div = document.getElementById("testId");
    var iframe = document.createElement("iframe");
    var button = document.createElement('div')
    var bg = document.createElement('div')

    bg.id = 'pay_bg'
    bg.style.position = 'absolute'
    bg.style.background = '#000000';
    bg.style.width = '100%';
    bg.style.height = '100%';
    bg.style.top = 0;
    bg.style.left = 0;
    bg.style.opacity = 0.8;

    bg.onclick = (function () {

    })
    div.appendChild(bg)


    iframe.id = "pay_iframe";
    iframe.style.background = '#ffffff'
    iframe.src = url;
    iframe.style.position = 'absolute';
    iframe.style.border = '0px';
    iframe.style.width = '90%';
    iframe.style.height = '90%';
    iframe.style.left = '5%';
    iframe.style.top = '5%';
    div.appendChild(iframe)

    button.id = 'pay_closeBtn';
    button.style.position = 'absolute';
    button.style.right = 0;
    button.style.top = '15px';
    button.style.background = 'url(./assets/images/room/close.png)'
    button.style.width = '60px';
    button.style.height = '60px';
    var self = this;
    button.onclick = (function () {
        self.removeIframe()
    })

    div.appendChild(button)
}
function removeIframe() {

    var div = document.getElementById("testId");
    var bg = document.getElementById("pay_bg");
    var pay_iframe = document.getElementById("pay_iframe");
    var pay_closeBtn = document.getElementById("pay_closeBtn");
    if (pay_iframe) {
        div.removeChild(pay_iframe);
    }
    if (pay_closeBtn) {
        div.removeChild(pay_closeBtn);
    }
    if (bg) {
        div.removeChild(bg);
    }
}


function exitfullscreen() { //退出全屏
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}
function showRecharge(payItems) {
    // console.log('这里吊起支付！！！')
    // console.log(payItems)
}
function showQrCode(use) {
}

function connectError() {
}

function closeSocket() {
    Main.closesocket();
}

function checkAWY() {

}
function reportSDK(str) {

}
function showQRCode() {

}
function isFocus() {

}
function isShare() {

}
function roleUp() {

}
function enterGame() {

}
function createRole() {

}
function getVipInfo() {

}
function isShowGameDesktop() {
}
function saveGameDesktop() {
}
function getClientVersion(callback) {
    if (callback) callback(0);
}

var ver = "0.12";
var verUrl = "http://nnqp.ruida2017.com/game/ver.txt?ver=";