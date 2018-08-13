import Pool from './base/pool'

let instance

/**
 * 全局状态管理器
 */
export default class DataBus {
  constructor() {
    console.log("DataBus class")
    if ( instance )
      return instance

    instance = this

    this.pool = new Pool()

    this.reset()
  }

  reset() {
    console.log("iamhere databus.js reset func")
    this.frame      = 0
    this.score      = 0
    this.bullets    = []
    this.enemys     = []
    this.animations = []
    this.gameOver   = false
  }

  /**
   * 回收敌人，进入对象池
   * 此后不进入帧循环
   */
  removeEnemey(enemy) {
    console.log("enter removeEnemey func")
    let temp = this.enemys.shift()

    temp.visible = false

    this.pool.recover('enemy', enemy)
  }

  /**
   * 回收子弹，进入对象池
   * 此后不进入帧循环
   */
  removeBullets(bullet) {
    console.log("enter removeBullets func")
    let temp = this.bullets.shift()

    temp.visible = false

    this.pool.recover('bullet', bullet)
  }
}
