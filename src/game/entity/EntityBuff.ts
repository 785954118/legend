class EntityBuff {
	/** 效果配置 */
	effConfig: EffectsConfig;
	/** 添加时间 */
	addTime: number;
	endTime: number;
	/** 计算后的值 */
	value: number;
	/** 总执行次数 */
	count: number;
	/** 当前执行次数 */
	step: number;

	multRate: number = 1;//倍率

	hostsHandle: number[];//宿主handle

	/** 施法者 */
	source;

	dispose() {
		this.source = null;
		this.hostsHandle = null;
		this.multRate = 1;
	}

	static createBuff(id: number, selfTarget: CharMonster, args?: { a: number, b: number, c: number, time: number }) {
		let config = GlobalConfig.EffectsConfig[id];
		Assert(config, `EffectsConfig中 ${id} 配置为空！！！`);
		let effValue = RoleAI.ins().skillEffValue(selfTarget, config, args);
		let addTime = args ? args.time || 0 : 0;
		return EntityBuff.createBaseBuff(id, selfTarget, effValue, config.duration + addTime);
	}

	static createBaseBuff(id: number, selfTarget: CharMonster, value?: number, duration?: number) {
		let config = GlobalConfig.EffectsConfig[id];
		Assert(config, `EffectsConfig中 ${id} 配置为空！！！`);
		let buff: EntityBuff = ObjectPool.pop("EntityBuff");
		buff.effConfig = config;
		buff.value = value;
		buff.addTime = egret.getTimer();
		buff.endTime = buff.addTime + (duration ? duration : config.duration);
		buff.count = ((duration ? duration : config.duration) / config.interval) >> 0;
		buff.step = 0;
		buff.source = selfTarget;

		if (config.type == SkillEffType.HostAddAttributes) {
			if (buff.hostsHandle == null) {
				buff.hostsHandle = [];
			}

			let mh = EntityManager.ins().getRootMasterHandle(selfTarget.infoModel.handle);
			if (buff.hostsHandle.indexOf(mh) < 0) {
				buff.hostsHandle.push(mh);
			}
		}

		return buff;
	}

	/**
	 * 是否可以执行buff效果
	 * @returns {boolean}
	 */
	isExecute(): boolean {
		return egret.getTimer() - this.addTime > this.step * this.effConfig.interval;
	}

	/**
	 * 是否可以移除buff
	 * @returns {boolean}
	 */
	canRemove(): boolean {
		return this.effConfig.type != SkillEffType.Summon && egret.getTimer() >= this.endTime
	}

	isCanotHit(): boolean {
		return this.effConfig.type == SkillEffType.AdditionalState && this.effConfig.args.i == 1
	}
}