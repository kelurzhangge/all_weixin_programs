let instance

/**
 * 统一的音效管理器
 */
export default class Music {
  constructor() {
    console.log("iamhere music.js enter constructor func")
    if ( instance )
      return instance

    instance = this

    this.bgmAudio = new Audio()
    this.bgmAudio.loop = true
    this.bgmAudio.src  = 'audio/bgm.mp3'

    this.shootAudio     = new Audio()
    this.shootAudio.src = 'audio/bullet.mp3'

    this.boomAudio     = new Audio()
    this.boomAudio.src = 'audio/boom.mp3'

    this.playBgm()
  }

  playBgm() {
    console.log("iamhere enter playBgm")
    this.bgmAudio.play()
  }

  playShoot() {
    console.log("iamhere enter playShoot")
    this.shootAudio.currentTime = 0
    this.shootAudio.play()
  }

  playExplosion() {
    console.log("iamhere enter playExplosion")
    this.boomAudio.currentTime = 0
    this.boomAudio.play()
  }
}
