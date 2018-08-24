var CONST = require("./const.js")
import SelectTank from './tank.js'
/**
 * 游戏开始菜单
 **/ 
export default class Menu {
	constructor(context) {
		this.ctx = context;
		this.x = 0;
		this.y = CONST.SCREEN_HEIGHT;
		this.selectTank = new SelectTank();
		this.playNum = 1;
		this.times = 0;
	}

	draw() {
		this.times ++ ;
		var temp = 0;
		if( parseInt(this.times / 6) % 2 == 0){
			temp = 0;
		}else{
			temp = this.selectTank.size;
		}
		if(this.y <= 0){
			this.y = 0;
		}else{
			this.y -= 5;
		}
		this.ctx.clearRect(0, 0, CONST.SCREEN_WIDTH, CONST.SCREEN_HEIGHT);   
		this.ctx.save(); //保存当前的绘图上下文
		//画背景
		this.ctx.drawImage(CONST.MENU_IMAGE, this.x, this.y, CONST.SCREEN_WIDTH, CONST.SCREEN_HEIGHT);
		//画选择坦克
		console.log(CONST.POS["selectTank"][0]+","+CONST.POS["selectTank"][1])
		this.ctx.drawImage(CONST.RESOURCE_IMAGE,  //要渲染的image对象
							CONST.POS["selectTank"][0],  //图片剪裁起始位置x轴
							CONST.POS["selectTank"][1] + temp,  //图片剪裁起始位置y轴
							this.selectTank.size,  //被剪裁的图片的宽度，x轴
							this.selectTank.size,  //被剪裁的图片的高度，y轴
							this.selectTank.x,//放置在画布中的位置，x轴
							this.y + this.selectTank.ys[this.playNum-1],  //放置在画布中的位置，y轴
							this.selectTank.size-2,   //使用的图片的大小，宽度
							this.selectTank.size-2);  //使用的图片的大小，高度
		this.ctx.restore();  // 恢复之前保存的绘图上下文
	}

	next(n) {
		this.playNum += n;
		if(this.playNum > 2){
			this.playNum = 1;
		}else if(this.playNum < 1){
			this.playNum = 2;
		}
	}

}
/*
var Menu = function(context){
	this.ctx = context;
	this.x = 0;
	this.y = SCREEN_HEIGHT;
	this.selectTank = new SelectTank();
	this.playNum = 1;
	this.times = 0;
	
	/**
	 * 画菜单
	 *//*
	this.draw = function(){
		this.times ++ ;
		var temp = 0;
		if( parseInt(this.times / 6) % 2 == 0){
			temp = 0;
		}else{
			temp = this.selectTank.size;
		}
		if(this.y <= 0){
			this.y = 0;
		}else{
			this.y -= 5;
		}
		this.ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);   
		this.ctx.save(); 
		//画背景
		this.ctx.drawImage(MENU_IMAGE, this.x, this.y);
		//画选择坦克
		this.ctx.drawImage(RESOURCE_IMAGE,POS["selectTank"][0],POS["selectTank"][1] + temp,this.selectTank.size,this.selectTank.size,
				this.selectTank.x,this.y + this.selectTank.ys[this.playNum-1],this.selectTank.size,this.selectTank.size);
		this.ctx.restore();
	};
	
	/**
	 * 选择坦克上下移动
	 *//*
	this.next = function(n){
		this.playNum += n;
		if(this.playNum > 2){
			this.playNum = 1;
		}else if(this.playNum < 1){
			this.playNum = 2;
		}
	};
};
*/