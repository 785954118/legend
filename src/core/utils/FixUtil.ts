/**
 * Created by hrz on 2017/8/25.
 */

class FixUtil {
	private static exmlsDic: Map<any>;

	static fixAll() {
		FixUtil.fixEXMLParser();
		FixUtil.fixLoadThm();
		FixUtil.fixComponentSkinName();

		//解决原来引擎中的bug
		FixUtil.fixRemoveDisplayObject();
		//已加载的资源，原来是第二帧返回，改为立刻返回
		// FixUtil.fixGetResAsync();
	}

	private static fixGetResAsync() {
		let func = RES.getResByUrl;
		RES.getResByUrl = function (url: string, compFunc: Function, thisObject: any, type: string = "") {
			if (type) {
				let analyzer: RES.AnalyzerBase = RES.getAnalyzer(type);
				let res = analyzer.getRes(url);
				if (res) {
					compFunc.call(thisObject, res, url);
					return;
				}
			}
			func(url, compFunc, thisObject, type);
		}
	}

	private static fixRemoveDisplayObject() {

		let removeDisplayObject = function (displayObject: egret.DisplayObject, bitmapData: egret.BitmapData | egret.Texture): void {
			if (!bitmapData) return;
			let hashCode: number;
			if ((<egret.Texture>bitmapData).bitmapData && (<egret.Texture>bitmapData).bitmapData.hashCode) {
				hashCode = (<egret.Texture>bitmapData).bitmapData.hashCode;
			}
			else {
				hashCode = bitmapData.hashCode;
			}
			if (!hashCode) {
				return;
			}
			if (!egret.BitmapData['_displayList'][hashCode]) {
				return;
			}

			let tempList = egret.BitmapData['_displayList'][hashCode];
			let index: number = tempList.indexOf(displayObject);
			if (index >= 0) {
				tempList.splice(index, 1);
				//引擎中的源代码为
				//tempList.splice(index);
			}

			if (tempList.length == 0) {
				ResourceMgr.ins().disposeResTime(hashCode);
			}
		}

		egret.BitmapData.$removeDisplayObject = removeDisplayObject;
	}

	private static parseSkinName(skinName: string) {
		let exmlsDic = FixUtil.exmlsDic;
		if (exmlsDic && exmlsDic.hasOwnProperty(skinName)) {
			let obj = exmlsDic[skinName];
			delete exmlsDic[skinName];
			EXML.$parseURLContent(obj.path, obj.content);
		}
	}

	private static fixComponentSkinName() {
		let $parseSkinName = eui.Component.prototype.$parseSkinName;
		eui.Component.prototype.$parseSkinName = function () {
			let skinName = this.skinName;
			if (typeof(skinName) == "string") {
				FixUtil.parseSkinName(skinName);
			}
			$parseSkinName.call(this);
		}
	}

	private static fixLoadThm() {
		let exmlsDic = FixUtil.exmlsDic = {};

		let setSkinClassName = function (path, content) {
			var match = content.match(/ class="([^"]*)"/i);
			if (DEBUG && exmlsDic[match[1]]) {
				alert(`皮肤 ${exmlsDic[match[1]].path} 与 ${path} 类名重复！！！`);
			}
			exmlsDic[match[1]] = {path: path, content: content};
		}

		eui.Theme.prototype["onConfigLoaded"] = function (str) {
			let data: any;
			if (str) {
				if (DEBUG) {
					try {
						data = JSON.parse(str);
					}
					catch (e) {
						egret.$error(3000);
					}
				} else {
					data = JSON.parse(str);
				}
			}
			else if (DEBUG) {
				egret.$error(3000, this.$configURL);
			}

			if (!data) {
				alert(`皮肤加载失败，请检查网络重新登录`);
				return;
			}


			if (data && data.skins) {
				let skinMap = this.skinMap
				let skins = data.skins;
				let keys = Object.keys(skins);
				let length = keys.length;
				for (let i = 0; i < length; i++) {
					let key = keys[i];
					if (!skinMap[key]) {
						this.mapSkin(key, skins[key]);
					}
				}
			}

			if (data.styles) {
				this.$styles = data.styles;
			}

			if (!data.exmls || data.exmls.length == 0) {
				this.onLoaded();
			}
			else if (data.exmls[0]['gjs']) {
				data.exmls.forEach((exml) => EXML.$parseURLContentAsJs((exml).path, (exml).gjs, (exml).className));
				this.onLoaded();
			}
			// In release version, exml content is packaged in the theme file
			else if (data.exmls[0]['content']) {
				data.exmls.forEach((exml) => setSkinClassName(exml.path, exml.content));
				// data.exmls.forEach((exml) => EXML.$parseURLContent((exml).path, (exml).content));
				FixUtil.preParserExml();
				this.onLoaded();
			}
			else {
				EXML.$loadAll(<string[]>data.exmls, this.onLoaded, this, true);
			}
		}
	}

	private static preParserExml() {
		let prelist = [`skins.ButtonSkin`, `skins.CheckBoxSkin`, `skins.HScrollBarSkin`, `skins.HSliderSkin`, `skins.ItemRendererSkin`, `skins.PanelSkin`,
			`skins.ProgressBarSkin`, `skins.RadioButtonSkin`, `skins.ScrollerSkin`, `skins.TextInputSkin`, `skins.ToggleSwitchSkin`, `skins.VScrollBarSkin`, `skins.VSliderSkin`,
			`PlayFunSkin`, `UIView2Skin`, `GameFightSceneSkin`];
		for (let skinName of prelist) {
			FixUtil.parseSkinName(skinName);
		}
	}

	private static fixEXMLParser() {
		let EXMLParser = eui.sys.EXMLParser;

		EXMLParser.prototype['getClassNameOfNode1'] = function (node) {
			if (node.attributes && node.attributes["className"]) {
				let Cls = egret.getDefinitionByName(node.attributes["className"])
				if (Cls) {
					if (node.parent && node.parent.localName == "ViewStack") {
						if (node.attributes['skinName']) {
							this.addInitSkin(Cls, node.attributes['skinName']);
							delete node.attributes['skinName'];
						}
					}

					return node.attributes["className"];
				}
			}
			return this['getClassNameOfNode'](node);
		}

		EXMLParser.prototype['addInitSkin'] = function (cls, skinName) {
			// (function (cls,skinName){
			let proto = cls.prototype;
			if (!proto.__skinName_1) {
				proto.__skinName_1 = skinName;

				let close = proto.close;
				if (close) {
					proto.close_1 = close;
					proto.close = function () {
						if (this.skinName) {
							this.close_1();
						}
					}
					close = null;
				}

				let open = proto.open;
				if (open) {
					proto.open_1 = open;
					proto.open = function (...param) {
						if (DEBUG) {
							if (!this.skinName) { //用来检查窗口内某些标签未打开就已经设皮肤的问题
								this.$initSkin();
							} else if (!this.$isInitSkin) {
								let clsName = egret.getQualifiedClassName(this);
								console.log(`类${clsName}代码中不能设置skinName！！`);
							}
						} else {
							if (!this.$isInitSkin) {
								this.$initSkin();
							}
						}

						this.open_1(...param);
					}
					open = null;
				}

				let childrenCreated = proto.childrenCreated;
				if (childrenCreated) {
					proto.childrenCreated_1 = childrenCreated;
					proto.childrenCreated = function () {

					}
					childrenCreated = null;
				}

				let initSkin = proto['$initSkin'];
				if (DEBUG && initSkin) {
					console.log("initSkin 函数不可以使用");
				}
				proto['$initSkin'] = function () {
					this.skinName = this.__skinName_1;
					this.$isInitSkin = true;
					this.childrenCreated_1();
				}
			}
			// })(cls1, skinName1);
		}

		EXMLParser.prototype['createFuncForNode'] = function (node: egret.XML): string {
			let className = node.localName;
			let isBasicType = this.isBasicTypeData(className);
			if (isBasicType)
				return this.createBasicTypeForNode(node);
			let moduleName = this.getClassNameOfNode1(node);
			let func = new eui.sys.EXFunction();
			let tailName = "_i";
			let id = node.attributes.id;
			func.name = id + tailName;
			this.currentClass.addFunction(func);
			let cb = new eui.sys.EXCodeBlock();
			func.codeBlock = cb;
			let varName: string = "t";
			if (className == "Object") {
				cb.addVar(varName, "{}");
			}
			else {
				cb.addVar(varName, "new " + moduleName + "()");
			}

			let containsId = !!this.currentClass.getVariableByName(id);
			if (containsId) {
				cb.addAssignment("this." + id, varName);
			}

			this.addAttributesToCodeBlock(cb, varName, node);

			this.initlizeChildNode(node, cb, varName);
			let delayAssignments = this.delayAssignmentDic[id];
			if (delayAssignments) {
				let length = delayAssignments.length;
				for (let i = 0; i < length; i++) {
					let codeBlock: eui.sys.EXCodeBlock = delayAssignments[i];
					cb.concat(codeBlock);
				}
			}
			cb.addReturn(varName);
			return "this." + func.name + "()";
		}

		let formatValue = EXMLParser.prototype['formatValue'];
		EXMLParser.prototype['formatValue'] = function (key, value, node) {
			if (key == "itemRendererSkinName") {
				return this['formatString'](value);
			}
			return formatValue.call(this, key, value, node);
		}

		let innerClassCount = 1;
		EXMLParser.prototype.parse = function (text: string): { new(): any } {
			if (DEBUG) {
				if (!text) {
					egret.$error(1003, "text");
				}
			}
			let xmlData: any = null;
			if (DEBUG) {
				try {
					xmlData = egret.XML.parse(text);
				}
				catch (e) {
					egret.$error(2002, text + "\n" + e.message);
				}
			} else {
				xmlData = egret.XML.parse(text);
			}

			let hasClass: boolean = false;
			let className: string = "";
			if (xmlData.attributes["class"]) {
				className = xmlData.attributes["class"];
				delete xmlData.attributes["class"];
				hasClass = !!className;
			}
			else {
				className = "$exmlClass_" + innerClassCount++;
			}
			let exClass = this.parseClass(xmlData, className);
			let code = exClass.toCode();

			let clazz: any = null;
			let geval = eval;
			if (DEBUG) {
				try {
					clazz = geval(code);
				}
				catch (e) {
					egret.log(code);
					return null;
				}
			} else {
				clazz = geval(code);
			}

			if (hasClass && clazz) {
				egret.registerClass(clazz, className);
				let paths = className.split(".");
				let length = paths.length;
				let definition = __global;
				for (let i = 0; i < length - 1; i++) {
					let path = paths[i];
					definition = definition[path] || (definition[path] = {});
				}
				if (definition[paths[length - 1]]) {

				}
				else {
					definition[paths[length - 1]] = clazz;
				}
			}

			xmlData = undefined;
			className = undefined;
			code = undefined;
			exClass = undefined;
			geval = undefined;
			text = undefined;
			return clazz;
		}

		EXMLParser = undefined;
	}
}