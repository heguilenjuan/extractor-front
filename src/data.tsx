    <div className="flex flex-col items-center min-h-screen p-6 gap-6">
      <div className="border border-gray-300 rounded-lg">
        <div className="relative" style={{ width: w, height: h }}>
          <div className="absolute inset-0 z-0">
            <Document file={fileUrl} onLoadSuccess={({ numPages }) => setNumPages(numPages ?? 0)}>
              <Page
                pageNumber={pageNumber}
                width={RENDER_WIDTH}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                onRenderSuccess={(page) => {
                  const v1 = page.getViewport({ scale: 1 });
                  const scale = RENDER_WIDTH / v1.width;
                  setW(RENDER_WIDTH);
                  setH(v1.height * scale);
                }}
              />
            </Document>
          </div>

          <div className="absolute inset-0 z-10">
            <Overlay
              width={w}
              height={h}
              boxes={overlay.boxes}
              selectedId={overlay.selectedId}
              onBackgroundPointerDown={(x, y) => overlay.createAt(x, y)}
              onBeginMove={(id, x, y) => overlay.beginMove(id, x, y)}
              onBeginResize={(id, handle, x, y) => overlay.beginResize(id, handle, x, y)}
              onPointerMove={(x, y) => overlay.onPointerMove(x, y)}
              onPointerUp={() => overlay.endInteraction()}
              onSelect={(id) => overlay.selectBox(id)}
              onRename={(name) => overlay.renameSelected(name)}
              onDelete={() => overlay.deleteSelected()}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          disabled={pageNumber <= 1}
          onClick={() => setPageNumber(p => p - 1)}
        >
          Anterior
        </button>
        <span>Página {pageNumber} de {numPages ?? "-"}</span>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          disabled={numPages ? pageNumber >= numPages : true}
          onClick={() => setPageNumber(p => p + 1)}
        >
          Siguiente
        </button>
      </div>
    </div>
