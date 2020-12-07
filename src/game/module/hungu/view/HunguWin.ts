/**
 * 魂骨界面
 */
class HunguWin extends BaseView {
	private roleId:number;
	private pos:number;
	//equip0~equip7
	private getItemTxt0:eui.Label;
	private executeBtn:eui.Button;
	private executeBtn0:eui.Button;
	private powerPanel0:PowerPanel;
	private xiangxishuxing:eui.Button;
	private fenjie:eui.Button;
	/**特效*/
	private posXian0:eui.Image[];
	private HGliangxianzhi0:eui.Image;
	private HGliangxianxie0:eui.Image;
	private liangdian0:eui.Image;
	private effectPos0:eui.Group;
	private posXian1:eui.Image[];
	private HGliangxianzhi1:eui.Image;
	private liangdian1:eui.Image;
	private effectPos1:eui.Group;
	private posXian2:eui.Image[];
	private HGliangxianzhi2:eui.Image;
	private HGliangxianxie2:eui.Image;
	private liangdian2:eui.Image;
	private effectPos2:eui.Group;
	private posXian3:eui.Image[];
	private HGliangxianzhi3:eui.Image;
	private HGliangxianxie3:eui.Image;
	private liangdian3:eui.Image;
	private effectPos3:eui.Group;
	private posXian4:eui.Image[];
	private HGliangxianzhi4:eui.Image;
	private HGliangxianxie4:eui.Image;
	private liangdian4:eui.Image;
	private effectPos4:eui.Group;
	private posXian5:eui.Image[];
	private HGliangxianzhi5:eui.Image;
	private HGliangxianxie5:eui.Image;
	private liangdian5:eui.Image;
	private effectPos5:eui.Group;
	private posXian6:eui.Image[];
	private HGliangxianzhi6:eui.Image;
	private HGliangxianxie6:eui.Image;
	private liangdian6:eui.Image;
	private effectPos6:eui.Group;
	private posXian7:eui.Image[];
	private HGliangxianzhi7:eui.Image;
	private HGliangxianxie7:eui.Image;
	private liangdian7:eui.Image;
	private effectPos7:eui.Group;
	private effectPos:eui.Group[];//流动特效后的点特效对齐组
	private effect1quanshen:eui.Group;//全身特效 集齐8件
	private effect2toubu:eui.Group;//集齐2件套播放 读表
	private effect3xia:eui.Group;//集齐6件套播放 读表
	private liangdian:eui.Image[];//亮点特效组
	public constructor() {
		super();
		// this.skinName = "hunguSkin";
	}
	protected childrenCreated() {


	}
	public close(...param: any[]): void {
		this.cleanWireEff();
		for( let i = 0; i < GlobalConfig.HunGuConf.equipCount;i++ ){
			this.cleanEff(i);
		}

	}
	public open(...param: any[]): void {
		this.addTouchEvent(this.getItemTxt0, this.onTap);
		this.addTouchEvent(this.executeBtn, this.onTap);
		this.addTouchEvent(this.executeBtn0, this.onTap);
		this.addTouchEvent(this.xiangxishuxing, this.onTap);
		this.addTouchEvent(this.fenjie, this.onTap);

		for (let i = 0; i < GlobalConfig.HunGuConf.equipCount; i++) {
			this.addTouchEvent(this["equip" + i], this.onSelect);
		}
		this.observe(HunguRedPoint.ins().postRoleRedPoint,this.updateUI);
		this.observe(Hungu.ins().postNothing2Wear,this.HunguItemsResult);
		this.observe(Hungu.ins().postWear2Noting,this.HunguItemsResult);
		this.roleId = param[0];
		this.pos = param[1];
		this.initEff();
		this.updateUI();

	}
	private initEff(){
		this.posXian0 = [this.HGliangxianzhi0,this.HGliangxianxie0];
		this.posXian1 = [this.HGliangxianzhi1];
		this.posXian2 = [this.HGliangxianzhi2,this.HGliangxianxie2];
		this.posXian3 = [this.HGliangxianzhi3,this.HGliangxianxie3];
		this.posXian4 = [this.HGliangxianzhi4,this.HGliangxianxie4];
		this.posXian5 = [this.HGliangxianzhi5,this.HGliangxianxie5];
		this.posXian6 = [this.HGliangxianzhi6,this.HGliangxianxie6];
		this.posXian7 = [this.HGliangxianzhi7,this.HGliangxianxie7];
		this.effectPos = [this.effectPos0,this.effectPos1,this.effectPos2,this.effectPos3,this.effectPos4,this.effectPos5,this.effectPos6,this.effectPos7]
		this.liangdian = [this.liangdian0,this.liangdian1,this.liangdian2,this.liangdian3,this.liangdian4,this.liangdian5,this.liangdian6,this.liangdian7]
		let mc = new MovieClip()
		mc.playFile(RES_DIR_EFF + "hguieffect1",-1);
		this.effect1quanshen.addChild(mc);
		this.updateEff();
	}
	private updateEff(){
		let hunguData = Hungu.ins().hunguData[this.roleId];
		if( !hunguData ){

			return;
		}
		let isSuccess = true;//完成8件收集
		for( let i = 0;i < 8;i++ ){
			//查看哪些部位激活了的
			if( hunguData.items[i].itemId ){
				for( let j in this[`posXian${i}`] ){
					this[`posXian${i}`][j].visible = true;
				}
				this.liangdian[i].visible = true;
			}else{
				isSuccess = false;
			}
		}
		// //全身特效
		// if( isSuccess ){
		// 	let mc = new MovieClip()
		// 	mc.playFile(RES_DIR_EFF + "hguieffect1",-1);
		// 	this.effect1quanshen.addChild(mc);
		// }

		//套装特效
		let suitEffects = [null,this.effect2toubu,this.effect3xia];//共鸣id对应的组
		for( let s in GlobalConfig.HunGuConf.suit ){
			let suitId = +s;
			if( !suitId )continue;
			if( suitEffects[suitId] ){
				let suit = Hungu.ins().getSuitData(this.roleId);
				for( let i in suit[suitId] ){
					if( suit[suitId][i].count.length < (+i) )continue;
					let stage = suit[suitId][i].stage;
					let config = GlobalConfig.HunGuSuit[suitId][i][stage];
					if( config.effectId ){
						let mc;
						if( !suitEffects[suitId].numElements ){
							mc = new MovieClip();
							suitEffects[suitId].addChild(mc);
						}else{
							mc = suitEffects[suitId].getChildAt(0) as MovieClip;
						}
						mc.playFile(RES_DIR_EFF + config.effectId,-1);
					}
				}
			}
		}

	}
	private onSelect(e: egret.TouchEvent): void {
		for (let i = 0; i < GlobalConfig.HunGuConf.equipCount; i++) {
			if( this["equip" + i] ){
				this["equip" + i].select.visible = false;
				if( e.currentTarget == this["equip" + i] ){
					this.pos = i;
					this["equip" + i].select.visible = true;
					// this.updateUI();
					//没有装备直接显示穿戴最好的
					let hunguData = Hungu.ins().hunguData[this.roleId];
					if( !hunguData || !hunguData.items[i].itemId ){
						// ViewManager.ins().open(HunguChooseEquipWin,this.roleId,this.pos);
						let itemData = Hungu.ins().getHunguItemsList(i);
						if( itemData.length ){
							Hungu.ins().sendHunguItems(this.roleId,i,itemData[0].configID);
						}else{
							UserTips.ins().showTips(`未拥有当前部位魂骨`);
						}
					}else{
						ViewManager.ins().open(HunguTipsWin,true,this.roleId,hunguData.items[i].itemId);
					}
				}
			}
		}
	}
	private updateUI(){
		let ins =  Hungu.ins();
		let power = ins.getResonancePower(this.roleId);
		let suit = ins.getSuitData(this.roleId);
		for( let i = 0;i < GlobalConfig.HunGuConf.equipCount;i++ ){
			this.updateItem(i);
			power += ins.getHunguPosPower(this.roleId,i,suit,true);
			this.powerPanel0.setPower(power);
		}
		this.getItemTxt0.textFlow = TextFlowMaker.generateTextFlow1(`|U:&T:${this.getItemTxt0.text}`);
	}
	private updateItem(index:number = 0){
		let equipItem = this["equip" + index];
		if (!equipItem) return;
		let ins =  Hungu.ins();
		let itemIcon: ItemIcon = equipItem.itemIcon;
		itemIcon.imgJob.visible = false;
		equipItem.level.visible = false;
		itemIcon.imgIcon.source = `hungu${index}`;
		equipItem.select.visible = (this.pos == index)?true:false;
		itemIcon.imgBg.source = index<=1?"wupingkuangNB":"quality0";
		let hunguData = ins.hunguData[this.roleId];
		if( hunguData && hunguData.items[index].itemId ){
			let itemId = hunguData.items[index].itemId;
			let config:ItemConfig = GlobalConfig.ItemConfig[itemId];
			itemIcon.imgIcon.source = config.icon + "_png";
		}
		else{
			for( let j in this[`posXian${index}`] ){
				this[`posXian${index}`][j].visible = false;
			}
		}
		equipItem["redPoint"].visible = this.getRedPoint(index);
	}
	private getRedPoint(pos:number){
		return HunguRedPoint.ins().HunguItemRedPoint(this.roleId,pos);
	}
	private onTap(e: egret.TouchEvent): void {
		switch (e.currentTarget){
			case this.getItemTxt0://获取道具
				UserWarn.ins().setBuyGoodsWarn(GlobalConfig.HunGuConf.gainItemId);
				break;
			case this.executeBtn://特殊共鸣
				ViewManager.ins().open(HunguGroupWin,this.roleId,1);
				break;
			case this.executeBtn0://躯干共鸣
				ViewManager.ins().open(HunguGroupWin,this.roleId,2);
				break;
			case this.xiangxishuxing://详细属性
				ViewManager.ins().open(HunguAttrWin,this.roleId);
				break;
			case this.fenjie:
				ViewManager.ins().open(SmeltItemTotalWin,this.getSmeltList());
				break;
		}
	}
	/**获取魂骨分解列表*/
	private getSmeltList():ItemData[]{
		let list = [];//UserBag.ins().getBagGoodsByType(ItemType.TYPE_24);
		let canFenjieItem = GlobalConfig.HunGuConf.canFenjieItem;
		for( let i in canFenjieItem  ){
			let itemData: ItemData = UserBag.ins().getBagItemById(canFenjieItem[i]);
			if( itemData ){
				list.push(itemData);
			}
		}
		return list;
	}
	/**穿戴升级等结果返回处理*/
	private HunguItemsResult(arr:number[]){
		let control = arr[0];//1穿戴 0卸下
		let pos = arr[1];
		if( control )
			this.playEff(pos);
		else
			this.cleanEff(pos);
	}
	/**部位装备被卸下*/
	public cleanEff(ipos:number = 0){
		for( let i in this[`posXian${ipos}`] ){
			this[`posXian${ipos}`][i].visible = false;
		}
		this.liangdian[ipos].visible = false;
		// this.effect1quanshen.removeChildren();//有装备被卸下 全身特效肯定不播

		let suitId = 0;//影响的共鸣id
		for( let i in GlobalConfig.HunGuConf.suit ){
			if( GlobalConfig.HunGuConf.suit[i].indexOf(ipos) != -1 ){
				suitId = (+i);
				break;
			}
		}
		let suitEffects = [null,this.effect2toubu,this.effect3xia];//共鸣id对应的组
		//检测同共鸣的套装数 卸下对应特效
		if( suitEffects[suitId] ){
			suitEffects[suitId].removeChildren();
		}
	}
	/**流动特效*/
	private playEff(ipos:number = 0){
		let playTime = 1000;//播放时间(毫秒)
		let posTime = [];
		let tw = 0;
		for( let i in this[`posXian${ipos}`] ){
			tw += this[`posXian${ipos}`][i].width;
			this[`posXian${ipos}`][i].scrollRect = new egret.Rectangle(0,0,0,this[`posXian${ipos}`][i].height);
			this[`posXian${ipos}`][i].visible = true;
		}
		//求出每条线段所需经过的时间 按长度百分比取时间占比
		let ts = 0;
		for( let i in this[`posXian${ipos}`] ){
			if( Number(i) == this[`posXian${ipos}`].length - 1 ){
				posTime[i] = playTime - ts;
			}else{
				posTime[i] = this[`posXian${ipos}`][i].width/tw*playTime;
				ts += posTime[i];
			}
		}
		this.playWireEff(this[`posXian${ipos}`],posTime,0,ipos);

		//套装特效
		let suitEffects = [null,this.effect2toubu,this.effect3xia];//共鸣id对应的组
		let suitId = 0;//影响的共鸣id
		for( let i in GlobalConfig.HunGuConf.suit ){
			if( GlobalConfig.HunGuConf.suit[i].indexOf(ipos) != -1 ){
				suitId = (+i);
				break;
			}
		}
		if( suitEffects[suitId] ){
			let suit = Hungu.ins().getSuitData(this.roleId);
			for( let i in suit[suitId] ){
				if( suit[suitId][i].count.length < (+i) )continue;
				let stage = suit[suitId][i].stage;
				let config = GlobalConfig.HunGuSuit[suitId][i][stage];
				if( config.effectId ){
					let mc;
					if( !suitEffects[suitId].numElements ){
						mc = new MovieClip();
						suitEffects[suitId].addChild(mc);
					}else{
						mc = suitEffects[suitId].getChildAt(0) as MovieClip;
					}
					mc.playFile(RES_DIR_EFF + config.effectId,-1);
				}
			}
		}


		//检测是否集齐全身特效
		// let isSuccess = true;
		// for( let i = 0;i < GlobalConfig.HunGuConf.equipCount;i++ ){
		// 	if( this[`posXian${i}`][0] && !this[`posXian${i}`][0].visible){
		// 		isSuccess = false;
		// 		break;
		// 	}
		// }
		// if( isSuccess && !this.effect1quanshen.numElements ){
		// 	let mc = new MovieClip()
		// 	mc.playFile(RES_DIR_EFF + "hguieffect1",-1);
		// 	this.effect1quanshen.addChild(mc);
		// }


		//测试流动效果
		// for( let idx = 0;idx < 8;idx++ ){
		// 	let posTime = [];
		// 	let tw = 0;
		// 	for( let i in this[`posXian${idx}`] ){
		// 		tw += this[`posXian${idx}`][i].width;
		// 		this[`posXian${idx}`][i].scrollRect = new egret.Rectangle(0,0,0,this[`posXian${idx}`][i].height);
		// 		this[`posXian${idx}`][i].visible = true;
		// 	}
		// 	//求出每条线段所需经过的时间 按长度百分比取时间占比
		// 	let ts = 0;
		// 	for( let i in this[`posXian${idx}`] ){
		// 		if( Number(i) == this[`posXian${idx}`].length - 1 ){
		// 			posTime[i] = playTime - ts;
		// 		}else{
		// 			posTime[i] = this[`posXian${idx}`][i].width/tw*playTime;
		// 			ts += posTime[i];
		// 		}
		// 	}
		// 	this.playWireEff(this[`posXian${idx}`],posTime,0,idx);
		// }
	}
	/**
	 * 播放流动
	 * @param posXian 每条线的控件数组
	 * @param posTime 每条线播放时长数组
	 * @param 数组播放索引位置
	 * @param 部位索引
	 * */
	private wireEffs:egret.Tween[][] = [];
	private playWireEff(posXian:eui.Image[],posTime:number[],playIndex:number = 0,ipos:number = 0){
		if( !posXian[playIndex] )return;
		let tw = egret.Tween.get(posXian[playIndex].scrollRect);
		tw.to({ "width": posXian[playIndex].width }, posTime[playIndex]).call(() => {
			egret.Tween.removeTweens(tw);
			posXian[playIndex].scrollRect.width = posXian[playIndex].width;
			playIndex++;
			if( playIndex >= posXian.length ){
				//播放点特效
				let mc = new MovieClip();
				mc.playFile(RES_DIR_EFF + "hguieffect0",1);
				this.effectPos[ipos].addChild(mc);
				this.liangdian[ipos].visible = true;
			}else{
				this.playWireEff(posXian,posTime,playIndex,ipos);
			}
		}, this);
		//检测同部位是否有动画
		if( !this.wireEffs[ipos] )
			this.wireEffs[ipos] = [];
		if( this.wireEffs[ipos][playIndex] ){
			egret.Tween.removeTweens(this.wireEffs[ipos][playIndex]);
		}
		this.wireEffs[ipos][playIndex] = tw;
	}
	private cleanWireEff(){
		if( !this.wireEffs )return;
		for( let i = 0; i < this.wireEffs.length;i++ ){
			if( !this.wireEffs[i] )continue;
			for( let j in this.wireEffs[i] ){
				egret.Tween.removeTweens(this.wireEffs[i][j]);
			}
		}
	}
}