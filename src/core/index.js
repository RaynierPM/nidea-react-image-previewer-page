import { downloableCanvas } from "./CanvasDownloable";
import { ImageInfo } from "./CanvasImageInfo";
import { DragHandler } from "./DragHandler";

const DEFAULT_COORD = 0;

export class ImagePreviewer {
  /** @type {HTMLCanvasElement} */
  canvas;

  /** @type {CanvasRenderingContext2D} */
  context;
  /** @type {{width: number; height: number}} */
  #dimensions;

  /** @type {number} - Space between grid's lines */
  #GRID_INCREMENT;

  /** @type {number} */
  // #zoom = 1;
  /**
   * @type {ImageInfo | null}
   */
  #imageInfo = null;

  #isClicked = false;

  /** @type {DragHandler | null} */
  #dragHandler = null;

  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    if (
      !(canvas instanceof HTMLCanvasElement) ||
      canvas.tagName.toLowerCase() != "canvas"
    ) {
      throw new Error("Canvas element required");
    }
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (ctx instanceof CanvasRenderingContext2D) {
      this.context = ctx;
    }

    const clientRectDOM = canvas.getClientRects()[0];

    const dimensions = {
      width: clientRectDOM.width,
      height: clientRectDOM.height,
    };
    this.#dimensions = dimensions;
    this.#GRID_INCREMENT =
      (this.#dimensions.width + this.#dimensions.height) * 0.1;
  }

  drawGrid() {
    const ctx = this.context;
    const { height, width } = this.#dimensions;
    ctx.beginPath();
    ctx.strokeStyle = "#888";
    ctx.lineWidth = 0.25;
    for (
      let col = this.#GRID_INCREMENT;
      col < width;
      col += this.#GRID_INCREMENT
    ) {
      ctx.moveTo(col, 0);
      ctx.lineTo(col, height);
    }

    for (
      let row = this.#GRID_INCREMENT;
      row < height;
      row += this.#GRID_INCREMENT
    ) {
      ctx.moveTo(0, row);
      ctx.lineTo(width, row);
    }
    ctx.stroke();

    this.drawCrosshair();
  }

  drawCrosshair() {
    const ctx = this.context;
    const { width, height } = this.#dimensions;
    ctx.beginPath();
    ctx.fillStyle = "#9999";
    ctx.moveTo(0, 0);
    ctx.lineTo(width, 0);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.lineTo(0, 0);
    ctx.arc(
      width / 2,
      height / 2,
      (width + height) * 0.21,
      0,
      2 * Math.PI,
      true
    );
    ctx.fill();
  }

  clearContext() {
    // this.context.clea
  }

  addImage(imgPath, withCrosshair = true) {
    const img = new Image();
    img.addEventListener("load", () => {
      this.#imageInfo = this.#getCanvasImageInfo(img);
      this.#drawImage();
      withCrosshair && this.drawCrosshair();
    });
    img.src = imgPath;
  }

  #drawImage() {
    if (this.#imageInfo) {
      const { img } = this.#imageInfo;

      this.context.drawImage(
        img,
        this.#imageInfo.x,
        this.#imageInfo.y,
        this.#imageInfo.slicedWidth,
        this.#imageInfo.slicedHeight,
        DEFAULT_COORD,
        DEFAULT_COORD,
        this.#dimensions.width,
        this.#dimensions.height
      );
    }
  }

  /**
   *
   * @param {HTMLImageElement} img
   */
  #getCanvasImageInfo(img) {
    return new ImageInfo(img);
  }

  /**
   *
   * @param {MouseEvent} event
   */
  #onDragHandler(event) {
    if (this.#isClicked && this.#imageInfo.img) {
      const { x, y } = this.#getCanvasClickPosition(event);
      const { x: xPxQty, y: yPxQty } = this.#dragHandler.getDifference(x, y);

      this.moveImage(xPxQty, yPxQty);
    }
  }

  #isClickedHandler(event) {
    if (this.#imageInfo) {
      const { x, y } = this.#getCanvasClickPosition(event);
      this.#dragHandler = new DragHandler(x, y);
      this.#isClicked = true;
    }
  }

  #isUnclickedHandler() {
    this.#dragHandler = null;
    this.#isClicked = false;
  }

  /**
   *
   * @param {MouseEvent} event
   * @returns
   */
  #getCanvasClickPosition(event) {
    const { x: canvasX, y: canvasY } = this.canvas.getBoundingClientRect();
    const positionX = event.clientX - canvasX;
    const positionY = event.clientY - canvasY;
    return { x: positionX, y: positionY };
  }

  addDragEvent() {
    this.canvas.addEventListener("mousedown", (event) => {
      this.#isClickedHandler(event);
    });
    this.canvas.addEventListener("mouseup", (event) => {
      this.#isUnclickedHandler(event);
    });
    this.canvas.addEventListener("mouseover", (event) => {
      this.#isUnclickedHandler(event);
    });
    this.canvas.addEventListener("mousemove", (event) => {
      this.#onDragHandler(event);
    });
  }

  removeDragEvent() {
    this.canvas.removeEventListener("mousedown", (event) => {
      this.#isClickedHandler(event);
    });
    this.canvas.removeEventListener("mouseup", (event) => {
      this.#isUnclickedHandler(event);
    });
    this.canvas.removeEventListener("mouseover", (event) => {
      this.#isUnclickedHandler(event);
    });
    this.canvas.removeEventListener("mousemove", (event) => {
      this.#onDragHandler(event);
    });
  }

  /**
   *
   * @param {number} xPxQty Horizontal pixels quantity
   * @param {number} yPxQty Horizontal pixels quantity
   */
  moveImage(xPxQty, yPxQty) {
    this.#imageInfo.move(xPxQty, yPxQty);
    this.#drawImage();
    this.drawCrosshair();
  }

  async downloadImage() {
    if (this.#imageInfo) {
      return await new downloableCanvas(this.#imageInfo).download()
    }
    return 
  }
}
