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

      <ImagePreviewer.ProcessBlobButton>
        {({ getBlob }) => (
          <Button
            onClick={async () => {
              const file = await getBlob();
              if (file) {
                const { type, size } = file;
                api.info({
                  message: "BLOB",
                  description: \`Type: \${type} - size: \${size}\`,
                });
              } else {
                api.error({
                  message: "error",
                  description: "Please add a image",
                });
              }
            }}
          >
            Test manipulating blob
          </Button>
        )}
      </ImagePreviewer.ProcessBlobButton>
    </div>
  </div>

  // ...Some code
</ImagePreviewer>`;
