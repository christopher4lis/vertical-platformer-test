const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 64 * 16 // 1024
canvas.height = 64 * 9 // 576

let parsedCollisions
let collisionBlocks
let background
const player = new Player({
  scale: 0.5,
  imageSrc: './img/warrior/Idle.png',
  frameRate: 8,
  animations: {
    idleRight: {
      frameRate: 8,
      frameBuffer: 8,
      loop: true,
      imageSrc: './img/warrior/Idle.png',
    },
    idleLeft: {
      frameRate: 8,
      frameBuffer: 8,
      loop: true,
      imageSrc: './img/warrior/Idle.png',
    },
    runRight: {
      frameRate: 8,
      frameBuffer: 8,
      loop: true,
      imageSrc: './img/warrior/Run.png',
    },
    runLeft: {
      frameRate: 8,
      frameBuffer: 8,
      loop: true,
      imageSrc: './img/warrior/Run.png',
    },
    jump: {
      frameRate: 2,
      frameBuffer: 8,
      loop: true,
      imageSrc: './img/warrior/Jump.png',
    },
    fall: {
      frameRate: 2,
      frameBuffer: 3,
      loop: true,
      imageSrc: './img/warrior/Fall.png',
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

const camera = {
  position: {
    x: 0,
    y: -200,
    // y: 0,
  },
}

// x: 256
// y: 144
// 0 - 320

function animate() {
  window.requestAnimationFrame(animate)

  c.save()
  c.scale(4, 4)
  c.translate(camera.position.x, camera.position.y)
  background.draw()
  // collisionBlocks.forEach((collisionBlock) => {
  //   collisionBlock.draw()
  // })

  // platformBlocks.forEach((collisionBlock) => {
  //   collisionBlock.draw()
  // })

  player.handleInput({ keys, camera })
  player.update()
  player.draw()

  c.save()
  c.globalAlpha = overlay.opacity
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  c.restore()
  c.restore()
}

levels[level].init()
animate()
