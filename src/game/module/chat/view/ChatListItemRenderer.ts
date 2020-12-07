class ChatListItemRenderer extends BaseItemRender {
	public head: eui.Image;
	public showText: eui.Label;
	public monthcard: eui.Image;
	public vipImg: eui.Image;
	public vip: eui.Group;
	public headBg: eui.Image;
	private labelName: eui.Label;
	private labelTitle: eui.Label;
	public static HEAD_BG: string[] = [`touxiangkuang0`, `touxiangkuang1`];
	public chatVip: eui.Image;
	public showHead: eui.Label;
	public textGroup: eui.Group;
	public type: eui.Image;

	constructor() {
		super();

		//this.skinName = "ChatItemSkin";
	}


	public dataChanged(): void {
		let _data: any = null;
		if (this.type) this.type.visible = false;
		if (this.data.type == 7) {
			_data = this.data as ChatInfoData;
		} else if (this.data.type == 3) {
			_data = this.data as ChatSystemData;
		}
		else {
			_data = this.data as GuildMessageInfo;
		}
		// let _data: ChatInfoData = this.data as ChatInfoData;
		if (_data.id == Actor.actorID)
			this.currentState = `self`;
		else if (this.data.type == 3)
			this.currentState = `sys`;
		else
			this.currentState = `other`;
			let serverName = window['getServerName'](_data.servId)
		let servStr: string = KFServerSys.ins().isKF ? `[${serverName}]` : "";

		this.validateNow();
		if (!this.vip) {
			let desc = "";
			let vip = 0;
			//公会(世界聊天不显示公会信息)
			let head: string;
			let strDesc: string;
			if (_data.type == 0 || _data.type == 1 || _data.type == 2) {
				// desc = _data.content;
				// vip  = _data.vipLevel;
				return;
				//世界
			} else if (_data.type == 3) {
				desc = _data.str;
				vip = 0;
				head = "|C:0xDD6717&T:[系统]|";
				strDesc = desc;
			}
			else {
				desc = _data.str;
				vip = _data.vip;
				head = `|C:0x16B2FF&T:[${_data.name}${servStr}]|`;
				strDesc = "|C:0xDFD1B5&T:" + desc + "|";
			}

			this.showHead.textFlow = TextFlowMaker.generateTextFlow(head);
			this.chatVip.visible = vip > 0 ? true : false;
			let vipImgWidth = 0;
			if (vip > 0) {
				vipImgWidth = this.chatVip.width;
				this.chatVip.x = 0;
				this.chatVip.y = 0;
				this.showHead.x = this.chatVip.x + vipImgWidth;
				this.showHead.y + this.chatVip.y;
			} else {
				this.showHead.x = 0;
				this.showHead.y = 0;
			}

			this.showText.textFlow = TextFlowMaker.generateTextFlow(strDesc);
			this.showText.x = this.showHead.x + this.showHead.width;//VIP+名字+内容
			//空格大小 = 4.5
			if (this.showHead.width + vipImgWidth + this.showText.width >= this.textGroup.width) {
				let space = "|C:0xDFD1B5&T:";
				this.showText.text = "";
				for (let i = 1; i <= 200; i++) {
					space += " ";
					if (i * 4.5 > this.showHead.width + vipImgWidth)
						break;
				}
				space += desc + "|"
				this.showText.textFlow = TextFlowMaker.generateTextFlow(space);
				this.showText.x = 0;
				this.showText.width = this.textGroup.width;
				this.showText.height = this.textGroup.height;
			}
			this.showText.y = this.showHead.y;
		} else {
			if (!_data.str) {
				return;
			}
			if (_data.type == 3) {
				this.labelName.text = `${_data.name}${servStr}`;
				this.head.visible = false;
				this.headBg.visible = false;
				this.vipImg.visible = false;
				this.labelTitle.text = ``;
				this.showText.textFlow = TextFlowMaker.generateTextFlow(_data.str);
				if (this.type) this.type.visible = true;
			} else {
				this.head.visible = true;
				this.headBg.visible = true;
				this.labelName.text = `${_data.name}${servStr}`;
				this.head.source = `head_${_data.job}${_data.sex}`;
				this.headBg.source = ChatListItemRenderer.HEAD_BG[_data.sex];
				if (_data.titleId)
					this.labelTitle.text = GlobalConfig.TitleConf[_data.titleId].name;
				else
					this.labelTitle.text = ``;
				this.vipImg.visible = this.vip.visible = _data.vip != 0;
				this.showText.text = _data.str;
			}


		}
	}
}