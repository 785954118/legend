/**
 * 战灵主界面
 *
 */
class ZhanLingPanel extends BaseEuiView {
	/**控件区*/
	private roleSelect:RoleSelectPanel;
	private zhanling:eui.Group;//战灵特效
	private model:MovieClip;
	private detail:eui.Button;//详情
	private powerPanel:PowerPanel;
	private suit:eui.Button;//套装查看
	private huanxing:eui.Button;//幻形
	private zhanlingName:eui.Image;//战灵名字
	private curAtt:eui.Label;//当前属性
	private nextAtt:eui.Label;//下一个属性
	private maxAtt:eui.Label;//满级后的属性显示
	private starGroup:eui.Group;//星星
	private barGroup:eui.Group;//经验条

	private checkBoxs:eui.CheckBox;//自动购买
	private costGroup:eui.Group;//消耗
	private icon:eui.Image;//消耗图标
	private countLabel:eui.Label;//消耗材料数
	private upBtn:eui.Button;//一键升星
	private upBtnEx:eui.Button;//皮肤激活
	private upRedPoint:eui.Image;//一键升星红点
	private lv:ItemStage;//阶级数控件
	private list:eui.List;//战灵皮肤界面的皮肤列表
	private hhRedPoint:eui.Image;
	private btn0:eui.Button;
	private rightRed0:eui.Button;
	private btn1:eui.Button;
	private rightRed1:eui.Button;
	private listScroller:eui.Scroller;
	/**当前选中的战灵id*/
	private zlId:number;
	private starList: StarList;
	private barbc:ProgressBarEff;
	private huanhua:eui.Button;
	private listData:eui.ArrayCollection;
	private isAutoUp:boolean;//是否一键升阶
	private _tick:number;//监听事件更新频率
	private postEvent:number;//允许接收的最大事件数刷新
	private closeBtn:eui.Button;
	private maxZlLv:number;
	private costType:number;
	private costCount:number;//
	private help:eui.Button;
	private eff:eui.Group;//天赋升级特效组
	private tfmc:MovieClip;
	constructor() {
		super();
		// this.skinName = 'ZhanlingSkin';
		// this.isTopLevel = true;
	}

	protected childrenCreated(){

	}
	public close(...param: any[]): void {
		// this.removeTouchEvent(this.leftbtn, this.onEvent);
		// this.list1.removeEventListener(egret.Event.CHANGE, this.onClick, this);
		// this.list0.removeEventListener(eui.ItemTapEvent.ITEM_TAP,this.onSoulClick,this);
		this.isAutoUp = false;
		this.upBtn.label = this.isAutoUp?`取 消`:`一键升星`;
		TimerManager.ins().remove(this.checkUpdate, this);
		TimerManager.ins().remove(this.autoUpStar, this);
		this.removeObserve();

	}
	public open(...param: any[]): void {
		this.openView(param);
	}

	protected openView(param) {
		this.addTouchEvent(this.detail, this.onEvent);
		this.addTouchEvent(this.suit, this.onEvent);
		this.addTouchEvent(this.huanxing, this.onEvent);
		this.addTouchEvent(this.upBtn, this.onEvent);
		this.addTouchEvent(this.upBtnEx, this.onEvent);
		this.addTouchEvent(this[`skillIcon0`], this.onEvent);
		this.addTouchEvent(this.huanhua, this.onEvent);
		this.addTouchEvent(this.btn0, this.onEvent);
		this.addTouchEvent(this.btn1, this.onEvent);
		this.addTouchEvent(this.closeBtn, this.onEvent);
		this.addTouchEvent(this.checkBoxs, this.updateCost);
		this.addTouchEvent(this.checkBoxs, this.updateModel);
		this.addTouchEvent(this.icon, this.showIconTips);
		this.addTouchEvent(this.help, this.onEvent);
		this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onSoulClick,this);
		this.observe(UserBag.ins().postItemAdd, this.timerUpdate);//道具添加
		this.observe(UserBag.ins().postItemDel, this.timerUpdate);//道具删除
		this.observe(UserBag.ins().postItemCountChange, this.timerUpdate);//道具变更
		this.observe(ZhanLing.ins().postZhanLingInfo, this.timerUpdate);
		this.observe(ZhanLing.ins().postZhanLingUpExp, this.timerUpdate);
		this.observe(ZhanLing.ins().postZhanLingDrug, this.timerUpdate);
		this.observe(ZhanLing.ins().postZhanLingWear, this.timerUpdate);
		this.observe(ZhanLing.ins().postZhanLingSkinUpGrade, this.timerUpdate);
		this.observe(ZhanLing.ins().postZhangLingSkinChange, this.timerUpdate);//战灵皮肤切换回应
		this.observe(ZhanLing.ins().postZhanLingUpgrade, this.stopUpGrade);//升星后处理
		this.observe(ZhanLing.ins().postZhanLingTalentLvUpGrade, this.TanlentLvUpGrade);//战灵天赋升级后处理
		// this.observe(ZhanLing.ins().postZhanLingComposeItem, this.timerUpdate);//战灵装备穿戴
		// this.list1.addEventListener(egret.Event.CHANGE, this.onClick, this)
		// if( !ZhanLingModel.ins().ZhanLingOpen() )return;
		this.list.itemRenderer = ZhanLingSkinItem;
		this.list.useVirtualLayout = false;
		this.listData = new eui.ArrayCollection();
		this.list.dataProvider = this.listData;
		this.zlId = param[0] || 0;//战灵id为0 皮肤幻化弄
		this._tick = 0;
		this.postEvent = Math.floor(150/GlobalConfig.ZhanLingConfig.unitTime);
		for( let i = 0; i < GlobalConfig.ZhanLingBase[this.zlId].skill.length;i++ ){
			this.addTouchEvent(this[`skillIcon${i+1}`],this.onSkillEvent);
		}

		for( let k in GlobalConfig.ZhanLingConfig.upgradeInfo ){
			let idx = GlobalConfig.ZhanLingConfig.upgradeInfo[k].sort;
			this.addTouchEvent(this[`up${idx}`],this.onDrugEvent);
		}
		this.addEvent(eui.UIEvent.CHANGE_END, this.listScroller, this.onChange);
		this.isAutoUp = false;
		this.roleSelect.hideRole();
		this.init();
		TimerManager.ins().doTimer(500, 0, this.checkUpdate, this);
	}

	/**定时检查_tick消息是否需要更新*/
	private checkUpdate(){
		//一定时间内 如果有事件来但时间数小于event个事件就更新一下 频繁派发太多事件就留给timerUpdate去更新
		if( this._tick && this._tick <= this.postEvent ){
			this._tick = 0;
			TimerManager.ins().doNext(() => {
				this.updateUI();
			},this);
		}
	}
	/**防止频繁更新*/
	private timerUpdate(): void {
		this._tick++;
		if( this._tick && this._tick > this.postEvent ){
			this._tick = 0;
			//刷新状态后下一帧变化界面数据
			TimerManager.ins().doNext(() => {
				this.updateUI();
			},this);
		}
	}
	public init(){
		this.updateUI(true);
	}
	public updateState(){
		 let zlData:ZhanLingData = ZhanLingModel.ins().getZhanLingDataById(this.zlId);
		 let zlLeve = zlData?zlData.level:0;
		 let maxLv = CommonUtils.getObjectLength(GlobalConfig.ZhanLingLevel[this.zlId]) - 1;//不算0级
		 if( !this.zlId ){
		 	//战灵Id为0是主界面 消耗战灵等级表的单次消耗进阶丹or系统配置表单次消耗元宝
			 if( zlLeve >= maxLv ){
				 this.currentState = "zl_max";
			 }else{
				 this.currentState = "zl_up";
			 }
		 }else{
			 if( zlLeve >= maxLv ){
				 this.currentState = "skin_max";
			 }else{
				 this.currentState = "skin_up";
			 }
		 }
		//升级后仍然需要检测状态实时变化
		 this.validateNow();
	}
	private updateUI(init?:boolean){
		this.updateState();
		this.updateTop(init);
		this.updateItem();
		this.updateSkill();
		this.updateValue();
		this.updateDown();
		this.updateCost();
		this.updateRedPoint();
	}
	//战灵名字 右上3个按钮 阶级显示
	private updateTop(init?:boolean){
		//战灵皮肤列表
		if( this.currentState == "skin_up" || this.currentState == "skin_max" ){
			this.listData.replaceAll(ZhanLingModel.ins().showZLlist);
			this.list.validateNow();
			//选中状态
			if( this.zlId ){
				for( let i = 0; i < this.list.numElements;i++ ){
					let render: ZhanLingSkinItem = this.list.getVirtualElementAt(i) as ZhanLingSkinItem;
					let zlbase:ZhanLingBase = this.list.dataProvider.getItemAt(i) as ZhanLingBase;
					if( zlbase.id == this.zlId ){
						render.setSelect(true);
						if( init ){
							let startPos = 0;
							if( i > 3 ){
								this.listScroller.stopAnimation();
								startPos = Math.floor((i+1)/4)*render.height;
							}
							this.setStartPosition(startPos);
						}
						break;
					}
				}
			}
			this.onChange();
			//幻化按钮
			this.huanhua.visible = ZhanLingModel.ins().getZhanLingDataById(this.zlId)?true:false;
			this.huanhua.icon = ZhanLingModel.ins().ZhanLingSkinId == this.zlId?"zl_quxiao_btn":"zl_huanhua_btn"
		}

		//战灵主界面右上角丹药
		let zllconfig = GlobalConfig.ZhanLingConfig;
		for( let k in zllconfig.upgradeInfo ){
			let i = zllconfig.upgradeInfo[k].sort;
			if( this[`up${i}`] ){
				this[`up${i}`].icon = GlobalConfig.ItemConfig[k].icon + "_png";
			}
			if( this[`redPoint${i}`] ){
				this[`redPoint${i}`].visible = ZhanLingModel.ins().getZhanLingDataByDrugUse(this.zlId,Number(k));
			}
			if( this[`used${i}`] ){
				this[`used${i}`].text = ZhanLingModel.ins().getZhanLingDataByDrug(this.zlId,Number(k));
			}
		}
		//战灵阶级
		let level = ZhanLingModel.ins().getZhanLingDataByLevel(this.zlId);
		this.lv.data = GlobalConfig.ZhanLingLevel[this.zlId][level].stageDesc;//阶级数描述
		//战灵模型
		if( !this.model )
			this.model = new MovieClip();
		if( !this.model.parent )
			this.zhanling.addChild(this.model);
		this.updateModel();
	}
	/**一键升星期间更新模型*/
	private updateModel(){
		let level = ZhanLingModel.ins().getZhanLingDataByLevel(this.zlId);
		let cfg:ZhanLingLevel;
		if( this.isAutoUp ){
			let stage = ZhanLingModel.ins().getZhanLingDataByStage(this.zlId);
			let nextLv = stage*10 + 1;
			cfg = GlobalConfig.ZhanLingLevel[this.zlId][nextLv];
			if( !cfg )
				cfg = GlobalConfig.ZhanLingLevel[this.zlId][level];
			else
				level = nextLv;//下一阶级
		}else{
			cfg = GlobalConfig.ZhanLingLevel[this.zlId][level];
		}

		this.zhanlingName.source = GlobalConfig.ZhanLingLevel[this.zlId][level].zlName;//战灵名字
		if( this.model.name != RES_DIR_EFF + cfg.innerAppearance )
			this.model.playFile(RES_DIR_EFF + cfg.innerAppearance,-1);
	}
	//装备道具
	private updateItem(){
		let itemData: ItemData[] = UserBag.ins().getBagGoodsByType(ItemType.TYPE_21);
		if( itemData )
			itemData.sort(this.sort);
		for( let i = 1;i <= GlobalConfig.ZhanLingConfig.equipPosCount;i++ ){
			 this[`item${i}`].name = i.toString();
			 let itemid = ZhanLingModel.ins().getZhanLingDataByItem(this.zlId,i);
			 this[`item${i}`].data = {zlId:this.zlId,id:itemid,equips:itemData};
		}
	}
	//技能
	private updateSkill(){
		let config:ZhanLingBase = GlobalConfig.ZhanLingBase[this.zlId];
		if( !config )return;
		let talentId = config.talent;
		let talentLv = ZhanLingModel.ins().getZhanLingDataByTalentLv(this.zlId);
		let zlTconfig:ZhanLingTalent = GlobalConfig.ZhanLingTalent[talentId][talentLv];
		if( !zlTconfig )
			zlTconfig = GlobalConfig.ZhanLingTalent[talentId][1];
		//在天赋描述中有就拿天赋描述 否则拿技能数据的icon
		if( zlTconfig.talentDesc && zlTconfig.talentDesc.icon ){
			this[`skillIcon0`].source = zlTconfig.talentDesc.icon;
		}else{
			if( zlTconfig.passive )
				this[`skillIcon0`].source = Math.floor(zlTconfig.passive[0].id / 1000) * 1000 + "_png";
		}
		//技能icon
		for( let i = 0; i < GlobalConfig.ZhanLingBase[this.zlId].skill.length;i++ ){
			let skillid = GlobalConfig.ZhanLingBase[this.zlId].skill[i].id;//ZhanLingSkill的技能编号 不是技能id
			let zlskill = GlobalConfig.ZhanLingSkill[skillid];//战灵技能库
			if( zlskill.desc && zlskill.desc.icon )
				this[`skillIcon${i+1}`].source = zlskill.desc.icon;
			else
				this[`skillIcon${i+1}`].source = Math.floor(zlskill.passive / 1000) * 1000 + "_png";
		}
		this[`blackImg0`].visible = talentLv?false:true;//黑色蒙版
		let lv = ZhanLingModel.ins().getZhanLingDataByLevel(this.zlId);
		for( let i = 0; i < GlobalConfig.ZhanLingBase[this.zlId].skill.length;i++ ){
			let sk:{id:number,open:number} = GlobalConfig.ZhanLingBase[this.zlId].skill[i];
			this[`blackImg${i+1}`].visible = (sk.open > lv)?true:false;//黑色蒙版
		}
	}
	//战力属性等数值
	private updateValue(){
		let lv = ZhanLingModel.ins().getZhanLingDataByLevel(this.zlId);
		let zllconfig:ZhanLingLevel = GlobalConfig.ZhanLingLevel[this.zlId][lv];
		if( !zllconfig )return;
		let TotalValue = ZhanLingModel.ins().getZhanLingPower(this.zlId);
		let power: number = TotalValue[0]?TotalValue[0]:0;
		this.powerPanel.setPower(power);
		if( !TotalValue[1].length )
			TotalValue[1] = this.getEmptyAttrs(this.zlId);
		if( !TotalValue[2].length )
			TotalValue[2] = this.getEmptyAttrs(this.zlId,true);
		let curAttrs:string = AttributeData.getAttStr(TotalValue[1], 0, 1, "：") + "\n";
		let netAttrs:string = AttributeData.getAttStr(TotalValue[2], 0, 1, "：") + "\n";

		this.curAtt.text  = curAttrs;
		this.nextAtt.text = netAttrs;
	}
	//无数据时候赋值默认数据
	private getEmptyAttrs(id:number,next?:boolean):AttributeData[]{
		let zlAttr: AttributeData[] = [];
		let config:ZhanLingLevel = GlobalConfig.ZhanLingLevel[id][0];
		zlAttr = ZhanLingModel.ins().addAttrs(zlAttr,config.attrs);
		if( !next ) {//非预览下一级属性 把属性置0
			for( let i = 0; i < zlAttr.length;i++ ){
				zlAttr[i].value = 0;
			}
		}
		return zlAttr;
	}
	//星星和进度条
	private updateDown(isUp:number = 0){
		if( this.zlId ){//如果是皮肤判定是否激活 未激活不显示
			let zlData:ZhanLingData = ZhanLingModel.ins().getZhanLingDataById(this.zlId);
			this.starGroup.visible = this.barGroup.visible = zlData?true:false;
			if( !zlData )return;
		}

		if( !this.starList ){
			this.starList = new StarList(10);
			this.starList.horizontalCenter = 0;
		}
		if( !this.starList.parent ){
			this.starGroup.addChild(this.starList);
		}

		let lv = ZhanLingModel.ins().getZhanLingDataByLevel(this.zlId);
		let showLv = Math.floor(lv%10);
		if( lv ){
			let stage2 = showLv;
			if( !stage2 ){
				showLv = 10;//N阶满星
			}
		}
		this.starList.setStarNum( showLv,isUp );
		if( !this.barbc ){
			this.barbc = new ProgressBarEff();
			this.barbc.setWidth(525);
		}
		if( !this.barbc.parent ){
			this.barGroup.addChild(this.barbc);
		}
		let exp = ZhanLingModel.ins().getZhanLingDataByExp(this.zlId);
		let config:ZhanLingLevel = GlobalConfig.ZhanLingLevel[this.zlId][lv];
		if( config ){
			this.barbc.reset();
			this.barbc.setData(exp, config.exp);
		}

	}
	//消耗
	private updateCost(){
		let arr = this.getCostValue();
		let curCount = arr[0];
		let totalCount = arr[1];
		let color = curCount >= totalCount?0x00ff00:0xff0000;
		this.countLabel.textFlow = TextFlowMaker.generateTextFlow1(`|C:${color}&T:${curCount}|/${totalCount}`);
		this.upBtn.visible = ZhanLingModel.ins().getZhanLingDataById(this.zlId)?true:false;//战灵是否激活
		this.upBtnEx.visible = !this.upBtn.visible;
	}
	private getCostValue(){
		let zlData:ZhanLingData = ZhanLingModel.ins().getZhanLingDataById(this.zlId);
		let zlBase:ZhanLingBase = GlobalConfig.ZhanLingBase[this.zlId];
		this.checkBoxs.visible = true;//激活皮肤流程隐藏勾选元宝
		this.costType = ItemType.TYPE_1;
		if( zlData || !zlBase.mat ){//战灵未激活的情况下 判断一下激活需不需要材料 空证明无需激活
			let curCount = 0;
			let totalCount = 0;
			let lv = ZhanLingModel.ins().getZhanLingDataByLevel(this.zlId);
			let zllconfig:ZhanLingLevel = GlobalConfig.ZhanLingLevel[this.zlId][lv];
			//即便是勾选了自动购买 也要等消耗材料用完才显示元宝
			let config:ItemConfig = GlobalConfig.ItemConfig[GlobalConfig.ZhanLingConfig.stageitemid];
			this.icon.source = config.icon + "_png";
			let itemData: ItemData = UserBag.ins().getBagItemById(GlobalConfig.ZhanLingConfig.stageitemid);
			curCount = itemData?itemData.count:0;
			totalCount = zllconfig.count;
			if( this.checkBoxs.selected && curCount < totalCount ){
				curCount = Actor.yb;
				this.icon.source = "szyuanbao";
				totalCount = GlobalConfig.ZhanLingConfig.unitPrice*zllconfig.count;
				this.costType = MoneyConst.yuanbao;
			}
			this.costCount = totalCount;
			return [curCount,totalCount];
		}
		//皮肤激活流程
		let config:ItemConfig = GlobalConfig.ItemConfig[zlBase.mat];
		this.icon.source = config.icon + "_png";
		let itemData: ItemData = UserBag.ins().getBagItemById(zlBase.mat);
		let curCount = itemData?itemData.count:0;
		let zlTalent:ZhanLingTalent = GlobalConfig.ZhanLingTalent[this.zlId][1];
		let totalCount = zlTalent.costCount;
		this.checkBoxs.visible = false;
		this.costType = ItemType.TYPE_22;
		this.costCount = totalCount;
		return [curCount,totalCount];
	}
	/**红点*/
	private updateRedPoint(){
		/**不需要显示的红点*/
		for( let i = 0; i < 5;i++ ){
			if( this[`skillRedPoint${i}`] ){
				this[`skillRedPoint${i}`].visible = false;
			}
		}
		this.hhRedPoint.visible = false;

		this.upRedPoint.visible = ZhanLingModel.ins().isUpGradeByStar(this.zlId) || ZhanLingModel.ins().isHintNum(this.zlId);
		this[`skillRedPoint0`].visible = ZhanLingModel.ins().isUpGradeByTalent(this.zlId);
		if( this[`hxRedPoint`] ){
			//皮肤显示列表中的皮肤编号
			let b = false;
			for( let i = 0; i < ZhanLingModel.ins().showZLlist.length;i++ ){
				let zlBase:ZhanLingBase = ZhanLingModel.ins().showZLlist[i];
				if( zlBase.id ){
					let b1 = ZhanLingModel.ins().isUpGradeByStar(zlBase.id) || ZhanLingModel.ins().isHintNum(zlBase.id);
					if( b1 ){
						b = true;
						break;
					}
					let b2 = ZhanLingModel.ins().isUpGradeByTalent(zlBase.id);
					if( b2 ){
						b = true;
						break;
					}
				}
			}
			this[`hxRedPoint`].visible = b;
		}
	}
	private onSoulClick(e:eui.ItemTapEvent){
		if (e && e.itemRenderer && e.item) {
			if( this.currentState == "zl_up" || this.currentState == "zl_max" ){
				//战灵主界面跳转皮肤
				let index = this.getIndexRule();
				ViewManager.ins().open(ZhanLingPanelEx,index);
			}else{
				//皮肤界面跳转别的皮肤
				let item:ZhanLingBase = e.item as ZhanLingBase;
				this.zlId = item.id;
				this.updateUI();
			}
		}
	}
	private onSkillEvent( e:egret.TouchEvent ){
		for( let i = 0; i < GlobalConfig.ZhanLingBase[this.zlId].skill.length;i++ ){
			if( e.currentTarget == this[`skillIcon${i+1}`] ){
				let sk:{id:number,open:number} = GlobalConfig.ZhanLingBase[this.zlId].skill[i];
				ViewManager.ins().open(ZhanLingTips,this.zlId,sk.id);
				break;
			}
		}
	}
	private onDrugEvent( e:egret.TouchEvent ){
		for( let k in GlobalConfig.ZhanLingConfig.upgradeInfo ){
			let idx = GlobalConfig.ZhanLingConfig.upgradeInfo[k].sort;
			if( e.currentTarget == this[`up${idx}`] ) {
				let itemid = this.getDrugItemByIndex(idx);
				if( this[`redPoint${idx}`].visible ){
					//使用丹药
					ZhanLing.ins().sendZhanLingDrug(this.zlId,itemid);
				}else{
					//弹出丹药tips
					ViewManager.ins().open(ZhanLingItemTips,this.zlId,itemid);
				}
			}
		}
	}
	public onEvent(e: egret.TouchEvent){
		let num: number = 84 * 5;
		let scrollV: number = 0;
		switch( e.currentTarget ){
			case this.closeBtn://皮肤关闭按钮
				ViewManager.ins().close(this);
				break;
			case this.detail://详情
				break;
			case this.suit:
				ViewManager.ins().open(ZhanLingSuitTip,this.zlId);
				break;
			case this.huanxing:
				//战灵主界面跳转皮肤
				let index = this.getIndexRule();
				ViewManager.ins().open(ZhanLingPanelEx,index);
				break;
			case this.upBtn:
				this.sendUpGrade();
				break;
			case this.upBtnEx://皮肤激活
				if( this.upRedPoint.visible ){
					ZhanLing.ins().sendZhanLingSkinUpGrade(this.zlId);
				}else{
					UserTips.ins().showTips(`|C:0xff0000&T:材料不足`);
				}
				break;
			case this[`skillIcon0`]:
				//天赋tips
				if( this[`skillRedPoint0`] && this[`skillRedPoint0`].visible ){
					//ZhanLing.ins().sendZhanLingSkinUpGrade(this.zlId);
					let talentId = ZhanLingModel.ins().getZhanLingDataByTalentId(this.zlId);
					let talentLv = ZhanLingModel.ins().getZhanLingDataByTalentLv(this.zlId);
					let nzltalent:ZhanLingTalent = GlobalConfig.ZhanLingTalent[talentId][talentLv+1];
					let nzlBase:ZhanLingBase = GlobalConfig.ZhanLingBase[this.zlId];
					let itemcfg = GlobalConfig.ItemConfig[nzlBase.mat];
					let w = WarnWin.show(`是否消耗|C:0x00ff00&T:${itemcfg.name}皮肤*${nzltalent.costCount}|升级天赋？`, null,null,()=>{
						ZhanLing.ins().sendZhanLingSkinUpGrade(this.zlId);
					},this);
					w.setBtnLabel(`取消`, `确定`);
				}else{
					ViewManager.ins().open(ZhanLingTips,this.zlId);
				}
				break;
			case this.btn0://上
				scrollV = this.list.scrollV - num;
				scrollV = Math.round(scrollV / 84) * 84;
				if (scrollV < 0) {
					scrollV = 0;
				}
				this.list.scrollV = scrollV;
				this.onChange();
				break;
			case this.btn1://下
				scrollV = this.list.scrollV+ num;
				scrollV = Math.round(scrollV / 84) * 84;
				if (scrollV > this.list.contentHeight - this.listScroller.height) {
					scrollV = this.list.contentHeight - this.listScroller.height;
				}
				this.list.scrollH = scrollV;
				this.onChange();
				break;
			case this.huanhua:
				if( !ZhanLingModel.ins().getZhanLingDataById(this.zlId) ){
					UserTips.ins().showTips(`|C:0xff0000&T:皮肤未激活`);
					return;
				}
				let hhId = this.zlId;
				if( ZhanLingModel.ins().ZhanLingSkinId == hhId ){
					// UserTips.ins().showTips(`当前皮肤已幻化`);
					hhId = 0;
				}
				ZhanLing.ins().sendZhangLingSkinChange(hhId);
				break;
			case this.help:
				ViewManager.ins().open(CommonHelpWin, GlobalConfig.HelpInfoConfig[35].text);
				break;
		}
	}
	private sendUpGrade(){
		this.isAutoUp = !this.isAutoUp;
		if( this.isAutoUp ){
			if( !this.checkUpStar() ){
				this.isAutoUp = false;
				return;
			}
			this.updateModel();
			TimerManager.ins().doTimer(GlobalConfig.ZhanLingConfig.unitTime, 0, this.autoUpStar, this);
		}else{
			TimerManager.ins().remove(this.autoUpStar, this);
		}
		this.upBtn.label = this.isAutoUp?`取 消`:`一键升星`;
	}
	private stopUpGrade(){
		this.isAutoUp = false;
		TimerManager.ins().remove(this.autoUpStar, this);
		this.upBtn.label = this.isAutoUp?`取 消`:`一键升星`;
		this.updateDown(1);
		this.updateModel();
		//是否需要弹出激活页面  只有模型不同的情况下才会弹出
		let lv = ZhanLingModel.ins().getZhanLingDataByLevel(this.zlId);
		let zlLevel:ZhanLingLevel = GlobalConfig.ZhanLingLevel[this.zlId][lv];
		//注:这里由于皮肤和战灵用的同一个界面 监听消息也相同  要断定最上层的才有激活模型动作
		if( zlLevel.activeLv && this.isTopLevel ){
			//弹出激活页
			Activationtongyong.show(0, zlLevel.zlNameLabel, "",true,null,"",zlLevel.innerAppearance);
		}
	}
	private TanlentLvUpGrade(){
		// if( !this.tfmc )
		// 	this.tfmc = new MovieClip();
		// if( !this.tfmc.parent )
		// 	this.eff.addChild(this.tfmc);
		// this.tfmc.playFile(RES_DIR_EFF + "promoteeff",1);
		let talentLv = ZhanLingModel.ins().getZhanLingDataByTalentLv(this.zlId);
		let lv = ZhanLingModel.ins().getZhanLingDataByLevel(this.zlId);
		let zlLevel:ZhanLingLevel = GlobalConfig.ZhanLingLevel[this.zlId][lv];
		if( zlLevel && talentLv && talentLv != 1 && this.isTopLevel ){
			//弹出激活页
			Activationtongyong.show(1, `${talentLv}级天赋`, "",true,null,"",zlLevel.innerAppearance);
		}
	}
	private showIconTips(){
		let id = MoneyConst.yuanbao;
		switch (this.costType) {
			case MoneyConst.yuanbao:
				ViewManager.ins().open(ItemCurrencyWin, id, this.costCount);
				break;
			case ItemType.TYPE_1:
				id = GlobalConfig.ZhanLingConfig.stageitemid;
				ViewManager.ins().open(ItemDetailedWin, 0, id, this.costCount);
				break;
			case ItemType.TYPE_22:
				id = GlobalConfig.ZhanLingBase[this.zlId].mat;
				ViewManager.ins().open(ZhanlingZBTipWin,id);
				break;
		}
	}
	private autoUpStar(){
		if( this.isAutoUp ){
			let buy = this.checkBoxs.selected?1:0;//是否勾选使用元宝
			if( !this._tick ){//刷新过战灵数据才再检查
				if( !this.checkUpStar() ){
					this.isAutoUp = false;
					TimerManager.ins().remove(this.autoUpStar, this);
					return;
				}
			}
			ZhanLing.ins().sendZhanLingUpExp(this.zlId,buy);
		}
	}
	private checkUpStar(){
		//是否满级
		if( this.currentState == "skin_max" || this.currentState == "zl_max" ){
			UserTips.ins().showTips(`|C:0xff0000&T:已满级`);
			this.upBtn.label = `一键升星`;
			return false;
		}
		//激活判定
		if( !ZhanLingModel.ins().getZhanLingDataById(this.zlId) ){
			UserTips.ins().showTips(`|C:0xff0000&T:皮肤未激活`);
			this.upBtn.label = `一键升星`;
			return false;
		}
		let buy = this.checkBoxs.selected?1:0;//是否勾选使用元宝
		let arr = this.getCostValue();
		let curCount = arr[0];
		let needCount = arr[1];
		if( !curCount || curCount < needCount ){
			if( buy ){
				curCount = Actor.yb;
				needCount = GlobalConfig.ZhanLingConfig.unitPrice*needCount;
				if( !curCount || curCount < needCount ){
					UserTips.ins().showTips(`|C:0xff0000&T:元宝不足`);
					this.upBtn.label = `一键升星`;
					return false;
				}
			}else{
				UserTips.ins().showTips(`|C:0xff0000&T:战灵进阶丹不足,可勾选自动购买升级`);
				this.upBtn.label = `一键升星`;
				return false;
			}
			//没有足够的材料 但有足够的元宝 继续往下走逻辑
		}
		this.upBtn.label = `取 消`;
		return true;
	}

	private sort(a:ItemData,b:ItemData){//从好到坏
		let aconfig:ZhanLingEquip = GlobalConfig.ZhanLingEquip[a.configID];
		let bconfig:ZhanLingEquip = GlobalConfig.ZhanLingEquip[b.configID];
		if( aconfig.level > bconfig.level )
			return -1;
		else
			return 1;
	}

	//战灵皮肤列表默认显示规则 取显示的索引 只有战灵皮肤界面才有皮肤列表
	private getIndexRule():number{
		let index = 0;
		ZhanLingModel.ins().updateShowZLlist();//刷新显示列表
		index = ZhanLingModel.ins().showZLlist[0].id;//默认显示第一个
		for( let i = 0; i < ZhanLingModel.ins().showZLlist.length;i++ ){
			let isUpStar = ZhanLingModel.ins().isUpGradeByStar(ZhanLingModel.ins().showZLlist[i].id);
			let isUpTalent = ZhanLingModel.ins().isUpGradeByTalent(ZhanLingModel.ins().showZLlist[i].id);
			if( isUpStar || isUpTalent ){
				index = ZhanLingModel.ins().showZLlist[i].id;
				break;
			}else{
				let isAct = ZhanLingModel.ins().getZhanLingDataByLevel(ZhanLingModel.ins().showZLlist[i].id);
				if( !isAct ){
					//和选中的对比 优先选择未激活 如果都未激活则按排序的优先级
					if( ZhanLingModel.ins().getZhanLingDataById(GlobalConfig.ZhanLingBase[index].id) )
						index = ZhanLingModel.ins().showZLlist[i].id;
					else if( GlobalConfig.ZhanLingBase[index].sort > GlobalConfig.ZhanLingBase[ZhanLingModel.ins().showZLlist[i].id].sort ){
						index = ZhanLingModel.ins().showZLlist[i].id;
					}
				}
			}
		}
		return index;

	}
	private onChange():void{
		if (this.list.scrollV < 39) {
			this.btn0.visible = false;
			this.btn1.visible = true;
		} else if (this.list.scrollV >= this.list.contentHeight - this.list.height - 39) {
			this.btn0.visible = true;
			this.btn1.visible = false;
		} else {
			this.btn0.visible = true;
			this.btn1.visible = true;
		}
		if( this.list.numElements <= 4 ){
			this.btn0.visible = this.btn1.visible = false;
		}
		this.rightRed0.visible = this.btn0.visible?this[`hxRedPoint`].visible:false;
		this.rightRed1.visible = this.btn1.visible?this[`hxRedPoint`].visible:false;

	}
	//设定列表到指定位置
	private setStartPosition(startPos:number){
		//修正最底部
		if( this.listScroller.height >= this.list.contentHeight )
			startPos = 0;
		else{
			let maxHeight = this.list.contentHeight - this.listScroller.height;
			maxHeight = maxHeight>0?maxHeight:0;
			if( startPos >= maxHeight )
				startPos = maxHeight;
		}

		this.list.scrollV = startPos;
	}
	//根据sort获取itemid
	private getDrugItemByIndex(sortId:number):number{
		let itemid = 0;
		let zllconfig = GlobalConfig.ZhanLingConfig;
		for( let k in zllconfig.upgradeInfo ) {
			let i = zllconfig.upgradeInfo[k].sort;
			if( i == sortId ){
				itemid = Number(k);
				break;
			}
		}
		return itemid;
	}
}
