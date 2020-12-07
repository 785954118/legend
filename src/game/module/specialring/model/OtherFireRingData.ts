/**
 * Created by hrz on 2017/11/8.
 *
 * 其他烈焰戒指数据 （遭遇战 矿洞战 野外玩家）
 */

class OtherFireRingData {
    lv:number;
    skillBooks:RingSkillInfo[];
    /**能力组，结构：道具能力ID，使用次数*/
    abilityItems:number[];

    /** 烈焰印记等级 */
	public lyMarkLv:number = 0;

	/** 烈焰印记技能 */
	public lyMarkSkills:number[] = [];

    parser(bytes:GameByteArray){
        this.lv = bytes.readInt();
        this.skillBooks = [];
        this.abilityItems = [];

        if (this.lv > 0) {
            let bookCount = bytes.readShort();
            for (let i = 0; i < bookCount; i++) {
                let skillInfo:RingSkillInfo = new RingSkillInfo();
                skillInfo.position = bytes.readShort();
                skillInfo.skillId = bytes.readShort();
                skillInfo.skillLvl = bytes.readShort();
                this.skillBooks.push(skillInfo);
            }

            let itemCount = bytes.readShort();
            for (let i = 0; i < itemCount; i++) {
                let id:number = bytes.readShort();
                let lv:number = bytes.readShort();
                this.abilityItems[id]=lv;
            }

            this.lyMarkLv = bytes.readShort();
            this.lyMarkSkills = [];
            let len:number = bytes.readByte();
            this.lyMarkSkills.length = len;

            for (let i:number = 0; i < len; i++)
                this.lyMarkSkills[i] = bytes.readShort();
        }
    }
}