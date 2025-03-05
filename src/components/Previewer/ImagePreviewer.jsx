import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { ImagePreviewer as CanvasImagePreviewer } from "core/index";

/**
 * @typedef PreviewerContext
 * @property {() => Promise<Blob>} loadBlob
 * @property {() => Promise<void>} downloadBlob
 * @property {(event: import('react').ChangeEvent<HTMLInputElement>) => void} onChangeFile
 */
/** @type {import('react').Context<PreviewerContext>} */
const PreviewerContext = createContext();

const NOT_VALID_IMPLEMENTATION_ERROR = new Error(
  "This component must be children from ImagePreviewer"
);

export default function ImagePreviewer({
  width,
  height,
  alwaysShowCanvas = false,
  showCrosshair = true,
  crosshairRadius = "auto",
  children,
}) {
  /**
   * @type {import("react").RefObject<import('../../core/index').ImagePreviewer>}
   */
  const imagePreviewer = useRef();
  const [image, setImage] = useState();

  /** @param {import('react').ChangeEvent<HTMLInputElement>} e */
  function handleImageChange(e) {
    const uploadedImage = e.target.files[0];
    if (uploadedImage) {
      setImage(uploadedImage);
    }
  }

  /**
   * @param {import('react').MouseEvent<HTMLButtonElement, Element>} event
   */

  const show = alwaysShowCanvas || Boolean(image);

  useEffect(() => {
    const canvas = document.querySelector("canvas#imageCanvas");
    if (canvas && show) {
      imagePreviewer.current = new CanvasImagePreviewer(canvas, {
        withCrosshair: showCrosshair,
        crossHairRadius: crosshairRadius,
      });

      imagePreviewer.current.drawGrid();

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

  /** @type {() => Promise<Blob>} */
  function loadImageToBlob() {
    return imagePreviewer.current?.getBlob();
  }

  return (
    <PreviewerContext.Provider
      value={{
        loadBlob: loadImageToBlob,
        downloadBlob: imagePreviewer.current?.downloadImage(),
        onChangeFile: handleImageChange,
      }}
    >
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
            margin: "10px 5px",
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
        {children}
      </div>
    </PreviewerContext.Provider>
  );
}

ImagePreviewer.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  alwaysShowCanvas: PropTypes.bool,
  showCrosshair: PropTypes.bool,
  crosshairRadius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.element,
};

/**
 *
 * @param {Object} props
 * @param {((
 *  {loadBlob}:{loadBlob: () => Promise<Blob>}
 * ) => import('react').ReactElement) |
 * import('react').ReactElement } props.children
 * @returns
 */
// eslint-disable-next-line react/display-name
ImagePreviewer.BlobButton = ({ children: Children }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const context = useContext(PreviewerContext);

  if (!context) {
    throw NOT_VALID_IMPLEMENTATION_ERROR;
  }

  return typeof Children === "function" ? (
    <Children loadBlob={context.loadBlob} />
  ) : (
    Children
  );
};

ImagePreviewer.BlobButton.propTypes = {
  children: PropTypes.func.isRequired,
};

/**
 *
 * @param {Object} props
 * @param {({loadBlob}:{onDownload: () => Promise<Blob>}) => import('react').ReactElement | import('react').ReactElement} props.children
 * @returns
 */
// eslint-disable-next-line react/display-name
ImagePreviewer.DownloadButton = ({ children: Children }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const context = useContext(PreviewerContext);

  if (!context) {
    throw NOT_VALID_IMPLEMENTATION_ERROR;
  }

  return typeof Children === "function" ? (
    <Children onDownload={context.downloadBlob} />
  ) : (
    Children
  );
};

ImagePreviewer.DownloadButton.propTypes = {
  children: PropTypes.func.isRequired,
};

/**
 * @typedef ImageInputProps
 * @property {((
 * { onChangeFile }:{
 *  onChangeFile: (event: import('react').ChangeEvent<HTMLInputElement>) => void
 * }) => import('react').ReactElement
 * ) | import('react').ReactElement} children
 */

/**
 *
 * @param {ImageInputProps} props
 * @returns
 */
// eslint-disable-next-line react/display-name
ImagePreviewer.ImageInput = ({ children: Children }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const context = useContext(PreviewerContext);

  if (!context) {
    throw NOT_VALID_IMPLEMENTATION_ERROR;
  }

  return typeof Children === "function" ? (
    <Children onChangeFile={context.onChangeFile} />
  ) : (
    Children
  );
};

ImagePreviewer.ImageInput.propTypes = {
  children: PropTypes.func.isRequired,
};
