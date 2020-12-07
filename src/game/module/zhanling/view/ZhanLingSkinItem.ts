/**
 * 战灵皮肤列表控件
 */
class ZhanLingSkinItem extends BaseItemRender {
	private icon:eui.Image;
	private select:eui.Image;
	private state:eui.Image;
	private label:eui.BitmapLabel;
	private redPoint:eui.Image;
	constructor() {
		super();
		this.skinName = 'ZhanlingZBItemSkin';

	}

	protected childrenCreated(): void {
		super.childrenCreated();
	}

	protected dataChanged(): void {
		if( !this.data )return;
		let id = this.data.id;
		let config:ZhanLingBase = GlobalConfig.ZhanLingBase[id];
		if( !config )return;
		let level = ZhanLingModel.ins().getZhanLingDataByLevel(id);
		this.icon.source = config.icon;
		this.state.visible = ZhanLingModel.ins().getZhanLingDataById(id)?false:true;//未激活标识
		this.select.visible = false;
		this.label.text = level + "";
		this.label.visible = !this.state.visible;
		let b = ZhanLingModel.ins().isUpGradeByStar(id) || ZhanLingModel.ins().isHintNum(id);
		if( !b ){
			b = ZhanLingModel.ins().isUpGradeByTalent(id);
		}
		this.redPoint.visible = b;
	}
	public destruct(): void {

	}
	public setSelect(v:boolean){
		this.select.visible = v;
	}
}