import { useEffect, useRef, useState } from "react";
import "./App.css";
import { ImagePreviewer } from "./core";
import Spinner from "./components/commons/spinner/Spinner";

function App() {
  /**
   * @type {import("react").RefObject<ImagePreviewer>}
   */
  const imagePreviewer = useRef();
  const [image, setImage] = useState();
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    imagePreviewer.current.downloadImage()
    .finally(() => {
      setIsLoading(false)
    });
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
      
      !isLoading && imagePreviewer.current.drawGrid();

      imagePreviewer.current.addDragEvent();

    return () => {imagePreviewer.current.removeDragEvent()}
    }
  }, [isLoading]);

  return (
    <>
      <header>
        <h1>Image previewer</h1>
      </header>
      <main style={{padding: '10rem 0px',}}>
        <div className="a-center fit-content">
          {isLoading ? (
            <Spinner />
          ) : (
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
              <div className="input" style={{ display: "flex" }}>
                <input type="file" accept=".jpg" onChange={handleImageChange} />
                <button onClick={handleDownload}>Download image</button>
              </div>
            </div>
          )}
        </div>
      </main>
      <footer>Hola</footer>
    </>
  );
}

export default App;
