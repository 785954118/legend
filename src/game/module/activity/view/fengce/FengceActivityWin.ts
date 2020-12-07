/**
 * Created by hrz on 2017/9/15.
 */

class FengceActivityWin extends BaseEuiView {
    private bgClose:eui.Rect;
    private viewStack:eui.ViewStack;
    //奖励
    private Reward:eui.Group;
    private count0:eui.Label;//每日元宝数量
    private lvText:eui.Label;
    private count2:eui.Label;//等级元宝数量
    private countDesc:eui.Label;//再升10级可领取

    private arrowleft:eui.Button;
    private arrowright:eui.Button;
    //bug反馈
    private Feedback:eui.Group;
    private edit:eui.EditableText;
    private sendBtn:eui.Button;

    private tab:eui.TabBar;

    private curLevelIndex:number = 0;
    private levelData:number[];

    private defaultText: string;
    constructor(){
        super();
        this.skinName = `fengceActiveSkin`;

        this.defaultText = `游戏内容遇到的问题，请咨询客服（不超过100字）`;
    }

    open(...params:any[]) {
        this.edit.addEventListener(egret.FocusEvent.FOCUS_IN, this.onTap, this);
        this.addTouchEvent(this.sendBtn, this.onTap);
        this.addTouchEvent(this.arrowleft, this.onTap);
        this.addTouchEvent(this.arrowright, this.onTap);
        this.addTouchEvent(this.bgClose, this.onTap);
        this.addTouchEvent(this.edit, this.onTap);
        this.addChangeEvent(this.tab, this.onSelectIndex);

        this.setSelectIndex(params[0] || 0);
    }

    private setSelectIndex(index:number) {
        this.viewStack.selectedIndex = index;

        if ( index == 0 ) {
            if ( !this.levelData ) {
                this.levelData = [];
                let config = GlobalConfig.LevelMailConfig;
                for (let id in config) {
                    if(config[id].mType) {
                        this.levelData.push(+id);
                    }
                }
                this.levelData.sort((a,b)=> {return a < b ? -1 : 1;});
            }
            let lv = Actor.level;
            let zs = UserZs.ins().lv;

            this.curLevelIndex = 0;
            for (let i = 0; i < this.levelData.length; i++) {
                this.curLevelIndex = i;
                let zz = Math.floor(this.levelData[i]/1000);
                if (zz < 1) { //小于1转
                    if (lv < this.levelData[i]) {
                        break;
                    }
                } else {
                    if ( zs < zz) {
                        break;
                    }
                }
            }
            this.updateLevel(this.curLevelIndex);

            let curDay = GameServer.serverOpenDay+1;
            let dayConfig = GlobalConfig.LoginDayMailConfig[curDay];
            if (dayConfig) {
                let mailId = dayConfig.idList[0];
                let mailConfig = GlobalConfig.MailIdConfig[mailId];
                this.count0.text = mailConfig.attachment[0].count+"";
            } else {
                this.count0.text = "0";
            }
        }
    }

    private updateLevel(levelIndex:number) {
        if (levelIndex < 0) {
            levelIndex = 0;
        }
        if (levelIndex >= this.levelData.length) {
            levelIndex = this.levelData.length - 1;
        }
        if (levelIndex == 0) {
            this.arrowleft.visible = false;
            this.arrowright.visible = true;
        } else if (levelIndex == this.levelData.length - 1) {
            this.arrowleft.visible = true;
            this.arrowright.visible = false;
        } else {
            this.arrowleft.visible = true;
            this.arrowright.visible = true;
        }

        this.curLevelIndex = levelIndex;

        let lv = this.levelData[levelIndex];
        let zs = Math.floor(this.levelData[levelIndex]/1000);
        if (zs < 1) {
            if (lv > Actor.level) {
                this.countDesc.text = `再升${lv-Actor.level}级可领取`;
            } else {
                this.countDesc.text = ``;
            }
            this.lvText.text = `${lv}级奖励`;
        } else {
            if (zs > UserZs.ins().lv) {
                this.countDesc.text = `达到${zs}转可领取`;
            } else {
                this.countDesc.text = ``;
            }
            this.lvText.text = `${zs}转奖励`;
        }
        let levelConfig = GlobalConfig.LevelMailConfig[lv];
        let mailId = levelConfig.idList[0];
        let mailConfig = GlobalConfig.MailIdConfig[mailId];
        this.count2.text = mailConfig.attachment[0].count+"";
    }

    private onSelectIndex(e:eui.ItemTapEvent) {
        this.setSelectIndex(e.itemIndex);
    }

    private onTap(e:egret.TouchEvent) {
        let tar = e.currentTarget;
        if ( tar == this.bgClose ) {
            ViewManager.ins().close(this);
        } else if ( tar == this.arrowleft ) {
            this.updateLevel(this.curLevelIndex-1);
        } else if ( tar == this.arrowright ) {
            this.updateLevel(this.curLevelIndex+1);
        } else if ( tar == this.sendBtn ) {
            if (this.edit.text.length == 0 || this.edit.text == this.defaultText) {
                UserTips.ins().showTips("内容不能为空");
                return;
            }
            ReportData.getIns().advice(this.edit.text, this.callBack, this);
        } else if ( tar == this.edit ) {
            if (this.edit.text == this.defaultText) {
                this.edit.text = "";
                this.edit.textColor = 0xffffff;
            }
        }
    }

    private callBack(){
        this.edit.text = "";
    }

    close() {
        this.tab.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onSelectIndex, this);
        this.edit.removeEventListener(egret.FocusEvent.FOCUS_IN, this.onTap, this);
    }
}

ViewManager.ins().reg(FengceActivityWin,LayerManager.UI_Popup);