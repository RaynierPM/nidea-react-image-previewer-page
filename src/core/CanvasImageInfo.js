export class ImageInfo {

  /**
   * 
   * @param {HTMLImageElement} img
   * @param {number?} aspectRatio
   */
    constructor(img, aspectRatio) {
      if (!(img instanceof Image)) {
        throw new Error('Not valid image')
      }
      
      this.#img = img
      const {width, height} = img
  
      if (!height || !width) {
        throw new Error('Not valid image dimensions')
      }
  
      this.#height = height
      this.#width = width
      this.#aspectRatio = aspectRatio ?? width/height


      if (this.showImageFullWidth()) {
        this.#slicedWidth = width
        this.#slicedheight = height * this.#aspectRatio
      }else {
        this.#slicedWidth = width / this.#aspectRatio
        this.#slicedheight = height
      }
    }

  #img;

  get img() {
    return this.#img
  }

  set img(img) {
    if (img instanceof Image) {
      this.#img = img
    }
  }
  
  #x = 0;

  get x() {
    return this.#x
  }

  set x(x) {
    if (typeof x === 'number'
      && (x >= 0 && x <= this.horizontalMovementLimit)
    ) {
      this.#x = x
    }
  }

  #y = 0;

  get y() {
    return this.#y
  }

  set y(y) {
    if (typeof y === 'number'
      && (y >= 0 && y <= this.verticalMovementLimit)
    ) {
      this.#y = y
    }
  }
  
  #width;

  get width() {
    return this.#width
  }

  set width(width) {
    if (typeof width === 'number') {
      this.#width = Math.abs(width)
    }
  }
  
  #height;

  get height() {
    return this.#height
  }

  set height(height) {
    if (typeof height === 'number') {
      this.#height = Math.abs(height)
    }
  }
  #aspectRatio;

  get aspectRatio() {
    return this.#aspectRatio
  }
  
  showImageFullWidth() {
    return this.#aspectRatio < 1
  }

  #slicedWidth;

  get slicedWidth() {
    return this.#slicedWidth
  }

  #slicedheight;

  get slicedHeight() {
    return this.#slicedheight
  }

  get horizontalMovementLimit() {
    return this.#width - this.#slicedWidth
  }

  get verticalMovementLimit() {
    return this.#height - this.#slicedheight
  }

  /**
   * 
   * @param {*} xPxQty - Pixels quantity to add/remove
   * @param {*} yPxQty - Pixels quantity to add/remove
   */
  move(xPxQty, yPxQty) {
    this.x = this.#x + (xPxQty*.5)
    this.y = this.#y + (yPxQty*.5) 
  }
}