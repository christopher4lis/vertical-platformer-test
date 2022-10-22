const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 64 * 16 // 1024
canvas.height = 64 * 9 // 576

let parsedCollisions
let collisionBlocks
let background
const player = new Player({
  imageSrc: './img/king2/idle.png',
  frameRate: 8,
  animations: {
    idleRight: {
      frameRate: 8,
      frameBuffer: 8,
      loop: true,
      imageSrc: './img/king2/idle.png',
    },
    idleLeft: {
      frameRate: 8,
      frameBuffer: 8,
      loop: true,
      imageSrc: './img/king2/idleLeft.png',
    },
    runRight: {
      frameRate: 8,
      frameBuffer: 8,
      loop: true,
      imageSrc: './img/king2/runRight.png',
    },
    runLeft: {
      frameRate: 8,
      frameBuffer: 8,
      loop: true,
      imageSrc: './img/king2/runLeft.png',
    },
  },
})

let level = 1
let platformBlocks = []
let levels = {
  1: {
    init: () => {
      parsedCollisions = collisionsLevel1.parse2D()
      collisionBlocks = parsedCollisions.createObjectsFrom2D()

      const parsedPlatformCollisions = platformCollisions.parse2D()
      platformBlocks = parsedPlatformCollisions.createObjectsFrom2D()

      player.collisionBlocks = collisionBlocks
      player.platformCollisions = platformBlocks
      if (player.currentAnimation) player.currentAnimation.isActive = false

      background = new Sprite({
        position: {
          x: 0,
          y: 0,
        },
        imageSrc: './img/background.png',
      })
    },
  },
}

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
}

const overlay = {
  opacity: 0,
}

c.scale(4, 4)
const camera = {
  position: {
    x: 0,
    y: -576 / 2,
  },
}
function animate() {
  window.requestAnimationFrame(animate)

  c.save()
  c.translate(camera.position.x, camera.position.y)
  background.draw()
  // collisionBlocks.forEach((collisionBlock) => {
  //   collisionBlock.draw()
  // })

  // platformBlocks.forEach((collisionBlock) => {
  //   collisionBlock.draw()
  // })

  player.handleInput({ keys, camera })
  player.draw()
  player.update()

  c.save()
  c.globalAlpha = overlay.opacity
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  c.restore()
  c.restore()
}

levels[level].init()
animate()
