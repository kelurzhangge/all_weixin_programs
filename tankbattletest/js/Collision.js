import {map} from './main.js'
var CONST = require("./const.js")
/*
*检测2个物体是否碰撞
* @param object1 物体1
* @param object2 物体2
* @param overlap 允许重叠的大小
* @returns {Boolean} 如果碰撞了，返回true
*/
export function CheckIntersect(object1, object2, overlap)
{
	//    x-轴              x-轴
	//  A1------>B1 C1    A2------->B2   C2
	//  +--------+  ^      +--------+     ^
	//  | object1|  | y-轴 | object2|     |
	//  |        |  |      |        |     |
	//  +--------+  D1     +--------+    D2
	//
	//overlap是重叠的区域值
	const A1 = object1.x + overlap
	const B1 = object1.x + object1.size - overlap
	const C1 = object1.y + overlap;
	const D1 = object1.y + object1.size - overlap;

	const A2 = object2.x + overlap;
	const B2 = object2.x + object2.size - overlap;
	const C2 = object2.y + overlap;
	const D2 = object2.y + object2.size - overlap;

	//假如他们在x-轴重叠
	if (A1 >= A2 && A1 <= B2
		|| B1 >= A2 && B1 <= B2) {
		//判断y-轴重叠
		if (C1 >= C2 && C1 <= D2 || D1 >= C2 && D1 <= D2) {
			return true;
		}
	}
	return false;
}

/*
* 坦克与地图块碰撞
* @param tank 坦克对象
* @param mapobj 地图对象
* @returns {Boolean} 如果碰撞，返回true
*/
export function tankMapCollision(tank, mapobj) {
	//移动检测，记录最后一次的移动方向，根据方向判断+-overlap，
	var tileNum = 0;//需要检测的tile数
	var rowIndex = 0;//map中的行索引
	var colIndex = 0;//map中的列索引
	var overlap = 3;//允许重叠的大小
	
	//根据tank的x,y计算出map中的row和col
	//数字6是offsetY的调整偏移值1和tank.size的调整偏移值5的和

	if (tank.dir == CONST.UP) {
		rowIndex = parseInt((tank.tempY + overlap - mapobj.offsetY) / mapobj.tileSize);
		colIndex = parseInt((tank.tempX + overlap - mapobj.offsetX - CONST.SCREEN_WIDTH*7/32) / mapobj.tileSize);
	} else if (tank.dir == CONST.DOWN) {
		//向下，即dir==1的时候，行索引的计算需要+tank.Height
		rowIndex = parseInt((tank.tempY - overlap - mapobj.offsetY + (tank.size-6))/mapobj.tileSize);
		colIndex = parseInt((tank.tempX + overlap - mapobj.offsetX - CONST.SCREEN_WIDTH*7/32)/mapobj.tileSize);
	} else if (tank.dir == CONST.LEFT) {
		rowIndex = parseInt((tank.tempY + overlap - mapobj.offsetY)/mapobj.tileSize);
		colIndex = parseInt((tank.tempX + overlap - mapobj.offsetX - CONST.SCREEN_WIDTH*7/32)/mapobj.tileSize);
	} else if (tank.dir == CONST.RIGHT) {
		rowIndex = parseInt((tank.tempY + overlap - mapobj.offsetY)/mapobj.tileSize);
		//向右，即dir ==3的时候，列索引的计算需要+tank.Height
		colIndex = parseInt((tank.tempX - overlap - mapobj.offsetX + (tank.size-6) - CONST.SCREEN_WIDTH*7/32)/mapobj.tileSize);
	}
	if (rowIndex >= mapobj.HTileCount || rowIndex < 0 || colIndex >= mapobj.wTileCount || colIndex < 0) {
		return true;
	}
	if (tank.dir == CONST.UP || tank.dir == CONST.DOWN) {
		var tempWidth = parseInt(tank.tempX - map.offsetX -  CONST.SCREEN_WIDTH*7/32 - (colIndex)*mapobj.tileSize + (tank.size-6) - overlap); //去除重叠部分
		if (tempWidth % mapobj.tileSize == 0) {
			tileNum = parseInt(tempWidth/mapobj.tileSize);
		} else {
			tileNum = parseInt(tempWidth/mapobj.tileSize) + 1;
		}
		for (var i=0; i<tileNum && colIndex+i < mapobj.wTileCount; i++) {
			var mapContent = mapobj.mapLevel[rowIndex][colIndex+i];
			if (mapContent == CONST.WALL || mapContent == CONST.GRID || mapContent == CONST.WATER || mapContent == CONST.HOME || mapContent == CONST.ANOTHREHOME) {
				if (tank.dir == CONST.UP) {
					tank.y = mapobj.offsetY + rowIndex * mapobj.tileSize + mapobj.tileSize - overlap;
				} else if (tank.dir == CONST.DOWN) {
					tank.y = mapobj.offsetY + rowIndex * mapobj.tileSize - (tank.size-6) + overlap;
				}
				return true;
			}
		}
	} else {
		var tempHeight = parseInt(tank.tempY - map.offsetY - (rowIndex)*mapobj.tileSize + (tank.size-6) - overlap); //去除重叠部分
		if (tempHeight % mapobj.tileSize == 0) {
			tileNum = parseInt(tempHeight/mapobj.tileSize);
		} else {
			tileNum = parseInt(tempHeight/mapobj.tileSize) + 1;
		}
		for (var i=0; i<tileNum && rowIndex+i < mapobj.HTileCount; i++) {
			var mapContent = mapobj.mapLevel[rowIndex+i][colIndex];
			if (mapContent == CONST.WALL || mapContent == CONST.GRID || mapContent == CONST.WATER || mapContent == CONST.HOME || mapContent == CONST.ANOTHREHOME) {
				if (tank.dir == CONST.LEFT) {
					tank.x = CONST.SCREEN_WIDTH*7/32 + mapobj.offsetX + colIndex * mapobj.tileSize + mapobj.tileSize - overlap;
				} else if (tank.dir == CONST.RIGHT) {
					tank.x = CONST.SCREEN_WIDTH*7/32 + mapobj.offsetX + colIndex * mapobj.tileSize - (tank.size-6) + overlap;
				}
				return true;
			}
		}
	}
	return false;
}

/*
* 子弹与地图块的碰撞
* @param bullet 子弹对象
* @param mapobj 地图对象
*/
export function bulletMapCollision(bullet, mapobj) {
	var tileNum = 0;//需要检测的tile数
	var rowIndex = 0; //map中的行索引
	var colIndex = 0;//map中的列索引
	var mapChangeIndex = [];//map中需要更新的索引数组
	var result = false;// 是否碰撞
	//根据bullet的x、y计算出map中的row和col
	if(bullet.dir == CONST.UP) {
		rowIndex = parseInt((bullet.y - mapobj.offsetY)/mapobj.tileSize);
		colIndex = parseInt((bullet.x - mapobj.offsetX - CONST.SCREEN_WIDTH*7/32)/mapobj.tileSize);
	} else if (bullet.dir == CONST.DOWN) {
		//向下，即dir==1的时候，行索引的计算需要+bullet.Height
		rowIndex = parseInt((bullet.y - mapobj.offsetY + bullet.size)/mapobj.tileSize);
		colIndex = parseInt((bullet.x - mapobj.offsetX - CONST.SCREEN_WIDTH*7/32)/mapobj.tileSize);
	} else if (bullet.dir == CONST.LEFT) {
		rowIndex = parseInt((bullet.y - mapobj.offsetY)/mapobj.tileSize);
		colIndex = parseInt((bullet.x - mapobj.offsetX - CONST.SCREEN_WIDTH*7/32)/mapobj.tileSize);
	} else if (bullet.dir == CONST.RIGHT) {
		rowIndex = parseInt((bullet.y - mapobj.offsetY)/mapobj.tileSize);
		//向右，即dir==3的时候，列索引的计算需要+bullet.Height
		colIndex = parseInt((bullet.x - mapobj.offsetX - CONST.SCREEN_WIDTH*7/32 + bullet.size)/mapobj.tileSize);
	}
	if (rowIndex >= mapobj.HTileCount || rowIndex < 0 || colIndex >= mapobj.wTileCount || colIndex < 0) {
		return true;
	}

	if (bullet.dir == CONST.UP || bullet.dir == CONST.DOWN) {
		var tempWidth = parseInt(bullet.x - map.offsetX - CONST.SCREEN_WIDTH*7/32 - (colIndex)*mapobj.tileSize + bullet.size);
		console.log("iamhere tempWidth is "+tempWidth);
		if (tempWidth % mapobj.tileSize == 0) {
			tileNum = parseInt(tempWidth/mapobj.tileSize);
		} else {
			tileNum = parseInt(tempWidth/mapobj.tileSize) + 1;
		}
		console.log("iamhere tileNum is "+tileNum);
		for (var i=0; i<tileNum && colIndex+i < mapobj.wTileCount; i++) {
			var mapContent = mapobj.mapLevel[rowIndex][colIndex+i];
			if (mapContent == CONST.WALL || mapContent == CONST.GRID || mapContent == CONST.HOME || mapContent == CONST.ANOTHREHOME) {
				result = true;
				if (mapContent == CONST.WALL) {
					//墙被打掉
					mapChangeIndex.push([rowIndex, colIndex+i]);
				} else if (mapContent == CONST.GRID) {

				} else {
					isGameOver = true;
					break;
				}
			}
		}
	} else {
		var tempHeight = parseInt(bullet.y - map.offsetY - (rowIndex)*mapobj.tileSize + bullet.size);
		if (tempHeight % mapobj.tileSize == 0) {
			tileNum = parseInt(tempHeight/mapobj.tileSize);
		} else {
			tileNum = parseInt(tempHeight/mapobj.tileSize) + 1;
		}
		for (var i=0; i<tileNum && rowIndex+i < mapobj.HTileCount; i++) {
			var mapContent = mapobj.mapLevel[rowIndex+i][colIndex];
			if (mapContent == CONST.WALL || mapContent == CONST.GRID || mapContent == CONST.HOME || mapContent == CONST.ANOTHREHOME) {
				//bullet.distroy();
				result = true;
				if (mapContent == CONST.WALL) {
					//墙被打掉
					mapChangeIndex.push([rowIndex+i, colIndex]);
				} else if (mapContent == CONST.GRID) {

				} else {
					isGameOver = true;
					break;
				}
			}
		}
	}
	//更新地图
	map.updateMap(mapChangeIndex, 0);
	return result;
}