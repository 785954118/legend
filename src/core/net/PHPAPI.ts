/**
 * PHP接口
 */
class PHPAPI {
	/**
	 * 域名地址
	 * 192.168.201.185  lcby.api.com杜江
	 */
	public static SVER_URL: string = "http://pay.lcbyh5.com/";

	/**
	 * 获取最近登录服务器和默认登录服务器接口
	 * @param	openid
	 * 
	 * @return	efault_server  默认登录服务器
     *   		last_server  登录过得服务器
	 * 			index 获取服务器列表所用的索引
	 * 			{
	 * 				"default_server":{"server_id":"0","name":null},
	 * 				"last_server":[{"server_id":"0","name":null},{"server_id":"6","name":"\u5218\u6d0b"},{"server_id":"9","name":"1\u670d"}],
	 * 				"index":1
	 * 			}
	 */
	public static GET_LAST_SERVER: string = PHPAPI.SVER_URL + "api/getlastserver?";

	/** 
	 * 获取服务器列表
	 * @param	index 获取第几页，1开始
	 * 
	 * @return	[{"server_id":"9","name":"xxx服"},{"server_id":"1024","name":"xxx服"}]
	 */
	public static GET_SEVER_LIST: string = PHPAPI.SVER_URL + "api/getserverlist?";

	/**
	 * 登录接口
	 * 玩吧参数：
	 * @param	openid
	 * @param	openkey
	 * @param	seqid
	 * @param	pf
	 * @param	iopenid
	 * @param	via
	 * 其他参数：
	 * @param	serverid 服务器id
	 */
	public static WAN_BA: string = PHPAPI.SVER_URL + "login/wanba?";

	/** 
	 * 获取玩家信息
	 * @param	appid
	 * @param	openid
	 * @param	openkey
	 * @param	pf
	 * @param	zoneid
	 * @param	sign：'openid=AAA&appid=BBBB&zoneid=CCCC&pf=CCCCCAPPKEY'
	 * 
	 * @return	[{"code":"0","is_vip":"1","vip_level":"8","score":"1000","expiredtime":"1407312182"}]
	 * 			code为0时表示成功 code为-1时表示失败
	 */
	public static USER_INFO: string = PHPAPI.SVER_URL + "payment/userInfo?";

	/**
	 * 生成订单并发货
	 * @param	appid
	 * @param	openid
	 * @param	openkey
	 * @param	pf
	 * @param	zoneid
	 * @param	itemid
	 * @param	seqid
	 * @param	serverid
	 * @param	sign：'openid=AAA&appid=BBBB&zoneid=CCCC&pf=CCCCCAPPKEY'
	 * 
	 * @return	[{"code":"0","message":"success"}]
	 * 			code为0时表示成功 code为-1时表示失败
	 */
	public static BUY: string = PHPAPI.SVER_URL + "payment/buy?";
}