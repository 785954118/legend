class ZhuangBanId {
	/**装扮id */
	public id: number;
	/**位置 */
	public pos: number;
	/**增加属性 */
	public attr: AttributeData[];
	/**有效时长(秒)*/
	public invalidtime: number;
	/**激活消耗*/
	public cost: {itemId:number,num:number};
	/**职业需求*/
	public roletype: number;
	/**装扮显示 */
	public res:string;
	/**装扮名字 */
	public name:string;
	/**部位属性加成 */
	public attr_precent:{pos:number,pre:number}[];
	/**部位属性加成战力 */
	public exPower:number;
	public sort:number;
	/** 翅膀属性加成 */
	public wing_attr_per:number;
	/**时装资源名称 */
	public dress_name: string;
	/**特殊属性加成 */
	public special_attr_desc: string;
	/**Tips显示资源 */
	public show_img: string;
	public constructor() {
	}
}