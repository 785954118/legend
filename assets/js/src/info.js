


var localAddress = 'https://cq.wfrunquan.com';
window.info = {
    version: '1.1.0',
    // channel:'lx', // lx是使用token登录的，渠道也是从浏览器获取的
    payUrl1: localAddress+ '/gm/index.php?m=Payment&a=Placeorder&platform=',
    payUrl2: localAddress+ '/gm/index.php?m=Paycc&a=placeorder&platform=',
    chat_control_address:localAddress+'/gm/index.php?m=Chat&a=chat_controls&',
    kefu_address:'https://temp-chat.mstatik.com/widget/standalone.html?eid=184645',

    get_channel_login_address:localAddress+ '/gm/index.php?m=Regi&a=channel_login&',


    get_gonggao_address: localAddress + '/gm/index.php?m=ServerInfo&a=game_notice',
    get_roomList_address: localAddress + '/gm/index.php?m=ServerInfo&a=server_list',
    get_login_address: localAddress + '/gm/index.php?m=Regi&a=channel_reg&',
    get_register_address: localAddress + '/gm/index.php?m=Regi&a=index&',

}