import { useState } from "react";
import { Document, Page } from "react-pdf";
import { useOverlay } from "./Overlay/useOverlay";
import { useTemplateSteps } from "./Template/useTemplate";
import { useFields } from "./Fields/useFields";
import Overlay from "./Overlay/Overlay";
import FieldPanel from "./Fields/FieldPanel";
import ReviewPanel from "./Template/ReviewePanel";
import { useTemplateReview } from "./Template/useTemplateReview";

const RENDER_WIDTH = 600;

export default function Viewer({ fileUrl }: { fileUrl?: string }) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [w, setW] = useState(RENDER_WIDTH);
  const [h, setH] = useState(Math.round(RENDER_WIDTH * 1.414));

  const overlay = useOverlay({ width: w, height: h });
  const { step, goDefine, goDraw, goReview, goCreate, templateName, setTemplateName } = useTemplateSteps();
  const { fieldsByBox, forBox, add, patch, remove, clearBox } = useFields();
  const { reviewOpen, preview, issues, submitting, openReview, closeReview, submitTemplate } = useTemplateReview({
    templateName,
    boxes: overlay.boxes,
    fieldsByBox,
    meta: { pageCount: numPages ?? undefined, renderWidth: w, renderHeight: h },
    onSuccess: () => {

    }
  })

  const onDeleteBox = () => {
    const id = overlay.selectedId;
    overlay.deleteSelected();
    if (id) clearBox(id);
  }

  const selectedBox = overlay.getBoxById(overlay.selectedId);
  const selectedFields = selectedBox ? forBox(selectedBox.id) : [];

  const buildPayload = () => ({
    name: templateName,
    boxes: overlay.boxes.map(({ id, x, y, w, h, name }) => ({ id, x, y, w, h, name })),
    fields: Object.values(fieldsByBox).flat(), // <-- incluye campos con su boxId
  });

  return (
    <div className="flex flex-col items-center min-h-screen p-6 gap-6">
      <div className="max-w-[820px]">
        {/* Steps */}
        <div className="mb-3 flex items-center gap-3">
          <span className={`px-2 py-1 rounded ${step === 'draw' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
            Paso 1: Dibujar boxes
          </span>
          <span className={`px-2 py-1 rounded ${step === 'define' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
            Paso 2: Definir campos
          </span>
          <span className={`px-2 py-1 rounded ${step === 'create' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
            Paso 3: Armar la plantilla
          </span>
        </div>

        {/* PDF VIEWER + OVERLAY */}
        <div className="flex justify-center border border-gray-300 rounded-lg">
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
                    setH(v1.height * scale)
                  }}

                />
              </Document>
            </div>
            <div className="aboslute inset-0 z-10">
              <Overlay
                width={w}
                height={h}
                boxes={overlay.boxes}
                selectedId={overlay.selectedId}
                onBackgroundPointerDown={(x, y) => step === 'draw' ? overlay.createAt(x, y) : overlay.selectBox(null)}
                onBeginMove={(id, x, y) => overlay.beginMove(id, x, y)}
                onBeginResize={(id, handle, x, y) => overlay.beginResize(id, handle, x, y)}
                onPointerMove={(x, y) => overlay.onPointerMove(x, y)}
                onPointerUp={() => overlay.endInteraction()}
                onSelect={(id) => overlay.selectBox(id)}
                onRename={(name) => overlay.renameSelected(name)}
                onDelete={onDeleteBox}
              />
            </div>
          </div>
        </div>
        {/* Barra inferior: Paginacion + controles de paso + nombre de plantilla */}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber((p) => p - 1)}
          >
            Anterior
          </button>
          <span>
            Pag. <strong>{pageNumber}</strong> de <strong>{numPages ?? "-"}</strong>
          </span>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={numPages ? pageNumber >= numPages : true}
            onClick={() => setPageNumber((p) => p + 1)}
          >
            Siguiente
          </button>
          <div className="ml-auto flex items-center gap-2">
            <input
              type="text"
              className="border rounded px-2 py-1"
              placeholder="Nombre de la plantilla"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />
            <button
              className="px-4 py-2 rounded border"
              onClick={() => (step === 'draw' ? goDefine() : goDraw())}
            >
              {step === 'draw' ? 'Definir campos' : 'Volver a secciones'}
            </button>

            {/* Ejemplo de uso del payload? */}
            <button
              className="px-4 py-2 rounded bg-emerald-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              onClick={ () => {
                openReview()
                goReview()
              }}
              disabled={!overlay.boxes.length}
            >
              {!overlay.boxes.length ? "Agrega al menos un Box" : "Crear plantilla"}
            </button>
          </div>
        </div>
      </div>

      {/* Panel de campos: visible solo en Paso 2 con un box seleccionador */}
      {step === 'define' && selectedBox && (
        <FieldPanel
          boxName={selectedBox.name ?? ""}
          fields={selectedFields}
          onAdd={() => add(selectedBox.id)}
          onUpdate={(id, p) => patch(selectedBox.id, id, p)}
          onRemove={(id) => remove(selectedBox.id, id)}
        />
      )}

      {step === 'define' && !selectedBox && (
        <div className="text-sm text-gray-600">Seleccioná un box para definir sus campos.</div>
      )}

      {preview && (
        <ReviewPanel
          payload={preview}
          issues={issues}
          submitting={submitting}
          onClose={closeReview}
          onSubmit={submitTemplate}
        />
      )}
    </div>
  );
}
