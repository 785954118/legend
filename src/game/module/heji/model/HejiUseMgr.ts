/**
 * Created by hrz on 2017/9/25.
 */

class HejiUseMgr extends BaseClass {
    static ins():HejiUseMgr {
        return super.ins() as HejiUseMgr;
    }

    private root:IHejiUse;
    private cool:number;

    register(root:IHejiUse) {
        this.root = root;
        this.reset();
        if (this.root.getSkillLvl()) {
            this.start();
        }
    }

    unregister(root:IHejiUse) {
        this.root = null;
        this.reset();
        this.stop();
    }

    start() {
        this.stop();
        TimerManager.ins().doTimer(1000, 0, this.updateTime, this);
    }

    stop() {
        TimerManager.ins().remove(this.updateTime, this);
    }

    private updateTime(){
        if (this.cool > 0) {
            this.cool -= 1;
        }
    }

    getSkillData():SkillData {
        if(!this.root.getSkillLvl()){
            return null;
        }
        let config: TogetherHitConfig = GlobalConfig.TogetherHitConfig[this.root.getSkillLvl()];
        let model: Role = this.getRoles()[0];
        if(!model) return null;
        if(Assert(config,`使用合击，合击等级：${this.root.getSkillLvl()}`)) {
            return;
        }
        let curSkill: SkillsConfig = GlobalConfig.SkillsConfig[config.skill_id[model.job - 1]];
        return new SkillData(curSkill.id);
    }

    getRoles(){
        return this.root.getRoles() || [];
    }

    getMaster() {
        let roles = this.getRoles();
        for (let i = 0; i < roles.length; i++) {
            if (roles[i].getAtt(AttributeType.atHp) > 0) {
                return EntityManager.ins().getEntityByHandle(roles[i].handle);
            }
        }
        return null;
    }

    canUse() {
        return this.cool <= 0;
    }

    useSuccess(){
        this.cool = 60;
    }

    reset() {
        this.cool = 7;
    }
}