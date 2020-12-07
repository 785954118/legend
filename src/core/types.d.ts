/**
 * Created by wangzhong on 2017/5/19.
 */
interface Map<T> {
	[index: string]: T;
}

interface XY {
	x: number,
	y: number
}

interface CharMoveObj {
	entity:CharMonster,
	endPoint:XY,
	vec:XY,
	path:any[],
	isGrid:boolean,
	time:number,
	total:number,
	isMainRole:boolean
}