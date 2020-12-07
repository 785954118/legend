/**
 * Created by hrz on 2017/7/19.
 */

class SoundUtil extends BaseClass{
    //跑动音效
    static RUN:string = `longlin_a_pd_mp3`;
    //窗口打开关闭音效
    static WINDOW:string = `longlin_a_dkjm_mp3`;
    //任务完成与接受音效
    static TASK:string = `longlin_b_renwu_mp3`;
    //玩家升级音效
    static LEVEL_UP:string = `longlin_b_shengji_mp3`;
    //传送场景
    static SCENE:string = `longlin_a_zyz_mp3`;
    //穿戴装备
    static EQUIP:string = `longlin_a_chuandai_mp3`;
    //创建角色成功
    static CREATE_ROLE:string = `longlin_a_chuangjue_mp3`;
    //强化
    static FORGE:string = `longlin_a_qianghua_mp3`;
    //熔炼
    static SMELT:string = `longlin_b_ronglian_mp3`;
    //技能升级
    static SKILL_UP:string = `longlin_b_jineng_mp3`;

    static WINDOW_OPEN:boolean = false;

    static ins():SoundUtil{
        return super.ins() as SoundUtil;
    }
    private _delayTime:number = 0;
    private _delayStartTime:number = 0;

    private _runTimeGap:number = 700;
    private _runTimeStart:number = 0;
    private playRunSound(){
        if(egret.getTimer() - this._runTimeStart >= this._runTimeGap){
            this._runTimeStart = egret.getTimer();
            SoundManager.ins().playEffect(SoundUtil.RUN);
        }
    }

    public playRun(){
        if(egret.getTimer() - this._runTimeStart > this._runTimeGap+100) {
            this.playRunSound();
        }
        if(!TimerManager.ins().isExists(this.playRunSound, this)){
            TimerManager.ins().doTimer(this._runTimeGap, 0, this.playRunSound,this);
        }
    }

    public stopRun(){
        TimerManager.ins().remove(this.playRunSound, this);
    }

    public playEffect(effectName) {
        if(egret.getTimer() - this._delayStartTime < this._delayTime) {
            return;
        }
        SoundManager.ins().playEffect(effectName);
    }

    public delayTime(time:number) {
        this._delayTime = time;
        this._delayStartTime = egret.getTimer();
    }
}