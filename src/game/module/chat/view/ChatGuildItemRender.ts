class ChatGuildItemRender extends BaseItemRender {
	private showText: eui.Label;
	private vipImg: eui.Image;
	private vip: eui.Group;
	private labelName: eui.Label;
	private head: eui.Image;
	private headBg: eui.Image;
	private labelTitle: eui.Label;
	public chatVip:eui.Image;
	public showHead: eui.Label;
	public textGroup:eui.Group;
	public showChannel:eui.Label;
	public constructor() {
		super();
	}

	public dataChanged(): void {
		if (this.data instanceof GuildMessageInfo) {
			let _data = this.data as GuildMessageInfo;
			if (_data.type != 1)
				this.currentState = `sys`;
			else if (_data.roleId == Actor.actorID)
				this.currentState = `self`;
			else
				this.currentState = `other`;
			let info: GuildMessageInfo = this.data;

			this.validateNow();
			if (this.vip && _data.type == 1) {
				this.vip.removeChildren();
				// let pic = BitmapNumber.ins().createNumPic(_data.vipLevel, "vip_v")
				// pic.x = -20;
				// this.vip.addChild(pic);
				this.head.source = `head_${_data.job}${_data.sex}`;
				this.headBg.source = ChatListItemRenderer.HEAD_BG[_data.sex];
				if (_data.titleId)
					this.labelTitle.text = GlobalConfig.TitleConf[_data.titleId].name;
				else
					this.labelTitle.text = ``;
				this.labelName.text = _data.name;
				this.vipImg.visible = this.vip.visible = _data.vipLevel != 0;
				this.showText.text = info.content;
			} else {
				if( info.type == 1 ){
				
					//会长
					if( this.showChannel )
						this.showChannel.visible = info.office?true:false;
					if( info.office ){
						let channel: string = "|C:0x" + GuildLanguage.guildOfficeColor[info.office] + "&T:[" + GuildLanguage.guildOffice[info.office] + "]|";
						this.showChannel.textFlow = TextFlowMaker.generateTextFlow(channel);
					}else{
						this.showChannel.text = "";
					}
					//vip图片
					if( this.chatVip )
						this.chatVip.visible = info.vipLevel > 0?true:false;
					let vipImgWidth = 0;
					if( info.vipLevel > 0 ){
						this.chatVip.x  = this.showChannel.width;
						this.chatVip.y  = this.showChannel.y;
						vipImgWidth = this.chatVip.width;
					}
					//名字
					if( this.showHead )
						this.showHead.visible = info.name?true:false;
					if( info.name ){
						let head: string = "|C:0x16B2FF&T:[" + info.name + "]|";
						this.showHead.textFlow = TextFlowMaker.generateTextFlow(head);
						if( !info.office ){
							this.showHead.x = vipImgWidth;
							this.showHead.y = 0;
						}else{
							this.showHead.x = this.showChannel.x + this.showChannel.width + vipImgWidth;
							this.showHead.y + this.showChannel.y;
						}
					}
					let strDesc = "|C:0xDFD1B5&T:" + info.content + "|";
					this.showText.textFlow = TextFlowMaker.generateTextFlow(strDesc);
					this.showText.x = this.showHead?(this.showHead.x + this.showHead.width):0;//职位+VIP+名字+内容
					//空格大小 = 4.5
					if( this.showChannel && this.showChannel.width + this.showHead.width + vipImgWidth + this.showText.width >= this.textGroup.width ){
						let space = "|C:0xDFD1B5&T:" ;
						this.showText.text = "";
						for(let i=1;i <= 200; i++){
							space += " ";
							if( i*4.5 > this.showChannel.width + this.showHead.width + vipImgWidth )
								break;
						}
						space += info.content + "|"
						this.showText.textFlow = TextFlowMaker.generateTextFlow(space);
						this.showText.x = 0;
						this.showText.width  = this.textGroup.width;
						this.showText.height = this.textGroup.height;
					}
					this.showText.y = this.showHead?this.showHead.y:0;
				}else{
					let str = "|C:0xDFD1B5&T:" + info.content + "|";
					this.showText.textFlow = TextFlowMaker.generateTextFlow(str);
					this.showText.x = 0;
					this.showText.y = 0;
					if(this.showChannel)
						this.showChannel.visible = false;
					if(this.chatVip)
						this.chatVip.visible = false;
					if(this.showHead)
						this.showHead.visible = false;
				}
				// let monthcardStr: string = info.monthCard == 1 ? "月" : "";
				// let vipStr: string = info.vipLevel > 0 ? "|C:0xDD6717&T:[" + monthcardStr + "V" + info.vipLevel + "]|" : "";
				// let officeStr: string = "|C:0x" + GuildLanguage.guildOfficeColor[info.office] + "&T:[" + GuildLanguage.guildOffice[info.office] + "]|";
				// let str: string = "";
				// if (info.type == 1) {
				// 	str = officeStr + "|C:0x16B2FF&T:[" + info.name + "]|" + vipStr + "|C:0xDFD1B5&T:" + info.content + "|";
				// }
				// else {
				// 	str = "|C:0xDFD1B5&T:" + info.content + "|";
				// }
				// this.showText.textFlow = TextFlowMaker.generateTextFlow(str);
			}
		}
	}
}