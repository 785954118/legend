/**
 * Created by hrz on 2017/7/22.
 */

class LevelImage extends BaseComponent {
    private num1:eui.Image;
    private num21:eui.Image;
    private num22:eui.Image;
    private num31:eui.Image;
    private num32:eui.Image;
    private num33:eui.Image;
    private _value:number = 1;
    constructor(){
        super();
        this.skinName = `jiejiSkin`;
    }

    getValue(){
        return this._value;
    }

    setValue(val) {
        if(val <= 0) val = 1;
        this._value = val;
        let str = val+"";
        if(val <= 10) {
            this.currentState = '1';
            this.num1.source = `jieji0${str}_png`;
        } else if (val <= 20 || val % 10 == 0) {
            this.currentState = '2';
            if (str.charAt(0) == '1') {
                this.num21.source = `jieji010_png`;
                this.num22.source = `jieji0${str.charAt(1)}_png`;
            } else {
                this.num21.source = `jieji0${str.charAt(0)}_png`;
                this.num22.source = `jieji010_png`;
            }
        } else if (val < 100) {
            this.currentState = '3';
            this.num31.source = `jieji0${str.charAt(0)}_png`;
            this.num32.source = `jieji010_png`;
            this.num33.source = `jieji0${str.charAt(1)}_png`;
        }
    }
}