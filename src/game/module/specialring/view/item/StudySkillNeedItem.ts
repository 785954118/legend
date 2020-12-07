/**
 * Created by Peach.T on 2017/11/2.
 */
class StudySkillNeedItem{
    public itemIcon:ItemIcon;
    public bless:eui.Image;
    public count:eui.Label;
    public nameTxt:eui.Label;
    public redPoint:eui.Group;

    public setData(itemId: number):void
    {
        let cfg = GlobalConfig.ItemConfig[itemId];
        this.itemIcon.setData(cfg);
        this.nameTxt.text = cfg.name;
    }
}
