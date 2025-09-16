import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export interface PdfViewerProps {
  file: File | string | null;
  page: number;               // 0-based
  scale?: number;
  onDocumentLoad?: (meta: { numPages: number }) => void;
  onPageChange?: (page0: number) => void;
  onScaleChange?: (scale: number) => void;
}

const PdfViewer: React.FC<PdfViewerProps> = ({
  file,
  page,
  scale = 1,
  onDocumentLoad,
  onPageChange,
  onScaleChange
}) => {
  const [numPages, setNumPages] = React.useState(0);

  const handleDocLoad = (info: { numPages: number }) => {
    setNumPages(info.numPages);
    onDocumentLoad?.({ numPages: info.numPages });
  };

  const go = (p: number) => {
    const clamped = Math.max(0, Math.min(p, Math.max(0, numPages - 1)));
    if (clamped !== page) onPageChange?.(clamped);
  };
  const zoom = (s: number) => {
    const next = Math.max(0.25, Math.min(s, 4));
    if (next !== scale) onScaleChange?.(next);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>Página {page + 1} / {numPages || '-'}</div>
        <div className="flex items-center gap-2">
          <button className="rounded border px-2 py-1" onClick={() => go(page - 1)} disabled={page <= 0}>◀︎</button>
          <button className="rounded border px-2 py-1" onClick={() => go(page + 1)} disabled={page >= numPages - 1}>▶︎</button>
          <div className="mx-2 h-5 w-px bg-gray-200" />
          <button className="rounded border px-2 py-1" onClick={() => zoom(scale - 0.1)}>-</button>
          <span className="w-12 text-center">{Math.round(scale * 100)}%</span>
          <button className="rounded border px-2 py-1" onClick={() => zoom(scale + 0.1)}>+</button>
          <button className="rounded border px-2 py-1" onClick={() => zoom(1)}>Reset</button>
        </div>
      </div>

      <div className="relative mx-auto">
        {file ? (
          <Document file={file} onLoadSuccess={handleDocLoad} loading={<Skeleton />}>
            {numPages > 0 && (
              <Page
                pageNumber={page + 1}
                scale={scale}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            )}
          </Document>
        ) : (
          <div className="grid h-[420px] w-[640px] place-items-center rounded-xl border border-dashed text-gray-500">
            Cargá un PDF para comenzar
          </div>
        )}
      </div>
    </div>
  );
};

const Skeleton: React.FC = () => (
  <div className="h-[420px] w-[640px] animate-pulse rounded-xl bg-gray-100" />
);

export default PdfViewer;
