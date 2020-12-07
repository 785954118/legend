class payItemRenderer extends BaseItemRender{
	private zfb: eui.Group; 
    private dq: eui.Group; 
    private wx: eui.Group; 
	public zfbBtn:eui.Image;
    public dqBtn:eui.Image;
    public wxBtn:eui.Image;

	public constructor() {
		super(); 
		this.skinName = "payItem"; 
        this.zfbBtn.addEventListener(egret.TouchEvent.TOUCH_END, function(){
            payDate.ins().payType = this.data.type
            payDate.ins()._url = this.data.url
        }, this);
        this.dqBtn.addEventListener(egret.TouchEvent.TOUCH_END, function(){
            payDate.ins().payType = this.data.type
            payDate.ins()._url = this.data.url
        }, this);
        this.wxBtn.addEventListener(egret.TouchEvent.TOUCH_END, function(){
            payDate.ins().payType = this.data.type
            payDate.ins()._url = this.data.url
        }, this);
	}

	public dataChanged(): void
	{
		super.dataChanged();
        this.closeAll()
		// this.redPoint.visible = Rank.ins().canPraiseByType(this.data.type);
        switch(this.data.type){
            case '1':
            this.zfb.visible = true
            break;
            case '2':
            this.wx.visible = true
            break;
            case '3':
            this.dq.visible = true
            break;
        }
		
	}
    public closeAll(){
        this.zfb.visible = false
        this.dq.visible = false
        this.wx.visible = false
    }
}