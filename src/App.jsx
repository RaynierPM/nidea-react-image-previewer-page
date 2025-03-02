import { useEffect, useRef, useState } from "react";
import "./App.css";
import { ImagePreviewer } from "./core";

function App() {
  const imagePreviewer = useRef();
  const [image, setImage] = useState();

  function handleImageChange(e) {
    const uploadedImage = e.target.files[0];
    if (uploadedImage) {
      setImage(uploadedImage);
    }
  }

  useEffect(() => {
    if (image instanceof File) {
      const imageUrl = URL.createObjectURL(image);
      imagePreviewer.current.addImage(imageUrl);
    }
  }, [image]);

  useEffect(() => {
    const canvas = document.querySelector("canvas#imageCanvas");
    imagePreviewer.current = new ImagePreviewer(canvas);

    imagePreviewer.current.drawGrid();
  }, []);

  return (
    <>
      <header>
        <h1>Image previewer</h1>
      </header>
      <main>
        <div className="a-center fit-content">
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
            This is a canvas, and seems not be supported
          </canvas>
          <div className="input">
            <input
              type="file"
              accept=".jpg"
              onChange={handleImageChange}
            ></input>
          </div>
        </div>
      </main>
      <footer>Hola</footer>
    </>
  );
}

export default App;
