/**
 * Created by hrz on 2017/10/14.
 * 综合聊天
 */
class ChatListItemRenderer3 extends BaseItemRender {
    public head: eui.Image;
    public nameLabel: eui.Label;
    public showText: eui.Label;
    public monthcard: eui.Image;
    public vipGroup: eui.Group;
    public vipImg: eui.Image;
    public vip: eui.Group;
    public headBg: eui.Image;
    public textGroup: eui.Group;
    public showHead: eui.Label;
    public chatVip: eui.Image;
    public showChannel: eui.Label;
    constructor() {
        super();

        // this.skinName = "ChatItemSkin2";
    }


    public dataChanged(): void {
        let _data: any = this.data;
        let maxWidth = 0;
        if (this.$parent) {
            // maxWidth = this.$parent.$getExplicitWidth();
        }

        let channel = "";
        let desc = "";
        let vip = 0;
        //公会
        if (_data instanceof GuildMessageInfo) {
            channel = "|C:0xDD6717&T:[行会]|";
            desc = _data.content;
            vip = _data.vipLevel;
            //世界
        }
        else if (_data instanceof ChatSystemData) {
            channel = "|C:0xDD6717&T:[系统]|";
            desc = _data.str;
        }
        else {
            let world: string = Chat.ins().getWorldStr();
            channel = `|C:0xDD6717&T:[${world}]|`;
            desc = _data.str;
            vip = _data.vip;
        }
        // let monthcardStr: string = _data.monthCard == 1 ? "月" : "";
        // let vipStr: string = vip > 0 ? "|C:0xDD6717&T:[" + monthcardStr + "V" + vip + "]|" : "";
        // let str: string = channel + "|C:0x16B2FF&T:[" + _data.name + "]|" + vipStr + "|C:0xDFD1B5&T:" + desc + "|";
        // this.showHead.textFlow = TextFlowMaker.generateTextFlow(str);
        this.showChannel.textFlow = TextFlowMaker.generateTextFlow(channel);
        this.showHead.text = "";
        if (_data.name) {
            let head: string = "|C:0x16B2FF&T:[" + _data.name + "]|";
            this.showHead.textFlow = TextFlowMaker.generateTextFlow(head);
        }
        this.chatVip.visible = vip > 0 ? true : false;
        let vipImgWidth = 0;
        if (vip > 0) {
            this.chatVip.x = this.showChannel.width;
            this.chatVip.y = this.showChannel.y;
            vipImgWidth = this.chatVip.width;
        }
        this.showHead.x = this.showChannel.x + this.showChannel.width + vipImgWidth;
        this.showHead.y + this.showChannel.y;
        let strDesc = "|C:0xDFD1B5&T:" + desc + "|";
        this.showText.textFlow = TextFlowMaker.generateTextFlow(strDesc);
        this.showText.y = this.showHead.y;
        this.showText.width = undefined;
        this.showText.height = undefined;
        this.validateNow();
        this.showText.x = this.showChannel.x + this.showChannel.width + vipImgWidth + this.showHead.width;
        if (this.showChannel.width + vipImgWidth + this.showHead.width + this.showText.textWidth > (maxWidth || this.textGroup.width)) {
            // let tH = this.showText.height;
            let space = "|C:0xDFD1B5&T:";
            this.showText.text = "";
            for (let i = 1; i <= 200; i++) {
                space += " ";
                if (i * 4.5 > this.showChannel.width + this.showHead.width + vipImgWidth)
                    break;
            }
            space += desc + "|";
            this.showText.x = 0;
            this.showText.textFlow = TextFlowMaker.generateTextFlow(space);
            this.showText.width = (maxWidth || this.textGroup.width);
        }
        this.height = this.showText.height + 20
    }
}