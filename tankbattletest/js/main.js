import Menu from './menu.js'
import Map from './map.js'
import Stage from './stage.js'
import Prop from './prop.js'

import { PlayTank, EnemyOne, EnemyTwo, EnemyThree } from './tank.js'
require("./Helper.js")

var CONST = require("./const.js")

let ctx = canvas.getContext('2d')
//let databus = new DataBus()
//var ctx;//2d画布
var wallCtx;//地图画布
var grassCtx;//草地画布
var tankCtx;//坦克画布
var overCtx;//结束画布
var menu = null;//菜单
var stage = null;//舞台
export var map = null;//地图
export var player1 = null;//玩家1
export var player2 = null;//玩家2
var prop = null;
export var enemyArray = [];//敌方坦克
export var bulletArray = [];//子弹数组
var keys = [];//记录按下的按键
export var crackArray = [];//爆炸数组

var gameState = CONST.GAME_STATE_MENU;//默认菜单状态
var level = 1;
export var maxEnemy = 20;//敌方坦克总数
var maxAppearEnemy = 5;//屏幕上一起出现的最大数
var appearEnemy = 0; //已出现的敌方坦克
var mainframe = 0;
var isGameOver = false;
var overX = 176;
var overY = 384;
export var enemyStopTime = 0;
var homeProtectedTime = -1;
var propTime = 300;

var cur_direction = 0;  //1-->上，2-->下， 3-->左, 4-->右
//var test_count = 0; 

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    this.initScreen();
    this.initObject();

    // 初始化事件监听
    this.initEvent()

    this.gameLoop = this.gameLoop.bind(this)
    setInterval(this.gameLoop,20);


  }

  initScreen(){
    //ctx = canvas.getContext('2d')
    //canvas.width = 300
    //canvas.height = 300
    //ctx.fillStyle = 'red'
    //var wallCanvas = wx.createCanvas();
    //wallCtx = wallCanvas.getContext("2d")
    wallCtx = ctx;
    var grassCanvas = wx.createCanvas();
    grassCtx = grassCanvas.getContext("2d")
    //wallCanvas.width = CONST.SCREEN_WIDTH
    //wallCanvas.height = CONST.SCREEN_HEIGHT
    grassCanvas.width = CONST.SCREEN_WIDTH
    grassCanvas.height = CONST.SCREEN_HEIGHT
    //var tankCanvas = wx.createCanvas();
    tankCtx = ctx;
    //tankCtx = tankCanvas.getContext("2d")
    //tankCanvas.width = CONST.SCREEN_WIDTH
    //tankCanvas.height = CONST.SCREEN_HEIGHT
    var overCanvas = wx.createCanvas();
    overCtx = overCanvas.getContext("2d")
    overCanvas.width = CONST.SCREEN_WIDTH
    overCanvas.height = CONST.SCREEN_HEIGHT
    //var canvas = wx.createCanvas();

    //var canvas = $("#stageCanvas");
    //ctx = canvas[0].getContext("2d");
    //canvas.attr({"width":SCREEN_WIDTH});
    //canvas.attr({"height":SCREEN_HEIGHT});
    //wallCtx = $("#wallCanvas")[0].getContext("2d");
    //grassCtx = $("#grassCanvas")[0].getContext("2d");
    //$("#wallCanvas").attr({"width":SCREEN_WIDTH});
    //$("#wallCanvas").attr({"height":SCREEN_HEIGHT});
    //$("#grassCanvas").attr({"width":SCREEN_WIDTH});
    //$("#grassCanvas").attr({"height":SCREEN_HEIGHT});
    //tankCtx = $("#tankCanvas")[0].getContext("2d");
    //$("#tankCanvas").attr({"width":SCREEN_WIDTH});
    //$("#tankCanvas").attr({"height":SCREEN_HEIGHT});
    //overCtx = $("#overCanvas")[0].getContext("2d");
    //$("#overCanvas").attr({"width":SCREEN_WIDTH});
    //$("#overCanvas").attr({"height":SCREEN_HEIGHT});
    //$("#canvasDiv").css({"width":SCREEN_WIDTH});
    //$("#canvasDiv").css({"height":SCREEN_HEIGHT});
    //$("#canvasDiv").css({"background-color":"#000000"});
    
  }

  initObject(){
    this.menu = new Menu(ctx);
    this.stage = new Stage(ctx,level);
    //this.map = new Map(wallCtx,grassCtx);
    map = new Map(wallCtx,grassCtx);
    //this.player1 = new PlayTank(tankCtx);
    player1 = new PlayTank(tankCtx);
    //player1.x = 129 + map.offsetX;
    player1.x = 94 + map.offsetX + CONST.SCREEN_WIDTH*7/32;
    //player1.y = 385 + map.offsetY;
    player1.y = 285 + map.offsetY;
    player2 = new PlayTank(tankCtx);
    player2.offsetX = 128; //player2的图片x与图片1相距128
    player2.x = 40 + map.offsetX + CONST.SCREEN_WIDTH*7/32;
    player2.y = 285 + map.offsetY;
    appearEnemy = 0; //已出现的敌方坦克
    enemyArray = [];//敌方坦克
    bulletArray = [];//子弹数组
    keys = [];//记录按下的按键
    crackArray = [];//爆炸数组
    isGameOver = false;
    overX = 176;
    overY = 384;
    overCtx.clearRect(0,0,CONST.SCREEN_WIDTH,CONST.SCREEN_HEIGHT);
    enemyStopTime = 0;
    homeProtectedTime = -1;
    propTime = 1000;
  }

  /**
   * 当手指触摸屏幕的时候
   * 判断手指在方向键还是功能键上，并触发对应的动作
   * @param {Number} x: 手指的X轴坐标
   * @param {Number} y: 手指的Y轴坐标
   * @return {Boolean}: 用于标识手指是否在方向键的上键的布尔值
   * 下面的数据都是通过界面中点击边界点并打印log获取数据得到的，会有一定的误差存在。
   * (16, 243)  (59, 243)  (59, 275)  (16, 275)   左上开始，顺时针，矩形的四个点坐标，手指坐标在这个范围内代表向左
   * (59, 200)  (93, 200)  (93, 243)  (59, 243)   左上开始，顺时针，矩形的四个点坐标，手指坐标在这个范围内代表向上
   * (93, 243)  (134,243)  (134,275)  (93, 275)   左上开始，顺时针，矩形的四个点坐标，手指坐标在这个范围内代表向右
   * (59, 275)  (93, 275)  (93, 314)  (59, 314)   左上开始，顺时针，矩形的四个点坐标，手指坐标在这个范围内代表向下
   * 1-->上，2-->下， 3-->左, 4-->右
   * 最上面的y坐标：172， 最下面的y坐标：227， 最左边的x坐标：589， 最右边的x坐标：645     手指坐标在这个范围内代表A区域
   * 最上面的y坐标：228， 最下面的y坐标：284， 最左边的x坐标：531， 最右边的x坐标：588     手指坐标在这个范围内代表B区域
   * 最上面的y坐标：282， 最下面的y坐标：338， 最左边的x坐标：589， 最右边的x坐标：645     手指坐标在这个范围内代表C区域
   */
  checkFingerOnWhichButton(x, y) {
    //console.log("iamhere index.js enter checkIsFingerOnUpButton func")
    console.log("x is "+ x +", y is " + y)

    if ((x >= 16 && x <= 59) && (y >= 243 && y <= 275)) { //左
      cur_direction = 3;
    } else if ((x >= 59 && x <= 93) && (y >= 200 && y <= 243)) { //上
      cur_direction = 1;
    } else if ((x >= 93 && x <= 134) && (y >= 243 && y <= 275)) { //右
      cur_direction = 4;
    } else if ((x >= 59 && x <= 93) && (y >= 275 && y <= 314)) { //下
      cur_direction = 2;
    } else if ((x >= 589 && x <= 645) && (y >= 172 && y <= 227)) { //A
      cur_direction = 5;
    } else if ((x >= 531 && x <= 588) && (y >= 228 && y <= 284)) { //B
      cur_direction = 6;
    } else if ((x >= 589 && x <= 645) && (y >= 282 && y <= 338)) { //C
      cur_direction = 7;
    } else {
      cur_direction = 0;
    }
  }

  initEvent() {
    //console.log("iamhere main.js enter initEvent func")
    canvas.addEventListener('touchstart', ((e) => {
      e.preventDefault()

      let x = e.touches[0].clientX
      let y = e.touches[0].clientY

      //console.log("clientX is "+e.touches[0].clientX)
      //console.log("clientY is "+e.touches[0].clientY)

      this.checkFingerOnWhichButton(x, y);
      switch(gameState){
        case CONST.GAME_STATE_MENU:
          console.log("iamhere cur_direction is "+ cur_direction)
          if (cur_direction == 5) {  //A图片，相当于回车
            gameState = CONST.GAME_STATE_INIT;
            //只有一个玩家
            if(this.menu.playNum == 1){
              player2.lives = 0;
            }
          } else {
            var n = 0;
            if (cur_direction == 1) { //上
              n = 1;
            } else if (cur_direction == 2) {//下
              n = -1;
            }
            this.menu.next(n);
          }
          break;
        case CONST.GAME_STATE_START:
          console.log("iamhere=============/////// cur_direction is "+ cur_direction)
          /*if(!keys.contain(e.keyCode)){
            keys.push(e.keyCode);
          }*/
          keys = [];//add by zhangge
          if (!keys.contain(cur_direction)) {
            keys.push(cur_direction);
          }

          //射击
          //if(e.keyCode == keyboard.SPACE && player1.lives > 0){
          if (cur_direction == 5) {
            player1.shoot(CONST.BULLET_TYPE_PLAYER);
          //}else if(e.keyCode == keyboard.ENTER && player2.lives > 0){
          }else if(cur_direction == 6 && player2.lives > 0) {
            player2.shoot(CONST.BULLET_TYPE_ENEMY);
          //}else if(e.keyCode == keyboard.N){
          } else if(cur_direction == 7) {
            this.nextLevel();
          }/*else if(e.keyCode == keyboard.P){
            this.preLevel();
          }*/
          break;
      }

    }).bind(this))

    canvas.addEventListener('touchend', ((e) => {
      e.preventDefault()

      switch(gameState){
        case CONST.GAME_STATE_START:
          keys = [];//add by zhangge
          break;
      }

    }).bind(this))

  }

  addEnemyTank(){
    //console.log("iamhre enter addEnemyTank")
    if(enemyArray == null || enemyArray.length >= maxAppearEnemy || maxEnemy == 0){
      return ;
    }
    appearEnemy++;
    var rand = parseInt(Math.random()*3);
    var obj = null;
    if(rand == 0){
      obj = new EnemyOne(tankCtx);
    }else if(rand == 1){
      obj = new EnemyTwo(tankCtx);
    }else if(rand == 2){
      obj = new EnemyThree(tankCtx);
    }
    //obj.x = CONST.ENEMY_LOCATION[parseInt(Math.random()*3)] + map.offsetX;
    obj.x = CONST.ENEMY_LOCATION[parseInt(Math.random()*3)] -2 + map.offsetX+CONST.SCREEN_WIDTH*7/32;
    obj.y = map.offsetY;  
    //console.log("iamhere obj.x is "+obj.x+", obj.y is "+obj.y+", enemyArray lenght is "+enemyArray.length);
    obj.dir = CONST.DOWN;
    enemyArray[enemyArray.length] = obj;
    //更新地图右侧坦克数
    map.clearEnemyNum(maxEnemy,appearEnemy);
  }

  drawEnemyTanks(){
    //console.log("imahere enter drawEnemyTanks func"+enemyArray.length)
    if(enemyArray != null || enemyArray.length > 0){
      for(var i=0;i<enemyArray.length;i++){
        var enemyObj = enemyArray[i];
        if(enemyObj.isDestroyed){
          enemyArray.removeByIndex(i);
          i--;
        }else{
          enemyObj.draw();
        }
      }
    }
    if(enemyStopTime > 0){
      enemyStopTime --;
    }
  }

  drawCrack(){
    if(crackArray != null && crackArray.length > 0){
      for(var i=0;i<crackArray.length;i++){
        var crackObj = crackArray[i];
        if(crackObj.isOver){
          crackArray.removeByIndex(i);
          i--;
          if(crackObj.owner == player1){
            player1.renascenc(1);
          }else if(crackObj.owner == player2){
            player2.renascenc(2);
          }
        }else{
          crackObj.draw();
        }
      }
    }
  }
  drawBullet(){
    if(bulletArray != null && bulletArray.length > 0){
      for(var i=0;i<bulletArray.length;i++){
        var bulletObj = bulletArray[i];
        if(bulletObj.isDestroyed){
          bulletObj.owner.isShooting = false;
          bulletArray.removeByIndex(i);
          i--;
        }else{
          bulletObj.draw();
        }
      }
    }
  }

  homeNoProtected(){
    var mapChangeIndex = [[23,11],[23,12],[23,13],[23,14],[24,11],[24,14],[25,11],[25,14]];
    map.updateMap(mapChangeIndex,CONST.WALL);
  }

  drawProp(){
    var rand = Math.random();
    if(rand < 0.4 && prop == null){
      prop = new Prop(overCtx);
      prop.init();
    }
    if(prop != null){
      prop.draw();
      if(prop.isDestroyed){
        prop = null;
        propTime = 1000;
      }
    }
  }

  gameOver(){
    overCtx.clearRect(0,0,CONST.SCREEN_WIDTH,CONST.SCREEN_HEIGHT);
    overCtx.drawImage(CONST.RESOURCE_IMAGE,
                    CONST.POS["over"][0],CONST.POS["over"][1],
                    64,32,
                    overX+map.offsetX+CONST.SCREEN_WIDTH*7/32,overY+map.offsetY,
                    48,30);
    overY -= 2 ;
    if(overY <= parseInt(map.mapHeight/2)){
      this.initObject();
      //只有一个玩家
      if(this.menu.playNum == 1){
        player2.lives = 0;
      }
      gameState = CONST.GAME_STATE_MENU;
    }
  }

  nextLevel(){
    level ++;
    if(level == 22){
      level = 1;
    }
    this.initObject();
    //只有一个玩家
    if(this.menu.playNum == 1){
      player2.lives = 0;
    }
    this.stage.init(level);
    gameState = CONST.GAME_STATE_INIT;
  }

  preLevel(){
    level --;
    if(level == 0){
      level = 21;
    }
    this.initObject();
    //只有一个玩家
    if(menu.playNum == 1){
      player2.lives = 0;
    }
    stage.init(level);
    gameState = CONST.GAME_STATE_INIT;
  }

  keyEvent(){
    console.log("iamhere neter keyEvent, ((((())))))")
    //if(keys.contain(keyboard.W)){
    console.log("keys is "+keys);
    var key_W = 1;
    var key_S = 2;
    var key_A = 3;
    var key_D = 4;
    if(keys.contain(key_W)){
      player1.dir = CONST.UP;
      player1.hit = false;
      player1.move();
      console.log("player1.move +++++++++++++++++++++++++=")
    //}else if(keys.contain(keyboard.S)){
    }else if(keys.contain(key_S)){
      player1.dir = CONST.DOWN;
      player1.hit = false;
      player1.move();
    //}else if(keys.contain(keyboard.A)){
    }else if(keys.contain(key_A)){
      player1.dir = CONST.LEFT;
      player1.hit = false;
      player1.move();
    //}else if(keys.contain(keyboard.D)){
    }else if(keys.contain(key_D)){
      player1.dir = CONST.RIGHT;
      player1.hit = false;
      player1.move();
    }

    
    /*if(keys.contain(keyboard.UP)){
      player2.dir = CONST.UP;
      player2.hit = false;
      player2.move();
    }else if(keys.contain(keyboard.DOWN)){
      player2.dir = CONST.DOWN;
      player2.hit = false;
      player2.move();
    }else if(keys.contain(keyboard.LEFT)){
      player2.dir = CONST.LEFT;
      player2.hit = false;
      player2.move();
    }else if(keys.contain(keyboard.RIGHT)){
      player2.dir = CONST.RIGHT;
      player2.hit = false;
      player2.move();
    }*/
    
  }

  drawAll(){
    console.log("iamhere enter drawAll func")

    //tankCtx.clearRect(0,0,CONST.SCREEN_WIDTH*7/32,CONST.SCREEN_HEIGHT);
    tankCtx.clearRect(CONST.SCREEN_WIDTH*7/32, 0, CONST.SCREEN_WIDTH*25/32 - CONST.SCREEN_WIDTH*7/32, CONST.SCREEN_HEIGHT);
    map.draw();//这是我自己加的,基本上初始化绘制一遍即可，现在先每帧都绘制。
    if(player1.lives > 0){
      console.log("iamhere player1.lives > 0")
      player1.draw();
    }
    if(player2.lives > 0){
      player2.draw();
    }
    drawLives();
    //console.log("drawAll, appearEnemy is "+appearEnemy + ", maxEnemy is "+maxEnemy);
    if(appearEnemy<maxEnemy){
      if(mainframe % 100 == 0){
        this.addEnemyTank();
        mainframe = 0;
      }
      mainframe++;
    }

    this.drawEnemyTanks();
    this.drawBullet();
    this.drawCrack();

    this.keyEvent();
    if(propTime<=0){
      this.drawProp();
    }else{
      propTime --;
    }
    if(homeProtectedTime > 0){
      homeProtectedTime --;
    }else if(homeProtectedTime == 0){
      homeProtectedTime = -1;
      this.homeNoProtected();
    }
  }


  gameLoop(){
    /*test_count++;
    if (test_count > 100000) {
      return
    }*/
    switch(gameState){
    
    case CONST.GAME_STATE_MENU:
      this.menu.draw();
      break;
    case CONST.GAME_STATE_INIT:
      console.log("imahere enter GAME_STATE_INIT branch")
      this.stage.draw();
      if(this.stage.isReady == true){
        gameState = CONST.GAME_STATE_START;
      }
      break;
    case CONST.GAME_STATE_START:
      console.log("iamhere enter GAME_STATE_START")
      this.drawAll();
      console.log("iamhere isGameOver is "+isGameOver)
      if(isGameOver ||(player1.lives <=0 && player2.lives <= 0)){
        gameState = CONST.GAME_STATE_OVER;
        map.homeHit();
        CONST.PLAYER_DESTROY_AUDIO.play();
      }
      if(appearEnemy == maxEnemy && enemyArray.length == 0){
        gameState  = CONST.GAME_STATE_WIN;
      }
      break;
    case CONST.GAME_STATE_WIN:
      this.nextLevel();
      break;
    case CONST.GAME_STATE_OVER:
      this.gameOver();
      break;
    }
  }

  
}

function drawLives(){
  map.drawLives(player1.lives,1);
  map.drawLives(player2.lives,2);
}

export function initMap(){
    map.setMapLevel(level);
    map.draw();
    drawLives();
}
export function setIsGameOverTure() {
  isGameOver = true;
}
/*
$(document).keydown(function(e){
  switch(gameState){
  case GAME_STATE_MENU:
    if(e.keyCode == keyboard.ENTER){
      gameState = GAME_STATE_INIT;
      //只有一个玩家
      if(menu.playNum == 1){
        player2.lives = 0;
      }
    }else{
      var n = 0;
      if(e.keyCode == keyboard.DOWN){
        n = 1;
      }else if(e.keyCode == keyboard.UP){
        n = -1;
      }
      menu.next(n);
    }
    break;
  case GAME_STATE_START:
    if(!keys.contain(e.keyCode)){
      keys.push(e.keyCode);
    }
    //射击
    if(e.keyCode == keyboard.SPACE && player1.lives > 0){
      player1.shoot(BULLET_TYPE_PLAYER);
    }else if(e.keyCode == keyboard.ENTER && player2.lives > 0){
      player2.shoot(BULLET_TYPE_ENEMY);
    }else if(e.keyCode == keyboard.N){
      nextLevel();
    }else if(e.keyCode == keyboard.P){
      preLevel();
    }
    break;
  }
});

$(document).keyup(function(e){
  keys.remove(e.keyCode);
});
*/

/*






function addEnemyTank(){
  if(enemyArray == null || enemyArray.length >= maxAppearEnemy || maxEnemy == 0){
    return ;
  }
  appearEnemy++;
  var rand = parseInt(Math.random()*3);
  var obj = null;
  if(rand == 0){
    obj = new EnemyOne(tankCtx);
  }else if(rand == 1){
    obj = new EnemyTwo(tankCtx);
  }else if(rand == 2){
    obj = new EnemyThree(tankCtx);
  }
  obj.x = ENEMY_LOCATION[parseInt(Math.random()*3)] + map.offsetX;
  obj.y = map.offsetY;  
  obj.dir = DOWN;
  enemyArray[enemyArray.length] = obj;
  //更新地图右侧坦克数
  map.clearEnemyNum(maxEnemy,appearEnemy);
}

function drawEnemyTanks(){
  if(enemyArray != null || enemyArray.length > 0){
    for(var i=0;i<enemyArray.length;i++){
      var enemyObj = enemyArray[i];
      if(enemyObj.isDestroyed){
        enemyArray.removeByIndex(i);
        i--;
      }else{
        enemyObj.draw();
      }
    }
  }
  if(emenyStopTime > 0){
    emenyStopTime --;
  }
}

function drawAll(){
  tankCtx.clearRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
  if(player1.lives>0){
    player1.draw();
  }
  if(player2.lives > 0){
    player2.draw();
  }
  drawLives();
  if(appearEnemy<maxEnemy){
    if(mainframe % 100 == 0){
      addEnemyTank();
      mainframe = 0;
    }
    mainframe++;
  }
  drawEnemyTanks();
  drawBullet();
  drawCrack();
  keyEvent();
  if(propTime<=0){
    drawProp();
  }else{
    propTime --;
  }
  if(homeProtectedTime > 0){
    homeProtectedTime --;
  }else if(homeProtectedTime == 0){
    homeProtectedTime = -1;
    homeNoProtected();
  }
}




function gameOver(){
  overCtx.clearRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
  overCtx.drawImage(RESOURCE_IMAGE,POS["over"][0],POS["over"][1],64,32,overX+map.offsetX,overY+map.offsetY,64,32);
  overY -= 2 ;
  if(overY <= parseInt(map.mapHeight/2)){
    initObject();
    //只有一个玩家
    if(menu.playNum == 1){
      player2.lives = 0;
    }
    gameState = GAME_STATE_MENU;
  }
}

function nextLevel(){
  level ++;
  if(level == 22){
    level = 1;
  }
  initObject();
  //只有一个玩家
  if(menu.playNum == 1){
    player2.lives = 0;
  }
  stage.init(level);
  gameState = GAME_STATE_INIT;
}

function preLevel(){
  level --;
  if(level == 0){
    level = 21;
  }
  initObject();
  //只有一个玩家
  if(menu.playNum == 1){
    player2.lives = 0;
  }
  stage.init(level);
  gameState = GAME_STATE_INIT;
}

function drawProp(){
  var rand = Math.random();
  if(rand < 0.4 && prop == null){
    prop = new Prop(overCtx);
    prop.init();
  }
  if(prop != null){
    prop.draw();
    if(prop.isDestroyed){
      prop = null;
      propTime = 1000;
    }
  }
}

function homeNoProtected(){
  var mapChangeIndex = [[23,11],[23,12],[23,13],[23,14],[24,11],[24,14],[25,11],[25,14]];
  map.updateMap(mapChangeIndex,WALL);
};
*/


