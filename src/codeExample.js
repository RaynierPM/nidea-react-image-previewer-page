export const EXAMPLE = `<ImagePreviewer
  width={width} // number
  height={height} // number
  alwaysShowCanvas={alwaysShowPreviewer} //boolean
  showCrosshair={showCrosshair} //boolean
  crosshairRadius={crosshairRadius} // 'auto' | number
>

      <ImagePreviewer.ImageInput>
        {({ onChangeFile }) => <Input type="file" onChange={onChangeFile} />}
      </ImagePreviewer.ImageInput>

      <ImagePreviewer.DownloadButton>
        {({ onDownload }) => (
          <Button
            onClick={onDownload}
            style={{
              width: "100%",
            }}
          >
            Download image
          </Button>
        )}
      </ImagePreviewer.DownloadButton>

      <ImagePreviewer.BlobButton>
        {({ loadBlob }) => (
          <ButtoncodeExample
            onClick={async () => {
              console.log(await loadBlob());
            }}
            style={{
              width: "100%",
            }}
          >
            Load blob
          </Button>
        )}
      </ImagePreviewer.BlobButton>
    </div>
  </div>

  // ...Some code
</ImagePreviewer>`;
