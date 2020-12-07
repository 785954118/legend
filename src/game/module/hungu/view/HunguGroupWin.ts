/**
 * 魂骨共鸣界面
 */
class HunguGroupWin extends BaseEuiView {
	private bgClose:eui.Button;
	private content:eui.Group;
	private id:number;//共鸣id
	private roleId:number;//人物索引

	private qualityName:string;
	private posName:string;
	private suit2:string;
	private suit4:string;
	private suit6:string;
	private itemData:{qualityName:string,posName:string,suits:string[]}[];
	public constructor() {
		super();
		this.skinName = "hunguGroupSkin";
	}
	protected childrenCreated() {


	}
	public close(...param: any[]): void {

	}
	public open(...param: any[]): void {
		this.addTouchEvent(this, this.onTap);

		this.roleId = param[0];
		this.id = param[1];
		this.updateShow();
	}
	private updateShow(){
		this.itemData = [];
		this.init();
		let suit = Hungu.ins().getSuitData(this.roleId);
		if( CommonUtils.getObjectLength(suit) && suit[this.id] ){
			this.itemData = [];
			this.suit2 = "";
			this.suit4 = "";
			this.suit6 = "";
			let list = this.getPosColorName(this.id);//0~7
			//品质
			let stages = [];
			for( let i in suit[this.id] ){
				if( stages.indexOf(suit[this.id][i].stage) == -1 )
					stages.push(suit[this.id][i].stage);
			}
			// let specalstr = (this.id == 1)?"特殊":"魂骨";
			let qualityName = "";
			for( let s = 0;s < stages.length;s++ ){
				let quality = stages[s];
				// qualityName = `【${Hungu.ins().getHunguItemQualityName(0,quality)}${specalstr}共鸣】`;
				qualityName = GlobalConfig.HunGuConf.suitName[this.id-1][quality<=1?0:(quality-1)];
				//套件数
				let lightPos = [];
				let suits = [];
				for( let i in GlobalConfig.HunGuSuit[this.id] ){
					for( let j = 0;j < suit[this.id][i].count.length;j++ ){
						let itemId = suit[this.id][i].count[j];
						let tpos = ItemConfig.getSubType(GlobalConfig.ItemConfig[itemId]);
						if( lightPos.indexOf(tpos) == -1 )
							lightPos.push(tpos);//找出需要亮起的部位
					}
					let hgsuit = GlobalConfig.HunGuSuit[this.id][i][quality];
					let color = 0;
					if( suit[this.id][i].stage == quality && suit[this.id][i].count.length >= (+i) )
						color = ColorUtil.GREEN_COLOR_N;
					else
						color = ColorUtil.GRAY_COLOR2;

					if( !hgsuit ){
						hgsuit = GlobalConfig.HunGuSuit[this.id][i][1];
					}
					if( hgsuit.dec ){
						suits.push(`|C:${color}&T:${i}件:`+ hgsuit.dec);
					}


					// if( hgsuit.specialAttrs )
					// 	suits.push(`|C:${color}&T:${i}件:装备基础属性+${hgsuit.specialAttrs/100}%`);
					// else{
					// 	// suits.push(`|C:${color}&T:${i}件:`+ AttributeData.getAttStr(hgsuit.attrs, 0, 1, "+"));
					// 	let valueStr = "";
					// 	for( let j = 0;j < hgsuit.attrs.length;j++ ){
					// 		valueStr += AttributeData.getAttrStrByType(hgsuit.attrs[j].type) + "+" +hgsuit.attrs[j].value + "  ";
					// 	}
					// 	suits.push(`|C:${color}&T:${i}件:`+ valueStr);
					// }
				}
				//装备部位
				let posName = "";
				for( let i = 0; i < list.length;i++ ){
					let color = 0;
					if( lightPos.indexOf(list[i]) == -1 ){
						color = ColorUtil.GRAY_COLOR2;
					}else{
						color = ColorUtil.GREEN_COLOR_N;
					}
					posName += `|C:${color}&T:${Hungu.ins().getHunguPosName(list[i])}`+ "  ";
				}
				this.itemData.push({qualityName:qualityName,posName:posName,suits:suits});
			}

			//检测是否6件身穿是当前阶 如果是就增加显示下一阶
			if( stages.length == 1 ){
				let isShowNext = true;
				if( Hungu.ins().hunguData[this.roleId] ){
					for( let i in Hungu.ins().hunguData[this.roleId].items ){
						if( list.indexOf(Number(i)) == -1 )continue;
						let itemId = Hungu.ins().hunguData[this.roleId].items[i].itemId;
						if( !itemId || GlobalConfig.HunGuEquip[itemId].stage != stages[0] ){
							isShowNext = false;
							break;
						}
					}
				}
				if( isShowNext ){
					//全部统一阶级必定是只有一个品质tips
					let suits2 = [];
					for( let i in GlobalConfig.HunGuSuit[this.id] ){
						if( !suit[this.id][+i] )continue;
						let maxStage = CommonUtils.getObjectLength(GlobalConfig.HunGuSuit[this.id][+i]);
						let curStage = suit[this.id][+i].stage;
						if( curStage != maxStage ){
							let nextStage = curStage + 1;
							// let nextHuSuit = GlobalConfig.HunGuSuit[this.id][i][curStage+1];
							let qualityName = GlobalConfig.HunGuConf.suitName[this.id-1][nextStage<=1?0:(nextStage-1)];
							//装备部位
							let posName = "";
							for( let j = 0; j < list.length;j++ ){
								posName += `|C:${ColorUtil.GRAY_COLOR2}&T:${Hungu.ins().getHunguPosName(list[j])}`+ "  ";
							}

							for( let j in GlobalConfig.HunGuSuit[this.id] ){
								let hgsuit = GlobalConfig.HunGuSuit[this.id][j][nextStage];
								if( hgsuit.dec ){
									suits2.push(`|C:${ColorUtil.GRAY_COLOR2}&T:${j}件:`+ hgsuit.dec);
								}
							}
							this.itemData.push({qualityName:qualityName,posName:posName,suits:suits2});
							break;
						}
					}
				}
			}
		}
		//把数据显示出来
		for( let i = 0;i < this.itemData.length;i++ ){
			let hgitem = new HunguGroupItem();
			hgitem.data = {qualityName:this.itemData[i].qualityName,posName:this.itemData[i].posName,suits:this.itemData[i].suits};
			this.content.addChild(hgitem);
		}
	}
	/**
	 * 获取共鸣所需显示部位
	 * @param 共鸣id
	 * */
	private getPosColorName(id:number){
		let list = [];
		for( let i = 0; i < GlobalConfig.HunGuConf.suit[id].length;i++ ){
			list.push(GlobalConfig.HunGuConf.suit[id][i]);
		}

		return list;
	}
	private init(id:number = this.id){
		let specalstr = (id == 1)?"特殊":"魂骨";
		let qualityName = `【凡品${specalstr}共鸣】`;
		let suitType = GlobalConfig.HunGuConf.suit[id];
		let posName = "";
		this.suit2 = "";
		this.suit4 = "";
		this.suit6 = "";
		for( let i = 0;i < suitType.length;i++ ){
			posName += `|C:${ColorUtil.GRAY_COLOR2}&T:` + Hungu.ins().getHunguPosName(suitType[i]) + "  ";
		}
		let suits = [];
		for( let k in GlobalConfig.HunGuSuit[id] ){
			let hgsuit = GlobalConfig.HunGuSuit[id][k][1];
			if( hgsuit.specialAttrs )
				suits.push(`|C:${ColorUtil.GRAY_COLOR2}&T:${k}件:装备基础属性+${hgsuit.specialAttrs/100}%`);
			else{
				let valueStr = "";
				for( let j = 0;j < hgsuit.attrs.length;j++ ){
					valueStr += AttributeData.getAttrStrByType(hgsuit.attrs[j].type) + "+" +hgsuit.attrs[j].value + "  ";
				}
				if( hgsuit.dec ){
					suits.push(`|C:${ColorUtil.GRAY_COLOR2}&T:${k}件:`+ hgsuit.dec);
				}
				// suits.push(`|C:${ColorUtil.GRAY_COLOR2}&T:${k}件:`+ valueStr);
			}
		}
		this.itemData.push({qualityName:qualityName,posName:posName,suits:suits});
	}
	private onTap(e: egret.TouchEvent): void {
		ViewManager.ins().close(this);
	}

}
ViewManager.ins().reg(HunguGroupWin, LayerManager.UI_Popup);