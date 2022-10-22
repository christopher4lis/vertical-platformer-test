class Player extends Sprite {
  constructor({
    collisionBlocks = [],
    imageSrc,
    frameRate,
    animations,
    loop,
    scale,
  }) {
    super({ imageSrc, frameRate, animations, loop, scale })
    this.position = {
      x: 130,
      y: 240,
    }

    this.velocity = {
      x: 0,
      y: 0,
    }

    this.sides = {
      bottom: this.position.y + this.height,
    }
    this.gravity = 0.1

    this.collisionBlocks = collisionBlocks
    this.platformCollisions = platformCollisions

    this.camera = {
      position: {
        x: this.position.x,
        y: this.position.y - 45,
      },
      offset: {
        x: 0,
        y: 576 / 2,
      },
      width: 200,
      height: 80,
    }
  }

  update() {
    this.position.x += this.velocity.x
    this.camera.position.x = this.position.x - 60
    this.camera.position.y = this.position.y

    if (this.camera.position.y + this.velocity.y <= this.camera.offset.y) {
      this.camera.offset.y += this.velocity.y
      camera.position.y -= this.velocity.y
    }

    if (
      this.camera.position.y + this.camera.height + this.velocity.y >=
      this.camera.offset.y + canvas.height / 4
    ) {
      this.camera.offset.y += this.velocity.y
      camera.position.y -= this.velocity.y
    }

    this.updateHitbox()

    this.checkForHorizontalCollisions()
    this.applyGravity()
    this.updateHitbox()
    this.checkForVerticalCollisions()

    // box of fully-cropped image
    // c.fillStyle = 'rgba(0, 0, 255, 0.5)'
    // c.fillRect(this.position.x, this.position.y, this.width, this.height)

    // // camera box
    // c.fillStyle = 'rgba(0, 255, 0, 0.05)'
    // c.fillRect(
    //   this.camera.position.x,
    //   this.camera.position.y,
    //   this.camera.width,
    //   this.camera.height
    // )

    // // hit box
    // c.fillStyle = 'rgba(255, 0, 0, 0.5)'
    // c.fillRect(
    //   this.hitbox.position.x,
    //   this.hitbox.position.y,
    //   this.hitbox.width,
    //   this.hitbox.height
    // )
  }

  handleInput({ keys }) {
    if (this.preventInput) return

    this.velocity.x = 0
    if (keys.d.pressed) {
      this.switchSprite('runRight')
      this.velocity.x = 1
      this.lastDirection = 'right'

      if (
        this.camera.position.x + this.camera.width + this.velocity.x >=
          canvas.width / 4 + this.camera.offset.x &&
        this.camera.offset.x < canvas.width / 4
      ) {
        this.camera.offset.x++
        camera.position.x -= 1
      }
    } else if (keys.a.pressed) {
      this.switchSprite('runLeft')
      this.velocity.x = -1
      this.lastDirection = 'left'

      if (this.hitbox.position.x + this.velocity.x <= 0) {
        const offset = this.hitbox.position.x - this.position.x
        this.position.x = 0 - offset + 0.01
      }

      if (
        this.camera.position.x + this.velocity.x <= 0 + this.camera.offset.x &&
        this.camera.offset.x > 0
      ) {
        this.camera.offset.x--
        camera.position.x += 1
      }
    } else {
      if (this.lastDirection === 'left') this.switchSprite('idleLeft')
      else this.switchSprite('idleRight')
    }
  }

  switchSprite(name) {
    if (this.image === this.animations[name].image) return
    this.currentFrame = 0
    this.image = this.animations[name].image
    this.frameRate = this.animations[name].frameRate
    this.frameBuffer = this.animations[name].frameBuffer
    this.loop = this.animations[name].loop
    this.currentAnimation = this.animations[name]
  }

  updateHitbox() {
    this.hitbox = {
      position: {
        x: this.position.x + this.width / 2 - 11.25,
        y: this.position.y + this.height - 28,
      },
      width: 22.5,
      height: 56 / 2,
    }

    // width / 8 == width of one image
    // width of one image / 2 = center of one image
    // center of image - width of character / 2 = horizontal centered hitbox
  }

  checkForHorizontalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i]

      // if a collision exists
      if (
        this.hitbox.position.x <=
          collisionBlock.position.x + collisionBlock.width &&
        this.hitbox.position.x + this.hitbox.width >=
          collisionBlock.position.x &&
        this.hitbox.position.y + this.hitbox.height >=
          collisionBlock.position.y &&
        this.hitbox.position.y <=
          collisionBlock.position.y + collisionBlock.height
      ) {
        // collision on x axis going to the left
        if (this.velocity.x < -0) {
          const offset = this.hitbox.position.x - this.position.x
          this.position.x =
            collisionBlock.position.x + collisionBlock.width - offset + 0.01
          break
        }

        if (this.velocity.x > 0) {
          const offset =
            this.hitbox.position.x - this.position.x + this.hitbox.width
          this.position.x = collisionBlock.position.x - offset - 0.01
          break
        }
      }
    }
  }

  applyGravity() {
    this.velocity.y += this.gravity
    this.position.y += this.velocity.y
  }

  checkForVerticalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i]

      // if a collision exists
      if (
        this.hitbox.position.x <=
          collisionBlock.position.x + collisionBlock.width &&
        this.hitbox.position.x + this.hitbox.width >=
          collisionBlock.position.x &&
        this.hitbox.position.y + this.hitbox.height >=
          collisionBlock.position.y &&
        this.hitbox.position.y <=
          collisionBlock.position.y + collisionBlock.height
      ) {
        if (this.velocity.y < 0) {
          this.velocity.y = 0
          const offset = this.hitbox.position.y - this.position.y
          this.position.y =
            collisionBlock.position.y + collisionBlock.height - offset + 0.01
          break
        }

        if (this.velocity.y > 0) {
          this.velocity.y = 0
          const offset =
            this.hitbox.position.y - this.position.y + this.hitbox.height
          this.position.y = collisionBlock.position.y - offset - 0.01
          break
        }
      }
    }

    for (let i = 0; i < this.platformCollisions.length; i++) {
      const collisionBlock = this.platformCollisions[i]

      // if a collision exists
      if (
        this.hitbox.position.x <=
          collisionBlock.position.x + collisionBlock.width &&
        this.hitbox.position.x + this.hitbox.width >=
          collisionBlock.position.x &&
        this.hitbox.position.y + this.hitbox.height >=
          collisionBlock.position.y &&
        this.hitbox.position.y + this.hitbox.height - this.velocity.y <=
          collisionBlock.position.y
      ) {
        // if (this.velocity.y < 0) {
        //   this.velocity.y = 0
        //   const offset = this.hitbox.position.y - this.position.y
        //   this.position.y =
        //     collisionBlock.position.y + collisionBlock.height - offset + 0.01
        //   break
        // }

        if (this.velocity.y > 0) {
          this.velocity.y = 0
          const offset =
            this.hitbox.position.y - this.position.y + this.hitbox.height
          this.position.y = collisionBlock.position.y - offset - 0.01
          break
        }
      }
    }
  }
}
