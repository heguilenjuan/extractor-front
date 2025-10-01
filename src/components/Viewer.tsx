/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Document, Page } from "react-pdf";
import { useOverlay } from "./Overlay/useOverlay";
import { useTemplateSteps } from "./Template/useTemplate";
import { useFields } from "./Fields/useFields";
import Overlay from "./Overlay/Overlay";
import FieldPanel from "./Fields/FieldPanel";
import ReviewPanel from "./Template/ReviewePanel";
import { useTemplateReview } from "./Template/useTemplateReview";
import axios from "axios";
import type { PageMeta } from "./Template/templates.types";
import AnchorsOverlay from "./Anchor/AnchorsOverlay";
import { useAnchors } from "./Anchor/useAnchors";

const RENDER_WIDTH = 600;
const URI = 'http://localhost:8000'


export default function Viewer({ fileUrl }: { fileUrl?: string }) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [w, setW] = useState(RENDER_WIDTH);
  const [h, setH] = useState(Math.round(RENDER_WIDTH * 1.414));
  const [mode, setMode] = useState<'boxes' | 'anchors'>('boxes');

  const [pagesMeta, setPagesMeta] = useState<Record<number, PageMeta>>({})

  const anchors = useAnchors();
  const overlay = useOverlay({ width: w, height: h });
  const { step, goDefine, goDraw, goReview, templateName, setTemplateName } = useTemplateSteps();
  const { fieldsByBox, forBox, add, patch, remove, clearBox } = useFields();
  const metaForHook = {
    pageCount: numPages ?? undefined,
    pages: Object.fromEntries(
      Object.entries(pagesMeta).map(([p, pm]) => [
        Number(p),
        { ...pm, anchors: anchors.anchors.filter(a => a.page === Number(p)) }
      ])
    ),
  };



  const { reviewOpen, preview, issues, submitting, openReview, closeReview, submitTemplate } = useTemplateReview({
    templateName,
    boxes: overlay.boxes,
    fieldsByBox,
    meta: metaForHook,
    onSuccess: () => { },
    customPost: async (templateData) => {
      console.log({ templateData })
/*         try {
          const payload = {
            id: `template-${Date.now()}-${templateData.name}`,
            ...templateData
          }
  
          const response = await axios.post(`${URI}/api/v1/templates`, payload, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
  
          return response.data;
        } catch (error) {
          console.error('Error al guardar plantilla:', error);
          throw error;
        } */

      
    }
  })

  const onDeleteBox = () => {
    const id = overlay.selectedId;
    overlay.deleteSelected();
    if (id) clearBox(id);
  }

  const selectedBox = overlay.getBoxById(overlay.selectedId);
  const selectedFields = selectedBox ? forBox(selectedBox.id) : [];

  return (
    <div className="flex flex-col items-center min-h-screen p-6 gap-6">
      <div className="max-w-[820px]">
        {/* Steps */}
        <div className="mb-3 flex items-center gap-3">
          <span className={`px-2 py-1 rounded ${step === 'draw' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
            Paso 1: Dibujar boxes
          </span>
          {step === 'draw' && (
            <div className="ml-2 inline-flex rounded border overflow-hidden">
              <button
                className={`px-2 py-1 ${mode === 'boxes' ? 'bg-blue-600 text-white' : 'bg-white'}`}
                onClick={() => setMode('boxes')}
              >
                Boxes
              </button>
              <button
                className={`px-2 py-1 ${mode === 'anchors' ? 'bg-blue-600 text-white' : 'bg-white'}`}
                onClick={() => setMode('anchors')}
              >
                Anclas
              </button>
            </div>
          )}
          <span className={`px-2 py-1 rounded ${step === 'define' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
            Paso 2: Definir campos
          </span>
          <span className={`px-2 py-1 rounded ${step === 'review' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
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
                    const viewportScale = RENDER_WIDTH / v1.width;

                    setW(RENDER_WIDTH);
                    setH(v1.height * viewportScale)

                    setPagesMeta(prev => ({
                      ...prev,
                      [page.pageNumber]: {
                        pdfWidthBase: v1.width,
                        pdfHeightBase: v1.height,
                        viewportScale,
                        renderWidth: RENDER_WIDTH,
                        renderHeight: v1.height * viewportScale,
                        rotation: v1.rotation


                      }
                    }))
                  }}

                />
              </Document>
            </div>
            {/* Capa de BOXES */}
            <div
              className="absolute inset-0 z-10"
              style={{
                opacity: mode === 'boxes' ? 1 : 0.45,
                pointerEvents: mode === 'boxes' ? 'auto' : 'none',   // ← habilitar solo en modo boxes
              }}
            >
              <Overlay
                width={w}
                height={h}
                boxes={overlay.boxes}
                selectedId={mode === 'boxes' ? overlay.selectedId : null}
                onBackgroundPointerDown={(x, y) =>
                  mode === 'boxes' && step === 'draw' ? overlay.createAt(x, y, pageNumber) : undefined as any}
                onBeginMove={(id, x, y) => mode === 'boxes' ? overlay.beginMove(id, x, y) : undefined as any}
                onBeginResize={(id, handle, x, y) => mode === 'boxes' ? overlay.beginResize(id, handle, x, y) : undefined as any}
                onPointerMove={(x, y) => mode === 'boxes' ? overlay.onPointerMove(x, y) : undefined as any}
                onPointerUp={() => mode === 'boxes' ? overlay.endInteraction() : undefined as any}
                onSelect={(id) => mode === 'boxes' ? overlay.selectBox(id) : undefined as any}
                onRename={(name) => mode === 'boxes' ? overlay.renameSelected(name) : undefined as any}
                onDelete={onDeleteBox}
              />
            </div>

            {/* Capa de ANCLAS */}
            <div
              className="absolute inset-0 z-20"
              style={{
                opacity: mode === 'anchors' ? 1 : 0.45,
                pointerEvents: mode === 'anchors' ? 'auto' : 'none',
              }}
            >
              <AnchorsOverlay
                width={w}
                height={h}
                page={pageNumber}
                anchors={anchors.anchors}
                selectedId={mode === 'anchors' ? anchors.selectedId : null}
                onBackgroundPointerDown={(x, y) => mode === 'anchors' && step === 'draw' ? anchors.createAt(x, y, pageNumber) : undefined as any}
                onBeginMove={(id, x, y) => mode === 'anchors' ? anchors.beginMove(id, x, y) : undefined as any}
                onBeginResizeSearch={(id, h, x, y) => mode === 'anchors' ? anchors.beginResizeSearch(id, h, x, y) : undefined as any}
                onPointerMove={(x, y) => mode === 'anchors' ? anchors.onPointerMove(x, y) : undefined as any}
                onPointerUp={() => mode === 'anchors' ? anchors.endInteraction() : undefined as any}
                onSelect={(id) => mode === 'anchors' ? anchors.select(id) : undefined as any}
                onRename={(name) => mode === 'anchors' ? anchors.rename(name) : undefined as any}
                onDelete={(id) => anchors.remove(id)}
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
              onClick={() => {
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

      {reviewOpen && preview && (
        <ReviewPanel
          payload={preview}
          issues={issues}
          submitting={submitting}
          onClose={closeReview}
          onSubmit={submitTemplate}
        />
      )}


      {step === 'draw' && mode === 'anchors' && anchors.selectedId && (() => {
        const a = anchors.getById(anchors.selectedId); if (!a) return null;
        return (
          <div className="w-full max-w-3xl border rounded-lg p-3 space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <input className="border rounded px-2 py-1" value={a.name ?? ''} onChange={e => anchors.patch(a.id, { name: e.target.value })} placeholder="Nombre ancla" />
              <select className="border rounded px-2 py-1" value={String(a.kind)} onChange={e => anchors.patch(a.id, { kind: e.target.value as any })}>
                <option value="text">text</option>
                <option value="regex">regex</option>
              </select>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={!!a.caseSensitive} onChange={e => anchors.patch(a.id, { caseSensitive: e.target.checked })} />
                caseSensitive
              </label>
            </div>
            <input className="border rounded px-2 py-1 w-full" value={a.pattern} onChange={e => anchors.patch(a.id, { pattern: e.target.value })} placeholder="pattern (texto o regex)" />
            <div className="grid grid-cols-4 gap-2 text-sm">
              <div>página: {a.page}</div>
              <div>x: {a.x.toFixed(1)}</div>
              <div>y: {a.y.toFixed(1)}</div>
              <div>peso:
                <input type="number" step="0.1" className="border rounded ml-2 w-20 px-1" value={a.weight ?? 1} onChange={e => anchors.patch(a.id, { weight: Number(e.target.value) })} />
              </div>
            </div>
            <div className="text-gray-600 text-xs">
              Tip: ajustá el rectángulo ámbar (“searchBox”) con los handles; eso acota la búsqueda del patrón.
            </div>
          </div>
        );
      })()}

    </div>
  );
}
