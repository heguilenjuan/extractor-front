import './App.css';
import { useTemplateStore } from './store/useTemplateStore';
import PdfViewer from './components/PdfViewer/PdfViewer';
import BlocksOverlay from './components/BlocksOverlay/BlocksOverlay';
import FieldForm from './components/FieldForm/FieldForm';
import FileDrop from './components/FileDropzone/FileDrop';
import { extractorApi, templatesApi } from './services/api';
import type { Box, TemplateDTO, TemplateField, WordBlock } from './types';

export default function App() {
  const {
    pdfUrl, page, scale, wordsByPage,
    fields, activeField, meta,
    setPdf, setPage, setScale, setWords, upsertField, setActive
  } = useTemplateStore();

  const words = wordsByPage[page] || [];

  const onFile = async (file: File) => {
    setPdf(file);
    const data = await extractorApi.extractText(file);
    for (const p of data.pages) setWords(p.page_number - 1, p.blocks || []);
  };

  const pickWord = (w: WordBlock) => {
    const name = activeField || 'nuevo_campo';
    const f: TemplateField = {
      page,
      box: w.coordinates,
      pad: 2,
      join_with_space: true,
      cast: 'text',
      regex: null
    };
    upsertField(name, f);
  };

  const drawBox = (box: Box) => {
    const name = activeField || 'nuevo_campo';
    const f: TemplateField = { page, box, pad: 2, join_with_space: true, cast: 'text', regex: null };
    upsertField(name, f);
  };

  const saveField = (v: any) => {
    const { name, ...rest } = v;
    upsertField(name, rest);
    setActive(name);
  };

  const saveTemplate = async () => {
    const payload: TemplateDTO = { id: meta.id, fields, meta };
    await templatesApi.saveTemplate(payload);
    alert('Plantilla guardada');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white p-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="font-semibold">Editor de Plantillas</div>
          <div className="flex items-center gap-2">
            <button className="rounded border px-3 py-1" onClick={() => setScale(Math.max(0.25, scale - 0.1))}>-</button>
            <span>{Math.round(scale * 100)}%</span>
            <button className="rounded border px-3 py-1" onClick={() => setScale(Math.min(4, scale + 0.1))}>+</button>
            <button className="rounded border px-3 py-1" onClick={() => setScale(1)}>Reset</button>
            <button className="rounded bg-indigo-600 px-3 py-1 text-white" onClick={saveTemplate}>Guardar plantilla</button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl grid-cols-12 gap-4 p-4">
        <div className="col-span-8">
          {!pdfUrl && (
            <div className="mb-4">
              <FileDrop onFile={onFile} />
            </div>
          )}
          <div className="relative">
            <PdfViewer
              file={pdfUrl}
              page={page}
              scale={scale}
              onPageChange={setPage}
              onScaleChange={setScale}
            />
            {/* overlay absoluto */}
            <div className="pointer-events-none absolute inset-0">
              <BlocksOverlay
                page={page}
                scale={scale}
                words={words}
                fields={fields}
                activeFieldName={activeField}
                mode={'word'} // alterná con 'marquee' si agregás un botón
                onPickWord={pickWord}
                onDrawBox={drawBox}
              />
            </div>
          </div>
        </div>

        <div className="col-span-4 space-y-4">
          <FieldForm
            initial={activeField ? { name: activeField, ...fields[activeField] } : undefined}
            onSave={saveField}
            onCancel={() => setActive(undefined)}
          />
          <div className="rounded-xl bg-white p-3 shadow">
            <div className="mb-2 font-medium">Campos</div>
            <ul className="space-y-1">
              {Object.keys(fields).map((k) => (
                <li key={k}>
                  <button
                    className={`w-full rounded px-2 py-1 text-left ${activeField===k?'bg-indigo-50':''}`}
                    onClick={() => setActive(k)}
                  >
                    {k}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
