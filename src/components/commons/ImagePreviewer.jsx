import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { ImagePreviewer as CanvasImagePreviewer } from "core/index";
import { Button, Input } from "antd";

export default function ImagePreviewer({
  width,
  height,
  alwaysShowCanvas = false,
  showCrosshair = true,
  crosshairRadius = "auto",
}) {
  /**
   * @type {import("react").RefObject<import('../../core/index').ImagePreviewer>}
   */
  const imagePreviewer = useRef();
  const [image, setImage] = useState();

  function handleImageChange(e) {
    const uploadedImage = e.target.files[0];
    if (uploadedImage) {
      setImage(uploadedImage);
    }
  }

  /**
   *
   * @param {import('react').MouseEvent<HTMLButtonElement, Element>} event
   */
  function handleDownload(event) {
    event.preventDefault();
    imagePreviewer.current.downloadImage();
  }

  const show = alwaysShowCanvas || Boolean(image);

  useEffect(() => {
    const canvas = document.querySelector("canvas#imageCanvas");
    if (canvas && show) {
      imagePreviewer.current = new CanvasImagePreviewer(canvas, {
        withCrosshair: showCrosshair,
        crossHairRadius: crosshairRadius,
      });

      imagePreviewer.current.drawGrid();

      imagePreviewer.current.addDragEvent();

      if (image instanceof File) {
        const imageUrl = URL.createObjectURL(image);
        imagePreviewer.current?.addImage(imageUrl);
      }

      return () => {
        imagePreviewer.current.removeDragEvent();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image]);

  useEffect(() => {
    imagePreviewer.current.dimensions = { width, height };
    imagePreviewer.current.refreshImage();
  }, [width, height]);

  useEffect(() => {
    imagePreviewer.current.options = {
      crossHairRadius: crosshairRadius,
      withCrosshair: showCrosshair,
    };
    imagePreviewer.current.refreshImage();
  }, [showCrosshair, crosshairRadius]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "10px 0px",
        }}
      >
        <canvas
          id="imageCanvas"
          width={width}
          height={height}
          style={{
            backgroundColor: "#ccc4",
            borderRadius: "20px",
            boxShadow: "#000 1px 1px 10px",
            cursor: "all-scroll",
            display: show ? "block" : "none",
          }}
        >
          This is a canvas, and seems not be supported by your browser
        </canvas>
      </div>
      <div className="a-center fit-content">
        <div className="input" style={{ display: "flex", flexWrap: "wrap" }}>
          <Input type="file" accept="image/*" onChange={handleImageChange} />
          <Button onClick={handleDownload} style={{ width: "100%" }}>
            Download image
          </Button>
          {Boolean(image) && (
            <Button
              style={{ width: "100%" }}
              onClick={() => {
                imagePreviewer.current.clearCanvas();
                setImage(null);
              }}
            >
              Clear canvas
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

ImagePreviewer.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  alwaysShowCanvas: PropTypes.bool,
  showCrosshair: PropTypes.bool,
  crosshairRadius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
