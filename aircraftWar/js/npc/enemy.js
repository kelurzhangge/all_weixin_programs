import Animation from '../base/animation'
import DataBus   from '../databus'

const ENEMY_IMG_SRC = 'images/enemy.png'
const ENEMY_WIDTH   = 60
const ENEMY_HEIGHT  = 60

const __ = {
  speed: Symbol('speed')
}

let databus = new DataBus()

function rnd(start, end){
  return Math.floor(Math.random() * (end - start) + start)
}

export default class Enemy extends Animation {
  constructor() {
    console.log("enter enemy.js constructor func")
    super(ENEMY_IMG_SRC, ENEMY_WIDTH, ENEMY_HEIGHT)

    this.initExplosionAnimation()
  }

  init(speed) {
    console.log("iamhere init speed func")
    this.x = rnd(0, window.innerWidth - ENEMY_WIDTH)
    this.y = -this.height

    this[__.speed] = speed

    this.visible = true
  }

  // 预定义爆炸的帧动画
  initExplosionAnimation() {
    console.log("iamhere enter initExplosionAnimation func")
    let frames = []

    const EXPLO_IMG_PREFIX  = 'images/explosion'
    const EXPLO_FRAME_COUNT = 19

    for ( let i = 0;i < EXPLO_FRAME_COUNT;i++ ) {
      frames.push(EXPLO_IMG_PREFIX + (i + 1) + '.png')
    }

    this.initFrames(frames)
  }

  // 每一帧更新子弹位置
  update() {
    console.log("iamehre enter update func")
    this.y += this[__.speed]

    // 对象回收
    if ( this.y > window.innerHeight + this.height )
      databus.removeEnemey(this)
  }
}
