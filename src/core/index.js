export class ImagePreviewer {
  /** @type {CanvasRenderingContext2D} */
  context;
  /** @type {{width: number; height: number}} */
  #dimensions;

  /** @type {number} */
  #INCREMENT;

  /**
   * @type {({width: number; height: number}) | null}
   */
  #imageDimensions = null

  /**
   * 
   * @param {Element} canvas 
   */
  constructor(canvas) {
    const ctx = canvas.getContext('2d')
    if (ctx instanceof CanvasRenderingContext2D) {
      this.context = ctx;
    }

    const clientRectDOM = canvas.getClientRects()[0]

    const dimensions = {
      width: clientRectDOM.width,
      height: clientRectDOM.height
    }
    this.#dimensions = dimensions
    this.#INCREMENT = (this.#dimensions.width+this.#dimensions.height)*.1
  }

  drawGrid() {
    const ctx = this.context;
    const { height, width } = this.#dimensions;
    ctx.beginPath();
    ctx.strokeStyle = '#888'
    ctx.lineWidth = 0.25
    for (let col = this.#INCREMENT; col < width; col += this.#INCREMENT) {
      ctx.moveTo(col, 0);
      ctx.lineTo(col, height);
    }

    for (let row = this.#INCREMENT; row < height; row += this.#INCREMENT) {
      ctx.moveTo(0, row);
      ctx.lineTo(width, row);
    }
    ctx.stroke();

    this.drawCrosshair()
  }

  drawCrosshair() {
    const ctx = this.context
    const {width, height} = this.#dimensions
    ctx.beginPath()
    ctx.fillStyle = '#9999'
    ctx.moveTo(0,0)
    ctx.lineTo(width, 0)
    ctx.lineTo(width, height)
    ctx.lineTo(0, height)
    ctx.lineTo(0,0)
    ctx.arc(width/2, height/2, (width+height)*.21, 0, 2*Math.PI, true)
    ctx.fill()
  }

  clearContext() {
    // this.context.
  }

  addImage(imgPath) {
    const img = new Image()
    img.addEventListener('load', () => {
      const {width, height} = img
      this.#imageDimensions = {width, height}
      const aspectRatio = height/width
      if (this.#isWidthPriority()) {
        this.context.drawImage(img, 0, 0, this.#dimensions.width/aspectRatio, this.#dimensions.height)
      } else {
        this.context.drawImage(img, 0, 0, this.#dimensions.width, this.#dimensions.height*aspectRatio)
      }
      this.drawCrosshair()
    })
    img.src = imgPath
  }

  #isWidthPriority() {
    if (this.#imageDimensions.width >= this.#imageDimensions.height) {
      return true
    }else {
      return false
    }
  }

}
