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
		// console.log("SCREEN_WIDTH is "+CONST.SCREEN_WIDTH + ",SCREEN_HEIGHT is "+CONST.SCREEN_HEIGHT)
		this.ctx.clearRect(0, 0, CONST.SCREEN_WIDTH, CONST.SCREEN_HEIGHT);   
		this.ctx.save(); //保存当前的绘图上下文
		//画背景
		/*
			context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
			img	规定要使用的图像、画布或视频。
			sx	可选。开始剪切的 x 坐标位置。
			sy	可选。开始剪切的 y 坐标位置。
			swidth	可选。被剪切图像的宽度。
			sheight	可选。被剪切图像的高度。
			x	在画布上放置图像的 x 坐标位置。
			y	在画布上放置图像的 y 坐标位置。
			width	可选。要使用的图像的宽度。（伸展或缩小图像）
			height	可选。要使用的图像的高度。（伸展或缩小图像）
		*/

		this.ctx.drawImage(CONST.MENU_IMAGE, 
						0, 0,
						CONST.SCREEN_WIDTH, CONST.SCREEN_HEIGHT,
						CONST.SCREEN_WIDTH*3/16, this.y, 
						CONST.SCREEN_WIDTH*7/8, CONST.SCREEN_HEIGHT);
		//画选择坦克
		// console.log(CONST.POS["selectTank"][0]+","+CONST.POS["selectTank"][1])
		
		this.ctx.drawImage(CONST.RESOURCE_IMAGE,  //要渲染的image对象
							CONST.POS["selectTank"][0],  //图片剪裁起始位置x轴
							CONST.POS["selectTank"][1] + temp,  //图片剪裁起始位置y轴
							this.selectTank.size,  //被剪裁的图片的宽度，x轴
							this.selectTank.size,  //被剪裁的图片的高度，y轴
							this.selectTank.x+170,//放置在画布中的位置，x轴
							this.y + this.selectTank.ys[this.playNum-1],  //放置在画布中的位置，y轴
							this.selectTank.size-2,   //使用的图片的大小，宽度
							this.selectTank.size-2);  //使用的图片的大小，高度
		//画方向盘
		this.ctx.drawImage(CONST.RESOURCE_IMAGE_DIRECTION,  //要渲染的image对象
							0,  //图片剪裁起始位置x轴
							0,  //图片剪裁起始位置y轴
							220,  //被剪裁的图片的宽度，x轴
							220,  //被剪裁的图片的高度，y轴
							0,//放置在画布中的位置，x轴
							this.y+180,  //放置在画布中的位置，y轴
							140,   //使用的图片的大小，宽度
							140);  //使用的图片的大小，高度

		//画手柄右边的按键A
		this.ctx.drawImage(CONST.RESOURCE_IMAGE_DIRECTION,  //要渲染的image对象
							650,  //图片剪裁起始位置x轴
							250,  //图片剪裁起始位置y轴
							120,  //被剪裁的图片的宽度，x轴
							120,  //被剪裁的图片的高度，y轴
							CONST.SCREEN_WIDTH*7/8,//放置在画布中的位置，x轴
							this.y+160,  //放置在画布中的位置，y轴
							70,   //使用的图片的大小，宽度
							70);  //使用的图片的大小，高度
		//画手柄右边的按键B
		this.ctx.drawImage(CONST.RESOURCE_IMAGE_DIRECTION,  //要渲染的image对象
							880,  //图片剪裁起始位置x轴
							10,  //图片剪裁起始位置y轴
							120,  //被剪裁的图片的宽度，x轴
							120,  //被剪裁的图片的高度，y轴
							CONST.SCREEN_WIDTH*25/32,//放置在画布中的位置，x轴
							this.y+215,  //放置在画布中的位置，y轴
							70,   //使用的图片的大小，宽度
							70);  //使用的图片的大小，高度
		//画手柄右边的按键C
		this.ctx.drawImage(CONST.RESOURCE_IMAGE_DIRECTION,  //要渲染的image对象
							805,  //图片剪裁起始位置x轴
							320,  //图片剪裁起始位置y轴
							120,  //被剪裁的图片的宽度，x轴
							120,  //被剪裁的图片的高度，y轴
							CONST.SCREEN_WIDTH*7/8,//放置在画布中的位置，x轴
							this.y+270,  //放置在画布中的位置，y轴
							70,   //使用的图片的大小，宽度
							70);  //使用的图片的大小，高度
		
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