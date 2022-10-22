class Sprite {
  constructor({
    position,
    imageSrc,
    frameRate = 1,
    animations,
    frameBuffer = 2,
    loop = true,
    autoplay = true,
    scale = 1,
  }) {
    this.position = position
    this.image = new Image()
    this.image.onload = () => {
      this.loaded = true
      this.width = (this.image.width / this.frameRate) * this.scale
      this.height = this.image.height * this.scale
    }
    this.image.src = imageSrc
    this.loaded = false
    this.frameRate = frameRate
    this.currentFrame = 0
    this.elapsedFrames = 0
    this.frameBuffer = frameBuffer
    this.animations = animations
    this.loop = loop
    this.autoplay = autoplay
    this.currentAnimation
    this.cropbox = {}
    this.scale = scale

    if (this.animations) {
      for (let key in this.animations) {
        const image = new Image()
        image.src = this.animations[key].imageSrc
        this.animations[key].image = image
      }
    }
  }
  draw() {
    if (!this.loaded) return
    this.cropbox = {
      position: {
        x: (this.image.width / this.frameRate) * this.currentFrame,
        y: 0,
      },
      width: this.image.width / this.frameRate,
      height: this.image.height,
    }

    c.drawImage(
      this.image,
      this.cropbox.position.x,
      this.cropbox.position.y,
      this.cropbox.width,
      this.cropbox.height,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    )

    this.updateFrames()
  }

  play() {
    this.autoplay = true
  }

  updateFrames() {
    if (!this.autoplay) return

    this.elapsedFrames++

    if (this.elapsedFrames % this.frameBuffer === 0) {
      if (this.currentFrame < this.frameRate - 1) this.currentFrame++
      else if (this.loop) this.currentFrame = 0
    }

    if (this.currentAnimation?.onComplete) {
      if (
        this.currentFrame === this.frameRate - 1 &&
        !this.currentAnimation.isActive
      ) {
        this.currentAnimation.onComplete()
        this.currentAnimation.isActive = true
      }
    }
  }
}
