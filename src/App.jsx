import { useEffect, useRef, useState } from "react";
import "./App.css";
import { ImagePreviewer } from "./core";

function App() {
  /**
   * @type {import("react").RefObject<ImagePreviewer>}
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

  useEffect(() => {
    if (image instanceof File) {
      const imageUrl = URL.createObjectURL(image);
      imagePreviewer.current.addImage(imageUrl);
    }
  }, [image]);

  useEffect(() => {
    const canvas = document.querySelector("canvas#imageCanvas");
    if (canvas) {
      imagePreviewer.current = new ImagePreviewer(canvas);

      imagePreviewer.current.drawGrid();

      imagePreviewer.current.addDragEvent();

      return () => {
        imagePreviewer.current.removeDragEvent();
      };
    }
  }, []);

  return (
    <>
      <header>
        <h1>Image previewer</h1>
      </header>
      <main style={{ padding: "10rem 0px" }}>
        <div className="a-center fit-content">
          <div>
            <canvas
              id="imageCanvas"
              width="400"
              height="400" 
              style={{
                backgroundColor: "#ccc4",
                borderRadius: "20px",
                boxShadow: "#000 1px 1px 10px",
                cursor: "all-scroll",
              }}
            >
              This is a canvas, and seems not be supported by your browser
            </canvas>
            <div className="input" style={{ display: "flex", flexWrap: 'wrap' }}>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              <button onClick={handleDownload}>Download image</button>
              <button style={{width: '100%'}} onClick={() => {
                imagePreviewer.current.clearCanvas()
                imagePreviewer.current.drawGrid()
              }}>
                Clear canvas
              </button>
            </div>
          </div>
        </div>
      </main>
      <footer>Hola</footer>
    </>
  );
}

export default App;
