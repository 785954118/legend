var Request = undefined;
Request = GetRequest();
var channel = Request['channel'];
var token = Request['token'];
var serverPortAry = []
var serverId = []
var address = []
var loginData = []

var paramObj = {
    httpUrl: info.get_roomList_address,
    type: 'post',
}
var self = this
this.loading = $.openCustomLoading("数据请求中");
httpRequest(paramObj, function (respondDada) {
    self.loading.hide();
    var _data = JSON.parse(respondDada);
    if (_data.code == 0) {
        for (var i = 0; i < _data.data.length; i++) {
            if (_data.data[i].is_test == 2) {
                self.add_div(_data.data[i])
                document.getElementById("scroller").style.height = 35 * (i + 1)
            }
        }
        var num = localStorage.getItem("selectedIndex")
        if (num) {
            document.getElementById("swiper").style.height = '75%';
            document.getElementById("lastSelectdIndex").style.display = "";
            if (document.getElementById("list" + num).className && document.getElementById("list" + num).className != 'room maintain') {
                document.getElementById("list" + num).className = 'room hot'
            }
            for (var i = 0; i < _data.data.length; i++) {
                if (_data.data[i].id == num) {
                    self.add_div2(_data.data[i])
                }
            }
        } else {
            document.getElementById("swiper").style.height = '95%';
            document.getElementById("lastSelectdIndex").style.display = "none";
        }

        var swiper = new Swiper('.swiper-container', {
            direction: 'vertical',
            slidesPerView: 'auto',
            freeMode: true,
            scrollbar: {
                el: '.swiper-scrollbar',
            },
            mousewheel: true,
        });
    } else {
        alert(_data.msg);
    }
})

function add_div2(data) {
    var div = document.createElement("div");
    div.className = "room hot";
    // var num = localStorage.getItem("selectedIndex")
    // if (!num) {
    //     // localStorage.setItem("selectedIndex", parseInt(data.server_id));
    // }
    div.id = "list" + data.id;
    serverPortAry[data.id] = data.server_port
    serverId[data.id] = data.server_id
    address[data.id] = data.database_host
    document.getElementById("lastSelectdIndex").appendChild(div);

    var span = document.createElement('span')
    span.innerHTML = data.server_name
    div.appendChild(span)

    var i = document.createElement('i')
    if (data.server_state == 4) {
        i.className = "icon font new"
    } else if (data.server_state == 1) {
        i.className = "icon font maintain"
        div.className = "room maintain";
    }
    else {
        i.className = "icon font boom"
    }
    div.appendChild(i)

    var _div = document.createElement("div");
    _div.className = "_room";
    div.appendChild(_div)
    _div.onclick = (function (event) {
        if (event.target.parentNode.className == "room maintain") return;
        var ary = event.target.parentNode.id.split('')
        var ary2 = ary.splice(4)
        var number = ary2.join('')
        if (!number) return
        self.button_onclick(number)
    });
}

function add_div(data) {
    var _data = {
        serverId: data.server_id,
        serverName: data.server_name
    }
    loginData.push(_data)



    var div = document.createElement("div");
    div.className = "room boom";
    // var num = localStorage.getItem("selectedIndex")
    // if (!num) {
    //     localStorage.setItem("selectedIndex", parseInt(data.server_id));
    // }
    div.id = "list" + data.id;
    serverPortAry[data.id] = data.server_port
    serverId[data.id] = data.server_id
    address[data.id] = data.database_host
    document.getElementById("scroller").appendChild(div);

    var span = document.createElement('span')
    span.innerHTML = data.server_name
    div.appendChild(span)

    var i = document.createElement('i')
    if (data.server_state == 4) {
        i.className = "icon font new"
    } else if (data.server_state == 1) {
        i.className = "icon font maintain"
        div.className = "room maintain";
    } else {
        i.className = "icon font boom"
    }
    div.appendChild(i)

    var _div = document.createElement("div");
    _div.className = "_room";
    div.appendChild(_div)
    _div.onclick = (function (event) {
        if (event.target.parentNode.className == "room maintain") return;
        var ary = event.target.parentNode.id.split('')
        var ary2 = ary.splice(4)
        var number = ary2.join('')
        if (!number) return
        self.button_onclick(number)
    });
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

function button_onclick(number) {
    for (var i = 0; i < document.getElementById("scroller").children.length; i++) {
        if (i == 0) continue
        document.getElementById("scroller").children[i].className = 'room boom';
    }
    document.getElementById("list" + number).className = 'room hot';

    localStorage.setItem("selectedIndex", parseInt(number));



    if (token) {
        var serverPort = serverPortAry[number];
        var srvaddr = address[number];
        var serverid = serverId[number];
        var paramObj2 = {
            httpUrl: info.get_channel_login_address,
            type: 'post',
            data: {
                token: token,
                channel: channel,
                serverid: serverid
            }
        }
        var self = this;
        this.loading = $.openCustomLoading("登录中，长时间未响应请刷新网页");
        httpRequest(paramObj2, function (respondDada) {
            // self.loading.hide();
            var _data = JSON.parse(respondDada);
            if (_data.code == 0) {
                self.loading.hide();
                var loginInfo = JSON.stringify(_data.data);
                var token = toCode(loginInfo)
                window.top.location.href = info.jumpAddress + token;

            } else {
                alert(_data.msg);
            }
        })
    } else {
        window.history.go(-1);
    }

}
var toCode = function (str) {
    var key = "9873216540AZCDEFGHIJKLMNOPQRSTUVWXYB";
    var l = key.length;
    var a = key.split("");
    var s = "", b, b1, b2, b3;
    for (var i = 0; i < str.length; i++) {
        b = str.charCodeAt(i);
        b1 = b % l;
        b = (b - b1) / l;
        b2 = b % l;
        b = (b - b2) / l;
        b3 = b % l;
        s += a[b3] + a[b2] + a[b1];
    }
    return s;
}

function httpRequest(paramObj, fun, errFun) {
    var xmlhttp = null;
    /*创建XMLHttpRequest对象，
     *老版本的 Internet Explorer（IE5 和 IE6）使用 ActiveX 对象：new ActiveXObject("Microsoft.XMLHTTP")
     * */
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    /*判断是否支持请求*/
    if (xmlhttp == null) {
        alert('你的浏览器不支持XMLHttp');
        return;
    }
    /*请求方式，并且转换为大写*/
    var httpType = (paramObj.type || 'GET').toUpperCase();
    /*数据类型*/
    var dataType = paramObj.dataType || 'json';
    /*请求接口*/
    var httpUrl = paramObj.httpUrl || '';
    /*是否异步请求*/
    var async = paramObj.async || true;
    /*请求参数--post请求参数格式为：foo=bar&lorem=ipsum*/
    var paramData = paramObj.data || [];
    var requestData = '';
    for (var name in paramData) {
        requestData += name + '=' + paramData[name] + '&';
    }
    requestData = requestData == '' ? '' : requestData.substring(0, requestData.length - 1);

    /*请求接收*/
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            /*成功回调函数*/
            fun(xmlhttp.responseText);
        } else {
            /*失败回调函数*/
            errFun;
        }
    }

    /*接口连接，先判断连接类型是post还是get*/
    if (httpType == 'GET') {
        xmlhttp.open("GET", httpUrl, async);
        xmlhttp.send(null);
    } else if (httpType == 'POST') {
        httpUrl += requestData;
        //  httpUrl =  'http://ezz25.com/gm/?m=Regi&a=index&serverid=80&name=test123465&password=123456&ID_card=2121212342342'
        xmlhttp.open("POST", httpUrl, async);
        //发送合适的请求头信息
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send(requestData);
    }
}