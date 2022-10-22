Array.prototype.parse2D = function () {
  const rows = []
  for (let i = 0; i < this.length; i += 36) {
    rows.push(this.slice(i, i + 36))
  }

  return rows
}

Array.prototype.createObjectsFrom2D = function () {
  const objects = []
  this.forEach((row, y) => {
    row.forEach((symbol, x) => {
      if (symbol === 292 || symbol === 202) {
        // push a new collision into collisionblocks array
        objects.push(
          new CollisionBlock({
            position: {
              x: x * 16,
              y: y * 16,
            },
          })
        )
      }
    })
  })

  return objects
}
