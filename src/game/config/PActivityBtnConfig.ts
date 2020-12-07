class PActivityBtnConfig {
	public type: number;
	public sort: number;
	public acTime: string;
	public id: number;
	public acDesc: string;
	public icon: string;
	public title: string;
	public light: number;
	public timeType: number;
	public startTime: string;
	public endTime: string;
	public showType: number;
	public activityType: number;
	public showReward: { type: number, id: number, count: number }[];
	public hfTimes: number;//第几次合服生效
	public pageStyle: number;
	public relyOn: number[];
	public pageSkin:string;
	public jump:any;//[窗口名,分页]
}