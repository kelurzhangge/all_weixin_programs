/*import Player from './player/index'
import Enemy from './npc/enemy'
import BackGround from './runtime/background'
import GameInfo from './runtime/gameinfo'
import Music from './runtime/music'
import DataBus from './databus'*/
//import CONST from './const.js'
import Menu from './menu.js'
import Map from './map.js'
import Stage from './stage.js'
var CONST = require("./const.js")
//import './jquery.min.js'

let ctx = canvas.getContext('2d')
//let databus = new DataBus()
//var ctx;//2d画布
var wallCtx;//地图画布
var grassCtx;//草地画布
var tankCtx;//坦克画布
var overCtx;//结束画布
var menu = null;//菜单
var stage = null;//舞台
var map = null;//地图
var player1 = null;//玩家1
var player2 = null;//玩家2
var prop = null;
var enemyArray = [];//敌方坦克
var bulletArray = [];//子弹数组
var keys = [];//记录按下的按键
var crackArray = [];//爆炸数组

var gameState = CONST.GAME_STATE_MENU;//默认菜单状态
var level = 1;
var maxEnemy = 20;//敌方坦克总数
var maxAppearEnemy = 5;//屏幕上一起出现的最大数
var appearEnemy = 0; //已出现的敌方坦克
var mainframe = 0;
var isGameOver = false;
var overX = 176;
var overY = 384;
var emenyStopTime = 0;
var homeProtectedTime = -1;
var propTime = 300;

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
    var wallCanvas = wx.createCanvas();
    wallCtx = wallCanvas.getContext("2d")
    var grassCanvas = wx.createCanvas();
    grassCtx = grassCanvas.getContext("2d")
    wallCanvas.width = 300
    wallCanvas.height = 300
    grassCanvas.width = 300
    grassCanvas.height = 300
    var tankCanvas = wx.createCanvas();
    tankCtx = tankCanvas.getContext("2d")
    tankCanvas.width = 300
    tankCanvas.height = 300
    var overCanvas = wx.createCanvas();
    overCtx = overCanvas.getContext("2d")
    overCanvas.width = 300
    overCanvas.height = 300
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
    //this.stage = new Stage(ctx,level);
    //this.map = new Map(wallCtx,grassCtx);
    //this.player1 = new PlayTank(tankCtx);
    /*player1.x = 129 + map.offsetX;
    player1.y = 385 + map.offsetY;
    player2 = new PlayTank(tankCtx);
    player2.offsetX = 128; //player2的图片x与图片1相距128
    player2.x = 256 + map.offsetX;
    player2.y = 385 + map.offsetY;
    appearEnemy = 0; //已出现的敌方坦克
    enemyArray = [];//敌方坦克
    bulletArray = [];//子弹数组
    keys = [];//记录按下的按键
    crackArray = [];//爆炸数组
    isGameOver = false;
    overX = 176;
    overY = 384;
    overCtx.clearRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
    emenyStopTime = 0;
    homeProtectedTime = -1;
    propTime = 1000;*/
  }

  initEvent() {
    console.log("iamhere main.js enter initEvent func")
    canvas.addEventListener('touchstart', ((e) => {
      e.preventDefault()

      let x = e.touches[0].clientX
      let y = e.touches[0].clientY

      console.log("clientX is "+e.touches[0].clientX)
      console.log("clientY is "+e.touches[0].clientY)
      console.log("e is "+e)

      switch(gameState){
        case CONST.GAME_STATE_MENU:
          /*if(e.keyCode == keyboard.ENTER){
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
          }*/
          var n = 0;
          var count=0;
          if (count % 2 == 0) {
            n = 1;
          } else if (count % 2 == 1) {
            n = -1;
          }
          count++;
          this.menu.next(n);
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
      /*if ( this.checkIsFingerOnAir(x, y) ) {
        this.touched = true

        this.setAirPosAcrossFingerPosZ(x, y)
      }*/

    }).bind(this))

  }
  gameLoop(){
    switch(gameState){
    
    case CONST.GAME_STATE_MENU:
      this.menu.draw();
      break;
    case CONST.GAME_STATE_INIT:
      this.stage.draw();
      if(stage.isReady == true){
        gameState = CONST.GAME_STATE_START;
      }
      break;
    case CONST.GAME_STATE_START:
      drawAll();
      if(isGameOver ||(player1.lives <=0 && player2.lives <= 0)){
        gameState = CONST.GAME_STATE_OVER;
        this.map.homeHit();
        CONST.PLAYER_DESTROY_AUDIO.play();
      }
      if(appearEnemy == maxEnemy && enemyArray.length == 0){
        gameState  = CONST.GAME_STATE_WIN;
      }
      break;
    case CONST.GAME_STATE_WIN:
      nextLevel();
      break;
    case CONST.GAME_STATE_OVER:
      gameOver();
      break;
    }
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
/*
function initMap(){
  map.setMapLevel(level);;
  map.draw();
  drawLives();
}

function drawLives(){
  map.drawLives(player1.lives,1);
  map.drawLives(player2.lives,2);
}

function drawBullet(){
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

function keyEvent(){
  if(keys.contain(keyboard.W)){
    player1.dir = UP;
    player1.hit = false;
    player1.move();
  }else if(keys.contain(keyboard.S)){
    player1.dir = DOWN;
    player1.hit = false;
    player1.move();
  }else if(keys.contain(keyboard.A)){
    player1.dir = LEFT;
    player1.hit = false;
    player1.move();
  }else if(keys.contain(keyboard.D)){
    player1.dir = RIGHT;
    player1.hit = false;
    player1.move();
  }
  
  if(keys.contain(keyboard.UP)){
    player2.dir = UP;
    player2.hit = false;
    player2.move();
  }else if(keys.contain(keyboard.DOWN)){
    player2.dir = DOWN;
    player2.hit = false;
    player2.move();
  }else if(keys.contain(keyboard.LEFT)){
    player2.dir = LEFT;
    player2.hit = false;
    player2.move();
  }else if(keys.contain(keyboard.RIGHT)){
    player2.dir = RIGHT;
    player2.hit = false;
    player2.move();
  }
  
}

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

function drawCrack(){
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

  /*
  restart() {
    databus.reset()

    canvas.removeEventListener(
      'touchstart',
      this.touchHandler
    )

    this.bg = new BackGround(ctx)
    this.player = new Player(ctx)
    this.gameinfo = new GameInfo()
    this.music = new Music()

    this.bindLoop = this.loop.bind(this)
    this.hasEventBind = false

    // 清除上一局的动画
    window.cancelAnimationFrame(this.aniId);

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }
  */
  /**
   * 随着帧数变化的敌机生成逻辑
   * 帧数取模定义成生成的频率
   *//*
  enemyGenerate() {
    if (databus.frame % 30 === 0) {
      let enemy = databus.pool.getItemByClass('enemy', Enemy)
      enemy.init(6)
      databus.enemys.push(enemy)
    }
  }

  // 全局碰撞检测
  collisionDetection() {
    let that = this

    databus.bullets.forEach((bullet) => {
      for (let i = 0, il = databus.enemys.length; i < il; i++) {
        let enemy = databus.enemys[i]

        if (!enemy.isPlaying && enemy.isCollideWith(bullet)) {
          enemy.playAnimation()
          that.music.playExplosion()

          bullet.visible = false
          databus.score += 1

          break
        }
      }
    })

    for (let i = 0, il = databus.enemys.length; i < il; i++) {
      let enemy = databus.enemys[i]

      if (this.player.isCollideWith(enemy)) {
        databus.gameOver = true

        break
      }
    }
  }

  // 游戏结束后的触摸事件处理逻辑
  touchEventHandler(e) {
    e.preventDefault()

    let x = e.touches[0].clientX
    let y = e.touches[0].clientY

    let area = this.gameinfo.btnArea

    if (x >= area.startX
      && x <= area.endX
      && y >= area.startY
      && y <= area.endY)
      this.restart()
  }
  */
  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   *//*
  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    this.bg.render(ctx)

    databus.bullets
      .concat(databus.enemys)
      .forEach((item) => {
        item.drawToCanvas(ctx)
      })

    this.player.drawToCanvas(ctx)

    databus.animations.forEach((ani) => {
      if (ani.isPlaying) {
        ani.aniRender(ctx)
      }
    })

    this.gameinfo.renderGameScore(ctx, databus.score)

    // 游戏结束停止帧循环
    if (databus.gameOver) {
      this.gameinfo.renderGameOver(ctx, databus.score)

      if (!this.hasEventBind) {
        this.hasEventBind = true
        this.touchHandler = this.touchEventHandler.bind(this)
        canvas.addEventListener('touchstart', this.touchHandler)
      }
    }
  }

  // 游戏逻辑更新主函数
  update() {
    if (databus.gameOver)
      return;

    this.bg.update()

    databus.bullets
      .concat(databus.enemys)
      .forEach((item) => {
        item.update()
      })

    this.enemyGenerate()

    this.collisionDetection()

    if (databus.frame % 20 === 0) {
      this.player.shoot()
      this.music.playShoot()
    }
  }

  // 实现游戏帧循环
  loop() {
    databus.frame++

    this.update()
    this.render()

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }*/
}
