class LoadingView extends BaseEuiView {

	public text: eui.Label;
	public constructor() {
		super();

		this.init();
	}

	protected init(): void {
		this.text = new eui.Label;
		this.text.text = "资源加载中...";
		this.addChild(this.text);
	}

	public setProgress(current: number, total: number): void {
		this.text.text = "资源加载中..." + current + "/" + total;
	}
}