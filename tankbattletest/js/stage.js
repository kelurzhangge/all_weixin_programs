var CONST = require("./const.js")
import Num from './num.js'

export default class Stage {
	constructor (context, l) {
		this.ctx = context;
		this.ctx.fillStyle = "#7f7f7f";
		this.drawHeigth = 15;
		this.level = l;
		this.temp = 0;
		this.dir = 1; //中间切换的方向，1：合上，2：展开
		this.isReady = false;//标识地图是否已经画好
		this.levelNum = new Num(context);
	}

	init(level) {
		this.dir = 1;
		this.isReady = false;
		this.level = level;
		this.temp = 0;
	}

	draw() {
		if(this.dir == 1){
			
			//temp = 15*15 灰色屏幕已经画完
			if(this.temp == 225){
				//78,14为STAGE字样在图片资源中的宽和高，194,208为canvas中的位置
				this.ctx.drawImage(CONST.RESOURCE_IMAGE, 
					CONST.POS["stageLevel"][0], CONST.POS["stageLevel"][1], 
					78, 14, 
					//194, 208, 
					(CONST.SCREEN_WIDTH*25/32 - CONST.SCREEN_WIDTH*7/32) / 2, 208,
					78, 14);
				//14为数字的宽和高，308, 208为canvas中的位置
				this.levelNum.draw(this.level,308, 208);
				//this.ctx.drawImage(RESOURCE_IMAGE,POS["num"][0]+this.level*14,POS["num"][1],14, 14,308, 208,14, 14);
				//绘制地图,调用main里面的方法
				//initMap();
				
			}else if(this.temp == 225 + 600){
				//600即调用了600/15次，主要用来停顿
				this.temp = 225;
				this.dir = -1;
				CONST.START_AUDIO.play(); 
			}else{
				/*
				* fillRect(x, y, width, height)的参数解释：
				* x: 矩形路径左上角的x坐标
				* y: 矩形路径左上角的y坐标
				* width: 矩形路径的宽度
				* height: 矩形路径的高度
				* CONST.SCREEN_WIDTH*25/32  含义是：功能键B的左临界x坐标
				* (CONST.SCREEN_WIDTH*25/32 - CONST.SCREEN_WIDTH*7/32)的含义是：功能键的左临界x坐标减去方向键右临界x坐标
				*/
				this.ctx.fillRect(CONST.SCREEN_WIDTH*7/32, this.temp, (CONST.SCREEN_WIDTH*25/32 - CONST.SCREEN_WIDTH*7/32), this.drawHeigth);
				this.ctx.fillRect(CONST.SCREEN_WIDTH*7/32, 448 - this.temp - this.drawHeigth , (CONST.SCREEN_WIDTH*25/32 - CONST.SCREEN_WIDTH*7/32), this.drawHeigth);
			}
		}else{
			if(this.temp >= 0){
				this.ctx.clearRect(CONST.SCREEN_WIDTH*7/32, this.temp , (CONST.SCREEN_WIDTH*25/32 - CONST.SCREEN_WIDTH*7/32), this.drawHeigth);
				this.ctx.clearRect(CONST.SCREEN_WIDTH*7/32, 448 - this.temp - this.drawHeigth, (CONST.SCREEN_WIDTH*25/32 - CONST.SCREEN_WIDTH*7/32), this.drawHeigth);
			}else{
				this.isReady = true;
			}
		}
		this.temp += this.drawHeigth * this.dir;
	}
}
/*
var Stage = function(context,l){
	this.ctx = context;
	this.ctx.fillStyle = "#7f7f7f";
	this.drawHeigth = 15;
	this.level = l;
	this.temp = 0;
	this.dir = 1; //中间切换的方向，1：合上，2：展开
	this.isReady = false;//标识地图是否已经画好
	this.levelNum = new Num(context);
	
	this.init = function(level){
		this.dir = 1;
		this.isReady = false;
		this.level = level;
		this.temp = 0;
	};
	
	this.draw = function(){
		if(this.dir == 1){
			
			//temp = 15*15 灰色屏幕已经画完
			if(this.temp == 225){
				//78,14为STAGE字样在图片资源中的宽和高，194,208为canvas中的位置
				this.ctx.drawImage(RESOURCE_IMAGE, POS["stageLevel"][0], POS["stageLevel"][1], 78, 14, 194, 208, 78, 14);
				//14为数字的宽和高，308, 208为canvas中的位置
				this.levelNum.draw(this.level,308, 208);
				//this.ctx.drawImage(RESOURCE_IMAGE,POS["num"][0]+this.level*14,POS["num"][1],14, 14,308, 208,14, 14);
				//绘制地图,调用main里面的方法
				initMap();
				
			}else if(this.temp == 225 + 600){
				//600即调用了600/15次，主要用来停顿
				this.temp = 225;
				this.dir = -1;
				START_AUDIO.play(); 
			}else{
				this.ctx.fillRect(0, this.temp, 512, this.drawHeigth);
				this.ctx.fillRect(0, 448 - this.temp - this.drawHeigth , 512, this.drawHeigth);
			}
		}else{
			if(this.temp >= 0){
				this.ctx.clearRect(0, this.temp , 512, this.drawHeigth);
				this.ctx.clearRect(0, 448 - this.temp - this.drawHeigth, 512, this.drawHeigth);
			}else{
				this.isReady = true;
			}
		}
		this.temp += this.drawHeigth * this.dir;
	};
};
*/