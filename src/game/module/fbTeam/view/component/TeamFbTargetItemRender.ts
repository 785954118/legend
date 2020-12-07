/**
 * 组队副本战斗界面怪物信息
 * @author wanghengshuai
 *
 */
class TeamFbTargetItemRender extends BaseItemRender {

    public namebg: eui.Image;
    public roleHead: eui.Image;
    public roleName: eui.Label;
    public targetSelect: eui.Image;
    public targetName: eui.Label;

    public attEffect: MovieClip;

    public constructor() {
        super();
        this.skinName = "teamFbTargetSkin";
        this.touchEnabled = true;
        this.touchChildren = false;
    }

    public dataChanged(): void {
        //CharMonster
        let monster: CharMonster = this.data;
        let config = GlobalConfig.MonstersConfig[monster.infoModel.configID];
        this.roleName.text = config.name;
        if (this.checkMonHead(config))
            this.roleHead.source = `monhead${config.head}_png`;
        if (GameLogic.ins().currAttackHandle && GameLogic.ins().currAttackHandle == monster.infoModel.handle) {
            this.addAttEffect();
            this.targetName.visible = true;
            this.targetSelect.visible = true;
        }
        else {
            this.removeAttEffect();
            this.targetName.visible = false;
            this.targetSelect.visible = false;
        }

    }

    private checkMonHead(config: MonstersConfig) {
        if (Assert(config.head, `怪物头像不存在2，id:${config.id},name:${config.name}`))
            return false;
        return true;
    }

    public addAttEffect(): void {
        if (!this.attEffect) {
            this.attEffect = new MovieClip;
            this.attEffect.x = 49;
            this.attEffect.y = 28;
            this.attEffect.playFile(RES_DIR_EFF + "FightingEff", -1);
            this.addChild(this.attEffect);
        }
    }

    public removeAttEffect(): void {
        if (this.attEffect) {
            this.attEffect.destroy();
            this.attEffect = null;
        }
    }
}