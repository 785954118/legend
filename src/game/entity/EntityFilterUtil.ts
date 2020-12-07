/**
 * Created by hrz on 2017/7/11.
 */

enum EntityFilter {
	no = 0, //无
	hard = 1, //石化
	poison = 2, //中毒
}

class EntityFilterUtil {
	// 滤镜优先级 数值越小优先级越高
	static buffFilter = {
		1: {
			filters: FilterUtil.ARRAY_GRAY_FILTER,
		},
		2: {
			filters: FilterUtil.ARRAY_GREEN_FILTER,
		}
	}

	static getEntityFilter(groupID:number) {
		let filter = EntityFilter.no;
		if (EntityFilterUtil.isHard(groupID)) {
			filter = EntityFilter.hard;
		} else if (EntityFilterUtil.isPoison(groupID)) {
			filter = EntityFilter.poison;
		}
		return filter;
	}

	//石化
	static isHard(groupID) {
		return groupID == 51001 || groupID == 150065;
	}

	//中毒
	static isPoison(groupID) {
		return groupID == 23001 || groupID == 61001 || groupID == 150071;
	}
}