/**
 * Created by hrz on 2017/7/20.
 */

class SettingView extends BaseEuiView {
    private cbSound:eui.CheckBox;
    private cbShake:eui.CheckBox;
    private cbHeji:eui.CheckBox;
    private cbQuanPing:eui.CheckBox;
    private bgClose:eui.Rect;
    constructor(){
        super();
        this.skinName = `settingskin`;
    }

    open(){
        this.addTouchEvent(this.cbSound, this.onTouch);
        this.addTouchEvent(this.cbShake, this.onTouch);
        this.addTouchEvent(this.cbHeji, this.onTouch);
        this.addTouchEvent(this.cbQuanPing, this.onTouch);
        this.addTouchEvent(this.bgClose, this.onTouch);

        this.cbSound.selected = SysSetting.ins().getBool(SysSetting.SOUND_EFFECT);
        this.cbShake.selected = SysSetting.ins().getBool(SysSetting.SHAKE_WIN);
        this.cbHeji.selected = SysSetting.ins().getBool(SysSetting.AUTO_HEJI);
        this.cbQuanPing.selected = this.isFullScree()

    }

    private isFullScree(){
        return window['isFullScree']() || false;
    }



    private onTouch(e:egret.TouchEvent){
        let tar = e.currentTarget;
        if (tar == this.cbSound) {
            SysSetting.ins().setBool(SysSetting.SOUND_EFFECT, tar.selected);
            UserTips.ins().showTips(``);
        } else if (tar == this.cbShake) {
            SysSetting.ins().setBool(SysSetting.SHAKE_WIN, tar.selected);
        } else if (tar == this.cbHeji) {
            SysSetting.ins().setBool(SysSetting.AUTO_HEJI, tar.selected);
        } else if (tar == this.cbQuanPing) {
            // SysSetting.ins().setBool(SysSetting.AUTO_HEJI, tar.selected);
            if(tar.selected){
                window['FullScree']()
            }else{
                window['exitfullscreen']()
            }
            
        }
        else if (tar == this.bgClose) {
            ViewManager.ins().close(this);
        }
    }
}

ViewManager.ins().reg(SettingView, LayerManager.UI_Popup);