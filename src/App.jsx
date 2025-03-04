import { Flex, Input, Switch } from "antd";
import "./App.css";
import ImagePreviewer from "./components/commons/ImagePreviewer";
import Title from "antd/es/typography/Title";
import { useState } from "react";
import Slot from "./components/configuration/slot";

function App() {
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(400);
  const [alwaysShowPreviewer, setAlwaysShowPreviewer] = useState(true);
  const [showCrosshair, setShowCrosshair] = useState(true);
  const [crosshairRadius, setCrosshairRadius] = useState("auto");

  /**
   *
   * @param {import('react').ChangeEvent<HTMLInputElement>} event
   */
  function handleChangeWidth(event) {
    const { value } = event.target;
    setWidth(Number(value));
  }

  /**
   *
   * @param {import('react').ChangeEvent<HTMLInputElement>} event
   */
  function handleChangeHeight(event) {
    const { value } = event.target;
    setHeight(Number(value));
  }

  function handleToggleShowCanvas() {
    setAlwaysShowPreviewer(!alwaysShowPreviewer);
  }

  function handleToggleShowCrosshair() {
    setShowCrosshair(!showCrosshair);
  }

  /** @param {import('react').ChangeEvent} event*/
  function handleChangeCrosshairRadius(event) {
    const { value } = event.target;
    setCrosshairRadius(Number(value));
  }

  /** @param {boolean} checked */
  function toggleAutoCrosshairRadius(checked) {
    if (!checked) {
      setCrosshairRadius(100);
    } else {
      setCrosshairRadius("auto");
    }
  }

  return (
    <>
      <header>
        <h1>Image previewer</h1>
      </header>
      <main style={{ padding: "10rem 0px" }}>
        <ImagePreviewer
          width={width}
          height={height}
          alwaysShowCanvas={alwaysShowPreviewer}
          showCrosshair={showCrosshair}
          crosshairRadius={crosshairRadius}
        />

        <Flex
          vertical
          style={{
            margin: "5px 10px",
            padding: "10px",
            backgroundColor: "#eeea",
            borderRadius: "20px",
          }}
        >
          <Title level={3}>Configuration</Title>
          <Flex wrap>
            <Slot>
              <Title level={5}>Width</Title>
              <Input type="number" value={width} onChange={handleChangeWidth} />
            </Slot>
            <Slot>
              <Title level={5}>Height</Title>
              <Input
                type="number"
                value={height}
                onChange={handleChangeHeight}
              />
            </Slot>
            <Slot>
              <Flex gap={10}>
                <Title level={5}>Always show image previewer</Title>
                <Switch
                  onChange={handleToggleShowCanvas}
                  checked={alwaysShowPreviewer}
                />
              </Flex>
            </Slot>
            <Slot>
              <Flex gap={10}>
                <Title level={5}>Show previewer crosshair</Title>
                <Switch
                  onChange={handleToggleShowCrosshair}
                  checked={showCrosshair}
                />
              </Flex>
            </Slot>
            <Slot>
              <Flex gap={10}>
                <Title level={5}>Show previewer crosshair</Title>
                <Switch
                  onChange={toggleAutoCrosshairRadius}
                  checked={crosshairRadius === "auto"}
                />
                (Auto)
              </Flex>
              {crosshairRadius !== "auto" && (
                <Input
                  value={crosshairRadius}
                  onChange={handleChangeCrosshairRadius}
                />
              )}
            </Slot>
          </Flex>
        </Flex>
      </main>
      <footer>
        <p>Made by RaynierPM (2025)</p>
      </footer>
    </>
  );
}

export default App;
